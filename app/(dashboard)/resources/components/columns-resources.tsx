"use client"

import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/data-table/components/data-table-column-header"
import { getInitials } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Resource } from "../data/schema-resources"

export const columnsResources: ColumnDef<Resource>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="">{row.getValue("name")}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "developers",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Developers" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label)
      const initials: string[] = row.getValue("developers")

      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          {initials.map((initial, index) => (
            <TooltipProvider key={`${index}_${initial}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-8 w-8">
                    {/* <AvatarImage src="/avatars/03.png" alt={initial} /> */}
                    <AvatarFallback>{getInitials(initial)}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>{initial}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "resources",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Resources" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="">{row.getValue("resources")}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "repository",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Repository" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="">{row.getValue("repository")}</span>
        </div>
      )
    },
  },
]
