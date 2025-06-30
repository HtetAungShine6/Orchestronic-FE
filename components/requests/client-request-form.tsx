"use client"

import Collaborators from "@/components/requests/collaborators"
import ResourceGroup, {
  cloudProviders,
  regions,
} from "@/components/requests/resource-group"
import { Textarea } from "@/components/ui/textarea"
import { RepoNameInput } from "@/components/requests/repo-name-input"

import { Session } from "next-auth"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { resourceSchema } from "@/app/zod/scheme"
import { useSelector } from "react-redux"
import { RootState } from "@/app/state/store"
import { useEffect } from "react"

export const requestFormSchema = z.object({
  repository_name: z.string().refine((value) => value.trim().length > 0, {
    message: "",
  }),
  repository_description: z.string().optional(),
  collaborators: z.array(z.string()).optional(),
  resource_group_name: z.string().nonempty({
    message: "",
  }),
  cloud_provider: z.string().nonempty({
    message: "",
  }),
  region: z.string().nonempty({
    message: "",
  }),
  resources: resourceSchema,
  request_description: z.string().nonempty({
    message: "Please provide a description for your request",
  }),
})

interface ClientRequestFormProps {
  suggestedName: string
  session: Session | null
}

export default function ClientRequestForm({
  suggestedName,
  session,
}: Readonly<ClientRequestFormProps>) {
  const repoName = useSelector((state: RootState) => state.repoName.value)

  const requestForm = useForm<z.infer<typeof requestFormSchema>>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      repository_name: "",
      repository_description: "",
      collaborators: [],
      resource_group_name: "",
      cloud_provider: cloudProviders[0].value,
      region: regions[0].value,
      request_description: "",
      resources: {
        vm: [],
        db: [],
        storage: [],
      },
    },
  })

  useEffect(() => {
    if (repoName) {
      requestForm.setValue("resource_group_name", repoName)
      requestForm.setValue("repository_name", repoName)
    }
  }, [repoName, requestForm])

  function onSubmit(values: z.infer<typeof requestFormSchema>) {
    console.log(values)
  }

  return (
    <Form {...requestForm}>
      <form onSubmit={requestForm.handleSubmit(onSubmit)} className="space-y-8">
        <RepoNameInput
          suggestedName={suggestedName}
          ownerName={session?.user?.name || "Your Account"}
          form={requestForm}
        />
        <Collaborators form={requestForm} />
        <ResourceGroup form={requestForm} />

        <FormField
          control={requestForm.control}
          name="request_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Request Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide any additional context or details for your request"
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Submit Request</Button>
        </div>
      </form>
    </Form>
  )
}
