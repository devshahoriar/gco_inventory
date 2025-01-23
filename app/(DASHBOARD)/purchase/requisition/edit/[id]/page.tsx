import { ContentLayout } from '@/components/admin-panel/content-layout'
import { EditRequisition } from './edit'
import { getRequisition } from './action'
import { getActiveOrg } from '@/lib/auth'

const EditReqPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const orgId = await getActiveOrg()
  const data = await getRequisition(id,orgId)
  return (
    <ContentLayout title="Edit Requisition">
      <EditRequisition id={id} regData={data} />
    </ContentLayout>
  )
}

export default EditReqPage
