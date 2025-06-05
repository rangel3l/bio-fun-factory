import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BioCiência Interativa',
  description: 'Material didático interativo para o ensino de biologia',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={`${inter.className} bg-gradient-to-b from-green-50 to-white min-h-screen relative pb-16`}>
        {children}
      </body>
    </html>
  )
}

