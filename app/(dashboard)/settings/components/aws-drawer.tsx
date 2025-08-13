"use client"

import { updateCloudConfig } from "@/app/api/cloud/api"
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
import { useMutation } from "@tanstack/react-query"
import Image from "next/image"
import { useForm } from "react-hook-form"
import z from "zod"

export const awsFormSchema = z.object({
  clientId: z.string().nonempty({ message: "Client ID is required" }),
  clientSecret: z.string().nonempty({ message: "Client Secret is required" }),
  subscriptionId: z
    .string()
    .nonempty({ message: "Subscription ID is required" }),
  cloudProvider: z.string().nonempty({ message: "Cloud Provider is required" }),
})

export default function AwsDrawer() {
  const form = useForm<z.infer<typeof awsFormSchema>>({
    resolver: zodResolver(awsFormSchema),
    defaultValues: {
      clientId: "",
      clientSecret: "",
      subscriptionId: "",
      cloudProvider: "AWS",
    },
  })

  function onSubmit(values: z.infer<typeof awsFormSchema>) {
    updateConfigMutation.mutate(values)
  }

  const updateConfigMutation = useMutation({
    mutationFn: (values: z.infer<typeof awsFormSchema>) =>
      updateCloudConfig(values),
    onSuccess: () => {},
    onError: (error) => {
      console.error("Failed to update AWS config:", error)
    },
  })

  return (
    <Drawer direction="right">
      <DrawerTrigger className="flex items-center justify-center gap-2 hover:underline cursor-pointer">
        <Image
          src="/icon/aws.svg"
          alt="AWS Cloud Provider Icon"
          width={24}
          height={24}
        />
        AWS
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Configure AWS</DrawerTitle>
          <DrawerDescription>
            Set up your AWS cloud provider configuration.
          </DrawerDescription>
        </DrawerHeader>
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
                      <Input
                        placeholder="Enter Client ID"
                        type="password"
                        {...field}
                      />
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
                      <Input
                        placeholder="Enter Subscription ID"
                        type="password"
                        {...field}
                      />
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
                      <Input
                        placeholder="Enter Client Secret"
                        type="password"
                        {...field}
                      />
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
      </DrawerContent>
    </Drawer>
  )
}
