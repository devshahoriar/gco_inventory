/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { AsyncSelect } from '@/components/ui/async-select'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import DateInput from '@/components/ui/DateInput'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { getAllBrances, getPurches } from './action'
import PrintPage from './PrintPage'

interface FormData {
  branchId: string
  branchName?: string
  startDate: Date | null
  endDate: Date | null
}

const InputCard = () => {
  const [formData, setFormData] = useState<FormData>({
    branchId: '',
    branchName: '',
    startDate: null,
    endDate: null,
  })
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState<any>(null)
  const [error, setError] = useState('')

  const handleBranchChange = (value: string, item?: any) => {
    setFormData({
      ...formData,
      branchId: value,
      branchName: item?.name || '',
    })
  }

  const handleGenerateReport = async () => {
    setLoading(true)
    setError('')
    try {
      if (!formData.branchId || !formData.startDate || !formData.endDate) {
        setError('All fields are required!')
        setLoading(false)
        return
      }
      const data = await getPurches(
        formData.branchId,
        formData.startDate,
        formData.endDate
      )
      setReportData(data)
      setTimeout(() => {
        window.print()
      }, 500)
    } catch (ee) {
      console.log(ee)
      setError('Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex justify-center print:hidden">
        <Card className="w-full md:w-[500px]">
          <CardHeader>
            <CardTitle>Purchase Report</CardTitle>
            <CardDescription>
              Get your Purchase Report by branch and date range
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Select Branch</Label>
              <AsyncSelect
                placeholder="Select Branch"
                fetcher={getAllBrances as any}
                getOptionValue={(item: any) => item.id}
                getDisplayValue={(item) => item.name}
                renderOption={(item) => <>{item.name}</>}
                onChange={(value, item) => handleBranchChange(value, item)}
                value={formData.branchId}
              />
            </div>

            <div className="space-y-1">
              <Label>Start Date</Label>
              <DateInput
                className="w-full"
                value={formData.startDate || undefined}
                onChange={(date) =>
                  setFormData((prev) => ({ ...prev, startDate: date }))
                }
              />
            </div>

            <div className="space-y-1">
              <Label>End Date</Label>
              <DateInput
                className="w-full"
                value={formData.endDate || undefined}
                onChange={(date) =>
                  setFormData((prev) => ({ ...prev, endDate: date }))
                }
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleGenerateReport}
              disabled={
                loading ||
                !formData.branchId ||
                !formData.startDate ||
                !formData.endDate
              }
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="print:block hidden">
        <PrintPage 
          data={reportData} 
          startDate={formData.startDate}
          endDate={formData.endDate}
        />
      </div>
    </>
  )
}

export default InputCard
