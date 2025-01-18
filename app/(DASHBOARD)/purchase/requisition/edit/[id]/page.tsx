import { ContentLayout } from '@/components/admin-panel/content-layout'
import { EditRequisition } from './edit'
import { getRequisition } from './action'

const EditReqPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const data = await getRequisition(id)
  return (
    <ContentLayout title="Edit Requisition">
      <EditRequisition id={id} regData={data} />
    </ContentLayout>
  )
}

export default EditReqPage
