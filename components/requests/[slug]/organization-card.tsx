import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconBuilding } from "@tabler/icons-react"
import { RequestDetail } from "./request-detail"
import { Label } from "@/components/ui/label"

export default function OrganizationCard({ data }: { data?: RequestDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className=" text-xl font-bold tracking-tight">
          <p className="flex items-center gap-1">
            <IconBuilding />
            Organization
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
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
  )
}
