/* eslint-disable @next/next/no-img-element */
import { format } from 'date-fns'
import { MonthlyReportItem } from './action'

interface PrintViewProps {
  data: MonthlyReportItem[]
  month: string
  year: string
}

const PrintView: React.FC<PrintViewProps> = ({ data, month, year }) => {
  // Calculate totals for the report footer
  const totals = data.reduce(
    (acc, item) => {
      return {
        openingStock: acc.openingStock + item.openingStock,
        totalReceived: acc.totalReceived + item.totalReceived,
        totalStock: acc.totalStock + item.totalStock,
        totalSales: acc.totalSales + item.totalSales,
        returnValue: acc.returnValue + item.returnValue,
        salesProductValue: acc.salesProductValue + item.salesProductValue,
        totalDamaged: acc.totalDamaged + item.totalDamaged,
        damagedValue: acc.damagedValue + item.damagedValue,
        currentStock: acc.currentStock + item.currentStock,
        stockProductValue: acc.stockProductValue + item.stockProductValue,
      }
    },
    {
      openingStock: 0,
      totalReceived: 0,
      totalStock: 0,
      totalSales: 0,
      returnValue: 0,
      salesProductValue: 0,
      totalDamaged: 0,
      damagedValue: 0,
      currentStock: 0,
      stockProductValue: 0,
    }
  )

  // Get the month index from the month name (0-11)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const monthIndex = months.indexOf(month)
  
  // Format the first day of the selected month

  const firstDayOfMonth = format(new Date(parseInt(year), monthIndex, 1), 'dd MMM yy')

  return (
    <div className="pt-5 mx-2">
      <div className="relative">
        <img
          className="object-contain size-20 absolute top-0 left-0"
          src="/logo.png"
          alt="Report"
        />
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">
            GLOBAL COMMUNITY ORGANIZATION
          </h1>
          <p className="text-sm">
            Hasan Nagar, Kamrangirchar, Dhaka-1211, +8801715343484
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-9 font-bold">
        <p>Monthly Sales & Stock Report</p>
        <p>Month of {month}-{year.substring(2)}</p>
      </div>

      <div>
        <style>
          {`
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th {
              border: 1px solid #ddd;
              padding: 8px;
              font-size: 11px;
            }
            td {
              border: 1px solid #ddd;
              padding: 8px;
              font-size: 11px;
            }
          `}
        </style>

        <table className="w-full mt-5 text-center text-xs">
          <thead>
            <tr className="font-semibold">
              <th className="">SL. No.</th>
              <th className="">Product Name</th>
              <th className="">Unit</th>
              <th className="">Opening Stock<br/>{firstDayOfMonth}</th>
              <th className="">Total Rcv<br/>Quantity</th>
              <th className="">Total<br/>Stock</th>
              <th className="">Total<br/>Sales</th>
              <th className="">Return<br/>Value</th>
              <th className="">Sales Product<br/>Value</th>
              <th className="">Total<br/>Damaged</th>
              <th className="">Damaged<br/>Value</th>
              <th className="">Current<br/>Stock</th>
              <th className="">Purchase<br/>Rate</th>
              <th className="">Stock Product<br/>Value</th>
            </tr>
          </thead>
          <tbody className="font-normal">
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item.productId}>
                  <td>{index + 1}</td>
                  <td className="text-left">{item.productName}</td>
                  <td>{item.unit}</td>
                  <td>{item.openingStock.toFixed(2)}</td>
                  <td>{item.totalReceived.toFixed(2)}</td>
                  <td>{item.totalStock.toFixed(2)}</td>
                  <td>{item.totalSales.toFixed(2)}</td>
                  <td>{item.returnValue.toFixed(2)}</td>
                  <td>{item.salesProductValue.toFixed(2)}</td>
                  <td>{item.totalDamaged.toFixed(2)}</td>
                  <td>{item.damagedValue.toFixed(2)}</td>
                  <td>{item.currentStock.toFixed(2)}</td>
                  <td>{item.purchaseRate.toFixed(2)}</td>
                  <td>{item.stockProductValue.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={14} className="py-4">No data available for the selected period</td>
              </tr>
            )}
          </tbody>
          {data.length > 0 && (
            <tfoot>
              <tr className="font-bold">
                <td colSpan={3} className="text-right">Total:</td>
                <td>{totals.openingStock.toFixed(2)}</td>
                <td>{totals.totalReceived.toFixed(2)}</td>
                <td>{totals.totalStock.toFixed(2)}</td>
                <td>{totals.totalSales.toFixed(2)}</td>
                <td>{totals.returnValue.toFixed(2)}</td>
                <td>{totals.salesProductValue.toFixed(2)}</td>
                <td>{totals.totalDamaged.toFixed(2)}</td>
                <td>{totals.damagedValue.toFixed(2)}</td>
                <td>{totals.currentStock.toFixed(2)}</td>
                <td>-</td>
                <td>{totals.stockProductValue.toFixed(2)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      
    </div>
  )
}

export default PrintView
