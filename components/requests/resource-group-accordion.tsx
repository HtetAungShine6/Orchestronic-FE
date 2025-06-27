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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
  storageCount: number
  databaseCount: number
}

export function ResourceGroupAccordion({
  form,
  vmCount,
  storageCount,
  databaseCount,
}: ResourceGroupAccordionProps) {
  const lastVMRef = useRef<HTMLDivElement | null>(null)
  const lastStorageRef = useRef<HTMLDivElement | null>(null)
  const lastDBRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (lastVMRef.current) {
      lastVMRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [vmCount])

  useEffect(() => {
    if (lastStorageRef.current) {
      lastStorageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }, [storageCount])

  useEffect(() => {
    if (lastDBRef.current) {
      lastDBRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [databaseCount])

  return (
    <div className="grid gap-6">
      {vmCount > 0 && (
        <Accordion type="single" collapsible>
          {Array.from({ length: vmCount }).map((_, i) => (
            <AccordionItem
              key={i}
              value={`virtual-machine-${i}`}
              ref={i === vmCount - 1 ? lastVMRef : null}
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

      {storageCount > 0 && (
        <Accordion type="single" collapsible>
          {Array.from({ length: storageCount }).map((_, i) => (
            <AccordionItem
              key={i}
              value={`storage-${i}`}
              ref={i === storageCount - 1 ? lastStorageRef : null}
            >
              <AccordionTrigger>Storage #{i + 1}</AccordionTrigger>
              <AccordionContent>
                <Card className="mt-2">
                  <CardHeader>
                    <CardTitle>Storage #{i + 1}</CardTitle>
                    <CardDescription>
                      Configure storage settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 pt-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`storage-type-${i}`}>Storage Type</Label>
                      <Select>
                        <SelectTrigger id={`storage-type-${i}`}>
                          <SelectValue placeholder="Select storage type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blob">Blob Storage</SelectItem>
                          <SelectItem value="file">File Storage</SelectItem>
                          <SelectItem value="queue">Queue Storage</SelectItem>
                          <SelectItem value="table">Table Storage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`storage-name-${i}`}>Storage Name</Label>
                      <Input
                        id={`storage-name-${i}`}
                        placeholder="Enter storage name"
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      {databaseCount > 0 && (
        <Accordion type="single" collapsible>
          {Array.from({ length: databaseCount }).map((_, i) => (
            <AccordionItem
              key={i}
              value={`database-${i}`}
              ref={i === databaseCount - 1 ? lastDBRef : null}
            >
              <AccordionTrigger>Database #{i + 1}</AccordionTrigger>
              <AccordionContent>
                <Card className="mt-2">
                  <CardHeader>
                    <CardTitle>Database #{i + 1}</CardTitle>
                    <CardDescription>
                      Configure database settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 pt-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`db-type-${i}`}>Database Type</Label>
                      <Select>
                        <SelectTrigger id={`db-type-${i}`}>
                          <SelectValue placeholder="Choose DB type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="postgres">PostgreSQL</SelectItem>
                          <SelectItem value="mysql">MySQL</SelectItem>
                          <SelectItem value="mssql">SQL Server</SelectItem>
                          <SelectItem value="oracle">Oracle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`db-name-${i}`}>Database Name</Label>
                      <Input
                        id={`db-name-${i}`}
                        placeholder="Enter database name"
                      />
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
