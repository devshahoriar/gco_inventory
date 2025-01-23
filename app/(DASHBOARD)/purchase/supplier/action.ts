/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { SUPPLIER_TAG } from '@/lib/constant'
import prisma from '@/prisma/db'
import { revalidateTag, unstable_cache } from 'next/cache'



export const countSupplier = unstable_cache(
  async (organizationId: string) => {
    return prisma.supplier.count({
      where: {
        organizationId: organizationId,
      },
    })
  },
  undefined,
  {
    tags: [SUPPLIER_TAG],
  }
)

export const getAllSupplier = unstable_cache(
  async (organizationId: string) => {
    return prisma.supplier.findMany({
      where: {
        organizationId: organizationId,
      },
      omit: {
        organizationId: true,
      },
    })
  },
  undefined,
  {
    tags: [SUPPLIER_TAG],
  }
)

export const createSupplier = async (data: any) => {
  revalidateTag(SUPPLIER_TAG)
  try {
    const supplier = await prisma.supplier.create({
      data: {
        code: data.code,
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        note: data.note,
        organizationId: data.orgId,
      },
      select: {
        id: true,
      },
    })
    return { success: true, data: supplier }
  } catch (error) {
    console.log(error)
    throw new Error('server error')
  }
}

export const updateSupplier = async (id: string, data: any) => {
  revalidateTag(SUPPLIER_TAG)
  try {
    const supplier = await prisma.supplier.update({
      where: { id },
      data: {
        code: data.code,
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        note: data.note,
        status: data.status,
      },
    })
    return { success: true, data: supplier }
  } catch (error) {
    console.log(error)
    throw new Error('server error')
  }
}

export const deleteSupplier = async (id: string) => {
  revalidateTag(SUPPLIER_TAG)
  try {
    await prisma.supplier.delete({
      where: { id },
    })
    return { success: true }
  } catch (error) {
    console.log(error)
    throw new Error('server error')
  }
}
