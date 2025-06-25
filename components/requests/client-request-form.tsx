"use client"

import { Label } from "@/components/ui/label"
import Collaborators from "@/components/requests/collaborators"
import ResourceGroup from "@/components/requests/resource-group"
import { Textarea } from "@/components/ui/textarea"
import { RepoNameInput } from "@/components/requests/repo-name-input"

import { Session } from "next-auth"
import { Form } from "@/components/ui/form"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"

export const requestFormSchema = z.object({
  repository_name: z.string(),
  repository_description: z.string().optional(),
})

interface ClientRequestFormProps {
  suggestedName: string
  session: Session | null
}

export default function ClientRequestForm({
  suggestedName,
  session,
}: ClientRequestFormProps) {
  const requestForm = useForm<z.infer<typeof requestFormSchema>>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      repository_name: "",
      repository_description: "",
    },
  })

  function onSubmit(values: z.infer<typeof requestFormSchema>) {
    console.log(values)
  }

  console.log(requestForm.formState.errors)

  return (
    <Form {...requestForm}>
      <form onSubmit={requestForm.handleSubmit(onSubmit)} className="space-y-8">
        <RepoNameInput
          suggestedName={suggestedName}
          ownerName={session?.user?.name || "Your Account"}
          form={requestForm}
        />
        <Collaborators />
        <ResourceGroup />

        <div className="grid w-full gap-3">
          <Label className="gap-1" htmlFor="request-description">
            Request Description
          </Label>
          <Textarea
            id="request-description"
            placeholder="Provide any additional context or details for your request"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Submit Request</Button>
        </div>
      </form>
    </Form>
  )
}
