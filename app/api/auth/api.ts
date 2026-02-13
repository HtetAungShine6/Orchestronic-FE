"use client"

export async function logout() {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include", // important to include cookies
  })
  // optionally redirect user
  window.location.href = "/"
}