import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const resourceSchema = z.object({
  name: z.string(),
  developers: z.array(z.string()),
  resources: z.string(),
  repository: z.string(),
})

export type Resource = z.infer<typeof resourceSchema>
