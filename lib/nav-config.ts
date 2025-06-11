import {
  IconCamera,
  IconCloudSearch,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconPackages,
  IconReport,
  IconSearch,
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
    },
    {
      title: "Repositories",
      url: "/repositories",
      icon: IconFolder,
    },
    {
      title: "Requests",
      url: "/requests",
      icon: IconSend,
    },
    {
      title: "Resources",
      url: "/resources",
      icon: IconPackages,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/get-help",
      icon: IconHelp,
    },
  ],
  operations: [
    {
      title: "Monitoring",
      url: "/monitoring",
      icon: IconCloudSearch,
    },
    {
      title: "Policies",
      url: "/policies",
      icon: IconShield,
    },
  ],
  collaborations: [
    {
      title: "Team",
      url: "/team",
      icon: IconUsers,
    },
  ],
}
