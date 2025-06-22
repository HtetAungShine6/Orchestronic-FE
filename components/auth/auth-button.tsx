"use client"

import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image"

export default function AuthButton() {
  const { data: session } = useSession()

  if (session) {
    return <Button onClick={() => signOut()}>Sign Out</Button>
  } else {
    return (
      <Button
        variant="outline"
        onClick={() => signIn("azure-ad", { callbackUrl: "/dashboard" })}
      >
        {/*
        <Image
          src="https://img.icons8.com/?size=100&id=22984&format=png&color=1A1A1A"
          alt="Microsoft icon"
          width={20}
          height={20}
        />
        Login with Microsoft
        */}
        Login
      </Button>
    )
  }
}
