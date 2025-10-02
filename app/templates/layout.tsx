import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume Templates - Professional CV Designs | Profocto',
  description: 'Browse our collection of professional resume templates. Choose from modern, elegant designs optimized for ATS systems. Free resume templates for all industries.',
  keywords: [
    'resume templates',
    'cv templates',
    'professional resume designs',
    'free resume templates',
    'modern resume layouts',
    'ats friendly templates',
    'resume formats',
    'profocto templates',
    'elegant cv designs'
  ],
  openGraph: {
    title: 'Professional Resume Templates | Choose Your Perfect Design - Profocto',
    description: 'Discover beautiful, ATS-friendly resume templates. Professional designs for every industry and career level.',
    url: 'https://profocto.tech/templates',
  },
  twitter: {
    title: 'Professional Resume Templates - Profocto',
    description: 'Browse elegant, modern resume templates designed for success. ATS-friendly and professionally crafted.',
  },
  alternates: {
    canonical: 'https://profocto.tech/templates',
  },
}

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}