/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { getActiveOrg } from '@/lib/auth'
import prisma from '@/prisma/db'
import { format } from 'date-fns'
import { after } from 'next/server'

export async function getInvoicesForSelect(search?: string) {
  try {
    const orgId = await getActiveOrg()
    const invoices = await prisma.invoice.findMany({
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
        Supplier: {
          select: {
            id: true,
            name: true,
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
          },
        },
      },
    })
    return invoices
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return []
  }
}

export async function getReturnNumber() {
  const orgId = await getActiveOrg()
  const count = await prisma.return.count({
    where: { orgId },
  })
  return `RET-${count + 1}-${format(new Date(), 'dd/MM/yyyy')}`
}

export async function createReturn(data: any) {
  try {
    const orgId = await getActiveOrg()
    const result = await prisma.return.create({
      data: {
        returnNo: data.returnNo,
        returnDate: new Date(data.returnDate),
        returnDueDate: new Date(data.returnDueDate),
        orgId,
        branceId: data.branceId,
        warehouseId: data.wareHouseId,
        supplierId: data.supplierId,
        remarks: data.remarks,
        invoiceId: data.invoiceId,
        ReturnItems: {
          createMany: {
            data: data.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              rate: item.rate,
              batch: item.batch,
              description: item.description,
            })),
          },
        },
      },
    })

    after(async () => {
      for (const item of data.items) {
        const existingStock = await prisma.stockItems.findFirst({
          where: {
            productId: item.productId,
            warehouseId: data.wareHouseId,
            orgId: orgId,
            batch: item.batch || ''
          }
        });

        if (existingStock) {
          const newQuantity = existingStock.quantity - item.quantity;
          if (newQuantity <= 0) {
            // Delete the stock item if quantity becomes 0 or negative
            await prisma.stockItems.delete({
              where: { id: existingStock.id }
            });
          } else {
            // Update with reduced quantity
            await prisma.stockItems.update({
              where: { id: existingStock.id },
              data: {
                quantity: newQuantity
              }
            });
          }
        }
      }
    });
    
    return result
  } catch (error: any) {
    console.error('Error creating return:', error)
    throw new Error(error.message || 'Failed to create return')
  }
}