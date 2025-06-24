"use client"

import { memo, useState, useEffect, ReactNode } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { checkBlank, formatRepoName, validateFormat } from "@/lib/utils"
import { useDebounce } from "@/hooks/useDebounce"
import { Label } from "@/components/ui/label"
import checkRepositoryAvailablity from "@/app/api/repository/api"
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
  const [checking, setChecking] = useState<boolean>(false)
  const [hasTyped, setHasTyped] = useState<boolean>(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ["repoName", debouncedRepoName],
    queryFn: () => checkRepositoryAvailablity(debouncedRepoName),
    enabled: !!debouncedRepoName,
  })

  useEffect(() => {
    if (!hasTyped) return

    async function checkAvailability(name: string) {
      if (checkBlank(name)) {
        setMessage(
          <span className="text-muted-foreground text-xs">
            ❌ Name cannot be blank
          </span>
        )
        setChecking(false)
        return
      }

      if (
        !validateFormat(name) &&
        !data?.exists
      ) {
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
        setChecking(false)
        return
      }

      const exists: boolean = data?.exists

      if (exists) {
        setMessage(
          <span className="text-red-700 text-xs font-bold">
            ❌ The repository {formatRepoName(name)} already exists on this
            account.
          </span>
        )
      } else {
        setMessage(
          <span className="text-green-700 font-bold text-xs">
            ✅ {name} is available.
          </span>
        )
      }

      setChecking(false)
    }

    checkAvailability(debouncedRepoName)
  }, [data?.exists, debouncedRepoName, hasTyped])

  function handleGenerate(event: React.MouseEvent<HTMLButtonElement>) {
    const name = event.currentTarget.value
    if (repoName === name) return
    setHasTyped(true)
    setChecking(true)
    setRepoName(name)
  }

  return (
    <>
      <div className="flex">
        <OwnerSection className="h-full grid gap-4" name={ownerName} />

        <div className="px-2 mt-6">
          <p className="font-semibold text-2xl">/</p>
        </div>

        <div className="h-full">
          <div className="grid gap-3">
            <Label htmlFor="repo-name">Repository name *</Label>
            <Input
              value={repoName}
              onChange={(e) => {
                setHasTyped(true)
                setChecking(true)
                setRepoName(e.target.value)
              }}
            />
            {checking ? (
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

interface OwnerSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
}

const OwnerSection = memo(function OwnerSection({
  name,
  ...props
}: OwnerSectionProps) {
  return (
    <div {...props}>
      <Label htmlFor="owner">Owner *</Label>
      <p className="font-medium">{name}</p>
    </div>
  )
})
