"use client"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { usePathname } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import { Spinner } from "@/components/ui/spinner"
import { Role, roleAccessRules } from "@/types/role"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const { user, loading } = useUser()

  // While loading, show nothing (or a spinner)
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    )

  // If not logged in, redirect immediately
  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/login"
    return null
  }

  // Role check
  const allowedRoles = roleAccessRules[pathname] || []
  if (!allowedRoles.includes(user.role as Role)) {
    if (typeof window !== "undefined") window.location.href = "/unauthorized"
    return null
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
