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
import z from "zod"
import { IconTrash } from "@tabler/icons-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

interface CollaboratorsProps {
  form: UseFormReturn<z.infer<typeof requestFormSchema>>
}

export default function Collaborators({ form }: CollaboratorsProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [searchEmail, setSearchEmail] = useState<string>("")
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const debouncedSearchEmail = useDebounce(searchEmail, 500)
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userByEmail", debouncedSearchEmail],
    queryFn: () => fuzzyFindUsersByEmail(debouncedSearchEmail),
  })

  function handleUserSelect(user: User) {
    setSelectedUsers((prev) => {
      if (prev.some((u) => u.email === user.email)) {
        return prev
      } else {
        const updated = [...prev, user]
        form.setValue(
          "collaborators",
          updated.map((u) => u.email)
        )
        return updated
      }
    })
    setFilteredUsers((prev) => {
      if (prev.some((u) => u.email === user.email)) {
        return prev
      } else {
        const updated = [...prev, user]
        return updated
      }
    })
    setOpen(false)
    setSearchEmail("")
  }

  function handleRemoveUser(email: string) {
    setSelectedUsers((prev) => {
      const updated = prev.filter((user) => user.email !== email)
      form.setValue(
        "collaborators",
        updated.map((u) => u.email)
      )
      return updated
    })

    setFilteredUsers((prev) => {
      const updated = prev.filter((user) => user.email !== email)
      return updated
    })
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    setSearchEmail(value)

    const filtered = selectedUsers.filter((user) =>
      user.email.toLowerCase().includes(value.toLowerCase())
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
              <CommandEmpty>{error.message}</CommandEmpty>
            ) : users?.length === 0 ? (
              <CommandEmpty>No users found.</CommandEmpty>
            ) : (
              users?.map((user: User) => (
                <CommandItem
                  className="cursor-pointer"
                  onSelect={() => handleUserSelect(user)}
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
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(true)}
            >
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
            <div className="flex flex-col gap-3 mt-4">
              {filteredUsers.map((user) => (
                <div key={user.email} className="flex items-center">
                  <Avatar>
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-2 flex flex-1 flex-col text-sm">
                    {user.name}
                    <span className="text-muted-foreground text-xs">
                      {user.email}
                    </span>
                  </div>
                  <span>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="ml-2"
                      onClick={() => handleRemoveUser(user.email)}
                    >
                      <IconTrash />
                    </Button>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm mt-4">
              No collaborators added yet.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  )
}
