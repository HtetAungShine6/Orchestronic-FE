"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loginWithAzure = () => {
    setError(null)
    setLoading(true)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) {
      setError("API URL is not configured.")
      setLoading(false)
      return
    }
    window.location.href = `${apiUrl}/auth/azure`
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Button onClick={loginWithAzure} disabled={loading}>
        {loading ? "Redirecting..." : "Login with Azure"}
      </Button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  )
}
