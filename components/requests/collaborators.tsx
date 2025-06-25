"use client"

import { useState } from "react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { fuzzyFindUsersByEmail } from "@/app/api/user/api"
import { User } from "@/types/api"
import { useDebounce } from "@/hooks/useDebounce"

export default function Collaborators() {
  const [open, setOpen] = useState<boolean>(false)
  const [searchEmail, setSearchEmail] = useState<string>("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const debouncedSearchEmail = useDebounce(searchEmail, 500)

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userByEmail", debouncedSearchEmail],
    queryFn: () => fuzzyFindUsersByEmail(debouncedSearchEmail),
    enabled: !!debouncedSearchEmail,
  })

  function handleUserSelect(userEmail: string) {
    setSelectedUsers((prev) => {
      if (prev.includes(userEmail)) {
        return prev
      } else {
        return [...prev, userEmail]
      }
    })
    setOpen(false)
    setSearchEmail("")
  }

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            placeholder="Search by email"
            onValueChange={(value) => setSearchEmail(value)}
          />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : error ? (
              <CommandEmpty>Error: {error.message}</CommandEmpty>
            ) : users?.length === 0 ? (
              <CommandEmpty>No users found.</CommandEmpty>
            ) : (
              users?.map((user: User) => (
                <CommandItem
                  className="cursor-pointer"
                  onSelect={() => handleUserSelect(user.email)}
                  key={user.email}
                  value={user.email}
                >
                  {user.name} ({user.email})
                </CommandItem>
              ))
            )}
          </CommandList>
        </Command>
      </CommandDialog>

      <Card>
        <CardHeader>
          <CardTitle>Collaborators</CardTitle>
          <CardDescription>
            Invite teammates to contribute to this repository.
          </CardDescription>
          <CardAction>
            <Button variant="secondary" onClick={() => setOpen(true)}>
              Add people
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Input type="text" placeholder="Find a collaborator..." />
          <div className="mt-4">
            {selectedUsers.length > 0 ? (
              <ul className="list-disc pl-5">
                {selectedUsers.map((email) => (
                  <li key={email} className="text-sm">
                    {email}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">
                No collaborators added yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
