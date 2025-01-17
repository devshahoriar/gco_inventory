import { ContentLayout } from '@/components/admin-panel/content-layout'
import { PageTopBar } from '@/components/shared/PageElement'
import { NewWareHouse } from './client'
import { getWarehouses } from './action'
import { WarehouseTable } from './warehouse-table'

export default async function WareHousePage() {
  const warehouses = await getWarehouses()

  return (
    <ContentLayout title="Warehouses">
      <PageTopBar>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Warehouses</h2>
          <span className="rounded-md bg-muted px-2 py-1 text-xs">
            {warehouses.length} total
          </span>
        </div>
        <NewWareHouse />
      </PageTopBar>
      <div className="mt-4">
        <WarehouseTable warehouses={warehouses} />
      </div>
    </ContentLayout>
  )
}
