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
  storageCount: number
}

export function ResourceGroupAccordionST({
  form,
  storageCount,
}: Readonly<ResourceGroupAccordionProps>) {
  const lastStorageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (lastStorageRef.current) {
      lastStorageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }, [storageCount])

  return (
    <div className="grid gap-6">
      {storageCount > 0 && (
        <Accordion type="single" collapsible>
          {Array.from({ length: storageCount }).map((_, i) => (
            <AccordionItem
              key={i}
              value={`storage-${i}`}
              ref={i === Math.floor(storageCount / 3) ? lastStorageRef : null}
            >
              <AccordionTrigger className="cursor-pointer">
                Storage #{i + 1}
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardHeader>
                    <CardTitle>Storage #{i + 1}</CardTitle>
                    <CardDescription>
                      Configure storage settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor={`storage-type-${i}`}>Storage Type</Label>
                      <Select
                        onValueChange={(value) =>
                          form.setValue(
                            `resources.resourceConfig.storage.${i}.type`,
                            value
                          )
                        }
                      >
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
                      <Label htmlFor={`storage-size-${i}`}>Storage Size</Label>
                      <Input
                        type="number"
                        id={`storage-size-${i}`}
                        placeholder="Enter storage size"
                        onChange={(e) => {
                          form.setValue(
                            `resources.resourceConfig.storage.${i}.capacityGB`,
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
