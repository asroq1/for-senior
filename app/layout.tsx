import type React from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'AI 손주',
  description: '시니어를 위한 노인 돌봄 특화 AI 스피커 AI SONJU',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <head>
        <link
          rel='stylesheet'
          as='style'
          href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard-dynamic-subset.css'
        />
      </head>
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem={false}
        >
          <main
            className={cn('min-h-screen bg-background font-sans antialiased')}
          >
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'
