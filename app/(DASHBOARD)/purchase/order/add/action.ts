'use server'
import { getActiveOrg } from '@/lib/auth'
import prisma from '@/prisma/db'

export const getInitialData = async () => {
  const orgId = await getActiveOrg()
  const [regList, branchList, supliyaerList, wareHouseList] = await Promise.all(
    [
      prisma.requisition.findMany({
        where: {
          organizationId: orgId,
        },
        select: {
          id: true,
          regNumber: true,
          _count: {
            select: {
              reqItems: true,
            },
          },
        },
      }),
      prisma.branch.findMany({
        where: {
          organizationId: orgId,
        },
        select: {
          id: true,
          name: true,
        },
      }),
      prisma.supplier.findMany({
        where: {
          organizationId: orgId,
        },
        select: {
          id: true,
          name: true,
        },
      }),
      prisma.warehouse.findMany({
        where: {
          organizationId: orgId,
        },
        select: {
          id: true,
          name: true,
        },
      }),
    ]
  )
  return { regList, branchList, supliyaerList, wareHouseList }
}

export const getPreRequisition = async (id: string) => {
  const req = await prisma.requisition.findUnique({
    where: { id },
    select: {
      reqDate: true,
      reqItems: {
        select: {
          quantity: true,
          product: {
            select: {
              name: true,
              id: true,
              ProductGroup: {
                select: {
                  id: true,
                  name: true,
                },
              },
              productUnit: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  })
  return req
}
