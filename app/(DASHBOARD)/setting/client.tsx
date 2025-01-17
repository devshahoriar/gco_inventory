/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useTheme } from 'next-themes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Moon, Sun, Monitor } from 'lucide-react'

const ThemeItem = ({ theme, icon: Icon, title, current, onClick }: any) => (
  <div
    onClick={() => onClick(theme)}
    className={`relative cursor-pointer rounded-lg border-2 p-4 hover:border-primary transition-all
      ${current === theme ? 'border-primary' : 'border-muted'}
    `}
  >
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-md ${current === theme ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">
          {theme === 'system' ? 'System preference' : `${title} mode`}
        </p>
      </div>
    </div>
  </div>
)

export const SettingClient = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className='w-full'>
          <div className="space-y-4">
            <h3 className="text-sm font-medium leading-none">Theme Preference</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <ThemeItem
                theme="light"
                icon={Sun}
                title="Light"
                current={theme}
                onClick={setTheme}
              />
              <ThemeItem
                theme="dark"
                icon={Moon}
                title="Dark"
                current={theme}
                onClick={setTheme}
              />
              <ThemeItem
                theme="system"
                icon={Monitor}
                title="System"
                current={theme}
                onClick={setTheme}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

