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
                      <Label htmlFor={`db-engine-${i}`}>Database Engine</Label>
                      <Select
                        onValueChange={(value) =>
                          form.setValue(`resources.db.${i}.engine`, value)
                        }
                      >
                        <SelectTrigger id={`db-engine-${i}`}>
                          <SelectValue placeholder="Choose DB engine" />
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
                      <Label htmlFor={`db-size-${i}`}>Database Size</Label>
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
