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
import { useEffect, useRef, useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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

export const cloudProviders = [
  { value: "azure", label: "Azure", icon: "/icon/azure.svg" },
  { value: "aws", label: "AWS", icon: "/icon/aws.svg" },
]
export const regions = [
  { value: "ap-southeast-1", label: "Asia Pacific (Singapore)" },
  { value: "us-east-1", label: "US East (N. Virginia)" },
  { value: "us-west-2", label: "US West (Oregon)" },
  { value: "eu-west-1", label: "EU (Ireland)" },
]

interface ResourceGroupProps {
  form: UseFormReturn<z.infer<typeof requestFormSchema>>
}

export default function ResourceGroup({ form }: ResourceGroupProps) {
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
            name="cloud_provider"
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
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 mt-6 w-135">
          <Label htmlFor="resources">Resources</Label>
          <div className="flex gap-6 ">
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
          <div className="flex gap-6 ">
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
        </div>
        <div className="mt-6">
          <ResourceGroupAccordion
            vmCount={vmCount}
            storageCount={storageCount}
            databaseCount={databaseCount}
          />
        </div>
      </CardContent>
    </Card>
  )
}

interface ResourceGroupAccordionProps {
  vmCount: number
  storageCount: number
  databaseCount: number
}
export function ResourceGroupAccordion({
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
                    <Input placeholder="e.g., 2 vCPU" />
                    <Label>Memory</Label>
                    <Input placeholder="e.g., 4 GB" />
                    <Label>OS</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose OS" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ubuntu">Ubuntu</SelectItem>
                        <SelectItem value="windows">Windows</SelectItem>
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
