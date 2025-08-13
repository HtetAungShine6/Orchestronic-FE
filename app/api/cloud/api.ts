import { awsFormSchema } from "@/app/(dashboard)/settings/components/aws-drawer"
import { ApiError } from "@/types/error"
import z from "zod"

export async function updateCloudConfig(values: z.infer<typeof awsFormSchema>) {
  const res = await fetch(`/api/cloud/secret`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...values }),
  })

  console.log(res)

  if (!res.ok) {
    const err = await res.json()
    throw new ApiError(
      err.statusCode ?? res.status,
      err.message ?? "Failed to update config",
      err.error ?? "Unknown error"
    )
  }

  return res.json()
}
