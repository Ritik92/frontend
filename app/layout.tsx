// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from './AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ping Notification System',
  description: 'Real-time ping notification system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}