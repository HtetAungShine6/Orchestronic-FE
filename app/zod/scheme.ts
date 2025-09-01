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
  name: z.string().nonempty({
    message: "Database name is required",
  }),
  engine: z.string().nonempty({
    message: "Database engine is required",
  }),
  storageGB: z.number().optional(),
  skuName: z.string().nonempty({
    message: "SKU name is required",
  }),
  username: z.string().nonempty({
    message: "Username is required",
  }),
  password: z.string().nonempty({
    message: "Password is required",
  }),
})

const storageSchema = z.object({
  accessTier: z.string().nonempty({
    message: "Access tier is required",
  }),
  name: z.string().regex(/^[a-z0-9]+$/, {
    message: "Repository name can only contain lowercase letters and numbers",
  }),
  kind: z.string().nonempty({
    message: "Kind is required",
  }),
  sku: z.string().nonempty({
    message: "SKU name is required",
  }),
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
