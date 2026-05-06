import { createServerFn, createServerOnlyFn } from '@tanstack/react-start'
import { z } from 'zod'

const loadCommunityPageInitialDataServer = createServerOnlyFn(
  async () => import('./communityPageInitialData.server'),
)

const inputSchema = z.object({
  communitySlug: z.string().min(1),
})

export const getCommunityPageShellData = createServerFn({ method: 'GET' })
  .inputValidator(inputSchema)
  .handler(async ({ data }) => {
    const { loadCommunityPageShellData } =
      await loadCommunityPageInitialDataServer()

    return loadCommunityPageShellData(data.communitySlug)
  })
