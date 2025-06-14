import { DataTable } from "@/components/data-table/components/data-table"

import { resourceSchema } from "./data/schema-resources"
import { z } from "zod"
import { columnsResources } from "./components/columns-resources"
import { promises as fs } from "fs"
import path from "path"

async function getResources() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/(dashboard)/resources/data/resources.json")
  )

  const resources = JSON.parse(data.toString())

  return z.array(resourceSchema).parse(resources)
}

export default async function Page() {
  const resources = await getResources()
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-6 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Resources</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your resources
          </p>
        </div>
      </div>
      <DataTable
        data={resources}
        columns={columnsResources}
        filterColumn="name"
        pageSize={10}
      />
    </div>
  )
}
