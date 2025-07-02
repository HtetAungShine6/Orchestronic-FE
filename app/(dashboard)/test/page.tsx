"use client"
import { operatingSystems } from "@/components/requests/resource-group-accordion-vm"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Page() {
  return (
    <div className="w-[540px] grid gap-2">
      <Label>Name</Label>
      <Input placeholder="e.g., web-server-1" />

      <div className="flex justify-between">
        <div className="grid gap-2">
          <Label>CPU</Label>
          <Input placeholder="e.g., 2" type="number" />
        </div>
        <div className="grid gap-2">
          <Label>RAM</Label>
          <Input placeholder="e.g., 4" type="number" />
        </div>
      </div>

      <div className="flex justify-between">
        <div className="grid gap-2">
          <Label>OS</Label>
          <Select>
            <SelectTrigger className="w-54">
              <SelectValue placeholder="Choose OS" />
            </SelectTrigger>
            <SelectContent>
              {operatingSystems.map((os) => (
                <SelectItem key={os.value} value={os.value}>
                  {os.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Disk Size</Label>
          <Input placeholder="e.g., 100" type="number" />
        </div>
      </div>
    </div>
  )
}
