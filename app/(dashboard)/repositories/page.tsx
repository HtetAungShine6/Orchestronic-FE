import { promises as fs } from "fs"
import path from "path"
import { repositorySchema } from "./data/schema-repository"
import { z } from "zod"

import { columnsRepositories } from "./components/columns-repository"
import RepositoriesTable from "./components/repositories-table"

async function getRequests() {
  const data = await fs.readFile(
    path.join(
      process.cwd(),
      "app/(dashboard)/repositories/data/repositories.json"
    )
  )

  const repositories = JSON.parse(data.toString())

  return z.array(repositorySchema).parse(repositories)
}

export default async function Page() {
  const repositories = await getRequests()

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-6 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Repositories</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your GitLab repositories!
          </p>
        </div>
      </div>
      <RepositoriesTable data={repositories} />
    </div>
  )
}
