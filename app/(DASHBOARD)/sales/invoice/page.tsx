/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { PageLeftComponent, PageTopBar } from '@/components/shared/PageElement'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getActiveOrg } from '@/lib/auth'
import { format } from 'date-fns'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { getAllSalesInvoices } from './action'

const InvoicePage = async () => {
  const activeOrg = await getActiveOrg()
  const allInvoices = await getAllSalesInvoices(activeOrg)

  // Calculate total amount for each invoice
  const calculateTotal = (items: any[]) => {
    return items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.rate
      const discountAmount = (itemTotal * (item.discount || 0)) / 100
      return sum + (itemTotal - discountAmount)
    }, 0)
  }

  return (
    <ContentLayout title="Sales Invoice">
      <PageTopBar>
        <PageLeftComponent title="Sales Invoices" length={allInvoices?.length} />
        <Button variant="outline" asChild>
          <Link href="/sales/invoice/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Sales Invoice
          </Link>
        </Button>
      </PageTopBar>

      <div className="mt-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Shipping Address</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allInvoices?.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.invoiceNo}</TableCell>
                <TableCell>
                  {format(invoice.invoiceDate, 'dd-MM-yyyy')}
                </TableCell>
                <TableCell>{invoice.Customers?.name || 'N/A'}</TableCell>
                <TableCell>{invoice.Warehouse?.name || 'N/A'}</TableCell>
                <TableCell>{invoice.address}</TableCell>
                <TableCell className="text-right">
                  ৳{calculateTotal(invoice.InvoiceItems).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ContentLayout>
  )
}

export default InvoicePage
