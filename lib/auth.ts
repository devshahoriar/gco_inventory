/* eslint-disable @typescript-eslint/no-explicit-any */
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { organization } from 'better-auth/plugins'
import { headers } from 'next/headers'
import { cache } from 'react'
import { getSession } from './authClient'
import prisma from '@/prisma/db'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mysql',
  }),
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
      let orgId = data?.session?.activeOrganizationId
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
