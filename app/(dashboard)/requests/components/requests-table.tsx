"use client"

import { DataTable } from "@/components/data-table/components/data-table"
import { useRouter } from "next/navigation"
import { Request } from "../data/schema-request"
import { columnsRequests } from "./columns-requests"

interface RepositoriesTableProps {
  data: Request[]
}

export default function RequestsTable({ data }: RepositoriesTableProps) {
  const router = useRouter()
  return (
    <DataTable
      data={data}
      columns={columnsRequests}
      filterColumn="id"
      pageSize={10}
      onRowClick={(row) => router.push(`/requests/${row.id}`)}
    />
  )
}
