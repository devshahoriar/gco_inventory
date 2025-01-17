import { ContentLayout } from '@/components/admin-panel/content-layout'
import { PageLeftComponent, PageTopBar } from '@/components/shared/PageElement'
import { getUser } from '@/lib/auth'
import { headers } from 'next/headers'
import { getProductGroupByOrgId } from './action'
import { AddGroup } from './client'
import { GroupTable } from './GroupTable'

const GroupPage = async () => {
  const user = await getUser(headers)
  const allGroups = await getProductGroupByOrgId(
    user?.activeOrganizationId as string
  )

  return (
    <ContentLayout title="Product Groups">
      <PageTopBar>
        <PageLeftComponent title="Product Groups" length={allGroups.length} />
        <AddGroup organizationId={user?.activeOrganizationId as string} />
      </PageTopBar>
      <GroupTable groups={allGroups} />
    </ContentLayout>
  )
}

export default GroupPage
