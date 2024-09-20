"use client"
// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import './globals.css'
import MainNav from '../components/nav/main'
import { Toaster } from '@/components/ui/toaster'
import { Suspense } from 'react'
const fontHeading = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const defaultQuery = async ({ queryKey }: { queryKey: any }) => {
  const apiURL = "http://localhost:8000/"
  const response = await fetch(apiURL + queryKey[0])
  return response.json()
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQuery
    }
  }
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <body
          className={cn(
            'antialiased',
            fontHeading.variable,
            fontBody.variable
          )}
        >

          <MainNav />
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
          <Toaster />
        </body>
      </html>
    </QueryClientProvider>
  )
}