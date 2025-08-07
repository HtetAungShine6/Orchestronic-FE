"use client"
import { approveRequest, getRequestBySlug } from "@/app/api/requests/api"
import { ApiError } from "@/types/error"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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
import { Button } from "@/components/ui/button"
import { Status } from "@/types/api"
import { useState } from "react"
import confetti from "canvas-confetti"

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
  const { data, isLoading, error } = useQuery<RequestDetail>({
    queryKey: ["request", slug],
    queryFn: () => getRequestBySlug(slug),
  })

  const approveMutation = useMutation({
    mutationFn: ({ requestId }: { requestId: string }) =>
      approveRequest(requestId),
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

  function handleApprove() {
    if (data) {
      approveMutation.mutate({ requestId: data.id })
    }
  }

  const session = useSession()

  if (isLoading) return <div>Loading...</div>
  if (error instanceof ApiError) return <div>{error.message}</div>

  return (
    <div className="flex flex-col gap-8">
      {showApprovePopup && (
        <AlertDialog open={showApprovePopup} onOpenChange={setShowApprovePopup}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Request Approved</AlertDialogTitle>
              <AlertDialogDescription>
                The request has been successfully approved.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowApprovePopup(false)}>
                Done
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
          {haveAdminOrIT(session.data?.user.role) &&
            data?.status !== Status.Approved && (
              <div className="ml-auto">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>
                      {approveMutation.isPending ? "Approving..." : "Approve"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will approve the
                        request and notify the requester.
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
            )}
        </div>
      </div>
    </div>
  )
}
