import { ContentLayout } from '@/components/admin-panel/content-layout'
import { getActiveOrg } from '@/lib/auth'
import React from 'react'
import { getAllStockItems } from './action'

const StockItem =async () => {
  const orgId = await getActiveOrg()
  const allItems = getAllStockItems(orgId)
  return (
    <ContentLayout title='Stock Item'>StockItem</ContentLayout>
  )
}

export default StockItem