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
import { Check, ChevronsUpDown } from "lucide-react"
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
  const [selectedValue, setSelectedValue] = useState<VmSizeDto | null>(null)

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

                    <div className="flex justify-between gap-4">
                      <div className="grid gap-2">
                        <Label>VM Size</Label>
                        <ComboboxDemo
                          form={form}
                          vmIndex={i}
                          selectedValue={selectedValue}
                          setSelectedValue={setSelectedValue}
                        />
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

                    <div className="flex justify-between gap-4">
                      <div className="grid gap-2">
                        <Label>CPU Cores</Label>
                        <Input
                          disabled
                          placeholder="Auto-filled from VM size"
                          type="number"
                          value={selectedValue?.numberOfCores}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>RAM (GB)</Label>
                        <Input
                          disabled
                          placeholder="Auto-filled from VM size"
                          type="number"
                          //TODO(jan): Handle decimal places correctly
                          value={
                            selectedValue?.memoryInMB === undefined
                              ? ""
                              : (selectedValue.memoryInMB / 1024).toFixed(1)
                          }
                        />
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

interface ComboboxDemoProps {
  form: UseFormReturn<z.infer<typeof requestFormSchema>>
  vmIndex: number
  onSelect?: (vmSize: VmSizeDto | null) => void
  selectedValue?: VmSizeDto | null
  setSelectedValue?: (vmSize: VmSizeDto | null) => void
}

export function ComboboxDemo({
  form,
  vmIndex,
  onSelect,
  selectedValue,
  setSelectedValue,
}: ComboboxDemoProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const {
    data: vmSizes,
    isLoading,
    error,
  } = useQuery<VmSizeDto[]>({
    queryKey: ["azure-vm-sizes", searchValue],
    queryFn: () => fetchVmSizes(searchValue, 1, 20),
  })

  const handleSelect = (vmSize: VmSizeDto) => {
    const newSelection = selectedValue?.id === vmSize.id ? null : vmSize
    setSelectedValue(newSelection)
    if (newSelection) {
      form.setValue(
        `resources.resourceConfig.vms.${vmIndex}.sizeId`,
        newSelection.id
      )
    }
    setOpen(false)
    onSelect?.(newSelection)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[216px] justify-between text-left"
        >
          <span className="truncate">
            {selectedValue ? selectedValue.name : "Select VM Size..."}
          </span>
          <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder="Search VM sizes..."
            className="h-9"
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList className="max-h-[300px]">
            {isLoading && <CommandEmpty>Loading VM sizes...</CommandEmpty>}
            {error && <CommandEmpty>Error loading VM sizes.</CommandEmpty>}
            {!isLoading && !error && (!vmSizes || vmSizes.length === 0) && (
              <CommandEmpty>No VM Size found.</CommandEmpty>
            )}
            <CommandGroup>
              {vmSizes?.map((vmSize) => (
                <CommandItem
                  key={vmSize.id}
                  value={vmSize.name}
                  onSelect={() => handleSelect(vmSize)}
                  className="flex items-start gap-3 py-3"
                >
                  <div className="flex-1">
                    <div className="font-medium">{vmSize.name}</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                      <div>vCPUs: {vmSize.numberOfCores}</div>
                      <div>RAM: {Math.round(vmSize.memoryInMB / 1024)} GB</div>
                      <div>
                        OS Disk: {Math.round(vmSize.osDiskSizeInMB / 1024)} GB
                      </div>
                      <div>Max Disks: {vmSize.maxDataDiskCount}</div>
                    </div>
                  </div>
                  <Check
                    className={`h-4 w-4 shrink-0 ${
                      selectedValue?.id === vmSize.id
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
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
