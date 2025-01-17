/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAuthClient } from 'better-auth/react'

import {
  inferAdditionalFields,
  organizationClient,
} from 'better-auth/client/plugins'
import { auth } from './auth'
import { APP_URL } from './constant'

export const { signIn, signUp, useSession, getSession, signOut,organization } =
  createAuthClient({
    baseURL: APP_URL!,
    plugins: [inferAdditionalFields<typeof auth>(), organizationClient()],
  })

export const getUserPermissions = (data: any): string[] => {
  const p = data?.user?.permissions || data?.permissions
  if (!p) return []
  return p.split(',')
}

export const haveUserPermission = (data: any, permission: string) => {
  const userPermissions = getUserPermissions(data)
  return userPermissions.includes(permission)
}
