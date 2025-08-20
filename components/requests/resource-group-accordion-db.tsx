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
// import { Input } from "@/components/ui/input"
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
import { Input } from "@/components/ui/input"
import { getPolicyDB } from "@/app/api/policy/api"
import { useQuery } from "@tanstack/react-query"

interface ResourceGroupAccordionProps {
  form: UseFormReturn<z.infer<typeof requestFormSchema>>
  databaseCount: number
}

export function ResourceGroupAccordionDB({
  form,
  databaseCount,
}: Readonly<ResourceGroupAccordionProps>) {
  const lastDBRef = useRef<HTMLDivElement | null>(null)

  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["getPolicyDB"],
  //   queryFn: () => getPolicyDB("AZURE"),
  // })

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
                      {/* <Label>Name</Label>
                      <Input
                        placeholder="e.g., web-server-1"
                        onChange={(e) => {
                          form.setValue(
                            `resources.resourceConfig.db.${i}.name`,
                            e.target.value
                          )
                        }}
                      /> */}
                      <div className="flex justify-between">
                        <div className="grid gap-2">
                          <Label htmlFor={`db-engine-${i}`}>
                            Database Engine
                          </Label>
                          <Select
                            onValueChange={(value) =>
                              form.setValue(
                                `resources.resourceConfig.dbs.${i}.engine`,
                                value
                              )
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
                              <SelectItem value="sql">SQL Server</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label>Storage</Label>
                          <Input
                            placeholder="e.g., 4 GB"
                            type="number"
                            onChange={(e) => {
                              form.setValue(
                                `resources.resourceConfig.dbs.${i}.storageGB`,
                                Number(e.target.value)
                              )
                            }}
                          />
                        </div>
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
