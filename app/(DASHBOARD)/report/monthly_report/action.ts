'use server'

import { getActiveOrg } from '@/lib/auth'
import prisma from '@/prisma/db'
import { startOfMonth, endOfMonth } from 'date-fns'

export type MonthlyReportItem = {
  productId: string
  productName: string
  unit: string
  openingStock: number
  totalReceived: number
  totalStock: number
  totalSales: number
  returnValue: number
  salesProductValue: number
  totalDamaged: number
  damagedValue: number
  currentStock: number
  purchaseRate: number
  stockProductValue: number
}

export async function generateMonthlyReport(month: string, year: string): Promise<MonthlyReportItem[]> {
  const activeOrgId = await getActiveOrg()
  
  // Convert month name to month number (0-11)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const monthIndex = months.indexOf(month)
  
  if (monthIndex === -1) {
    throw new Error('Invalid month selected')
  }
  
  // Create date objects for start and end of selected month
  const selectedMonthStart = startOfMonth(new Date(parseInt(year), monthIndex))
  const selectedMonthEnd = endOfMonth(new Date(parseInt(year), monthIndex))
  
  // Get all products in the organization
  const products = await prisma.product.findMany({
    where: { organizationId: activeOrgId },
    include: {
      productUnit: true,
    },
  })

  const reportData: MonthlyReportItem[] = []

  for (const product of products) {
    try {
      // Calculate opening stock
      // This is the sum of all stock items before the start of the month MINUS
      // the sum of all sales before the start of the month PLUS
      // the sum of all returns before the start of the month MINUS
      // the sum of all damages before the start of the month
      
      // Find all stock items received before start of month
      const stockBeforeMonth = await prisma.stockItems.aggregate({
        where: {
          productId: product.id,
          orgId: activeOrgId,
          createdAt: { lt: selectedMonthStart },
        },
        _sum: {
          quantity: true,
        },
      })
      
      // Find all sales before start of month
      const salesBeforeMonth = await prisma.sealsInvoiceItems.aggregate({
        where: {
          productId: product.id,
          SalesInvoice: {
            orgId: activeOrgId,
            invoiceDate: { lt: selectedMonthStart },
          },
        },
        _sum: {
          quantity: true,
        },
      })
      
      // Find all returns before start of month
      const returnsBeforeMonth = await prisma.sealsReturnItems.aggregate({
        where: {
          productId: product.id,
          SealsReturn: {
            orgId: activeOrgId,
            returnDate: { lt: selectedMonthStart },
          },
        },
        _sum: {
          quentity: true,
        },
      })
      
      // Find all damages before start of month
      const damagesBeforeMonth = await prisma.damage.aggregate({
        where: {
          productId: product.id,
          orgId: activeOrgId,
          damageDate: { lt: selectedMonthStart },
        },
        _sum: {
          quantity: true,
        },
      })
      
      // Calculate opening stock
      const openingStock = 
        (stockBeforeMonth._sum.quantity || 0) - 
        (salesBeforeMonth._sum.quantity || 0) + 
        (returnsBeforeMonth._sum.quentity || 0) -
        (damagesBeforeMonth._sum.quantity || 0)
      
      // Calculate total received during the month
      const receivedInMonth = await prisma.stockItems.aggregate({
        where: {
          productId: product.id,
          orgId: activeOrgId,
          createdAt: { 
            gte: selectedMonthStart,
            lte: selectedMonthEnd 
          },
        },
        _sum: {
          quantity: true,
        },
      })
      
      // Get average purchase rate from stock items
      const purchaseRateData = await prisma.stockItems.findMany({
        where: {
          productId: product.id,
          orgId: activeOrgId,
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5, // Get recent stock items to calculate average purchase rate
        select: {
          rate: true,
          quantity: true
        }
      })
      
      // Calculate weighted average purchase rate
      let totalQuantity = 0
      let totalValue = 0
      purchaseRateData.forEach(item => {
        totalQuantity += item.quantity
        totalValue += item.quantity * item.rate
      })
      const purchaseRate = totalQuantity > 0 ? totalValue / totalQuantity : 0
      
      // Calculate sales during the month
      const salesInMonth = await prisma.sealsInvoiceItems.aggregate({
        where: {
          productId: product.id,
          SalesInvoice: {
            orgId: activeOrgId,
            invoiceDate: {
              gte: selectedMonthStart,
              lte: selectedMonthEnd
            },
          },
        },
        _sum: {
          quantity: true,
          rate: true,
        },
      })
      
      // Calculate returns during the month
      const returnsInMonth = await prisma.sealsReturnItems.aggregate({
        where: {
          productId: product.id,
          SealsReturn: {
            orgId: activeOrgId,
            returnDate: {
              gte: selectedMonthStart,
              lte: selectedMonthEnd
            },
          },
        },
        _sum: {
          quentity: true,
          rate: true,
        },
      })
      
      // Calculate damages during the month
      const damagesInMonth = await prisma.damage.aggregate({
        where: {
          productId: product.id,
          orgId: activeOrgId,
          damageDate: {
            gte: selectedMonthStart,
            lte: selectedMonthEnd
          },
        },
        _sum: {
          quantity: true,
          price: true,
        },
      })
      
      // Get values for each calculation
      const totalReceived = receivedInMonth._sum.quantity || 0
      const totalStock = openingStock + totalReceived
      const totalSales = salesInMonth._sum.quantity || 0
      const returnValue = (returnsInMonth._sum.quentity || 0) * (returnsInMonth._sum.rate || 0)
      const salesProductValue = (salesInMonth._sum.quantity || 0) * (salesInMonth._sum.rate || 0)
      const totalDamaged = damagesInMonth._sum.quantity || 0
      const damagedValue = damagesInMonth._sum.price || 0
      
      // Calculate current stock
      const currentStock = totalStock - totalSales + (returnsInMonth._sum.quentity || 0) - totalDamaged
      
      // Calculate stock value
      const stockProductValue = currentStock * purchaseRate
      
      // Add to report data if the product has any transactions or stock
      if (openingStock !== 0 || totalReceived !== 0 || totalSales !== 0 || currentStock !== 0) {
        reportData.push({
          productId: product.id,
          productName: product.name,
          unit: product.productUnit?.name || '',
          openingStock,
          totalReceived,
          totalStock,
          totalSales,
          returnValue,
          salesProductValue,
          totalDamaged,
          damagedValue,
          currentStock,
          purchaseRate,
          stockProductValue
        })
      }
    } catch (error) {
      console.error(`Error processing product ${product.id}:`, error)
      // Continue with next product instead of failing the entire report
    }
  }

  return reportData
}
