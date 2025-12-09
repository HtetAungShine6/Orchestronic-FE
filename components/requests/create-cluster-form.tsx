"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"

// ⭐ Reuse existing VM combobox
import { AzureVMSizeCombobox } from "@/components/requests/azure-resource-group-accordion/azure-resource-group-accordion-vm"

import { VmSizeDto } from "@/types/request"

// ===============================
// 📌 Cluster Form Schema
// ===============================
const clusterFormSchema = z.object({
  clusterName: z.string().min(3, "Cluster name is required"),
  nodes: z.coerce.number().min(1, "Must be at least 1 node"),
  sizeId: z.string().min(1, "Cluster size is required"), // VM Size ID
})

type ClusterFormType = z.infer<typeof clusterFormSchema>

export default function ClientClusterForm() {
  const [selectedClusterSize, setSelectedClusterSize] = useState<
    VmSizeDto | undefined
  >(undefined)

  const form = useForm<ClusterFormType>({
    resolver: zodResolver(clusterFormSchema),
    defaultValues: {
      clusterName: "",
      nodes: 1,
      sizeId: "",
    },
  })

  const onSubmit = (values: ClusterFormType) => {
    alert("Submitted:\n" + JSON.stringify(values, null, 2))
  }

  return (
    <Card className="border rounded-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Cluster Configuration
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Cluster Name */}
            <FormField
              control={form.control}
              name="clusterName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Cluster Name *</FormLabel>
                  <FormControl>
                    <Input
                      className="h-9"
                      placeholder="e.g. orchestronic-cluster"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Number of Nodes */}
            <FormField
              control={form.control}
              name="nodes"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Number of Nodes *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      className="h-9"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ⭐ Cluster Size (Searchable VM Size Selector) */}
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Cluster Size *</FormLabel>
                  <FormControl>
                    <AzureVMSizeCombobox
                      selectedValue={selectedClusterSize}
                      setSelectedValue={setSelectedClusterSize}
                      usePolicyFilter={false}
                      handleSelect={(vmSize) => {
                        // ⭐ EXACT same logic as VM Size
                        // Only Standard_B1ls appears by default
                        // Others appear when searched
                        setSelectedClusterSize(vmSize)
                        field.onChange(vmSize.id)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className="flex justify-end pt-1">
              <Button type="submit" className="h-9 px-4">
                Create Cluster
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
