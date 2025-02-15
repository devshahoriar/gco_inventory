/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import prisma from '@/prisma/db'



export const countSupplier = 
  async (organizationId: string) => {
    return prisma.supplier.count({
      where: {
        organizationId: organizationId,
      },
    })
  }

export const getAllSupplier = 
  async (organizationId: string) => {
    return prisma.supplier.findMany({
      where: {
        organizationId: organizationId,
      },
      omit: {
        organizationId: true,
      },
    })
  }

export const createSupplier = async (data: any) => {
  
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
