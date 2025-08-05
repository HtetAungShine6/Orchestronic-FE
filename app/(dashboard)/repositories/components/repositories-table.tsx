"use client"

import { DataTable } from "@/components/data-table/components/data-table"
import { useRouter } from "next/navigation"
import { columnsRepositories } from "./columns-repositories"
import { getRepositories } from "@/app/api/repository/api"
import { useQuery } from "@tanstack/react-query"

interface RepositoriesTableProps {
  pageSize?: number
}

export default function RepositoriesTable({
  pageSize = 10,
}: RepositoriesTableProps) {
  const router = useRouter()

  const { data, isLoading, error } = useQuery({
    queryKey: ["repositories"],
    queryFn: getRepositories,
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading table</p>

  return (
    <DataTable
      data={data}
      columns={columnsRepositories}
      filterColumn="name"
      pageSize={pageSize}
      onRowClick={(row) => router.push(`/repositories/${row.id}`)}
    />
  )
}
