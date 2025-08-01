"use client"

import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/data-table/components/data-table-column-header"
import { getInitials } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Repository } from "../data/schema-repository"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const columnsRepositories: ColumnDef<Repository>[] = [
  //   {
  //     accessorKey: "date",
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title="Date" />
  //     ),
  //     cell: ({ row }) => {
  //       // const label = labels.find((label) => label.value === row.original.label)

  //       return (
  //         <div className="flex space-x-2">
  //           {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
  //           <span className="">
  //             {new Date(row.getValue("date")).toLocaleDateString("en-GB", {
  //               weekday: "short",
  //               day: "2-digit",
  //               month: "short",
  //               hour: "2-digit",
  //               minute: "2-digit",
  //               hour12: false,
  //             })}
  //           </span>
  //         </div>
  //       )
  //     },
  //   },
  //   {
  //   accessorKey: "resources",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Requested Resources" />
  //   ),
  //   cell: ({ row }) => {
  //     // const label = labels.find((label) => label.value === row.original.label)

  //     return (
  //       <div className="flex space-x-2">
  //         {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
  //         <span className="">
  //           {row.getValue("resources")}
  //         </span>
  //       </div>
  //     )
  //   },
  // },
  {
    accessorKey: "name",
    meta: {
      title: "Repository",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Repository" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="">{row.getValue("name")}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "RepositoryCollaborator",
    meta: {
      title: "Collaborators",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Collaborators" />
    ),
    cell: ({ row }) => {
      const initials = row.getValue(
        "RepositoryCollaborator"
      ) as Repository["RepositoryCollaborator"]

      return (
        <div className="flex space-x-2">
          {initials.map((initial, index) => (
            <TooltipProvider key={`${index}_${initial}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-8 w-8">
                    {/* <AvatarImage src="/avatars/03.png" alt={initial} /> */}
                    <AvatarFallback>
                      {getInitials(initial.user.name)}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>{initial.user.name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="">{row.getValue("description")}</span>
        </div>
      )
    },
  },
]
