import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RequestDetail } from "./request-detail"
import { MessageSquareText } from "lucide-react"

export default function FeedbackCard({ data }: { data?: RequestDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">
          <p className="flex items-center gap-1">
            <MessageSquareText />
            Feedback
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>{data?.feedback ?? "No feedback provided."}</CardContent>
    </Card>
  )
}
