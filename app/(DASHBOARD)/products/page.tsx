import { ContentLayout } from '@/components/admin-panel/content-layout'
import { PageLeftComponent, PageTopBar } from '@/components/shared/PageElement'
import { getActiveOrg } from '@/lib/auth'
import { getAllProductByOrganization } from './action'
import { AddProduct } from './client'
import { ProductTable } from './components/product-table'

const ProductPage = async () => {
  const orgId = await getActiveOrg()
  const listProduct = await getAllProductByOrganization(
   orgId
  )

  return (
    <ContentLayout title="Product">
      <PageTopBar>
        <PageLeftComponent title="Product" length={listProduct.length} />
        <AddProduct />
      </PageTopBar>
      <div className="mt-5">
        <ProductTable products={listProduct} />
      </div>
    </ContentLayout>
  )
}

export default ProductPage
