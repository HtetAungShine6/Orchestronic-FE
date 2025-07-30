"use client"
import { statuses } from "@/app/(dashboard)/requests/data/data"
import { getRequestBySlug } from "@/app/api/requests/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

export default function RequestDetail({ slug }: { slug: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["request", slug],
    queryFn: () => getRequestBySlug(slug),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading request details</div>

  const status = statuses.find((s) => s.value === data?.status)

  return (
    <div className="space-y-6">
      {/* Request Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Request Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Status
              </Label>
              <p className="flex items-center">
                {status?.icon && (
                  <status.icon className={cn("mr-2 h-4 w-4", status.color)} />
                )}
                <span>{status?.label}</span>
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Description
              </Label>
              <p>{data?.description}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Created At
              </Label>
              <p>{format(new Date(data?.createdAt), "EEE, dd MMM, HH:mm")}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Updated At
              </Label>
              <p>{format(new Date(data?.updatedAt), "EEE, dd MMM, HH:mm")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Owner Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight">
            Owner Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Name
              </Label>
              <p>{data?.owner?.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Email
              </Label>
              <p>{data?.owner?.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Role
              </Label>
              <p>{data?.owner?.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Repository Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight">
            Repository
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Name
              </Label>
              <p>{data?.repository?.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Status
              </Label>
              <p>{data?.repository?.status}</p>
            </div>
            {data?.repository?.description && (
              <div className="col-span-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Description
                </Label>
                <p>{data?.repository?.description}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resources Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight">
            Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Resource Group Name
              </Label>
              <p>rg-{data?.resources?.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Cloud Provider
              </Label>
              <p className="capitalize">{data?.resources?.cloudProvider}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Region
              </Label>
              <p>{data?.resources?.region}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
