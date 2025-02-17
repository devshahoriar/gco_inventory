/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { AsyncSelect } from '@/components/ui/async-select'
import { Button } from '@/components/ui/button'
import DateInput from '@/components/ui/DateInput'
import { Input } from '@/components/ui/input'
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
import { PlusCircle, X } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import useSWR from 'swr'
import { toast } from 'sonner'
import {
  getBranchesForSelect,
  getWarehousesForSelect,
  getCustomersForSelect,
  getSalesExecutivesForSelect,
  getProductsForSelect,
  getProductUnit,
  getSalesOrderNo,
  createSalesOrder,
} from './action'
import { useRouter } from 'next/navigation'

interface ProductOption {
  id: string
  name: string
  productUnit?: {
    name: string
  }
}

const ProductInput = ({
  index,
  product,
  updateProduct,
  removeProduct,
}: {
  index: number
  product: {
    productId: string
    productName: string
    quantity: number
    rate: number
    unit: string
  }
  updateProduct: (index: number, field: string, value: any) => void
  removeProduct: (index: number) => void
}) => {
  const total = (product.quantity || 0) * (product.rate || 0)

  const { data: productUnit } = useSWR(
    product.productId ? `product-unit-${product.productId}` : null,
    () => getProductUnit(product.productId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  // Only update unit if it's different from current unit
  useEffect(() => {
    if (productUnit?.name && productUnit.name !== product.unit) {
      updateProduct(index, 'unit', productUnit.name)
    }
  }, [productUnit?.name, product.unit, index, updateProduct])

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!value || value === '0') {
      updateProduct(index, 'quantity', 0)
      return
    }
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      updateProduct(index, 'quantity', numValue)
    }
  }

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!value || value === '0') {
      updateProduct(index, 'rate', 0)
      return
    }
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      updateProduct(index, 'rate', numValue)
    }
  }

  const productsFetcher = useCallback(
    (v: string) => getProductsForSelect(v),
    []
  )

  return (
    <TableRow>
      <TableCell className="w-[300px]">
        <AsyncSelect
          placeholder="Select Product"
          fetcher={productsFetcher as any}
          renderOption={(item:any) => <>{item.name}</>}
          getOptionValue={(item) => item.id}
          getDisplayValue={(item) => item.name}
          value={product.productId}
          onChange={(value, options: ProductOption[] = []) => {
            const selectedProduct = options.find((opt) => opt.id === value)
            if (selectedProduct) {
              updateProduct(index, 'productId', value)
              updateProduct(index, 'productName', selectedProduct.name)
            }
          }}
        />
      </TableCell>
      <TableCell className="w-[120px]">
        <Input
          type="number"
          min="0"
          step="1"
          placeholder="Quantity"
          value={product.quantity || ''}
          onChange={handleQuantityChange}
        />
      </TableCell>
      <TableCell className="w-[80px]">{productUnit?.name || ''}</TableCell>
      <TableCell className="w-[120px]">
        <Input
          type="number"
          min="0"
          step="0.01"
          placeholder="Rate"
          value={product.rate || ''}
          onChange={handleRateChange}
        />
      </TableCell>
      <TableCell className="text-right w-[120px] font-medium">
        {total.toFixed(2)}
      </TableCell>
      <TableCell className="w-[50px]">
        <Button variant="ghost" size="sm" onClick={() => removeProduct(index)}>
          <X className="size-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export const AddNewSalesOrder = () => {
  const [formData, setFormData] = useState({
    orderNo: '',
    branceId: '',
    warehoueId: '',
    customerId: '',
    address: '',
    remarks: '',
    placesOfDelivery: '',
    orderDate: new Date(),
    deliveryDate: new Date(),
    salesExucutiveId: '',
    contactPerson: '',
    contactNumber: '',
    products: [] as Array<{
      productId: string
      productName: string
      quantity: number
      rate: number
      unit: string
    }>,
  })


  const { data: orderNo, isLoading: isLoadingOrderNo } = useSWR(
    'sales-order-no',
    getSalesOrderNo,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  useEffect(() => {
    if (orderNo && !formData.orderNo) {
      setFormData((prev) => ({
        ...prev,
        orderNo,
      }))
    }
  }, [orderNo, formData.orderNo])

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()


  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          productId: '',
          productName: '',
          quantity: 0,
          rate: 0,
          unit: 'pcs',
        },
      ],
    }))
  }

  const removeProduct = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }))
  }


  const updateProduct = useCallback(
    (index: number, field: string, value: any) => {
      setFormData((prev) => ({
        ...prev,
        products: prev.products.map((product, i) =>
          i === index ? { ...product, [field]: value } : product
        ),
      }))
    },
    []
  )


  const totalAmount = formData.products.reduce(
    (sum, product) => sum + product.quantity * product.rate,
    0
  )

  const handleSubmit = async () => {
    setError(null)
    if (
      !formData.orderNo ||
      !formData.branceId ||
      !formData.warehoueId ||
      !formData.customerId ||
      !formData.salesExucutiveId ||
      !formData.address ||
      !formData.contactPerson ||
      !formData.contactNumber
    ) {
      setError('Please fill in all required fields')
      return
    }

    // Validate products
    if (formData.products.length === 0) {
      setError('Please add at least one product')
      return
    }

    if (formData.products.some((p) => !p.productId || !p.quantity || !p.rate)) {
      setError('Please complete all product details')
      return
    }

    setLoading(true)
    try {
      await createSalesOrder(formData)
      toast.success('Sales order created successfully')
      router.push('/sales/order')
    } catch (error: any) {
      setError(error.message || 'Failed to create sales order')
    } finally {
      setLoading(false)
    }
  }


  const branchFetcher = useCallback(
    (v: string) => getBranchesForSelect(v, formData.branceId),
    [formData.branceId]
  )
  const warehouseFetcher = useCallback(
    (v: string) => getWarehousesForSelect(v, formData.warehoueId),
    [formData.warehoueId]
  )
  const customerFetcher = useCallback(
    (v: string) => getCustomersForSelect(v, formData.customerId),
    [formData.customerId]
  )
  const salesExecutiveFetcher = useCallback(
    (v: string) => getSalesExecutivesForSelect(v, formData.salesExucutiveId),
    [formData.salesExucutiveId]
  )

  return (
    <div className="max-w-4xl mx-auto p-2">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Order No</Label>
            <Input
              placeholder={isLoadingOrderNo ? 'Loading...' : 'Order Number'}
              value={formData.orderNo}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label>Select Branch</Label>
            <AsyncSelect
              placeholder="Select Branch"
              fetcher={branchFetcher as any}
              renderOption={(item: any) => <>{item.name}</>}
              getOptionValue={(item) => item.id}
              getDisplayValue={(item) => item.name}
              value={formData.branceId}
              onChange={(value) =>
                setFormData({ ...formData, branceId: value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Select Warehouse</Label>
            <AsyncSelect
              placeholder="Select Warehouse"
              fetcher={warehouseFetcher as any}
              renderOption={(item: any) => <>{item.name}</>}
              getOptionValue={(item) => item.id}
              getDisplayValue={(item) => item.name}
              value={formData.warehoueId}
              onChange={(value) =>
                setFormData({ ...formData, warehoueId: value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Select Customer</Label>
            <AsyncSelect
              placeholder="Select Customer"
              fetcher={customerFetcher as any}
              renderOption={(item: any) => <>{item.name}</>}
              getOptionValue={(item) => item.id}
              getDisplayValue={(item) => item.name}
              value={formData.customerId}
              onChange={(value) =>
                setFormData({ ...formData, customerId: value })
              }
            />
          </div>

          <div className="space-y-2 flex flex-col">
            <Label>Order Date</Label>
            <DateInput
              value={formData.orderDate}
              onChange={(date) =>
                setFormData({ ...formData, orderDate: date || new Date() })
              }
            />
          </div>

          <div className="space-y-2 flex flex-col">
            <Label>Delivery Date</Label>
            <DateInput
              value={formData.deliveryDate}
              onChange={(date) =>
                setFormData({ ...formData, deliveryDate: date || new Date() })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Select Sales Executive</Label>
            <AsyncSelect
              placeholder="Select Sales Executive"
              fetcher={salesExecutiveFetcher as any}
              renderOption={(item: any) => <>{item.name}</>}
              getOptionValue={(item) => item.id}
              getDisplayValue={(item) => item.name}
              value={formData.salesExucutiveId}
              onChange={(value) =>
                setFormData({ ...formData, salesExucutiveId: value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Contact Person</Label>
            <Input
              placeholder="Contact Person"
              value={formData.contactPerson}
              onChange={(e) =>
                setFormData({ ...formData, contactPerson: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Contact Number</Label>
            <Input
              placeholder="Contact Number"
              value={formData.contactNumber}
              onChange={(e) =>
                setFormData({ ...formData, contactNumber: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Address</Label>
          <Input
            placeholder="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Places of Delivery</Label>
          <Input
            placeholder="Places of Delivery"
            value={formData.placesOfDelivery}
            onChange={(e) =>
              setFormData({ ...formData, placesOfDelivery: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Remarks</Label>
          <Input
            placeholder="Remarks"
            value={formData.remarks}
            onChange={(e) =>
              setFormData({ ...formData, remarks: e.target.value })
            }
          />
        </div>

        <div className="space-y-3">
          {formData.products.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Product</TableHead>
                    <TableHead className="w-[120px]">Quantity</TableHead>
                    <TableHead className="w-[80px]">Unit</TableHead>
                    <TableHead className="w-[120px]">Rate</TableHead>
                    <TableHead className="text-right w-[120px]">
                      Total
                    </TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.products.map((product, i) => (
                    <ProductInput
                      key={i}
                      index={i}
                      product={product}
                      updateProduct={updateProduct}
                      removeProduct={removeProduct}
                    />
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>
                      Total Items: {formData.products.length}
                    </TableCell>
                    <TableCell colSpan={3} className="text-right">
                      Total Amount: {totalAmount.toFixed(2)} taka
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            className="!bg-transparent"
            onClick={addProduct}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>

          {error && <div className="text-red-500 p-2">{error}</div>}

          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Submit Sales Order'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddNewSalesOrder
