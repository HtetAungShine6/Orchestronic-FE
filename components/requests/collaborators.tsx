"use client"

import { useState } from "react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
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

export default function Collaborators() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Search by email" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
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
