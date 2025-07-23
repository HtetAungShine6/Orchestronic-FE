// lib/fetchWithAuth.ts
import { getServerSession } from "next-auth"
import { authOptions } from "./auth-options"

let refreshing = false

export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {}
) {
  const session = await getServerSession(authOptions)

  // Set access token from session
  init.headers = {
    ...init.headers,
    Authorization: `Bearer ${session?.user.backendAccessToken}`,
  }

  let res = await fetch(input, {
    ...init,
    credentials: "include", // Important for sending refresh token cookie
  })

  // If token expired, try refreshing once
  if (res.status === 401 && !refreshing) {
    refreshing = true

    const refreshRes = await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json()

      // Update token in memory/session
      if (session && session.user) {
        session.user.backendAccessToken = refreshData.accessToken
      }

      // Retry original request with new token
      init.headers = {
        ...init.headers,
        Authorization: `Bearer ${refreshData.accessToken}`,
      }

      res = await fetch(input, {
        ...init,
        credentials: "include",
      })
    }

    refreshing = false
  }

  return res
}
