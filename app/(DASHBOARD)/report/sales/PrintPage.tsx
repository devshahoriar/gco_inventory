/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns'

const PrintPage = ({ 
  data, 
  startDate, 
  endDate,
  branchId,
  branchName
}: { 
  data: any,
  startDate: Date | null,
  endDate: Date | null,
  branchId: string,
  branchName?: string
}) => {
  // If no data or dates are provided, don't render anything
  if (!data || !startDate || !endDate) return null

  // Format the display of date ranges
  const formattedStartDate = format(new Date(startDate), 'dd MMM yyyy')
  const formattedEndDate = format(new Date(endDate), 'dd MMM yyyy')

  // Calculate totals for the footer
  let totalAmount = 0
  let totalDiscount = 0
  let totalAmountAfterDiscount = 0
  let totalOtherAdjustments = 0 // This would need to be provided in the data
  let totalNetAmount = 0

  // Determine if we're viewing all branches or a specific branch
  const isAllBranches = branchId === "all"

  return (
    <div className='print:w-full p-4 print:p-4'>
      <h1 className="font-bold text-2xl text-center">Sales Register</h1>
      <p className='text-center'>
        {isAllBranches ? 'All Branches' : `Branch: ${branchName}`}
      </p>
      <p className='text-center'>From Date: {formattedStartDate} To Date: {formattedEndDate}</p>
      <p className='text-center text-sm'>Print Date: {format(new Date(),'dd MMM yyyy hh:mm bb')}</p>
      <table className="border border-gray-300 w-full mt-5">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-center">SL. No.</th>
            {isAllBranches && (
              <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-left">Branch</th>
            )}
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-left">Customer Name</th>
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-center">Invoice<br/>Date</th>
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-center">Invoice<br/>No</th>
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-left">Particulars</th>
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-center">Qty.</th>
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-right">Rate</th>
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-right">Amount</th>
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-right">Discount</th>
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-right">Total<br/>Amount</th>
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-right">Others<br/>Ad.</th>
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-right">Net Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((invoice: any, index: number) => {
            // For each invoice, map through its items
            return invoice.InvoiceItems.map((item: any, itemIndex: number) => {
              const amount = item.quantity * item.rate
              const discountAmount = item.discount ? (amount * item.discount) / 100 : 0
              const totalAfterDiscount = amount - discountAmount
              const otherAdjustments = 0 // This data needs to come from backend if available
              const netAmount = totalAfterDiscount + otherAdjustments

              // Accumulate totals
              totalAmount += amount
              totalDiscount += discountAmount
              totalAmountAfterDiscount += totalAfterDiscount
              totalOtherAdjustments += otherAdjustments
              totalNetAmount += netAmount

              return (
                <tr key={`${invoice.id}-${itemIndex}`} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                    {index * invoice.InvoiceItems.length + itemIndex + 1}
                  </td>
                  {isAllBranches && (
                    <td className="border border-gray-300 px-2 py-1 text-xs">
                      {itemIndex === 0 ? invoice.Branch?.name || 'N/A' : ''}
                    </td>
                  )}
                  <td className="border border-gray-300 px-2 py-1 text-xs">
                    {itemIndex === 0 ? invoice.Customers.name : ''}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                    {itemIndex === 0 ? format(new Date(invoice.invoiceDate), 'dd/MM/yyyy') : ''}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                    {itemIndex === 0 ? invoice.invoiceNo : ''}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-xs">
                    {item.product.name}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                    {item.quantity} {item.product.productUnit?.name || ''}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-xs text-right">
                    {item.rate.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-xs text-right">
                    {amount.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-xs text-right">
                    {discountAmount.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-xs text-right">
                    {totalAfterDiscount.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-xs text-right">
                    {otherAdjustments.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-xs text-right">
                    {netAmount.toFixed(2)}
                  </td>
                </tr>
              );
            });
          })}
          
          {data.length === 0 && (
            <tr>
              <td colSpan={isAllBranches ? 13 : 12} className="border border-gray-300 px-2 py-1 text-xs text-center">
                No data found
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100">
            <td colSpan={isAllBranches ? 8 : 7} className="border border-gray-300 px-2 py-1 text-xs font-bold text-right">Total:</td>
            <td className="border border-gray-300 px-2 py-1 text-xs font-bold text-right">{totalAmount.toFixed(2)}</td>
            <td className="border border-gray-300 px-2 py-1 text-xs font-bold text-right">{totalDiscount.toFixed(2)}</td>
            <td className="border border-gray-300 px-2 py-1 text-xs font-bold text-right">{totalAmountAfterDiscount.toFixed(2)}</td>
            <td className="border border-gray-300 px-2 py-1 text-xs font-bold text-right">{totalOtherAdjustments.toFixed(2)}</td>
            <td className="border border-gray-300 px-2 py-1 text-xs font-bold text-right">{totalNetAmount.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default PrintPage
