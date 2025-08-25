"use client"
import { Button } from "@/components/ui/button"

export default function Page() {
  const loginWithAzure = () => {
    // Redirect user to your NestJS backend Azure login
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/azure`
  }
  return <Button onClick={loginWithAzure}>Login</Button>
}
