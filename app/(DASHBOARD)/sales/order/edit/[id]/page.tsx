import { ContentLayout } from '@/components/admin-panel/content-layout'
import { getActiveOrg } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { getSalesOrderById } from './action'
import EditSalesOrder from './EditSalesOrder'

type Props = {
  params: {
    id: string
  }
}

async function EditOrderPage({ params }: Props) {
  const orgId = await getActiveOrg()
  const order = await getSalesOrderById(params.id, orgId)

  if (!order) {
    notFound()
  }

  return (
    <ContentLayout title="Edit Sales Order">
      <EditSalesOrder initialData={order} />
    </ContentLayout>
  )
}

export default EditOrderPage
