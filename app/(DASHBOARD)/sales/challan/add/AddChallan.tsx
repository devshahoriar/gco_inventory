/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { AsyncSelect } from '@/components/ui/async-select'
import { Button } from '@/components/ui/button'
import DateInput from '@/components/ui/DateInput'
import { InputParent } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  createSealsChallan,
  getOrderDetailsForChallan,
  getSalesOrderForSelect,
} from './action'

interface ChallanItem {
  productId: string
  productName: string
  quantity: number
  alterUnit: string
  description: string
  unit: string // Add unit to interface
}

interface FormData {
  salessChallanNo: string
  sealdOrderID: string
  brancesId: string
  wareHouseId: string
  customerId: string
  sealsExucutiveId: string
  contractPerson: string
  addreess: string
  designation: string
  remark: string
  contactNumber: string
  placesOfDelivery: string
  customerVat: string
  poNo: string
  poDate: Date
  exclusiveMobile: string
  salesOrder: string
  salesOrderDate: Date
  driverName: string
  driverMobile: string
  transotMode: string
  vehicleNo: string
  clallanDate: Date
  dueDate: Date
  items: ChallanItem[]
}

const initialFormData: FormData = {
  salessChallanNo: '',
  sealdOrderID: '',
  brancesId: '',
  wareHouseId: '',
  customerId: '',
  sealsExucutiveId: '',
  contractPerson: '',
  addreess: '',
  designation: '',
  remark: '',
  contactNumber: '',
  placesOfDelivery: '',
  customerVat: '',
  poNo: '',
  poDate: new Date(),
  exclusiveMobile: '',
  salesOrder: '',
  salesOrderDate: new Date(),
  driverName: '',
  driverMobile: '',
  transotMode: '',
  vehicleNo: '',
  clallanDate: new Date(),
  dueDate: new Date(),
  items: [],
}

