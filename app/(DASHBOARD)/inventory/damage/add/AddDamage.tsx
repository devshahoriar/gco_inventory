/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { AsyncSelect } from '@/components/ui/async-select'
import { Button } from '@/components/ui/button'
import DateInput from '@/components/ui/DateInput'
import { InputParent } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  getProductGroup,
  getProductsForSelect,
  getWarehouseForSelect,
  saveDamage,
  generateDamageNo,
} from './action'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const AddDamageForm = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    damageNo: '',
    warehouseId: '',
    productId: '',
    quantity: 0,
    remark: '',
    damageDate: new Date(),
    groupId: '',
  })

  const [productUnit, setProductUnit] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [stockAvailable, setStockAvailable] = useState(0)

  // Generate damage number when component mounts
  useEffect(() => {
    const fetchDamageNo = async () => {
      try {
        const damageNo = await generateDamageNo()
        setFormData((prev) => ({ ...prev, damageNo }))
      } catch (error) {
        console.error('Failed to generate damage number:', error)
        toast.error('Failed to generate damage number')
      } finally {
        setInitializing(false)
      }
    }

    fetchDamageNo()
  }, [])

  const handleSubmit = async () => {
    setError('')

    // Validation
    if (!formData.damageNo) {
      setError('Damage No is required')
      return
    }

    if (!formData.warehouseId) {
      setError('Warehouse is required')
      return
    }

    if (!formData.productId) {
      setError('Product is required')
      return
    }

    if (!formData.quantity || formData.quantity <= 0) {
      setError('Quantity must be greater than 0')
      return
    }

    if (formData.quantity > stockAvailable) {
      setError(`Available stock is only ${stockAvailable} ${productUnit}`)
      return
    }

    try {
      setLoading(true)
      const result:any = await saveDamage({
        damageNo: formData.damageNo,
        warehouseId: formData.warehouseId,
        productId: formData.productId,
        quantity: formData.quantity,
        remark: formData.remark,
        damageDate: formData.damageDate,
      })

      if (result.error) {
        setError(result.message || 'Failed to save damage record')
        toast.error(result.message || 'Failed to save damage record')
        return
      }
      
      toast.success('Damage record saved successfully')
      router.push('/inventory/damage')
      
    } catch (error: any) {
      // This catch block is now mostly for network errors
      console.log(error)
      setError('Connection error. Please try again.')
      toast.error('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-2">
      {initializing ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Initializing form...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Damage No</Label>
              <InputParent
                placeholder="Damage No"
                value={formData.damageNo}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, damageNo: e.target.value }))
                }
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label>Damage Date</Label>
              <DateInput
                value={formData.damageDate}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    damageDate: date || new Date(),
                  }))
                }
              />
            </div>
          </div>

          <div>
            <Label>Warehouse</Label>
            <AsyncSelect
              fetcher={getWarehouseForSelect}
              renderOption={(item: any) => <div>{item.name}</div>}
              getOptionValue={(item) => item.id}
              getDisplayValue={(item) => item.name}
              placeholder="Select Warehouse"
              value={formData.warehouseId}
              onChange={(v) => {
                setFormData((prev) => ({
                  ...prev,
                  warehouseId: v,
                  productId: '', // Clear product when warehouse changes
                  quantity: 0,
                }))
                setStockAvailable(0)
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Product Group</Label>
              <AsyncSelect
                fetcher={getProductGroup}
                renderOption={(item: any) => <div>{item.name}</div>}
                getOptionValue={(item) => item.id}
                getDisplayValue={(item) => item.name}
                placeholder="Select Group"
                value={formData.groupId}
                onChange={(v) => {
                  setFormData((prev) => ({
                    ...prev,
                    groupId: v,
                    productId: '',
                    quantity: 0,
                  }))
                  setStockAvailable(0)
                }}
              />
            </div>

            <div>
              <Label>Product</Label>
              <AsyncSelect
                fetcher={(v?: string) =>
                  getProductsForSelect(formData.groupId, v)
                }
                renderOption={(item: any) => <div>{item.name}</div>}
                getOptionValue={(item) => item.id}
                getDisplayValue={(item) => item.name}
                placeholder="Select Product"
                value={formData.productId}
                onChange={(v, options) => {
                  const selectedProduct = options?.find((item) => item.id === v)
                  setProductUnit(selectedProduct?.productUnit?.unit || '')

                  // Calculate available stock
                  const availableStock =
                    selectedProduct?.StockItems?.reduce(
                      (sum: any, item: any) => sum + item.quantity,
                      0
                    ) || 0

                  setStockAvailable(availableStock)
                  setFormData((prev) => ({
                    ...prev,
                    productId: v,
                    quantity: 0,
                  }))
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <Label>Quantity {productUnit ? `(${productUnit})` : ''}</Label>
              {stockAvailable > 0 && (
                <span className="text-sm text-gray-500">
                  Available: {stockAvailable} {productUnit}
                </span>
              )}
            </div>
            <InputParent
              type="number"
              placeholder="Enter quantity"
              value={formData.quantity || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value)
                setFormData((prev) => ({
                  ...prev,
                  quantity: isNaN(value) ? 0 : value,
                }))
              }}
            />
          </div>

          <div>
            <Label>Remarks</Label>
            <Textarea
              placeholder="Enter details about damage reason..."
              value={formData.remark}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, remark: e.target.value }))
              }
              rows={4}
            />
          </div>

          <div>
            {error && (
              <div className="text-red-500 text-sm p-2 mb-2">
                {error}
              </div>
            )}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Save Damage Record'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
