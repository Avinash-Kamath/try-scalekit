import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Try Scalekit',
  description: 'Experience Scalekit\'s Gmail integration platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/faviconV2.png" />
        <link rel="shortcut icon" type="image/png" href="/faviconV2.png" />
        <link rel="apple-touch-icon" href="/faviconV2.png" />
        <meta name="msapplication-TileImage" content="/faviconV2.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
