// app/auth/callback/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AzureCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Parse accessToken from URL
    const urlParams = new URLSearchParams(window.location.search)
    const accessToken = urlParams.get("accessToken")

    if (accessToken) {
      // Save accessToken in memory or localStorage
      localStorage.setItem("accessToken", accessToken)

      // Remove query params from URL to avoid token leaks
      const cleanUrl = window.location.origin + "/auth/callback"
      window.history.replaceState({}, document.title, cleanUrl)

      // Redirect to dashboard
      router.replace("/dashboard")
    } else {
      // Handle missing token (optional: redirect to login)
      router.replace("/login")
    }
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Logging you in...</p>
    </div>
  )
}
