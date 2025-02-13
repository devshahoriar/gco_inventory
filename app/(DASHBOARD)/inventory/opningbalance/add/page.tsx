import React from 'react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { AddOpningBalanceForm } from './addOpningBalance'

const AddOpningBalance = () => {
  return (
    <ContentLayout title="Add Opening Balance">
      <AddOpningBalanceForm />
    </ContentLayout>
  )
}

export default AddOpningBalance