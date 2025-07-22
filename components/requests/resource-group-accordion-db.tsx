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

interface ResourceGroupAccordionProps {
  form: UseFormReturn<z.infer<typeof requestFormSchema>>
  databaseCount: number
}

export function ResourceGroupAccordionDB({
  form,
  databaseCount,
}: Readonly<ResourceGroupAccordionProps>) {
  const lastDBRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (lastDBRef.current) {
      lastDBRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [databaseCount])

  return (
    <div className="grid gap-6">
      {databaseCount > 0 && (
        <Accordion type="single" collapsible>
          {Array.from({ length: databaseCount }).map((_, i) => (
            <AccordionItem
              key={i}
              value={`database-${i}`}
              ref={i === Math.floor(databaseCount / 3) ? lastDBRef : null}
            >
              <AccordionTrigger className="cursor-pointer">
                Database #{i + 1}
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardHeader>
                    <CardTitle>Database #{i + 1}</CardTitle>
                    <CardDescription>
                      Configure database settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <div className="grid gap-2">
                      <Label>Name</Label>
                      <Input
                        placeholder="e.g., web-server-1"
                        onChange={(e) => {
                          form.setValue(
                            `resources.vm.${i}.name`,
                            e.target.value
                          )
                        }}
                      />
                      <div className="flex justify-between">
                        <div className="grid gap-2">
                          <Label htmlFor={`db-engine-${i}`}>
                            Database Engine
                          </Label>
                          <Select
                            onValueChange={(value) =>
                              form.setValue(`resources.db.${i}.engine`, value)
                            }
                          >
                            <SelectTrigger id={`db-engine-${i}`}>
                              <SelectValue placeholder="Choose DB engine" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="postgres">
                                PostgreSQL
                              </SelectItem>
                              <SelectItem value="mysql">MySQL</SelectItem>
                              <SelectItem value="mssql">SQL Server</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`db-instance-class-${i}`}>
                            Instance Class / Size
                          </Label>
                          <Select
                            onValueChange={(value) =>
                              form.setValue(
                                `resources.db.${i}.instanceClass`,
                                value
                              )
                            }
                          >
                            <SelectTrigger id={`db-instance-class-${i}`}>
                              <SelectValue placeholder="Choose DB instance class" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="db.t2.micro">
                                db.t2.micro
                              </SelectItem>
                              <SelectItem value="db.t2.small">
                                db.t2.small
                              </SelectItem>
                              <SelectItem value="db.t2.medium">
                                db.t2.medium
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`db-size-${i}`}>Storage Size</Label>
                      <Input
                        type="number"
                        id={`db-name-${i}`}
                        placeholder="Enter database size"
                        onChange={(e) => {
                          form.setValue(
                            `resources.db.${i}.size`,
                            Number(e.target.value)
                          )
                        }}
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
