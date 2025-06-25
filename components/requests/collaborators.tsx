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
import { requestFormSchema } from "@/components/requests/client-request-form"
import { UseFormReturn } from "react-hook-form"
import z, { set } from "zod"
import { IconTrash } from "@tabler/icons-react"

interface CollaboratorsProps {
  form: UseFormReturn<z.infer<typeof requestFormSchema>>
}

export default function Collaborators({ form }: CollaboratorsProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [searchEmail, setSearchEmail] = useState<string>("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const debouncedSearchEmail = useDebounce(searchEmail, 500)
  const [filteredUsers, setFilteredUsers] = useState<string[]>([])

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userByEmail", debouncedSearchEmail],
    queryFn: () => fuzzyFindUsersByEmail(debouncedSearchEmail),
    // enabled: !!debouncedSearchEmail,
  })

  function handleUserSelect(userEmail: string) {
    setSelectedUsers((prev) => {
      if (prev.includes(userEmail)) {
        return prev
      } else {
        const updated = [...prev, userEmail]
        form.setValue("collaborators", updated)
        return updated
      }
    })
    setFilteredUsers((prev) => {
      if (prev.includes(userEmail)) {
        return prev
      } else {
        const updated = [...prev, userEmail]
        return updated
      }
    })
    setOpen(false)
    setSearchEmail("")
  }

  function handleRemoveUser(email: string) {
    setSelectedUsers((prev) => {
      const updated = prev.filter((userEmail) => userEmail !== email)
      form.setValue("collaborators", updated)
      return updated
    })
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    setSearchEmail(value)

    const filtered = selectedUsers.filter((user) =>
      user.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredUsers(filtered)
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
          <Input
            // value={searchEmail}
            onChange={handleInputChange}
            type="text"
            placeholder="Find a collaborator..."
          />

          {filteredUsers.length > 0 ? (
            <ul className="mt-4">
              {filteredUsers.map((email) => (
                <div key={email} className="flex items-center">
                  <li key={email} className="text-sm">
                    {email}
                  </li>
                  <span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={() => handleRemoveUser(email)}
                    >
                      <IconTrash />
                    </Button>
                  </span>
                </div>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">
              No collaborators added yet.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  )
}
