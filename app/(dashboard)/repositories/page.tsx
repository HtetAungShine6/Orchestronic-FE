import { DataTable } from "@/components/data-table/components/data-table"
import { promises as fs } from "fs"
import path from "path"
import { requestSchema } from "./data/schema-requests"
import { z } from "zod"

import { columnsRequests } from "./components/columns-requests"

async function getRequests() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/(dashboard)/repositories/data/requests.json")
  )

  const requests = JSON.parse(data.toString())

  return z.array(requestSchema).parse(requests)
}

export default async function Page() {
  const requests = await getRequests()

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-6 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Repositories</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your GitLab repositories
          </p>
        </div>
      </div>
      <DataTable
        data={requests}
        columns={columnsRequests}
        filterColumn="repository"
      />
    </div>
  )
}
