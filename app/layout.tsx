import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'TRIAGE Research Lab',
    template: '%s — TRIAGE Research Lab',
  },
  description:
    'Platform Riset Kolaborasi Manusia–AI dalam Manajemen Keluhan Pasien Rumah Sakit. Tesis Magister Manajemen Rumah Sakit.',
  keywords: [
    'triage',
    'AI',
    'rumah sakit',
    'penelitian',
    'manajemen keluhan pasien',
    'human-in-the-loop',
  ],
  authors: [{ name: 'TRIAGE Research Team' }],
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning className={inter.variable}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
