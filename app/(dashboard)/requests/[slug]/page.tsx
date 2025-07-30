import { getRequestBySlug } from "@/app/api/requests/api"
import RequestDetail from "@/components/requests/[slug]/request-detail"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["request", slug],
    queryFn: () => getRequestBySlug(slug),
  })

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-6 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/requests">Requests</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{slug}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-2xl font-bold tracking-tight">{slug}</h2>
        </div>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <RequestDetail slug={slug} />
      </HydrationBoundary>
    </div>
  )
}
