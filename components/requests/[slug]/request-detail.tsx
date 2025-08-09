"use client"
import {
  changeRequestStatus,
  getRequestBySlug,
  RequestStatusResponse,
} from "@/app/api/requests/api"
import { ApiError } from "@/types/error"
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import ResourceGroupCard from "./resource-group-card"
import OrganizationCard from "./organization-card"
import { Role } from "@/types/role"
import DescriptionCard from "./description-card"
import { ResourceConfig } from "@/types/resource"
import { VmSizeDto } from "@/types/request"
import { useSession } from "next-auth/react"
import { haveAdminOrIT } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"
import { Status } from "@/types/api"
import { useState } from "react"
import confetti from "canvas-confetti"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import FeedbackCard from "./feedback-card"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquareText } from "lucide-react"
import { Label } from "@/components/ui/label"

export interface RequestDetail {
  id: string
  displayCode: string
  status: "Pending" | "Approved" | "Rejected"
  description: string
  ownerId: string
  repositoryId: string
  resourcesId: string
  createdAt: Date
  updatedAt: Date
  feedback?: string
  resources: {
    id: string
    name: string
    cloudProvider: string
    region: string
    size: VmSizeDto
    sizeId: string
    resourceConfigId: string
    resourceConfig: ResourceConfig
  }
  repository: {
    id: string
    name: string
    description: string | null
    resourcesId: string
    RepositoryCollaborator: {
      userId: string
      repositoryId: string
      user: {
        id: string
        email: string
        name: string
        role: Role
      }
      assignedAt: string
    }[]
    status: "Pending" | "Approved" | "Rejected"
  }
  owner: {
    id: string
    name: string
    email: string
    role: Role
  }
}

export default function RequestDetail({ slug }: { slug: string }) {
  const queryClient = useQueryClient()
  const [showApprovePopup, setShowApprovePopup] = useState(false)
  const [showRejectPopup, setShowRejectPopup] = useState(false)
  const { data, isLoading, error } = useQuery<RequestDetail>({
    queryKey: ["request", slug],
    queryFn: () => getRequestBySlug(slug),
  })

  const approveMutation = useMutation({
    mutationFn: ({ requestId }: { requestId: string }) =>
      changeRequestStatus(requestId, Status.Approved),
    onSuccess: (data) => {
      if (data.status === Status.Approved) {
        confetti({
          particleCount: 200,
          spread: 70,
          origin: { y: 0.6 },
        })
        setShowApprovePopup(true)
        queryClient.invalidateQueries({
          queryKey: ["request", slug],
        })
      }
    },
    onError: (error) => {
      console.error("Failed to approve request:", error)
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ requestId }: { requestId: string }) =>
      changeRequestStatus(requestId, Status.Rejected),
    onSuccess: (data) => {
      if (data.status === Status.Rejected) {
        setShowRejectPopup(true)
        queryClient.invalidateQueries({
          queryKey: ["request", slug],
        })
      }
    },
    onError: (error) => {
      console.error("Failed to reject request:", error)
    },
  })

  function handleApprove() {
    if (data) {
      approveMutation.mutate({ requestId: data.id })
    }
  }

  function handleReject() {
    if (data) {
      rejectMutation.mutate({ requestId: data.id })
    }
  }

  const session = useSession()

  if (isLoading) return <div>Loading...</div>
  if (error instanceof ApiError) return <div>{error.message}</div>

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-6 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/requests">Requests</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{slug}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-2xl font-bold tracking-tight">{slug}</h2>
        </div>
        {haveAdminOrIT(session.data?.user.role) &&
          data?.status !== Status.Approved &&
          data?.status !== Status.Rejected && (
            <AdminITActionsButton
              handleApprove={handleApprove}
              handleReject={handleReject}
              approveMutation={approveMutation}
              rejectMutation={rejectMutation}
            />
          )}
      </div>
      <div className="flex flex-col gap-8">
        {showApprovePopup && (
          <StatusChangePopup
            showPopup={showApprovePopup}
            setShowPopup={setShowApprovePopup}
            title="Request Approved"
            description="The request has been successfully approved."
          />
        )}
        {showRejectPopup && (
          <StatusChangePopup
            showPopup={showRejectPopup}
            setShowPopup={setShowRejectPopup}
            title="Request Rejected"
            description="The request has been successfully rejected."
          />
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side - Resource details */}
          <div className="lg:col-span-2 space-y-6">
            <ResourceGroupCard data={data} />
          </div>

          {/* Right side - Organization info */}
          <div className="flex flex-col space-y-6">
            <OrganizationCard data={data} />
            <DescriptionCard data={data} />
          </div>
          {/* Feedback card */}
          {data?.feedback ||
            (data?.status !== Status.Pending && (
              <div className="col-span-3">
                <FeedbackCard data={data} />
              </div>
            ))}
          {data?.status === Status.Pending && (
            <div className="grid gap-2 col-span-3">
              <Label className="flex items-center gap-1 font-bold tracking-tight text-xl">
                <MessageSquareText />
                Feedback *
              </Label>
              <Textarea
                className="h-40"
                placeholder="Leave your feedback here..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusChangePopup({
  showPopup,
  setShowPopup,
  title,
  description,
}: {
  showPopup: boolean
  setShowPopup: (open: boolean) => void
  title: string
  description: string
}) {
  return (
    <AlertDialog open={showPopup} onOpenChange={setShowPopup}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowPopup(false)}>
            Done
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function AdminITActionsButton({
  handleApprove,
  handleReject,
  approveMutation,
  rejectMutation,
}: {
  handleApprove: () => void
  handleReject: () => void
  approveMutation: UseMutationResult<
    RequestStatusResponse,
    Error,
    {
      requestId: string
    },
    unknown
  >
  rejectMutation: UseMutationResult<
    RequestStatusResponse,
    Error,
    {
      requestId: string
    },
    unknown
  >
}) {
  return (
    <div className="flex gap-4 ml-auto">
      <AlertDialog>
        <AlertDialogTrigger
          className={buttonVariants({ variant: "destructive" })}
        >
          {rejectMutation.isPending ? "Rejecting..." : "Reject"}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will reject the request and
              notify the requester.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={() => handleReject()}
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger className={buttonVariants({ variant: "default" })}>
          {approveMutation.isPending ? "Approving..." : "Approve"}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will approve the request and
              notify the requester.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleApprove()}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
