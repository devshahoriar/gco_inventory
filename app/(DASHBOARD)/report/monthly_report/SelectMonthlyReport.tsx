'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { generateMonthlyReport, MonthlyReportItem } from './action'
import PrintView from './PrintView'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const SelectMonthlyReport = () => {
  const [month, setMonth] = useState<string>('')
  const [year, setYear] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState<MonthlyReportItem[]>([])
  const [isReportGenerated, setIsReportGenerated] = useState(false)

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) =>
    (currentYear - 2 + i).toString()
  )

  const handleMonthChange = (value: string) => {
    setMonth(value)
  }

  const handleYearChange = (value: string) => {
    setYear(value)
  }

  const generateReport = async () => {
    if (!month || !year) {
      toast.error('Please select both month and year')
      return
    }

    setLoading(true)
    try {
      const data = await generateMonthlyReport(month, year)
      setReportData(data)
      setIsReportGenerated(true)
      setTimeout(() => {
        window.print()
      }, 500)
    } catch (error) {
      console.error('Error generating report:', error)
      toast.error('Failed to generate report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex justify-center print:hidden">
        <Card className="w-full md:w-[500px]">
          <CardHeader>
            <CardTitle>Monthly Report</CardTitle>
            <CardDescription>
              Get your monthly sales and stock report.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="month" className="text-sm font-medium">
                  Select Month
                </label>
                <Select value={month} onValueChange={handleMonthChange}>
                  <SelectTrigger id="month" className="w-full">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="year" className="text-sm font-medium">
                  Select Year
                </label>
                <Select value={year} onValueChange={handleYearChange}>
                  <SelectTrigger id="year" className="w-full">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full"
                onClick={generateReport}
                disabled={loading || !month || !year}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Report'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {isReportGenerated && (
        <div className="print:block hidden">
          <PrintView data={reportData} month={month} year={year} />
        </div>
      )}
    </>
  )
}

export default SelectMonthlyReport
