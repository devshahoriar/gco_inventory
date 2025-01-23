import { ContentLayout } from '@/components/admin-panel/content-layout'
import EditOrder from './EditOrder'
import { getOrder } from './action'

interface Props {
  params: {
    id: string
  }
}

const EditOrderPage = async (pr: Promise<Props>) => {
  const params = await pr
  const order = await getOrder(params.params.id)

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
