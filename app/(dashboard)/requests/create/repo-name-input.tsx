"use client"

import { memo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { checkBlank, formatRepoName, validateFormat } from "@/lib/utils"

interface RepoNameInputProps {
  suggestedName: string
  ownerName: string
}

export function RepoNameInput({
  suggestedName,
  ownerName,
}: RepoNameInputProps) {
  const [repoName, setRepoName] = useState<string>("")
  const [available, setAvailable] = useState<null | boolean>(null)
  const [error, setError] = useState<string | React.ReactNode>()
  const [checking, setChecking] = useState(false)

  async function checkRepoAvailability(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value

    setRepoName(name)
    setChecking(true)
    setError("")

    if (checkBlank(name)) {
      setError(
        <span className="text-muted-foreground text-xs">
          ❌ Name cannot be blank
        </span>
      )
      setAvailable(false)
      setChecking(false)
      return
    }

    if (!validateFormat(name)) {
      setError(
        <div className="text-muted-foreground text-xs">
          <span className="text-green-700 font-bold">
            ✅ Your new repository will be created as {formatRepoName(name)}.
          </span>
          <br />
          <span>
            The repository name can only contain ASCII letters, digits, and the
            characters ., -, and _.
          </span>
        </div>
      )
      setAvailable(false)
      setChecking(false)
      return
    }

    const fakeUnavailableList = ["test-repo", "my-project"]
    await new Promise((res) => setTimeout(res, 500))

    const exists = fakeUnavailableList.includes(name)
    if (exists) {
      setError(
        <span className="text-muted-foreground text-xs">
          ❌ The repository ${name} already exists on this account.
        </span>
      )
      setAvailable(false)
    } else {
      setError("")
      setAvailable(true)
    }

    setChecking(false)
  }

  function handleGenerate(event: React.MouseEvent<HTMLButtonElement>) {
    const name = event.currentTarget.value
    setRepoName(name)
    checkRepoAvailability({
      target: { value: name },
    } as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <>
      <div className="flex">
        <OwnerSection className="h-full" name={ownerName} />

        <div className="px-2 mt-6">
          <p className="font-semibold text-2xl">/</p>
        </div>

        <div className="h-full">
          <label className="block font-medium">Repository name *</label>
          <Input
            value={repoName}
            onChange={(e) => checkRepoAvailability(e)}
            className="w-58"
          />
          {checking ? (
            <span className="text-muted-foreground text-xs">
              Checking availability...
            </span>
          ) : error ? (
            error
          ) : available ? (
            <span className="text-green-700 font-semibold text-xs">
              ✅ {repoName} is available.
            </span>
          ) : null}
        </div>
      </div>
      <p className="text-muted-foreground text-sm">
        Great repository names are short and memorable. Need inspiration? How
        about{" "}
        <Button
          variant="ghost"
          onClick={handleGenerate}
          value={suggestedName}
          className="text-green-700 cursor-pointer font-bold px-0 py-0"
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
      <label className="block font-medium">Owner *</label>
      <Button variant="outline">{name}</Button>
    </div>
  )
})
