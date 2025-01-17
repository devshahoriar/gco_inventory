'use server'

import { getUser } from "@/lib/auth"
import prisma from "@/prisma/db"
import { headers } from "next/headers"

export const getProductGroup = async () => {
  const user = await getUser(headers)
  return await prisma.productGroup.findMany({
    where: {
      organizationId: user?.activeOrganizationId,
    },
    omit: {
      description: true,
      organizationId: true,
      group: true,
    },
  })
}

export const getProductForSelect = async (guId: string) => {
  console.log(guId)
  const user = await getUser(headers)
  return await prisma.product.findMany({
    where: {
      productGroupId: guId,
      organizationId: user?.activeOrganizationId,
    },
    select: {
      id: true,
      name: true,
      productUnit: {
        select: {
          id: true,
          name: true,
          unit: true,
        },
      },
    },
  })
}
