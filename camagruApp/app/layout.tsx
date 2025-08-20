import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import NavbarWrapper from '@/components/navbar/NavbarWrapper'

export const metadata: Metadata = {
  title: 'Camagru',
  description: 'Instagram clone app',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body>
        <Providers>
          <NavbarWrapper />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
