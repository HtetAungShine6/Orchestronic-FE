import { CircleCheck } from "lucide-react"
import { CopyButton } from "@/components/ui/shadcn-io/copy-button"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function TextareaWithCopyButton({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={className}>
      <Label className="mb-1 block">{label}</Label>
      <div className="flex items-center gap-1">
        <Textarea value={value} readOnly className="flex-1 w-fit h-[120px]" />
        <CopyButton
          variant="ghost"
          className="px-3 py-2 hover:bg-transparent"
          content={value}
          onCopy={() =>
            toast.success("Copied to clipboard", {
              icon: <CircleCheck color="white" fill="black" />,
            })
          }
        />
      </div>
    </div>
  )
}
