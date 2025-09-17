"use client"

import { fetchAwsVmSizes } from "@/app/api/policy/aws/api"
import { AwsVmSizeDto } from "@/types/request"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ChevronsUpDown } from "lucide-react"
import { Button } from "../ui/button"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "../ui/command"
import { Check } from "lucide-react"

interface AwsVMSizeComboboxProps {
  selectedValue: AwsVmSizeDto | undefined
  setSelectedValue: (val: AwsVmSizeDto | undefined) => void
  portal?: boolean
  handleSelect?: (vmSize: AwsVmSizeDto) => void
  defaultValue?: string
  usePolicyFilter?: boolean
}

export function AwsVMSizeCombobox({
  selectedValue,
  setSelectedValue,
  portal = true,
  handleSelect,
  defaultValue,
  usePolicyFilter = false,
}: AwsVMSizeComboboxProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const vmSizes: AwsVmSizeDto[] = [
    {
      id: "d2ddf565-1e8d-480d-9018-731e6f4d5405",
      name: "t2.micro",
      raw: "t2.micro",
      numberOfCores: 1,
      memoryInMB: 1024,
    },
    // {
    //   id: "683a5a81-03fa-4597-b1f0-b06259e201bc",
    //   name: "t3.micro",
    //   raw: "t3.micro",
    //   numberOfCores: 2,
    //   memoryInMB: 1024,
    // },
  ]

  const { isLoading, error } = useQuery<AwsVmSizeDto[]>({
    queryKey: ["aws-vm-sizes", searchValue],
    queryFn: () => fetchAwsVmSizes(searchValue, 1, 20, usePolicyFilter),
  })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[216px] justify-between text-left"
          defaultValue={defaultValue}
        >
          <span className="truncate">
            {selectedValue ? selectedValue.name : "Select VM Size..."}
          </span>
          <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent portal={portal} className="w-[400px] p-0 z-50">
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
                  onSelect={() => {
                    handleSelect?.(vmSize)
                    setSelectedValue(vmSize)
                    setOpen(false)
                  }}
                  className="flex items-start gap-3 py-3 cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="font-medium">{vmSize.name}</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                      <div>vCPUs: {vmSize.numberOfCores}</div>
                      <div>RAM: {Math.round(vmSize.memoryInMB / 1024)} GB</div>
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
