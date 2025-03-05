/* eslint-disable @next/next/no-img-element */
import { ContentLayout } from '@/components/admin-panel/content-layout'
import SelectMonthlyReport from './SelectMonthlyReport'

const MonthlyReport = () => {
  return (
    <ContentLayout title="Monthly Report">
      <SelectMonthlyReport />
    </ContentLayout>
  )
}

export default MonthlyReport
