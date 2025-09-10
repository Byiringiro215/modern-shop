'use client'
import './globals.css'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import Footer from './components/Footer'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { CartProvider } from './context/CartContext'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

 const metadata = {
  title: 'ModernShop - Your Online Store',
  description: 'Discover amazing products at unbeatable prices',
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
      },
    },
  }))

  const pathname=usePathname()
  const isLoginPage=pathname === '/login'
  const isSignupPage=pathname === '/register'

  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          
          {
            !isLoginPage && !isSignupPage ? (
              <Header />
            ) : (
              <></>
            )
          }
         
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        
        
        </QueryClientProvider>
       
      </body>
    </html>
  )
}
