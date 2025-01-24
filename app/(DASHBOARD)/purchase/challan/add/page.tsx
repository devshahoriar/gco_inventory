import { ContentLayout } from '@/components/admin-panel/content-layout'
import AddChallan from './addChalan'
import { getChallanNumber } from './action'

const AddChalanPage = async () => {
  const chNum = await getChallanNumber()
  return (
    <ContentLayout title="Add Challan">
      <AddChallan chNum={chNum} />
    </ContentLayout>
  )
}

export default AddChalanPage
