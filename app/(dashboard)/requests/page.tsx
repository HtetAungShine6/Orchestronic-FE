// import { Metadata } from "next"

import { getRequests } from "@/app/api/requests/api"
import RequestsTable from "./components/requests-table"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconPlus } from "@tabler/icons-react"

export default async function Page() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["requests"],
    queryFn: getRequests,
  })

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-6 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Requests</h2>
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
        <RequestsTable pageSize={10} />
      </HydrationBoundary>
    </div>
  )
}
