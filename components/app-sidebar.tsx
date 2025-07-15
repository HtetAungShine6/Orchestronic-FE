"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import OrchestronicLogo from "./orchestronic-logo"
import { useSession } from "next-auth/react"
import { navData } from "@/lib/nav-config"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()

  const user = {
    name: session?.user?.name ?? "Unknown User",
    email: session?.user?.email ?? "unknown@example.com",
    avatar: "/default-avatar.png",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                {/* <IconInnerShadowTop className="!size-5" /> */}
                <OrchestronicLogo size={20} />
                <span className="text-base font-semibold">Orchestronic</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} session={session} />
        <NavDocuments
          items={navData.operations}
          label="Operations"
          session={session}
        />
        {/* <NavDocuments
          items={navData.collaborations}
          label="Collaboration"
          session={session}
        /> */}
        <NavSecondary
          items={navData.navSecondary}
          className="mt-auto"
          session={session}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
