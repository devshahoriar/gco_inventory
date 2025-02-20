/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import AddNewSalesOrder from '../../add/AddNewSalesOrder'
import { updateSalesOrder } from './action'

export default function EditSalesOrder({ initialData }: { initialData: any }) {
  // Transform initial data to match form structure
  const formattedData = {
    ...initialData,
    products: initialData.SealsProduct.map((item: any) => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      rate: item.rate,
      unit: item.product.productUnit.name,
    })),
  }

  return (
    <AddNewSalesOrder
      initialData={formattedData}
      isEdit={true}
      onSubmit={updateSalesOrder}
    />
  )
}
