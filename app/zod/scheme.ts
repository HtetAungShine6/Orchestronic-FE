import { z } from "zod"

const vmSchema = z.object({
  name: z.string().nonempty({
    message: "VM name is required",
  }),
  numberOfCores: z.number().min(1, "CPU must be at least 1 vCPU"),
  memory: z.number().min(1, "Memory must be at least 1 GB"),
  os: z.string().nonempty({
    message: "Operating system is required",
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
    message: "",
  }),
  cloud_provider: z.string().nonempty({
    message: "",
  }),
  region: z.string().nonempty({
    message: "",
  }),
  resourceConfig: z.object({
    vm: z.array(vmSchema).optional(),
    db: z.array(dbSchema).optional(),
    storage: z.array(storageSchema).optional(),
  }),
})
