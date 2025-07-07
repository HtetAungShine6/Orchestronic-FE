import { promises as fs } from "fs"
import path from "path"
// import { Metadata } from "next"
import { z } from "zod"

import { repositorySchema } from "@/app/(dashboard)/repositories/data/schema-repository"
import RepositoriesTable from "@/app/(dashboard)/repositories/components/repositories-table"

import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import Link from "next/link"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { getRequests } from "@/app/api/requests/api"
import RequestsTable from "@/app/(dashboard)/requests/components/requests-table"

async function getRepositories() {
  const data = await fs.readFile(
    path.join(
      process.cwd(),
      "app/(dashboard)/repositories/data/repositories.json"
    )
  )

  const Repositories = JSON.parse(data.toString())

  return z.array(repositorySchema).parse(Repositories)
}

export default async function Page() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["requests"],
    queryFn: getRequests,
  })

  const repositories = await getRepositories()

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
          <Button asChild>
            <Link href="/requests/create">
              <IconPlus /> Request
            </Link>
          </Button>
        </div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <RequestsTable pageSize={5} />
        </HydrationBoundary>
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
        <RepositoriesTable data={repositories} pageSize={5} />
      </div>
    </>
  )
}
