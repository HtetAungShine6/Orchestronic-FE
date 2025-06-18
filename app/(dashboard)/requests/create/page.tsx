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
  CardAction,
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RepoVisibility } from "./repo-visibility"
import { Button } from "@/components/ui/button"

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
        <div className="flex justify-center">
          <Card className="lg:w-[50%]">
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
                <Input />
              </div>
              <Separator className="my-3" />
              <RepoVisibility />
            </CardContent>
            <CardFooter className="ml-auto">
              <CardAction>
                <Button className="bg-green-700 hover:bg-green-800">
                  Create repository
                </Button>
              </CardAction>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
