/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { signIn, signUp, useSession } from '@/lib/authClient'

import { Loader } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { FormEvent, useEffect, useState } from 'react'

export default function LoginRegistrationPage() {
  const [activeTab, setActiveTab] = useState('login')
  const [registerData, setRegisterData] = useState<any>({})
  const [loginData, setLoginData] = useState<any>({ remem: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginError, setLoginError] = useState('')
  const { data } = useSession()
  const [success, setSuccess] = useState('')

  const { replace } = useRouter()
  useEffect(() => {
    if (data !== null) {
      replace('/')
    }
  }, [data, data?.session, replace])

  const _hendelRegister = async (e: FormEvent) => {
    e.preventDefault()
    await signUp.email(
      {
        email: registerData?.email,
        name: registerData?.name,
        password: registerData?.pass,
      },
      {
        onSuccess: () => {
          setActiveTab('login')
          setSuccess('Account created successfully, please login')
          setLoading(false)
        },
        onError: (v) => {
          setError(v.error.message)
          setLoading(false)
        },
        onRequest: () => {
          setError('')
          setLoading(true)
        },
      }
    )
  }

  const _hendelLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')
    const { error } = await signIn.email({
      email: loginData.email,
      password: loginData.pass,
      rememberMe: loginData.remem,
      callbackURL: '/',
    })
    if (error) {
      console.log(error)
      setLoginError(error?.message as string)
    }
    setLoading(false)
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center h-[98vh]">
      <Card className="w-full max-w-md  dark:text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to GCO
          </CardTitle>
          <CardDescription className="text-center">
            Login or create an account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={_hendelLogin}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      required
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <PasswordInput
                      id="login-password"
                      required
                      name="pass"
                      placeholder="Password"
                      onChange={(e) =>
                        setLoginData({ ...loginData, pass: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remem"
                      value={loginData.remem}
                      onCheckedChange={(v) =>
                        setLoginData({ ...loginData, remem: v })
                      }
                    />
                    <label
                      htmlFor="remem"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </label>
                  </div>
                  {loginError && (
                    <p className="text-red-500 text-sm">{loginError}</p>
                  )}
                  {success && (
                    <p className="text-green-500 text-sm">{success}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full hover:bg-opacity-30"
                    disabled={loading}
                  >
                    {loading ? <Loader className="animate-spin" /> : 'Log In'}
                  </Button>
                </div>
              </form>
              <div className="mt-4 text-center">
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={_hendelRegister}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      name="name"
                      placeholder="John Doe"
                      required
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="register-password">Password</Label>
                    <PasswordInput
                      name="pass"
                      id="register-password"
                      required
                      placeholder="Password"
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          pass: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-confirm-password">
                      Confirm Password
                    </Label>
                    <PasswordInput
                      name="repass"
                      id="register-confirm-password"
                      required
                      placeholder="Password"
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          conPass: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required name="trams" />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{' '}
                      <Link href="#" className="text-blue-600 hover:underline">
                        Terms and Conditions
                      </Link>
                    </label>
                  </div>
                  <p className="text-sm text-red-600">{error}</p>
                  <Button disabled={loading} type="submit" className="w-full">
                    {loading ? <Loader className="animate-spin" /> : 'Register'}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
