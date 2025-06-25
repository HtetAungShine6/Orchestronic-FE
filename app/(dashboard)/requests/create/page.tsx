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
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { generateRepoName } from "@/lib/utils"
import { Metadata } from "next"
import { RepoNameInput } from "../../../../components/requests/repo-name-input"
import { getServerSession } from "next-auth/next"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Collaborators from "../../../../components/requests/collaborators"
import ResourceGroup from "@/components/requests/resource-group"
import { Textarea } from "@/components/ui/textarea"

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
        <div className="grid gap-6">
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
              <div className="grid w-full gap-3">
                <Label className="gap-1" htmlFor="email">
                  Description
                  <span className="text-muted-foreground text-sm">
                    (optional)
                  </span>
                </Label>
                <Input placeholder="Briefly describe your repository" />
              </div>
            </CardContent>
          </Card>

          <Collaborators />
          <ResourceGroup />
          <div className="grid w-full gap-3">
            <Label className="gap-1" htmlFor="request-description">
              Request description
            </Label>
            <Textarea placeholder="Type your message here" />
          </div>
        </div>
      </div>
    </>
  )
}
