'use server'

import { cookies } from 'next/headers'

export const setActiveOrg = async (orgId: string) => {
  const co = await cookies()
  co.set('activeOrg', orgId, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
  })
}
