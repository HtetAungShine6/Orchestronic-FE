"use client"

import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react"

export default function AuthButton() {
  const { data: session } = useSession()

  if (session) {
    return <Button onClick={() => signOut()}>Sign Out</Button>
  } else {
    return (
      <Button onClick={() => signIn("azure-ad", { callbackUrl: "/dashboard" })}>
        Sign In
      </Button>
    )
  }
}
