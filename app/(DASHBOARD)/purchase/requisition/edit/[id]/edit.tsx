/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'


import { toast } from "sonner"
import { AddRequisition } from "../../add/addReqesition"
import { updateRequisition } from "./action"

export const EditRequisition = ({ id,regData }: { id: string,regData:any }) => {

  const initialData = {
    regNumber: regData.regNumber,
    reqDate: regData.reqDate,
    naration: regData.naration,
    reqItems: regData.reqItems.map((item: any) => ({
      productId: item.product.id,
      quantity: item.quantity.toString(),
      groupId: item.groupId,
      remark: item.remark
    }))
  }

  return (
    <AddRequisition 
      initialData={initialData}
      onSubmit={async (formData) => {
        try {
          await updateRequisition(id, formData)
          toast.success('Requisition updated successfully')
        } catch (error: any) {
          toast.error(error.message || 'Update failed')
        }
      }}
    />
  )
}