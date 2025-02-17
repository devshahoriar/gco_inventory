import { ContentLayout } from '@/components/admin-panel/content-layout'
import React from 'react'
import AddNewSalesOrder from './AddNewSalesOrder'

const AddNewOrder = () => {
  return (
    <ContentLayout title="New Sales order">
      <AddNewSalesOrder />
    </ContentLayout>
  )
}

export default AddNewOrder
