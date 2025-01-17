import { ContentLayout } from '@/components/admin-panel/content-layout'
import { PageTopBar } from '@/components/shared/PageElement'
import { Button } from '@/components/ui/button'

const DashboardPage = async () => {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, 2000)
  })

  return (
    <ContentLayout title="Dashboard">
      <PageTopBar>
        <div>Title</div>
        <div className="space-x-2">
          <Button variant="outline">Add</Button>
          <Button variant="outline">Filter</Button>
        </div>
      </PageTopBar>
    </ContentLayout>
  )
}

export default DashboardPage
