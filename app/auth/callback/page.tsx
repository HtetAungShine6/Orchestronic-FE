"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get("token")
    const errorParam = searchParams.get("error")

    if (errorParam) {
      setError(errorParam)
      setTimeout(() => router.push("/login"), 3000)
      return
    }

    if (token) {
      // Token should already be set as HTTP-only cookie by backend
      // Just redirect to dashboard
      router.push("/dashboard")
    } else {
      // Check if cookie is already set
      const checkAuth = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
            {
              credentials: "include",
            }
          )
          if (res.ok) {
            router.push("/dashboard")
          } else {
            setError("Authentication failed")
            setTimeout(() => router.push("/login"), 3000)
          }
        } catch {
          setError("Authentication failed")
          setTimeout(() => router.push("/login"), 3000)
        }
      }
      checkAuth()
    }
  }, [searchParams, router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        {error ? (
          <div>
            <p className="text-red-500">{error}</p>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting to login...
            </p>
          </div>
        ) : (
          <div>
            <p className="text-lg">Completing authentication...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mt-4"></div>
          </div>
        )}
      </div>
    </div>
  )
}
