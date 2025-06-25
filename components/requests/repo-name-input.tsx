"use client"

import { useState, useEffect, ReactNode } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { checkBlank, formatRepoName, validateFormat } from "@/lib/utils"
import { useDebounce } from "@/hooks/useDebounce"
import { Label } from "@/components/ui/label"
import checkRepositoryAvailability from "@/app/api/repository/api"
import { useQuery } from "@tanstack/react-query"

interface RepoNameInputProps {
  suggestedName: string
  ownerName: string
}

export function RepoNameInput({
  suggestedName,
  ownerName,
}: RepoNameInputProps) {
  const [repoName, setRepoName] = useState<string>("")
  const debouncedRepoName = useDebounce(repoName, 500)

  const [message, setMessage] = useState<ReactNode>(null)
  const [hasTyped, setHasTyped] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ["repoName", debouncedRepoName],
    queryFn: () => checkRepositoryAvailability(debouncedRepoName),
    enabled: !!debouncedRepoName,
  })

  useEffect(() => {
    if (repoName === debouncedRepoName) {
      setIsTyping(false)
    }
  }, [debouncedRepoName, repoName])

  useEffect(() => {
    if (!hasTyped) return

    if (repoName !== debouncedRepoName) return

    function checkAvailability(name: string) {
      if (checkBlank(name)) {
        setMessage(
          <span className="text-muted-foreground text-xs">
            ❌ Name cannot be blank
          </span>
        )
        return
      }

      if (!validateFormat(name)) {
        setMessage(
          <div className="text-muted-foreground text-xs">
            <span className="text-green-700 font-bold">
              ✅ Your new repository will be created as {formatRepoName(name)}.
            </span>
            <br />
            <span>
              The repository name can only contain ASCII letters, digits, and
              the characters ., -, and _.
            </span>
          </div>
        )
        return
      }

      if (data?.exists) {
        setMessage(
          <span className="text-red-700 text-xs font-bold">
            ❌ The repository {formatRepoName(name)} already exists on this
            account.
          </span>
        )
        return
      }

      setMessage(
        <span className="text-green-700 font-bold text-xs">
          ✅ {name} is available.
        </span>
      )
    }

    checkAvailability(debouncedRepoName)
  }, [data?.exists, debouncedRepoName, hasTyped, repoName])

  function handleGenerate() {
    setHasTyped(true)
    setRepoName(suggestedName)
  }

  if (error) {
    return (
      <p className="text-red-700 text-xs font-bold">Error: {error.message}</p>
    )
  }

  return (
    <>
      <div className="flex">
        <div className="h-full grid gap-4">
          <Label htmlFor="owner">Owner *</Label>
          <p className="font-medium">{ownerName}</p>
        </div>

        <div className="px-2 mt-6">
          <p className="font-semibold text-2xl">/</p>
        </div>

        <div className="h-full">
          <div className="grid gap-3">
            <Label htmlFor="repo-name">Repository name *</Label>
            <Input
              id="repo-name"
              value={repoName}
              onChange={(e) => {
                setIsTyping(true)
                setHasTyped(true)
                setRepoName(e.target.value)
              }}
            />
            {isTyping || isLoading ? (
              <span className="text-muted-foreground text-xs">
                Checking availability...
              </span>
            ) : (
              message
            )}
          </div>
        </div>
      </div>
      <p className="text-muted-foreground text-sm">
        Great repository names are short and memorable. Need inspiration? How
        about{" "}
        <Button
          variant="ghost"
          onClick={handleGenerate}
          value={suggestedName}
          className="text-green-700 font-bold px-0 py-0 hover:text-green-800 hover:bg-transparent"
        >
          {suggestedName}
        </Button>{" "}
        ?
      </p>
    </>
  )
}
