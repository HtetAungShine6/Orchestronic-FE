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

export const operatingSystems = [
  { value: "ubuntu", label: "Ubuntu" },
  { value: "windows", label: "Windows" },
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
              <AccordionTrigger>Virtual Machines #{i + 1}</AccordionTrigger>
              <AccordionContent>
                <Card className="mt-2">
                  <CardHeader>
                    <CardTitle>VM #{i + 1}</CardTitle>
                    <CardDescription>
                      Configure virtual machine settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <Label>CPU</Label>
                    <Input
                      placeholder="e.g., 2 vCPU"
                      type="number"
                      onChange={(e) => {
                        form.setValue(
                          `resources.vm.${i}.cpu`,
                          Number(e.target.value)
                        )
                      }}
                    />
                    <Label>Memory</Label>
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
                    <Label>OS</Label>
                    <Select
                      onValueChange={(value) =>
                        form.setValue(`resources.vm.${i}.os`, value)
                      }
                    >
                      <SelectTrigger>
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