const AddSealsChallan = ({
  initialChallanNumber,
}: {
  initialChallanNumber: string
}) => {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    salessChallanNo: initialChallanNumber,
  })
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (formData.sealdOrderID) {
        setLoading(true)
        try {
          const details = await getOrderDetailsForChallan(formData.sealdOrderID)
          if (details) {
            setOrderDetails(details) // Store full order details
            setFormData((prev) => ({
              ...prev,
              brancesId: details.Branch?.id || '',
              wareHouseId: details.Warehouse?.id || '',
              customerId: details.Customers?.id || '',
              sealsExucutiveId: details.salesExucutive?.id || '',
              contractPerson: details.contactPerson,
              addreess: details.address,
              contactNumber: details.contactNumber,
              placesOfDelivery: details.placesOfDelivery,
              items: details.SealsProduct.map((sp) => ({
                productId: sp.product.id,
                productName: sp.product.name,
                quantity: sp.quantity,
                alterUnit: '',
                description: '',
                unit: sp.product.productUnit.unit, // Add unit from product
              })),
            }))
          }
        } catch (error) {
          console.error('Error fetching order details:', error)
        }
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [formData.sealdOrderID])

  const handleItemChange = (index: number, data: Partial<ChallanItem>) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, ...data } : item
      ),
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      // Validation
      if (
        !formData.sealdOrderID ||
        !formData.salessChallanNo ||
        formData.items.length === 0
      ) {
        toast.error('Please fill all required fields')
        return
      }

      const challanData = {
        ...formData,
        items: formData.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          alterUnit: item.alterUnit,
          description: item.description,
        })),
      }

      const response = await createSealsChallan(challanData)

      if (response.success) {
        toast.success('Sales challan created successfully')
        router.push('/sales/challan')
        router.refresh()
      } else {
        toast.error(response.error || 'Failed to create sales challan')
      }
    } catch (error) {
      console.error('Submit sales challan error:', error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-2">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <InputParent
            labelTitle="Challan Number"
            placeholder="Enter challan number"
            value={formData.salessChallanNo}
            onChange={(e) => handleChange('salessChallanNo', e.target.value)}
          />

          <div className="space-y-1">
            <Label>Add Order Challan</Label>
            <AsyncSelect
              placeholder="Select Sales Order"
              fetcher={getSalesOrderForSelect}
              renderOption={(item: any) => (
                <>
                  {item.orderNo} · {item._count.SealsProduct} Items
                </>
              )}
              getOptionValue={(item) => item.id}
              getDisplayValue={(item) =>
                `${item.orderNo} · ${item._count.SealsProduct} Items`
              }
              value={formData.sealdOrderID}
              onChange={(v) => handleChange('sealdOrderID', v)}
            />
          </div>

          <InputParent
            labelTitle="Branch"
            placeholder="Branch"
            value={orderDetails?.Branch?.name || ''}
            disabled
            className="disabled:opacity-90"
          />

          <InputParent
            labelTitle="Warehouse"
            placeholder="Warehouse"
            value={orderDetails?.Warehouse?.name || ''}
            disabled
            className="disabled:opacity-90"
          />

          <InputParent
            labelTitle="Customer"
            placeholder="Customer"
            value={`${orderDetails?.Customers?.name || ''} · ${
              orderDetails?.Customers?.customerNumber || ''
            }`}
            disabled
            className="disabled:opacity-90"
          />

          <InputParent
            labelTitle="Sales Executive"
            placeholder="Sales Executive"
            value={`${orderDetails?.salesExucutive?.name || ''} · ${
              orderDetails?.salesExucutive?.email || ''
            }`}
            disabled
            className="disabled:opacity-90"
          />

          <InputParent
            labelTitle="Contract Person"
            placeholder="Enter contract person"
            value={formData.contractPerson}
            onChange={(e) => handleChange('contractPerson', e.target.value)}
          />

          <InputParent
            labelTitle="Designation"
            placeholder="Enter designation"
            value={formData.designation}
            onChange={(e) => handleChange('designation', e.target.value)}
          />

          <InputParent
            labelTitle="Contact Number"
            placeholder="Enter contact number"
            value={formData.contactNumber}
            onChange={(e) => handleChange('contactNumber', e.target.value)}
          />

          <InputParent
            labelTitle="Places of Delivery"
            placeholder="Enter delivery place"
            value={formData.placesOfDelivery}
            onChange={(e) => handleChange('placesOfDelivery', e.target.value)}
          />

          <div className="space-y-1">
            <Label>PO Date</Label>
            <DateInput
              className="w-full block"
              value={formData.poDate}
              onChange={(date) => handleChange('poDate', date)}
            />
          </div>

          <InputParent
            labelTitle="PO Number"
            placeholder="Enter PO number"
            value={formData.poNo}
            onChange={(e) => handleChange('poNo', e.target.value)}
          />

          <InputParent
            labelTitle="Driver Name"
            placeholder="Enter driver name"
            value={formData.driverName}
            onChange={(e) => handleChange('driverName', e.target.value)}
          />

          <InputParent
            labelTitle="Driver Mobile"
            placeholder="Enter driver mobile"
            value={formData.driverMobile}
            onChange={(e) => handleChange('driverMobile', e.target.value)}
          />

          <InputParent
            labelTitle="Transport Mode"
            placeholder="Enter transport mode"
            value={formData.transotMode}
            onChange={(e) => handleChange('transotMode', e.target.value)}
          />

          <InputParent
            labelTitle="Vehicle Number"
            placeholder="Enter vehicle number"
            value={formData.vehicleNo}
            onChange={(e) => handleChange('vehicleNo', e.target.value)}
          />

          <div className="space-y-1">
            <Label>Challan Date</Label>
            <DateInput
              className="w-full block"
              value={formData.clallanDate}
              onChange={(date) => handleChange('clallanDate', date)}
            />
          </div>

          <div className="space-y-1">
            <Label>Due Date</Label>
            <DateInput
              className="w-full block"
              value={formData.dueDate}
              onChange={(date) => handleChange('dueDate', date)}
            />
          </div>
        </div>

        <InputParent
          labelTitle="Address"
          placeholder="Enter address"
          value={formData.addreess}
          onChange={(e) => handleChange('addreess', e.target.value)}
        />

        <InputParent
          labelTitle="Remarks"
          isTextArea
          placeholder="Add remarks..."
          value={formData.remark}
          onChange={(e) => handleChange('remark', e.target.value)}
        />

        {formData.items.length > 0 && (
          <div className="space-y-3">
            <Label className="flex gap-2 items-center justify-center border-b pb-2 text-xl">
              Challan Items
            </Label>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Alter Unit</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.items.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <InputParent
                          type="text"
                          placeholder="Product Name"
                          value={item.productName}
                          disabled
                        />
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <InputParent
                          type="number"
                          placeholder="Quantity"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(i, {
                              quantity: Number(e.target.value),
                            })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {item.unit}
                        </span>
                      </TableCell>
                      <TableCell>
                        <InputParent
                          placeholder="Alter Unit"
                          value={item.alterUnit}
                          onChange={(e) =>
                            handleItemChange(i, { alterUnit: e.target.value })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <InputParent
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(i, { description: e.target.value })
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={5} className="text-right font-medium">
                      Total Items: {formData.items.length}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        )}

        <Button className="w-full" disabled={loading} onClick={handleSubmit}>
          {loading ? 'Creating...' : 'Submit Sales Challan'}
        </Button>
      </div>
    </div>
  )
}

export default AddSealsChallan
