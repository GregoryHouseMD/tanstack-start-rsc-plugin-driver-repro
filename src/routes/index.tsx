import { createFileRoute } from '@tanstack/react-router'
import { getCommunityPageShellData } from '../server/communityPageInitialData'

export const Route = createFileRoute('/')({
  loader: () =>
    getCommunityPageShellData({
      data: { communitySlug: 'repro' },
    }),
  component: HomePage,
})

function HomePage() {
  const data = Route.useLoaderData()
  return <main>{data.title}</main>
}
