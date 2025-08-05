import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useEffect, useRef, useState } from "react"
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
import { useQuery } from "@tanstack/react-query"
import { ChevronsUpDown } from "lucide-react"
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
import { ApiError } from "@/types/error"
import { PaginatedVmSizesDto, VmSizeDto } from "@/types/request"

async function fetchVmSizes(
  value: string,
  page: number,
  limit: number
): Promise<VmSizeDto[]> {
  console.log(
    "Fetching VM sizes with value:",
    value,
    "page:",
    page,
    "limit:",
    limit
  )
  const response = await fetch(
    `/api/vm-sizes?page=${page}&limit=${limit}&search=${value}`
  )

  if (!response.ok) {
    const err = await response.json()
    throw new ApiError(
      err.statusCode ?? response.status,
      err.message ?? "Failed to fetch VM sizes",
      err.error ?? "Unknown error"
    )
  }

  const data = (await response.json()) as PaginatedVmSizesDto
  return data.data
}

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
              <AccordionTrigger className="cursor-pointer">
                Virtual Machines #{i + 1}
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
                        form.setValue(
                          `resources.resourceConfig.vms.${i}.name`,
                          e.target.value
                        )
                      }}
                    />

                    {/* <div className="flex justify-between">
                      <div className="grid gap-2">
                        <Label>CPU</Label>
                        <Input
                          placeholder="e.g., 2"
                          type="number"
                          onChange={(e) => {
                            form.setValue(
                              `resources.resourceConfig.vms.${i}.numberOfCores`,
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
                              `resources.resourceConfig.vms.${i}.memory`,
                              Number(e.target.value)
                            )
                          }}
                        />
                      </div>
                    </div> */}
                    <div className="flex justify-between">
                      <div className="grid gap-2">
                        <Label>VM Size</Label>
                        <ComboboxDemo />
                      </div>
                      <div className="grid gap-2">
                        <Label>Operating System</Label>
                        <Select
                          onValueChange={(value) =>
                            form.setValue(
                              `resources.resourceConfig.vms.${i}.os`,
                              value
                            )
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

export function ComboboxDemo() {
  const [open, setOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState("")
  const [searchValue, setSearchValue] = useState("")

  const {
    data: vmSizes,
    isLoading,
    error,
  } = useQuery<VmSizeDto[]>({
    queryKey: ["azure-vm-sizes", searchValue],
    queryFn: () => fetchVmSizes(searchValue, 1, 20),
  })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedValue
            ? vmSizes?.find((vmSize) => vmSize.name === selectedValue)?.name ||
              selectedValue
            : "Select VM Size..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search VM sizes..."
            className="h-9"
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            {isLoading && <CommandEmpty>Loading VM sizes...</CommandEmpty>}
            {error && <CommandEmpty>Error loading VM sizes.</CommandEmpty>}
            {!isLoading && !error && (!vmSizes || vmSizes.length === 0) && (
              <CommandEmpty>No VM Size found.</CommandEmpty>
            )}
            <CommandGroup>
              {vmSizes?.map((vmSize) => (
                <CommandItem
                  className="flex flex-col gap-1 items-start"
                  key={vmSize.id}
                  value={vmSize.name}
                  onSelect={(currentValue) => {
                    setSelectedValue(
                      currentValue === selectedValue ? "" : currentValue
                    )
                    setOpen(false)
                  }}
                >
                  <p>{vmSize.name}</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>vCPUs: {vmSize.numberOfCores}</li>
                    <li>RAM: {(vmSize.memoryInMB / 1024).toFixed(1)} GB</li>
                    <li>
                      OS Disk: {(vmSize.osDiskSizeInMB / 1024).toFixed(1)} GB
                    </li>
                    <li>
                      Resource Disk:{" "}
                      {(vmSize.resourceDiskSizeInMB / 1024).toFixed(1)} GB
                    </li>
                    <li>Max Data Disks: {vmSize.maxDataDiskCount}</li>
                  </ul>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
