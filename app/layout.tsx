import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Toaster } from 'react-hot-toast';
import StructuredData from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Profocto - Profile Élegante | Modern Resume Builder & CV Creator',
  description: 'Create stunning professional resumes with Profocto\'s Profile Élegante. Free online resume builder with elegant templates, real-time editing, and PDF export. Build your perfect CV in minutes.',
  keywords: [
    'profocto',
    'profile elegante', 
    'resume builder',
    'cv creator',
    'online resume maker',
    'professional resume',
    'free resume builder',
    'resume templates',
    'cv templates',
    'elegant resume',
    'modern resume',
    'resume generator',
    'job application',
    'career tools'
  ],
  authors: [{ name: 'Profocto Team', url: 'https://profocto.tech' }],
  creator: 'Profocto',
  publisher: 'Profocto',
  metadataBase: new URL('https://profocto.tech'),
  alternates: {
    canonical: 'https://profocto.tech',
  },
  icons: {
    icon: '/assets/1.png',
    shortcut: '/assets/1.png',
    apple: '/assets/1.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://profocto.tech',
    title: 'Profocto - Professional Resume Builder | Create Elegant CVs Online',
    description: 'Design beautiful, professional resumes with Profocto\'s intuitive resume builder. Choose from elegant templates, edit in real-time, and export as PDF. Free online CV creator.',
    siteName: 'Profocto',
    images: [
      {
        url: 'https://ik.imagekit.io/profocto/Screenshot%202025-09-29%20122924.png?updatedAt=1759129229692',
        width: 1200,
        height: 630,
        alt: 'Profocto - Modern Resume Builder Interface',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Profocto - Create Professional Resumes Online',
    description: 'Build stunning resumes with our elegant, modern resume builder. Free templates, real-time editing, PDF export.',
    images: ['https://ik.imagekit.io/profocto/Screenshot%202025-09-29%20122924.png?updatedAt=1759129229692'],
    creator: '@profocto',
    site: '@profocto',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
  classification: 'Business Tools',
  verification: {
    // Add your Google Search Console verification code here
    // google: 'your-google-verification-code',
  },
  other: {
    'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
    'theme-color': '#ec4899',
  },
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body suppressHydrationWarning={true}>
        {/* Skip to content link for keyboard navigation */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-pink-500 focus:text-white focus:rounded"
        >
          Skip to content
        </a>
        <AuthProvider>
          <main id="main-content">
            {children}
          </main>
        </AuthProvider>
        <Toaster position="bottom-center" /> 
      </body>
    </html>
  )
}
