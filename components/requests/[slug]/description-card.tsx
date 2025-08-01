import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconInfoCircle } from "@tabler/icons-react"
import { RequestDetail } from "./request-detail"

export default function DescriptionCard({ data }: { data?: RequestDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">
          <p className="flex items-center gap-1">
            <IconInfoCircle />
            Description
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data?.description ?? "No description provided."}
      </CardContent>
    </Card>
  )
}
