import { ContentLayout } from '@/components/admin-panel/content-layout'
import React from 'react'
import AddOrder from './AddOrder'

const NewOrderPage = () => {
  return (
    <ContentLayout title="New Order">
      <AddOrder />
    </ContentLayout>
  )
}

export default NewOrderPage
