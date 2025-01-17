'use client'
import { Button, ButtonProps } from '../ui/button'
import { signOut } from '@/lib/authClient'
import { Slot } from '@radix-ui/react-slot'
import { useRouter } from 'next/navigation'

const SingOutButton = ({ children,asChild, ...props }: ButtonProps) => {
  const { refresh } = useRouter()
  const hendelSingOut = async () => {
    await signOut()
    refresh()
  }
  const Comp = asChild ? Slot : Button
  return (
    <Comp onClick={hendelSingOut} {...props}>
      {children}
    </Comp>
  )
}

export default SingOutButton
