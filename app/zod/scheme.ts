import { z } from "zod"

const vmSchema = z.object({
  name: z.string().nonempty({
    message: "VM name is required",
  }),
  os: z.string().nonempty({
    message: "Operating system is required",
  }),
  sizeId: z.string().nonempty({
    message: "VM size is required",
  }),
})

const dbSchema = z.object({
  engine: z.string(),
  storageGB: z.number().min(1, "Storage must be at least 1 GB"),
})

const storageSchema = z.object({
  type: z.string(),
  capacityGB: z.number().min(1, "Size must be at least 1 GB"),
})

export const resourceSchema = z.object({
  name: z.string().nonempty({
    message: "Please provide a name for your resources",
  }),
  cloudProvider: z.string().nonempty({
    message: "Please select a cloud provider",
  }),
  region: z.string().nonempty({
    message: "Please select a region",
  }),
  resourceConfig: z
    .object({
      vms: z.array(vmSchema).optional(),
      dbs: z.array(dbSchema).optional(),
      sts: z.array(storageSchema).optional(),
    })
    .refine(
      (data) => {
        const hasVM = data.vms && data.vms.length > 0
        const hasDB = data.dbs && data.dbs.length > 0
        const hasStorage = data.sts && data.sts.length > 0
        return hasVM || hasDB || hasStorage
      },
      {
        message: "At least one resource (VM, Database, or Storage) is required",
      }
    ),
})
