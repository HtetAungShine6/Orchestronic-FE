"use client"

import { ColumnDef } from "@tanstack/react-table"

import { statuses } from "../data/data"
import { Request } from "../data/schema-request"
import { DataTableColumnHeader } from "@/components/data-table/components/data-table-column-header"
import { cn } from "@/lib/utils"

export const columnsRequests: ColumnDef<Request>[] = [
  {
    accessorKey: "displayCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Request" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] truncate">{row.getValue("displayCode")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="">
            {new Date(row.getValue("createdAt")).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "resources",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Requested Resources" />
    ),
    cell: ({ row }) => {
      const resources = row.getValue("resources") as Request["resources"]

      return (
        <div className="flex space-x-2">
          <span className="">{resources.name}</span>
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
      const repository = row.getValue("repository") as Request["repository"]

      return (
        <div className="flex space-x-2">
          <span className="">{repository.name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className={cn("mr-2 h-4 w-4", status.color)} />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
]
