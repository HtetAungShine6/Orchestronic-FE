"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import { getUser } from "@/app/api/user/api"

export function RequestButton() {
  const { data: session, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  })

  return (
    <Button
      asChild
      onClick={(e) => {
        if (isLoading) {
          e.preventDefault()
          return
        }

        if (!session?.gitlabUrl) {
          e.preventDefault()
          alert("Please add your GitLab URL first.")
        }
      }}
    >
      <Link href="/requests/create">
        <IconPlus /> Request
      </Link>
    </Button>
  )
}
