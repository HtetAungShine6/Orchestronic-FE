import { CircleCheck } from "lucide-react"
import { CopyButton } from "@/components/ui/shadcn-io/copy-button"
import { toast } from "sonner"
import InputPassword from "@/components/ui/input-password"
import { Label } from "@/components/ui/label"
import InputWithCopyButton from "./input-with-copy-button"

interface SSHProps {
  ip: string
  password: string
}

export default function SSH({ ip, password }: SSHProps) {
  return (
    <div className="space-y-4">
      {/* IP Address Field */}
      <InputWithCopyButton label="IP Address" value={ip} />

      {/* Password Field */}
      <div>
        <Label className="mb-1 block">Password</Label>
        <div className="flex items-center gap-1">
          <InputPassword value={password} readOnly />
          <CopyButton
            variant="ghost"
            className="px-3 py-2 hover:bg-transparent"
            content={password}
            onCopy={() =>
              toast.success("Copied to clipboard", {
                icon: <CircleCheck color="white" fill="black" />,
              })
            }
          />
        </div>
      </div>
    </div>
  )
}
