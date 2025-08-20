"use client"

import { DataTable } from "@/components/data-table/components/data-table"
import { useRouter } from "next/navigation"
import { columnsRepositories } from "./columns-repositories"
import { getRepositories } from "@/app/api/repository/api"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

interface RepositoriesTableProps {
  pageSize?: number
}

export default function RepositoriesTable({
  pageSize = 10,
}: RepositoriesTableProps) {
  const router = useRouter()
  const { data: session } = useSession()

  const { data, isLoading, error } = useQuery({
    queryKey: ["repositories"],
    queryFn: getRepositories,
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading table</p>

  const columns = columnsRepositories(session?.user?.role)

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
