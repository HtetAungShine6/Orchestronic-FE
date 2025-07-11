"use client"

import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/data-table/components/data-table-column-header"
import { Resource } from "../data/schema-resources"
import { generateResources, toTitleCase } from "@/lib/utils"

export const columnsResources: ColumnDef<Resource>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
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
    accessorKey: "cloudProvider",
    meta: {
      title: "Cloud Provider",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cloud Provider" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="">{toTitleCase(row.getValue("cloudProvider"))}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "resourceConfig",
    meta: {
      title: "Resources",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Resources" />
    ),
    cell: ({ row }) => {
      const resourceConfig = row.getValue(
        "resourceConfig"
      ) as Resource["resourceConfig"]
      return (
        <div className="flex space-x-2">
          <span className="">{generateResources(resourceConfig)}</span>
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
      const repository = row.getValue("repository") as Resource["repository"]

      return (
        <div className="flex space-x-2">
          <span className="">{repository.name}</span>
        </div>
      )
    },
  },
]
