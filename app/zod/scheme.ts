import { z } from "zod"

const vmSchema = z.object({
  cpu: z.number().min(1, "CPU must be at least 1"),
  memory: z.number().min(1, "Memory must be at least 1 GB"),
  os: z.string(),
})

const dbSchema = z.object({
  engine: z.enum(["postgres", "mysql", "mongodb"]),
  version: z.string(),
  storage: z.number().min(1, "Storage must be at least 1 GB"),
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
