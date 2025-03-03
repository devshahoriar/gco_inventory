import { ContentLayout } from '@/components/admin-panel/content-layout'
import React from 'react'
import { AddDamageForm } from './AddDamage'

const AddDamagePage = () => {
  return (
    <ContentLayout title='Add Damage'>
      <AddDamageForm />
    </ContentLayout>
  )
}

export default AddDamagePage