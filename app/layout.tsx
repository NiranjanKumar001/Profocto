import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Toaster } from 'react-hot-toast';
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

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
      {/* Flex column layout to keep footer at bottom */}
      <body suppressHydrationWarning={true} className="pt-16 flex flex-col min-h-screen">
        <AuthProvider>
          {/* Header at the top */}
          <Header />
          
          {/* Main content grows to fill space */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer at the bottom */}
          <Footer />
        </AuthProvider>

        {/* Toast notifications */}
        <Toaster position="bottom-center" />
      </body>
    </html>
  )
}
