/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'
// import { useReactToPrint } from 'react-to-print'

const ViewSealsChallan = ({ data }: { data: any }) => {
  const componentRef = useRef(null)
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  // })

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/sales/challan">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Challans
          </Link>
        </Button>
        {/* <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print Challan
        </Button> */}
      </div>

      <div ref={componentRef} className="space-y-4 p-4">
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl font-bold">DELIVERY CHALLAN</h1>
          <p className="text-muted-foreground">
            Challan No: {data.salessChallanNo}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <span className="font-semibold">Name:</span> {data.Customers.name}
              </p>
              <p>
                <span className="font-semibold">Contact Person:</span>{' '}
                {data.contractPerson}
              </p>
              <p>
                <span className="font-semibold">Designation:</span>{' '}
                {data.designation}
              </p>
              <p>
                <span className="font-semibold">Contact:</span>{' '}
                {data.contactNumber}
              </p>
              <p>
                <span className="font-semibold">Address:</span> {data.addreess}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Challan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <span className="font-semibold">Challan Date:</span>{' '}
                {format(new Date(data.clallanDate), 'PP')}
              </p>
              <p>
                <span className="font-semibold">Due Date:</span>{' '}
                {format(new Date(data.dueDate), 'PP')}
              </p>
              <p>
                <span className="font-semibold">PO Number:</span> {data.poNo}
              </p>
              <p>
                <span className="font-semibold">PO Date:</span>{' '}
                {format(new Date(data.poDate), 'PP')}
              </p>
              <p>
                <span className="font-semibold">Sales Order:</span>{' '}
                {data.SealsOrder.orderNo}
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>
                    <span className="font-semibold">Driver Name:</span>{' '}
                    {data.driverName}
                  </p>
                  <p>
                    <span className="font-semibold">Driver Mobile:</span>{' '}
                    {data.driverMobile}
                  </p>
                  <p>
                    <span className="font-semibold">Transport Mode:</span>{' '}
                    {data.transotMode}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-semibold">Vehicle Number:</span>{' '}
                    {data.vehicleNo}
                  </p>
                  <p>
                    <span className="font-semibold">Place of Delivery:</span>{' '}
                    {data.placesOfDelivery}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Items</CardTitle>
              <CardDescription>
                Total Items: {data.sealsChallanItems.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Alter Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.sealsChallanItems.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.product.productUnit.unit}</TableCell>
                      <TableCell>{item.alterUnit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {data.remark && (
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Remarks</CardTitle>
              </CardHeader>
              <CardContent>{data.remark}</CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewSealsChallan
