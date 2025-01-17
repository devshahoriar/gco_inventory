import { ContentLayout } from '@/components/admin-panel/content-layout'
import { PageLeftComponent, PageTopBar } from '@/components/shared/PageElement'
import { getUser } from '@/lib/auth'
import { headers } from 'next/headers'
import { getAllProductByOrganization } from './action'
import { AddProduct } from './client'
import { ProductTable } from './components/product-table'

const ProductPage = async () => {
  const user = await getUser(headers)
  const listProduct = await getAllProductByOrganization(
    user?.activeOrganizationId as string
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
