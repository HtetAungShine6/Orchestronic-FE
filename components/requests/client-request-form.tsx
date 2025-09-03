"use client"

import Collaborators from "@/components/requests/collaborators"
import ResourceGroup from "@/components/requests/resource-group"
import { CloudProvider, cloudProviders, regions } from "@/types/resource"
import { Textarea } from "@/components/ui/textarea"
import { RepoNameInput } from "@/components/requests/repo-name-input"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import z from "zod"
import { useForm, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { resourceSchema } from "@/app/zod/scheme"
import { useSelector } from "react-redux"
import { RootState } from "@/app/state/store"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { createRequest } from "@/app/api/requests/api"
import { useMutation } from "@tanstack/react-query"
import { User } from "@/types/api"
import AlertError from "../ui/alert-error"

export const requestFormSchema = z.object({
  resources: resourceSchema,
  repository: z.object({
    name: z
      .string()
      .regex(/^[a-z0-9._-]+$/, {
        message:
          "Repository name can only contain lowercase letters and numbers",
      })
      .min(3, { message: "Repository name must be at least 3 characters" })
      .max(24, { message: "Repository name must be at most 24 characters" }),
    description: z.string().optional(),
    collaborators: z
      .array(
        z.object({
          userId: z.string().nonempty({
            message: "Collaborator ID is required",
          }),
        })
      )
      .optional(),
  }),
  description: z.string().nonempty({
    message: "Please provide a description for your request",
  }),
})

interface ClientRequestFormProps {
  suggestedName: string
  session?: User
}

export default function ClientRequestForm({
  suggestedName,
  session,
}: Readonly<ClientRequestFormProps>) {
  const repoName = useSelector((state: RootState) => state.repoName.value)
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof requestFormSchema>) =>
      createRequest(values),
    onSuccess: () => {
      setShowSuccess(true)
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  const requestForm = useForm<z.infer<typeof requestFormSchema>>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      repository: {
        description: "",
      },
      resources: {
        cloudProvider: cloudProviders[0].value,
        region: regions[CloudProvider.AZURE][0].value,
      },
    },
  })

  useEffect(() => {
    if (repoName) {
      requestForm.setValue("resources.name", `rg-${repoName}`)
      requestForm.setValue("repository.name", repoName)
    }
  }, [repoName, requestForm])

  async function onSubmit(values: z.infer<typeof requestFormSchema>) {
    mutation.mutate(values)
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    router.push(`/requests/${mutation.data?.displayCode}`)
  }

  console.log(requestForm.formState.errors)

  return (
    <>
      {error && (
        <AlertError
          title="Error creating request"
          description="There was an error creating your request."
          content={error}
        />
      )}
      <AlertDialogError form={requestForm} />
      <AlertDialogSuccess isOpen={showSuccess} onClose={handleSuccessClose} />

      <Form {...requestForm}>
        <form
          onSubmit={requestForm.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <RepoNameInput
            suggestedName={suggestedName}
            ownerName={session?.name ?? "Your Account"}
            form={requestForm}
          />
          <Collaborators form={requestForm} />
          <ResourceGroup form={requestForm} />

          <FormField
            control={requestForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Request Description *</FormLabel>
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
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}

function AlertDialogError({
  form,
}: {
  form: UseFormReturn<z.infer<typeof requestFormSchema>>
}) {
  const [hasErrors, setHasErrors] = useState<boolean>(false)

  useEffect(() => {
    setHasErrors(
      form.formState.errors.resources?.resourceConfig?.message === "Required"
    )
  }, [form.formState.errors])

  return (
    <AlertDialog open={hasErrors}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Form Validation Errors</AlertDialogTitle>
          <AlertDialogDescription>
            Please fix the following errors before submitting:
          </AlertDialogDescription>
          <ul className="mt-2 list-disc list-inside">
            <li className="text-red-600">
              At least one resource (VM, Database, or Storage) is required
            </li>
          </ul>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setHasErrors(false)}>
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function AlertDialogSuccess({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Request Created Successfully!</AlertDialogTitle>
          <AlertDialogDescription>
            Your request has been submitted successfully. You will be redirected
            to the requests page to view your submission.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>
            Go to Requests
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
