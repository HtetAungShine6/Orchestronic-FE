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
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  //   {
  //     accessorKey: "id",
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title="Task" />
  //     ),
  //     cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
  //     enableSorting: false,
  //     enableHiding: false,
  //   },
  // {
  //   accessorKey: "title",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Title" />
  //   ),
  //   cell: ({ row }) => {
  //     // const label = labels.find((label) => label.value === row.original.label)

  //     return (
  //       <div className="flex space-x-2">
  //         {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
  //         <span className="max-w-[500px] truncate font-medium">
  //           {row.getValue("title")}
  //         </span>
  //       </div>
  //     )
  //   },
  // },
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
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="">{row.getValue("description")}</span>
        </div>
      )
    },
  },
  //   {
  //     accessorKey: "status",
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title="Status" />
  //     ),
  //     cell: ({ row }) => {
  //       const status = statuses.find(
  //         (status) => status.value === row.getValue("status")
  //       )

  //       if (!status) {
  //         return null
  //       }

  //       return (
  //         <div className="flex w-[100px] items-center">
  //           {status.icon && (
  //             <status.icon className={cn("mr-2 h-4 w-4", status.color)} />
  //           )}
  //           <span>{status.label}</span>
  //         </div>
  //       )
  //     },
  //     filterFn: (row, id, value) => {
  //       return value.includes(row.getValue(id))
  //     },
  //   },
  // {
  //   accessorKey: "priority",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Priority" />
  //   ),
  //   cell: ({ row }) => {
  //     const priority = priorities.find(
  //       (priority) => priority.value === row.getValue("priority")
  //     )

  //     if (!priority) {
  //       return null
  //     }

  //     return (
  //       <div className="flex items-center">
  //         {priority.icon && (
  //           <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{priority.label}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
]
