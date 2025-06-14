import Image from "next/image"

import { promises as fs } from "fs"
import path from "path"
// import { Metadata } from "next"
import { z } from "zod"

import { columns } from "./components/columns"
import { columnsRequests } from "./components/columns-requests"
import { DataTable } from "@/components/data-table/components/data-table"
import { taskSchema } from "./data/schema"
import { requestSchema } from "./data/schema-requests"

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "A task and issue tracker build using Tanstack Table.",
// }

// Simulate a database read for tasks.
async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/(dashboard)/dashboard/data/tasks.json")
  )

  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}

async function getRequests() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/(dashboard)/dashboard/data/requests.json")
  )

  const requests = JSON.parse(data.toString())

  return z.array(requestSchema).parse(requests)
}

export default async function Page() {
  const tasks = await getTasks()
  const requests = await getRequests()

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-6 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your requests!
            </p>
          </div>
        </div>
        <DataTable data={tasks} columns={columns} filterColumn="id" />
      </div>

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
    </>
  )
}
