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
import React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
// import { getPolicyDB } from "@/app/api/policy/api"
// import { useQuery } from "@tanstack/react-query"

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
              <AccordionContent forceMount>
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
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label>Storage</Label>
                          <DatabaseSizeCombobox
                            onChange={(value) => {
                              form.setValue(
                                `resources.resourceConfig.dbs.${i}.storageGB`,
                                value
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

const databaseSizes = [
  { value: 32768, label: 32, unit: "GB" },
  { value: 65536, label: 64, unit: "GB" },
  { value: 131072, label: 128, unit: "GB" },
  { value: 262144, label: 256, unit: "GB" },
  { value: 524288, label: 512, unit: "GB" },
  { value: 1048576, label: 1, unit: "TB" },
  { value: 2097152, label: 2, unit: "TB" },
  { value: 4194304, label: 4, unit: "TB" },
  { value: 8388608, label: 8, unit: "TB" },
  { value: 16777216, label: 16, unit: "TB" },
  { value: 33553408, label: 32, unit: "TB" },
]

export function DatabaseSizeCombobox({
  onChange,
}: {
  onChange?: (value: number) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<number | "">("")
  const [search, setSearch] = React.useState("")

  // Filter sizes based on number or unit (GB/TB)
  const filteredSizes = databaseSizes.filter((size) => {
    const s = search.trim().toLowerCase()
    const numberStr = size.label.toString()
    const unitStr = size.unit.toLowerCase()
    return numberStr.includes(s) || unitStr.includes(s)
  })

  const handleSelect = (selectedValue: number) => {
    setValue(selectedValue)
    setOpen(false)
    setSearch("")
    if (onChange) onChange(selectedValue)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? (() => {
                const selected = databaseSizes.find(
                  (size) => size.value === value
                )
                return selected ? `${selected.label} ${selected.unit}` : ""
              })()
            : "Select size..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search size..."
            className="h-9"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No size found.</CommandEmpty>
            <CommandGroup>
              {filteredSizes.map((size) => (
                <CommandItem
                  key={size.value}
                  value={size.value.toString()}
                  onSelect={() => handleSelect(size.value)}
                >
                  {size.label} {size.unit}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === size.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
