/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { getActiveOrg } from '@/lib/auth'
import prisma from '@/prisma/db'

export const getCustomerNumber = async () => {
  const activOrg = await getActiveOrg()
  return prisma.customers.count({
    where: { orgId: activOrg },
  })
}

export const addCustomer = async (customer: any) => {
  try {
    const activOrg = await getActiveOrg()
    const newCustomer = await prisma.customers.create({
      data: {
        name: customer.name,
        customersType: customer.customersType,
        customerNumber: customer.customerNumber || '0',
        address: customer.address,
        mobile: customer.mobile,
        email: customer.email || '',
        note: customer.note || '',
        status: customer.status === 'true',
        Organization: {
          connect: {
            id: activOrg
          }
        }
      },
    })
    return newCustomer
  } catch (error: any) {
    console.log(error)
    throw new Error('Failed to create customer')
  }
}

export const updateCustomer = async (id: string, customer: any) => {
  try {
    const activOrg = await getActiveOrg()
    const updatedCustomer = await prisma.customers.update({
      where: { 
        id,
        orgId: activOrg 
      },
      data: {
        name: customer.name,
        customersType: customer.customersType,
        address: customer.address,
        mobile: customer.mobile,
        email: customer.email || '',
        note: customer.note || '',
        status: customer.status === 'true',
      },
    })
    return updatedCustomer
  } catch (error: any) {
    console.log(error)
    throw new Error('Failed to update customer')
  }
}

export const allCustomers = async () => {
  const activOrg = await getActiveOrg()
  return prisma.customers.findMany({
    where: { orgId: activOrg },
  })
}
