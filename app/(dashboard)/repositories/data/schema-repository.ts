import { z } from "zod"

export const repositorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  resourcesId: z.string(),
  status: z.string(),

  resources: z.object({
    id: z.string(),
    name: z.string(),
    cloudProvider: z.string(),
    region: z.string(),
    resourceConfigId: z.string(),
  }),

  collaborators: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      role: z.string(),
    })
  ),

  request: z.object({
    id: z.string(),
    displayCode: z.string(),
    status: z.string(),
    description: z.string(),
    ownerId: z.string(),
    repositoryId: z.string(),
    resourcesId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
})

export type Repository = z.infer<typeof repositorySchema>
