import Image from "next/image"

import { promises as fs } from "fs"
import path from "path"
// import { Metadata } from "next"
import { z } from "zod"

import { requestSchema } from "./data/schema-request"
import RequestsTable from "./components/requests-table"

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "A task and issue tracker build using Tanstack Table.",
// }

// Simulate a database read for tasks.
async function getRequests() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/(dashboard)/requests/data/requests.json")
  )

  const requests = JSON.parse(data.toString())

  return z.array(requestSchema).parse(requests)
}

export default async function Page() {
  const requests = await getRequests()

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-6 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Requests</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your requests!
            </p>
          </div>
        </div>
        <RequestsTable data={requests} />
      </div>
    </>
  )
}
