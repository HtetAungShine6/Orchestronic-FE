import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default async function Page() {
  return (
    <>
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
                  <BreadcrumbPage>Create Request</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-2xl font-bold tracking-tight">
              Create Request
            </h2>
          </div>
        </div>
      </div>
    </>
  )
}
