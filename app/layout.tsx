import type React from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'
import { cn } from '@/lib/utils'

export const metadata = {
  title: '시니어 서비스',
  description: '시니어를 위한 종합 서비스 플랫폼',
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
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard-dynamic-subset.css"
        />
      </head>
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem={false}
        >
          <main className={cn('min-h-screen bg-background font-sans antialiased')}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'
