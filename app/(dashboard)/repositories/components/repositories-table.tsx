"use client"

import { DataTable } from "@/components/data-table/components/data-table"
import { useRouter } from "next/navigation"
import { columnsRepositories } from "./columns-repositories"
import { getRepositories } from "@/app/api/repository/api"
import { useQuery } from "@tanstack/react-query"
import { getUser } from "@/app/api/user/api"

interface RepositoriesTableProps {
  pageSize?: number
}

export default function RepositoriesTable({
  pageSize = 10,
}: RepositoriesTableProps) {
  const router = useRouter()

  const { data: session } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ["repositories"],
    queryFn: getRepositories,
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading table</p>

  const columns = columnsRepositories(session?.role)

  return (
    <DataTable
      data={data}
      columns={columns}
      filterColumn="name"
      pageSize={pageSize}
      onRowClick={(row) =>
        router.push(`${process.env.NEXT_PUBLIC_GITLAB_URL}/root/${row.name}`)
      }
    />
  )
}
