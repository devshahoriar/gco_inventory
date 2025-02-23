/* eslint-disable @typescript-eslint/no-explicit-any */
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { organization } from 'better-auth/plugins'
import { cookies, headers } from 'next/headers'
import { cache } from 'react'
import { getSession } from './authClient'
import prisma from '@/prisma/db'
import { SecondaryStorage } from './secondaryStorage'

const secondaryStorageInstance = new SecondaryStorage();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mysql',
  }),
  secondaryStorage: {
    get: async (key) => secondaryStorageInstance.get(key),
    set: async (key, value, ttl) => secondaryStorageInstance.set(key, value, ttl),
    delete: async (key) => secondaryStorageInstance.delete(key)
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },

  plugins: [organization({})],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24,
    },
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,

    additionalFields: {
      createdAt: {
        type: 'date',
        returned: false,
      },
      updatedAt: {
        type: 'date',
        returned: false,
        required: false,
      },
      userAgent: {
        type: 'string',
        returned: false,
        required: false,
      },
    },
  },
  advanced: {
    cookies: {
      session_token: {
        name: 'token',
      },
    },
  },
  user: {
    additionalFields: {
      active: {
        type: 'boolean',
        required: false,
        defaultValue: true,
        returned: true,
      },
      createdAt: {
        type: 'date',
        returned: false,
        required: false,
      },
      updatedAt: {
        type: 'date',
        returned: false,
        required: false,
      },
      emailVerified: {
        type: 'boolean',
        returned: false,
        required: false,
      },
    },
  },
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL!],
  baseURL: process.env.NEXT_PUBLIC_APP_URL!,
})

export interface UserType {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  permissions: string
  active: boolean
  activeOrganizationId: string
}

export const getUser = cache(
  async (header: typeof headers): Promise<UserType | null> => {
    const { data } = (await getSession({
      fetchOptions: {
        headers: await header(),
      },
    })) as any
    if (data?.user) {
      const co = await cookies()

      let orgId =
        co.get('activeOrg')?.value || data?.session?.activeOrganizationId
      if (!orgId) {
        const org = await prisma.organization.findFirst({
          where: {
            members: {
              some: {
                userId: data?.user?.id,
              },
            },
          },
          select: {
            id: true,
          },
        })
        orgId = org?.id ? org.id : null
      }
      const user = {
        ...data?.user,
        activeOrganizationId: orgId,
      }
      delete user.createdAt
      delete user.updatedAt
      return user
    }
    return null
  }
)

export const getActiveOrg = async () => {
  const co = await cookies()
  let orgId = co.get('activeOrg')?.value
  if (!orgId) {
    const user = await getUser(headers)
    orgId = user?.activeOrganizationId
  }
  if (!orgId) {
    throw new Error('No active organization found')
  }
  return orgId as string
}

export const setActiveOrg = async (orgId: string) => {
  const co = await cookies()
  co.set('activeOrg', orgId, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
  })
}
