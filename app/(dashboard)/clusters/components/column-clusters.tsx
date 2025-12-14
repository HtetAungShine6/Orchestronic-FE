// "use client"

// import { ColumnDef } from "@tanstack/react-table"
// import { Badge } from "@/components/ui/badge"
// import { ClusterResource } from "@/app/api/requests/api"

// export const getColumnsClusters = (): ColumnDef<ClusterResource>[] => [
//   {
//     accessorKey: "name",
//     header: "Cluster Name",
//     cell: ({ row }) => {
//       return <div className="font-medium">{row.getValue("name")}</div>
//     },
//   },
//   {
//     accessorKey: "cloudProvider",
//     header: "Provider",
//     cell: ({ row }) => {
//       const provider = row.getValue("cloudProvider") as string
//       return (
//         <Badge variant={provider === "AZURE" ? "default" : "secondary"}>
//           {provider}
//         </Badge>
//       )
//     },
//   },
//   {
//     accessorKey: "region",
//     header: "Region",
//     cell: ({ row }) => {
//       return <div>{row.getValue("region")}</div>
//     },
//   },
// ]

"use client"
import { ColumnDef } from "@tanstack/react-table"
import { ClusterResource } from "@/app/api/requests/api"
import { Cloud, MapPin } from "lucide-react"

export const getColumnsClusters = (): ColumnDef<ClusterResource>[] => [
  {
    accessorKey: "name",
    header: "Cluster Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "cloudProvider",
    header: "Provider",
    cell: ({ row }) => {
      const provider = row.getValue("cloudProvider") as string

      const providerConfig = {
        AZURE: {
          gradient: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50 dark:bg-blue-950/30",
          textColor: "text-blue-700 dark:text-blue-300",
          borderColor: "border-blue-200 dark:border-blue-800",
        },
        AWS: {
          gradient: "from-orange-500 to-amber-500",
          bgColor: "bg-orange-50 dark:bg-orange-950/30",
          textColor: "text-orange-700 dark:text-orange-300",
          borderColor: "border-orange-200 dark:border-orange-800",
        },
      }

      const config =
        providerConfig[provider as keyof typeof providerConfig] ||
        providerConfig.AZURE

      return (
        <div
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 ${config.bgColor} ${config.borderColor}`}
        >
          <div
            className={`flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br ${config.gradient} shadow-sm`}
          >
            <Cloud className="h-3 w-3 text-white" />
          </div>
          <span className={`text-sm font-semibold ${config.textColor}`}>
            {provider}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "region",
    header: "Region",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{row.getValue("region")}</span>
        </div>
      )
    },
  },
]
