import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { generateRepoName } from "@/lib/utils"
import { Metadata } from "next"
import { getServerSession } from "next-auth/next"

import ClientRequestForm from "@/components/requests/client-request-form"
import { authOptions } from "@/lib/auth-options"

export const metadata: Metadata = {
  title: "New request",
  description:
    "Create a new request to provision infrastructure, deploy services, or access internal developer resources within the platform.",
}

export default async function Page() {
  const suggestedName = generateRepoName()
  const session = await getServerSession(authOptions)

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
                <BreadcrumbPage>Create Request</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-2xl font-bold tracking-tight">Create Request</h2>
        </div>
      </div>
      <div className="grid gap-6">
        <ClientRequestForm session={session} suggestedName={suggestedName} />
      </div>
    </div>
  )
}
