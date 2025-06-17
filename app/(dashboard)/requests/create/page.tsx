import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { generateRepoName } from "@/lib/utils"
import { Metadata } from "next"
import { RepoNameInput } from "./repo-name-input"
import { getServerSession } from "next-auth"

export const metadata: Metadata = {
  title: "New request",
  description:
    "Create a new request to provision infrastructure, deploy services, or access internal developer resources within the platform.",
}

export default async function Page() {
  const suggestedName = generateRepoName()
  const session = await getServerSession()

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
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Create a new repository</CardTitle>
              <CardDescription>
                A repository contains all project files, including the revision
                history.
              </CardDescription>
              <Separator />
              <CardDescription>
                Required fields are marked with an asterisk (*).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RepoNameInput
                suggestedName={suggestedName}
                ownerName={session?.user?.name || "unknown"}
              />
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
