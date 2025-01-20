'use server'
import { getUser } from '@/lib/auth'
import prisma from '@/prisma/db'
import { headers } from 'next/headers'

export const getInitialData = async () => {
  const user = await getUser(headers)
  const [regList, branchList, supliyaerList, wareHouseList] = await Promise.all(
    [
      prisma.requisition.findMany({
        where: {
          organizationId: user?.activeOrganizationId,
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
          organizationId: user?.activeOrganizationId,
        },
        select: {
          id: true,
          name: true,
        },
      }),
      prisma.supplier.findMany({
        where: {
          organizationId: user?.activeOrganizationId,
        },
        select: {
          id: true,
          name: true,
        },
      }),
      prisma.warehouse.findMany({
        where: {
          organizationId: user?.activeOrganizationId,
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
