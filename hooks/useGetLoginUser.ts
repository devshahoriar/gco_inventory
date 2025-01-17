import { useSession } from '@/lib/authClient'

const useGetLoginUser = () => {
  const { data } = useSession()
  const user = data?.user
  return user
}

export default useGetLoginUser
