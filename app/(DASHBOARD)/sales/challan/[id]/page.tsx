import { ContentLayout } from '@/components/admin-panel/content-layout'
import { notFound } from 'next/navigation'
import ViewSealsChallan from './ViewChallan'
import { getSalesChallan } from './action'

interface Props {
  params: Promise<{ id: string }>
}

const SealsChallanViewPage = async ({ params }: Props) => {
  const chalanId = (await params).id
  const challan = await getSalesChallan(chalanId)
  
  if (!challan) {
    notFound()
  }

  return (
    <ContentLayout title={`Sales Challan: ${challan.salessChallanNo}`}>
      <ViewSealsChallan data={challan} />
    </ContentLayout>
  )
}

export default SealsChallanViewPage
