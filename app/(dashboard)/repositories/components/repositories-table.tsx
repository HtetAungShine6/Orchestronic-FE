"use client"

import { DataTable } from "@/components/data-table/components/data-table"
import { useRouter } from "next/navigation"
import { Repository } from "../data/schema-repository"
import { columnsRepositories } from "./columns-repositories"

interface RepositoriesTableProps {
  data: Repository[]
  pageSize?: number
}

export default function RepositoriesTable({
  data,
  pageSize = 10,
}: RepositoriesTableProps) {
  const router = useRouter()
  return (
    <DataTable
      data={data}
      columns={columnsRepositories}
      filterColumn="repository"
      pageSize={pageSize}
      onRowClick={(row) => router.push(`/repositories/${row.repository}`)}
    />
  )
}
