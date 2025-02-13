import { ContentLayout } from '@/components/admin-panel/content-layout'
import { getActiveOrg } from '@/lib/auth'
import React from 'react'
import { getAllStockItems } from './action'
import { columns } from './columns'
import { DataTable } from './data-table'

const StockItem = async () => {
  const orgId = await getActiveOrg()
  const allItems = await getAllStockItems(orgId)
  return (
    <ContentLayout title='Stock Item'>
      <DataTable columns={columns} data={allItems} />
    </ContentLayout>
  )
}

export default StockItem