import { ContentLayout } from '@/components/admin-panel/content-layout'
import { PageLeftComponent, PageTopBar } from '@/components/shared/PageElement'
import { getUser } from '@/lib/auth'
import { headers } from 'next/headers'
import { getProductUnitByOrgId } from './action'
import { AddUnit } from './client'
import { UnitTable } from './UnitTable'

const ProductUnitePage = async () => {
  const user = await getUser(headers)
  const allUnit = await getProductUnitByOrgId(
    user?.activeOrganizationId as string
  )
  return (
    <ContentLayout title="Product Units">
      <PageTopBar>
        <PageLeftComponent title="Product Units" length={allUnit.length} />
        <AddUnit organizationId={user?.activeOrganizationId as string} />
      </PageTopBar>
      <UnitTable units={allUnit} />
    </ContentLayout>
  )
}

export default ProductUnitePage
