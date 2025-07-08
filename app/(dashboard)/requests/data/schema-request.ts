import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const requestSchema = z.object({
  id: z.string(),
  displayCode: z.string(),
  title: z.string(),
  status: z.string(),
  date: z.string(),
  resources: z.object({
    id: z.string(),
    name: z.string(),
    cloudProvider: z.string(),
    region: z.string(),
    resourceConfigId: z.string(),
  }),
  repository: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    resourcesId: z.string(),
    status: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
  owner: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.string(),
  }),
})

export type Request = z.infer<typeof requestSchema>
