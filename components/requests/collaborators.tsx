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

export default function Collaborators() {
  const [open, setOpen] = useState(false)
  const [searchEmail, setSearchEmail] = useState("")

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userByEmail", searchEmail],
    queryFn: () => fuzzyFindUsersByEmail(searchEmail),
    enabled: !!searchEmail,
  })

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
                <CommandItem key={user.email} value={user.email}>
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
          <CardDescription className="text-sm">
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
        </CardContent>
      </Card>
    </>
  )
}
