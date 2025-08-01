"use client"

import { DataTable } from "@/components/data-table/components/data-table"
import { useRouter } from "next/navigation"
import { columnsRequests } from "./columns-requests"
import { getRequests } from "@/app/api/requests/api"
import { useQuery } from "@tanstack/react-query"

interface RequestsTableProps {
  pageSize?: number
}

export default function RequestsTable({ pageSize = 10 }: RequestsTableProps) {
  const router = useRouter()

  const { data, isLoading, error } = useQuery({
    queryKey: ["requests"],
    queryFn: getRequests,
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading table</p>

  return (
    <DataTable
      data={data}
      columns={columnsRequests}
      filterColumn="displayCode"
      pageSize={pageSize}
      onRowClick={(row) => router.push(`/requests/${row.displayCode}`)}
    />
  )
}
