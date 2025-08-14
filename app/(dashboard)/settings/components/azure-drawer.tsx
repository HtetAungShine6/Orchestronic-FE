"use client"

import { getCloudConfig, updateCloudConfig } from "@/app/api/cloud/api"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import z from "zod"

export const azureFormSchema = z.object({
  clientId: z.string().nonempty({ message: "Client ID is required" }),
  clientSecret: z.string().nonempty({ message: "Client Secret is required" }),
  subscriptionId: z
    .string()
    .nonempty({ message: "Subscription ID is required" }),
  tenantId: z.string().nonempty({ message: "Tenant ID is required" }),
  cloudProvider: z.string().nonempty({ message: "Cloud Provider is required" }),
})

export default function AzureDrawer() {
  const [showPasswords, setShowPasswords] = useState({
    clientId: false,
    clientSecret: false,
    subscriptionId: false,
    tenantId: false,
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ["cloudConfig", "AZURE"],
    queryFn: () => getCloudConfig("AZURE"),
  })

  const form = useForm<z.infer<typeof azureFormSchema>>({
    resolver: zodResolver(azureFormSchema),
    defaultValues: {
      clientId: "",
      clientSecret: "",
      subscriptionId: "",
      tenantId: "",
      cloudProvider: "AZURE",
    },
  })

  useEffect(() => {
    if (data) {
      form.reset({
        clientId: data.clientId || "",
        clientSecret: data.clientSecret || "",
        subscriptionId: data.subscriptionId || "",
        tenantId: data.tenantId || "",
        cloudProvider: "AZURE",
      })
    }
  }, [data, form])

  function onSubmit(values: z.infer<typeof azureFormSchema>) {
    updateConfigMutation.mutate(values)
  }

  const updateConfigMutation = useMutation({
    mutationFn: (values: z.infer<typeof azureFormSchema>) =>
      updateCloudConfig(values),
    onSuccess: () => {},
    onError: (error) => {
      console.error("Failed to update Azure config:", error)
    },
  })

  return (
    <Drawer direction="right">
      <DrawerTrigger className="flex items-center justify-center gap-2 hover:underline cursor-pointer">
        <Image
          src="/icon/azure.svg"
          alt="Azure Cloud Provider Icon"
          width={24}
          height={24}
        />
        Azure
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Configure Azure</DrawerTitle>
          <DrawerDescription>
            Set up your Azure cloud provider configuration.
          </DrawerDescription>
        </DrawerHeader>
        {error ? (
          <div>Error loading Azure config</div>
        ) : isLoading ? (
          <div>Loading...</div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col h-full p-4 pb-0"
            >
              <div className="space-y-4 flex-1">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter Client ID"
                            type={showPasswords.clientId ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowPasswords((prev) => ({
                                ...prev,
                                clientId: !prev.clientId,
                              }))
                            }
                          >
                            {showPasswords.clientId ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscriptionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscription ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter Subscription ID"
                            type={
                              showPasswords.subscriptionId ? "text" : "password"
                            }
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowPasswords((prev) => ({
                                ...prev,
                                subscriptionId: !prev.subscriptionId,
                              }))
                            }
                          >
                            {showPasswords.subscriptionId ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Secret</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter Client Secret"
                            type={
                              showPasswords.clientSecret ? "text" : "password"
                            }
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowPasswords((prev) => ({
                                ...prev,
                                clientSecret: !prev.clientSecret,
                              }))
                            }
                          >
                            {showPasswords.clientSecret ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tenantId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tenant ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter Tenant ID"
                            type={showPasswords.tenantId ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowPasswords((prev) => ({
                                ...prev,
                                tenantId: !prev.tenantId,
                              }))
                            }
                          >
                            {showPasswords.tenantId ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end mb-4">
                <Button type="submit" className="w-full">
                  Save
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DrawerContent>
    </Drawer>
  )
}
