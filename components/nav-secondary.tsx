"use client"

import * as React from "react"
import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { Role } from "@/types/role"
import { Session } from "next-auth"

export function NavSecondary({
  items,
  session,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
    role?: Role[]
  }[]
  session: Session | null
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname()

  const itemsFiltered = items.filter((item) =>
    item.role?.includes(session?.user.role as Role)
  )

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {itemsFiltered.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.url)}
                className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
              >
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
