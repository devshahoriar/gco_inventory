import { ContentLayout } from '@/components/admin-panel/content-layout'
import { PageLeftComponent, PageTopBar } from '@/components/shared/PageElement'
import { getActiveOrg } from '@/lib/auth'
import { getProductUnitByOrgId } from './action'
import { AddUnit } from './client'
import { UnitTable } from './UnitTable'

const ProductUnitePage = async () => {
  const orgId = await getActiveOrg()
  const allUnit = await getProductUnitByOrgId(
    orgId
  )
  return (
    <ContentLayout title="Product Units">
      <PageTopBar>
        <PageLeftComponent title="Product Units" length={allUnit.length} />
        <AddUnit organizationId={orgId} />
      </PageTopBar>
      <UnitTable units={allUnit} />
    </ContentLayout>
  )
}

export default ProductUnitePage
