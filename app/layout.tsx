import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Toaster } from 'react-hot-toast';
import Header from "@/components/ui/Header";

export const metadata: Metadata = {
  title: 'Profile Élegante',
  description: 'ELEGANT AND MODERN RESUME BUILDER',
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      {/* Add padding-top so content doesn’t overlap fixed header */}
      <body suppressHydrationWarning={true} className="pt-16">
        <AuthProvider>
          {/* Add the Header above children */}
          <Header />
          {children}
        </AuthProvider>
        <Toaster position="bottom-center" /> {/* Toast notifications */}
      </body>
    </html>
  )
}
