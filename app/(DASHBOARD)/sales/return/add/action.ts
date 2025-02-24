/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { getActiveOrg } from '@/lib/auth'
import prisma from '@/prisma/db'
import { format } from 'date-fns'
import { after } from 'next/server'

export async function getReturnNumber() {
  const orgId = await getActiveOrg()
  const count = await prisma.sealsReturn.count({
    where: { orgId },
  })
  return `SRET-${count + 1}-${format(new Date(), 'dd/MM/yyyy')}`
}

export async function getSalesInvoicesForSelect(search?: string) {
  try {
    const orgId = await getActiveOrg()
    const invoices = await prisma.salesInvoice.findMany({
      where: {
        orgId,
        invoiceNo: {
          contains: search,
        },
      },
      select: {
        id: true,
        invoiceNo: true,
        Branch: {
          select: {
            id: true,
            name: true,
          },
        },
        Warehouse: {
          select: {
            id: true,
            name: true,
          },
        },
        Customers: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        InvoiceItems: {
          select: {
            productId: true,
            product: {
              select: {
                name: true,
              },
            },
            quantity: true,
            rate: true,
            unit: true,
          },
        },
        customerLedger: true,
        salesledger: true,
      },
    })
    return invoices
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return []
  }
}

export async function createSealsReturn(data: any) {
  try {
    const orgId = await getActiveOrg()
    const result = await prisma.sealsReturn.create({
      data: {
        returnNo: data.returnNo,
        returnDate: new Date(data.returnDate),
        dueDate: new Date(data.dueDate),
        invoiceId: data.invoiceId,
        branceId: data.branceId,
        warehouseId: data.wareHouseId,
        customerId: data.customerId,
        address: data.address || '',
        customerLedger: data.customerLedger,
        salesLadger: data.salesLadger,
        remark: data.remark,
        orgId,
        SealsReturnItems: {
          createMany: {
            data: data.items.map((item: any) => ({
              productId: item.productId,
              quentity: item.quantity,
              rate: item.rate,
            })),
          },
        },
      },
    })

    // Update stock after return creation
    after(async () => {
      for (const item of data.items) {
        const existingStock = await prisma.stockItems.findFirst({
          where: {
            productId: item.productId,
            warehouseId: data.wareHouseId,
            orgId,
          },
        })

        if (existingStock) {
          const newQuantity = existingStock.quantity + item.quantity
          await prisma.stockItems.update({
            where: { id: existingStock.id },
            data: { quantity: newQuantity }
          })
        } else {
          await prisma.stockItems.create({
            data: {
              productId: item.productId,
              quantity: item.quantity,
              rate: item.rate,
              warehouseId: data.wareHouseId,
              orgId,
              batch: '',
              description: '',
              discount: 0,
            }
          })
        }
      }
    })

    return result
  } catch (error: any) {
    console.error('Error creating sales return:', error)
    throw new Error(error.message || 'Failed to create sales return')
  }
}