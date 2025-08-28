import { statuses } from "@/app/(dashboard)/requests/data/data"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cloudProviders, regions } from "../resource-group"
import { IconPackages } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import Image from "next/image"
import { RequestDetail } from "./request-detail"
import { Separator } from "@/components/ui/separator"
import ResourceConfigSection from "./resource-config-section"

export default function ResourceGroupCard({ data }: { data?: RequestDetail }) {
  const status = statuses.find((s) => s.value === data?.status)
  const cloudProvider = cloudProviders.find(
    (provider) => provider.value === data?.resources?.cloudProvider
  )
  const region = regions.find((r) => r.value === data?.resources?.region)
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <p className="flex items-center text-xl font-bold">
            <IconPackages />
            Resource Group
          </p>
          <p className="flex items-center gap-1">
            {status?.icon && (
              <status.icon className={cn("h-4 w-4", status.color)} />
            )}
            <span className="text-sm font-normal">{status?.label}</span>
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <div className="">
            <Label className="text-sm font-medium text-muted-foreground">
              Name
            </Label>
            <p className="truncate">{data?.resources?.name}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Cloud Provider
            </Label>
            <p className="flex items-center gap-1">
              <Image
                src={cloudProvider?.icon || "/default-icon.png"}
                alt={cloudProvider?.label || "None"}
                width={20}
                height={20}
              />
              {cloudProvider?.label}
            </p>
          </div>
          <div className="">
            <Label className="text-sm font-medium text-muted-foreground">
              Region
            </Label>
            <div className="flex items-center gap-1">
              <Image
                src={region?.flag || "/default-icon.png"}
                alt={region?.label || "None"}
                width={16}
                height={16}
              />
              <p className="truncate">{region?.label}</p>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Created at
            </Label>
            <p>
              {data?.createdAt &&
                format(new Date(data.createdAt), "EEE, dd MMM yyyy, HH:mm")}
            </p>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter>
        <ResourceConfigSection data={data} />
      </CardFooter>
    </Card>
  )
}
