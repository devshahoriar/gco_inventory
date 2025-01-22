import { ContentLayout } from '@/components/admin-panel/content-layout'
import { PageLeftComponent, PageTopBar } from '@/components/shared/PageElement'
import { getActiveOrg } from '@/lib/auth'
import { getProductGroupByOrgId } from './action'
import { AddGroup } from './client'
import { GroupTable } from './GroupTable'

const GroupPage = async () => {
  const orgId = await getActiveOrg()
  const allGroups = await getProductGroupByOrgId(orgId)

  return (
    <ContentLayout title="Product Groups">
      <PageTopBar>
        <PageLeftComponent title="Product Groups" length={allGroups.length} />
        <AddGroup organizationId={orgId} />
      </PageTopBar>
      <GroupTable groups={allGroups} />
    </ContentLayout>
  )
}

export default GroupPage
