// app/clusters/components/clusters-table.tsx
"use client"

import { DataTable } from "@/components/data-table/components/data-table"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { getUserClusters } from "@/app/api/requests/api"
import DataTableSkeleton from "../../requests/components/data-table-skeleton"
import { getColumnsClusters } from "./column-clusters"

interface ClustersTableProps {
  pageSize?: number
}

export default function ClustersTable({ pageSize = 10 }: ClustersTableProps) {
  const router = useRouter()

  const { data, isLoading, error } = useQuery({
    queryKey: ["clusters"],
    queryFn: getUserClusters,
  })

  if (isLoading) return <DataTableSkeleton />
  if (error) return <p>Error loading clusters</p>

  const columns = getColumnsClusters()

  return (
    <DataTable
      data={data ?? []}
      columns={columns}
      filterColumn="name"
      pageSize={pageSize}
      onRowClick={(row) => router.push(`/clusters/${row.id}`)}
    />
  )
}
