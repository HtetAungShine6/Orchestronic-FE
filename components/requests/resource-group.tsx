"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { useState } from "react"

import { useSelector } from "react-redux"
import { RootState } from "@/app/state/store"
import { requestFormSchema } from "./client-request-form"
import { UseFormReturn } from "react-hook-form"
import z from "zod"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ResourceGroupAccordionST } from "./resource-group-accordion-st"
import { ResourceGroupAccordionVM } from "./resource-group-accordion-vm"
import { ResourceGroupAccordionDB } from "./resource-group-accordion-db"

export const cloudProviders = [
  { value: "azure", label: "Azure", icon: "/icon/azure.svg" },
  { value: "aws", label: "AWS", icon: "/icon/aws.svg" },
]
export const regions = [
  {
    value: "ap-southeast-1",
    label: "Asia Pacific (Singapore)",
    flag: "https://flagsapi.com/SG/flat/16.png",
  },
  {
    value: "us-east-1",
    label: "US East (N. Virginia)",
    flag: "https://flagsapi.com/US/flat/16.png",
  },
  {
    value: "us-west-2",
    label: "US West (Oregon)",
    flag: "https://flagsapi.com/US/flat/16.png",
  },
  {
    value: "eu-west-1",
    label: "EU (Ireland)",
    flag: "https://flagsapi.com/IE/flat/16.png",
  },
]

interface ResourceGroupProps {
  form: UseFormReturn<z.infer<typeof requestFormSchema>>
}

export default function ResourceGroup({ form }: Readonly<ResourceGroupProps>) {
  const [vmCount, setVmCount] = useState(0)
  const [storageCount, setStorageCount] = useState(0)
  const [databaseCount, setDatabaseCount] = useState(0)
  const repoName = useSelector((state: RootState) => state.repoName.value)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Group</CardTitle>
        <CardDescription>
          Group related resources together to simplify management, access
          control, and organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-start w-135">
          <div className="grid w-[165px]">
            <Label htmlFor="resource-group-name">Resource Group Name</Label>
            <p className="truncate">rg-{repoName}</p>
          </div>
          <FormField
            control={form.control}
            name="resources.cloudProvider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cloud Provider</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cloudProviders.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className="flex items-center gap-2">
                            <Image
                              src={option.icon}
                              width={16}
                              height={16}
                              alt={`${option.label} Icon`}
                            />
                            {option.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-2">
            <Label htmlFor="resource-group-provider">Region</Label>
            <Select defaultValue={regions[0].value}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="flex items-center gap-2">
                      <Image
                        src={option.flag}
                        width={16}
                        height={16}
                        alt={`${option.label} Icon`}
                      />
                      {option.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 mt-6 w-135">
          <Label htmlFor="resources">Resources</Label>
          <div>
            <div className="flex gap-6">
              <Label htmlFor="vm" className="w-60">
                Virtual Machines
              </Label>
              <Input
                id="vm"
                placeholder="e.g., 2"
                type="number"
                min={0}
                onChange={(e) => setVmCount(Number(e.target.value))}
              />
            </div>
            <ResourceGroupAccordionVM form={form} vmCount={vmCount} />
          </div>
          <div className="">
            <div className="flex gap-6">
              <Label htmlFor="storage" className="w-60">
                Storage Accounts
              </Label>
              <Input
                id="storage"
                placeholder="e.g., 1"
                type="number"
                min={0}
                onChange={(e) => setStorageCount(Number(e.target.value))}
              />
            </div>
            <ResourceGroupAccordionST form={form} storageCount={storageCount} />
          </div>
          <div className="">
            <div className="flex gap-6">
              <Label htmlFor="sql" className="w-60">
                Databases
              </Label>
              <Input
                id="database"
                placeholder="e.g., 1"
                type="number"
                min={0}
                onChange={(e) => setDatabaseCount(Number(e.target.value))}
              />
            </div>
            <ResourceGroupAccordionDB
              form={form}
              databaseCount={databaseCount}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
