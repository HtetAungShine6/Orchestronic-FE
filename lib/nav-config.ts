import { Role } from "@/types/role"
import {
  IconCloudSearch,
  IconDashboard,
  IconFolder,
  IconHelp,
  IconPackages,
  IconSend,
  IconSettings,
  IconShield,
  IconUsers,
} from "@tabler/icons-react"

export const navData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
      role: [Role.Admin, Role.Developer, Role.IT],
    },
    {
      title: "Repositories",
      url: "/repositories",
      icon: IconFolder,
      role: [Role.Admin, Role.Developer, Role.IT],
    },
    {
      title: "Requests",
      url: "/requests",
      icon: IconSend,
      role: [Role.Admin, Role.Developer, Role.IT],
    },
    {
      title: "Resources",
      url: "/resources",
      icon: IconPackages,
      role: [Role.Admin, Role.Developer, Role.IT],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
      role: [Role.Admin],
    },
    {
      title: "Get Help",
      url: "/get-help",
      icon: IconHelp,
      role: [Role.Admin, Role.Developer, Role.IT],
    },
  ],
  operations: [
    {
      title: "Monitoring",
      url: "/monitoring",
      icon: IconCloudSearch,
      role: [Role.Admin, Role.Developer, Role.IT],
    },
    {
      title: "Policies",
      url: "/policies",
      icon: IconShield,
      role: [Role.Admin, Role.Developer, Role.IT],
    },
  ],
  collaborations: [
    {
      title: "Team",
      url: "/team",
      icon: IconUsers,
      role: [Role.Admin, Role.Developer, Role.IT],
    },
  ],
}
