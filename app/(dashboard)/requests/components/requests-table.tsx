"use client"

import { DataTable } from "@/components/data-table/components/data-table"
import { useRouter } from "next/navigation"
import { Request } from "../data/schema-request"
import { columnsRequests } from "./columns-requests"

interface RepositoriesTableProps {
  data: Request[]
  pageSize?: number
}

export default function RequestsTable({
  data,
  pageSize = 10,
}: RepositoriesTableProps) {
  const router = useRouter()
  return (
    <DataTable
      data={data}
      columns={columnsRequests}
      filterColumn="id"
      pageSize={pageSize}
      onRowClick={(row) => router.push(`/requests/${row.id}`)}
    />
  )
}
