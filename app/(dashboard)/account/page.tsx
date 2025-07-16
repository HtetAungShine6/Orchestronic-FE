import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader } from "@/components/ui/card"
import { getInitials } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default async function Page() {
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-6 md:flex">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Account</h1>
        <p className="text-muted-foreground">
          Here&apos;s your account information!
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" alt={session?.user.name} />
              <AvatarFallback className="text-lg">
                {getInitials(session?.user.name || "")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{session?.user.name}</h2>
              <p className="text-muted-foreground">{session?.user.email}</p>
              <Badge variant="default">{session?.user.role}</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
