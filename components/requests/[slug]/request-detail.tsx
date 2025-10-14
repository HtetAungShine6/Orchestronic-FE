"use client"

import {
  changeRequestStatus,
  deleteRequest,
  getRequestBySlug,
  RequestStatusResponse,
  updateRequestFeedback,
} from "@/app/api/requests/api"
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
import { haveAdminOrIT, showDestroyButtonAfterCreation } from "@/lib/utils"
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
import { RequestPageSkeleton } from "./request-page-skeleton"
import { getUser } from "@/app/api/user/api"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
// import { RepositoryStatus } from "@/types/repo"
import { AwsRequestDetail, AzureRequestDetail } from "@/types/request"

// const AirflowLogs = lazy(() => import("./airflow-logs"))

export default function RequestDetail({ slug }: { slug: string }) {
  const queryClient = useQueryClient()
  // const [showApprovePopup, setShowApprovePopup] = useState(false)
  const [showRejectPopup, setShowRejectPopup] = useState(false)
  const [feedback, setFeedback] = useState<string>("")

  const { data, isLoading, error } = useQuery<
    AzureRequestDetail | AwsRequestDetail
  >({
    queryKey: ["request", slug],
    queryFn: () => getRequestBySlug(slug),
    refetchInterval: () => 30000,
    refetchIntervalInBackground: true,
  })

  const updateFeedback = useMutation({
    mutationFn: ({
      requestId,
      feedback,
    }: {
      requestId: string
      feedback: string
    }) => updateRequestFeedback(requestId, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["request", slug],
      })
    },
  })

  const approveMutation = useMutation({
    mutationFn: ({ requestId }: { requestId: string }) =>
      changeRequestStatus(requestId, Status.Approved),
    onSuccess: (data) => {
      if (data.status === Status.Approved) {
        // confetti({
        //   particleCount: 200,
        //   spread: 70,
        //   origin: { y: 0.6 },
        // })
        // setShowApprovePopup(true)
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
    mutationFn: async ({ requestId }: { requestId: string }) => {
      return await changeRequestStatus(requestId, Status.Rejected)
    },
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
    if (data && feedback.trim()) {
      approveMutation.mutate({ requestId: data.id })
      updateFeedback.mutate({
        requestId: data.id,
        feedback: feedback,
      })
    }
  }

  function handleReject() {
    if (data && data.feedback?.trim()) {
      rejectMutation.mutate({ requestId: data.id })
      updateFeedback.mutate({
        requestId: data.id,
        feedback: feedback,
      })
    }
  }

  const deleteMutation = useMutation({
    mutationFn: async ({ requestId }: { requestId: string }) => {
      await changeRequestStatus(requestId, Status.Deleted)
      return await deleteRequest(requestId)
    },
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

  function handleDelete() {
    if (data && data.feedback?.trim()) {
      deleteMutation.mutate({ requestId: data.id })
    }
  }

  const {
    data: session,
    isLoading: isLoadingUser,
    error: errorUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  })

  if (isLoadingUser) return <RequestPageSkeleton />
  if (errorUser) return <p>Error fetching user data...</p>

  if (isLoading) return <RequestPageSkeleton />
  if (error) return <div>{error.message}</div>

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
        {haveAdminOrIT(session?.role) &&
          data?.status !== Status.Approved &&
          data?.status !== Status.Rejected &&
          data?.status !== Status.Deleted && (
            <AdminITActionsButton
              handleApprove={handleApprove}
              handleReject={handleReject}
              approveMutation={approveMutation}
              rejectMutation={rejectMutation}
              feedback={feedback}
            />
          )}
        {data?.status === Status.Approved &&
          showDestroyButtonAfterCreation(data) && (
            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <AlertDialogTrigger
                      className={buttonVariants({ variant: "destructive" })}
                    >
                      {rejectMutation.isPending ? "Deleting..." : "Delete"}
                    </AlertDialogTrigger>
                  </span>
                </TooltipTrigger>
                {/* <TooltipContent>
                <p>Not available</p>
              </TooltipContent> */}
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will delete the resource
                    group associated with this request.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className={buttonVariants({ variant: "destructive" })}
                    onClick={() => handleDelete()}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
      </div>
      <div className="flex flex-col gap-8">
        {/* {showApprovePopup && (
          <StatusChangePopup
            showPopup={showApprovePopup}
            setShowPopup={setShowApprovePopup}
            title="Request Approved"
            description="The request has been successfully approved."
          />
        )} */}
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
          {data?.status === Status.Approved && data?.feedback !== "" && (
            <div className="col-span-3">
              <FeedbackCard data={data} />
            </div>
          )}
          {data?.status === Status.Pending &&
            (session?.role === Role.Admin || session?.role === Role.IT) && (
              <div className="grid gap-2 col-span-3">
                <Label className="flex items-center gap-1 font-bold tracking-tight text-xl">
                  <MessageSquareText />
                  Feedback *
                </Label>
                <Textarea
                  required
                  className="h-40"
                  placeholder="Leave your feedback here..."
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
            )}
          {/* {data?.status === Status.Approved && (
            <div className="col-span-3">
              <AirflowLogs
                dagId="AZURE_Resource_Group"
                dagRunId="manual__2025-09-15T04:04:17.884443+00:00"
              />
            </div>
          )} */}
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
  feedback,
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
  feedback: string
}) {
  const isFeedbackEmpty = !feedback.trim()

  return (
    <div className="flex gap-4 ml-auto">
      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <AlertDialogTrigger
                className={buttonVariants({ variant: "destructive" })}
                disabled={isFeedbackEmpty || rejectMutation.isPending}
                title={isFeedbackEmpty ? "Please provide feedback" : ""}
              >
                {rejectMutation.isPending ? "Rejecting..." : "Reject"}
              </AlertDialogTrigger>
            </span>
          </TooltipTrigger>
          {isFeedbackEmpty && (
            <TooltipContent>
              <p>Please provide feedback</p>
            </TooltipContent>
          )}
        </Tooltip>
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
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <AlertDialogTrigger
                className={buttonVariants({ variant: "default" })}
                disabled={isFeedbackEmpty || approveMutation.isPending}
              >
                {approveMutation.isPending ? "Approving..." : "Approve"}
              </AlertDialogTrigger>
            </span>
          </TooltipTrigger>
          {isFeedbackEmpty && (
            <TooltipContent>
              <p>Please provide feedback</p>
            </TooltipContent>
          )}
        </Tooltip>
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
