"use client"

import { DataTable } from "@/components/data-table/components/data-table"
import { useRouter } from "next/navigation"
import { getColumnsRequests } from "./columns-requests"
import { getRequests } from "@/app/api/requests/api"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

interface RequestsTableProps {
  prefilterStatus?: boolean
  pageSize?: number
}

export default function RequestsTable({
  prefilterStatus = false,
  pageSize = 10,
}: RequestsTableProps) {
  const router = useRouter()
  const { data: session } = useSession()

  const { data, isLoading, error } = useQuery({
    queryKey: ["requests"],
    queryFn: getRequests,
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading table</p>

  const columns = getColumnsRequests(session?.user?.role)

  return (
    <DataTable
      prefilterStatus={prefilterStatus}
      data={data}
      columns={columns}
      filterColumn="displayCode"
      pageSize={pageSize}
      onRowClick={(row) => router.push(`/requests/${row.displayCode}`)}
    />
  )
}
