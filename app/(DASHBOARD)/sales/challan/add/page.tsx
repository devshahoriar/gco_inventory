import { ContentLayout } from '@/components/admin-panel/content-layout'
import AddSealsChallan from './AddChallan'
import { getSalesChallanNumber } from './action'

const SealsChallanAddPage = async () => {
  const challanNumber = await getSalesChallanNumber()
  
  return (
    <ContentLayout title="Add Sales Challan">
      <AddSealsChallan initialChallanNumber={challanNumber} />
    </ContentLayout>
  )
}

export default SealsChallanAddPage
