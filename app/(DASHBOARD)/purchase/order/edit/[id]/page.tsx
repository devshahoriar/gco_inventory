/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentLayout } from '@/components/admin-panel/content-layout'
import EditOrder from './EditOrder'
import { getOrder } from './action'

const EditOrderPage = async ({ params }: any) => {
  const para = await params
  const order = await getOrder(para.id)

  if (!order) {
    return <div>Order not found</div>
  }

  return (
    <ContentLayout title="Edit Order">
      <EditOrder initialData={order} />
    </ContentLayout>
  )
}

export default EditOrderPage
