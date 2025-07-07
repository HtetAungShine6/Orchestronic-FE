import { z } from "zod"

const vmSchema = z.object({
  name: z.string().nonempty({
    message: "VM name is required",
  }),
  cpu: z.number().min(1, "CPU must be at least 1 vCPU"),
  memory: z.number().min(1, "Memory must be at least 1 GB"),
  os: z.string().nonempty({
    message: "Operating system is required",
  }),
  instancetype: z.string().nonempty({
    message: "Instance type is required",
  }),
})

const dbSchema = z.object({
  engine: z.string(),
  size: z.number().min(1, "Storage must be at least 1 GB"),
  instanceClass: z.string().nonempty({
    message: "Instance class is required",
  }),
})

const storageSchema = z.object({
  type: z.string(),
  size: z.number().min(1, "Size must be at least 1 GB"),
})

export const resourceSchema = z.object({
  vm: z.array(vmSchema).optional(),
  db: z.array(dbSchema).optional(),
  storage: z.array(storageSchema).optional(),
})
