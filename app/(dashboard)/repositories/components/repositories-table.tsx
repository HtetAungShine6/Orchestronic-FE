"use client"

import { DataTable } from "@/components/data-table/components/data-table"
import { useRouter } from "next/navigation"
import { Repository } from "../data/schema-repository"
import { columnsRepositories } from "./columns-repository"

interface RepositoriesTableProps {
  data: Repository[]
}

export default function RepositoriesTable({ data }: RepositoriesTableProps) {
  const router = useRouter()
  return (
    <DataTable
      data={data}
      columns={columnsRepositories}
      filterColumn="repository"
      pageSize={10}
      onRowClick={(row) => router.push(`/repositories/${row.repository}`)}
    />
  )
}
