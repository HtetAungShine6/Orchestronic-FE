// // import { Metadata } from "next"

// import { getRequests } from "@/app/api/requests/api"
// import RequestsTable from "./components/requests-table"
// import {
//   dehydrate,
//   HydrationBoundary,
//   QueryClient,
//   useQuery,
// } from "@tanstack/react-query"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { IconPlus } from "@tabler/icons-react"
// import { RequestButton } from "./components/request-button"

// export default async function Page() {
//   const queryClient = new QueryClient()

//   await queryClient.prefetchQuery({
//     queryKey: ["requests"],
//     queryFn: getRequests,
//   })

//   return (
//     <div className="hidden h-full flex-1 flex-col space-y-8 p-6 md:flex">
//       <div className="flex items-center justify-between space-y-2">
//         <div>
//           <h2 className="text-2xl font-bold tracking-tight">Requests</h2>
//           <p className="text-muted-foreground">
//             Here&apos;s a list of your requests!
//           </p>
//         </div>
//         {/* <Button asChild>
//           <Link href="/requests/create">
//             <IconPlus /> Request
//           </Link>
//         </Button> */}
//         <RequestButton/>
//       </div>
//       <HydrationBoundary state={dehydrate(queryClient)}>
//         <RequestsTable pageSize={10} />
//       </HydrationBoundary>
//     </div>
//   )
// }

// app/requests/page.tsx
import { getRequests, getUserClusters } from "@/app/api/requests/api"
import RequestsTable from "./components/requests-table"
import ClustersTable from "../clusters/components/clusters-table"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { RequestButton } from "./components/request-button"

export default async function Page() {
  const queryClient = new QueryClient()

  // Prefetch both requests and clusters
  await queryClient.prefetchQuery({
    queryKey: ["requests"],
    queryFn: getRequests,
  })

  await queryClient.prefetchQuery({
    queryKey: ["clusters"],
    queryFn: getUserClusters,
  })

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-6 md:flex">
      {/* Requests Section */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Requests</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your requests!
          </p>
        </div>
        <RequestButton />
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <RequestsTable pageSize={10} />
      </HydrationBoundary>

      {/* Clusters Section */}
      <div className="flex items-center justify-between space-y-2 pt-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Clusters</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your clusters! Click on a cluster to view
            details.
          </p>
        </div>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ClustersTable pageSize={10} />
      </HydrationBoundary>
    </div>
  )
}
