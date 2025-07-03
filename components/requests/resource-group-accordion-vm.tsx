import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useEffect, useRef } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UseFormReturn } from "react-hook-form"
import { requestFormSchema } from "./client-request-form"
import z from "zod"
import Image from "next/image"

export const operatingSystems = [
  { value: "ubuntu", label: "Ubuntu", icon: "/icon/ubuntu.png" },
  { value: "windows", label: "Windows", icon: "/icon/windows.png" },
]

interface ResourceGroupAccordionProps {
  form: UseFormReturn<z.infer<typeof requestFormSchema>>
  vmCount: number
}

export function ResourceGroupAccordionVM({
  form,
  vmCount,
}: Readonly<ResourceGroupAccordionProps>) {
  const lastVMRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (lastVMRef.current) {
      lastVMRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [vmCount])

  return (
    <div className="grid gap-6">
      {vmCount > 0 && (
        <Accordion type="single" collapsible>
          {Array.from({ length: vmCount }).map((_, i) => (
            <AccordionItem
              key={i}
              value={`virtual-machine-${i}`}
              ref={i === Math.floor(vmCount / 3) ? lastVMRef : null}
            >
              <AccordionTrigger className="flex items-center justify-between">
                <div className="flex items-center justify-between w-full outline-none">
                  Virtual Machines #{i + 1}
                  <span className="cursor-pointer">Delete</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardHeader>
                    <CardTitle>VM #{i + 1}</CardTitle>
                    <CardDescription>
                      Configure virtual machine settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <Label>Name</Label>
                    <Input
                      placeholder="e.g., web-server-1"
                      onChange={(e) => {
                        form.setValue(`resources.vm.${i}.name`, e.target.value)
                      }}
                    />
                    <div className="flex justify-between">
                      <div className="grid gap-2">
                        <Label>CPU</Label>
                        <Input
                          placeholder="e.g., 2"
                          type="number"
                          onChange={(e) => {
                            form.setValue(
                              `resources.vm.${i}.cpu`,
                              Number(e.target.value)
                            )
                          }}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>RAM</Label>
                        <Input
                          placeholder="e.g., 4 GB"
                          type="number"
                          onChange={(e) => {
                            form.setValue(
                              `resources.vm.${i}.memory`,
                              Number(e.target.value)
                            )
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div className="grid gap-2">
                        <Label>Operating System</Label>
                        <Select
                          onValueChange={(value) =>
                            form.setValue(`resources.vm.${i}.os`, value)
                          }
                        >
                          <SelectTrigger className="w-54">
                            <SelectValue placeholder="Choose OS" />
                          </SelectTrigger>
                          <SelectContent>
                            {operatingSystems.map((os) => (
                              <SelectItem key={os.value} value={os.value}>
                                <span className="flex items-center gap-2">
                                  <Image
                                    src={os.icon}
                                    width={16}
                                    height={16}
                                    alt={`${os.label} Icon`}
                                  />
                                  {os.label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Disk Size</Label>
                        <Input placeholder="e.g., 100 GB" type="number" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  )
}
