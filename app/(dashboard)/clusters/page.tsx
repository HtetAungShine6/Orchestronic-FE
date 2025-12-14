import { getUserClusters } from "@/app/api/requests/api"
import ClustersTable from "./components/clusters-table"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"

export default async function ClustersPage() {
  const queryClient = new QueryClient()
  
  await queryClient.prefetchQuery({
    queryKey: ["clusters"],
    queryFn: getUserClusters,
  })

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-6 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Clusters</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your clusters!
          </p>
        </div>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ClustersTable pageSize={10} />
      </HydrationBoundary>
    </div>
  )
}