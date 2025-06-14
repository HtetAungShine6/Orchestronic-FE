import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const repositorySchema = z.object({
  // id: z.string(),
  description: z.string(),
  // status: z.string(),
  // date: z.string(),
  developers: z.array(z.string()),
  repository: z.string(),
  // label: z.string(),
  // priority: z.string(),
})

export type Repository = z.infer<typeof repositorySchema>
