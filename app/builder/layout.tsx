import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume Builder - Create Professional CV | Profocto',
  description: 'Build your professional resume with Profocto\'s intuitive resume builder. Edit in real-time, choose from elegant templates, and export as PDF. Free online CV creator.',
  keywords: [
    'resume builder',
    'cv creator', 
    'online resume maker',
    'professional resume',
    'resume editor',
    'cv builder',
    'profocto builder',
    'resume templates',
    'pdf resume export'
  ],
  openGraph: {
    title: 'Professional Resume Builder | Create CVs Online - Profocto',
    description: 'Design your perfect resume with our powerful online builder. Real-time editing, professional templates, and instant PDF export.',
    url: 'https://profocto.tech/builder',
  },
  twitter: {
    title: 'Create Professional Resumes Online - Profocto Builder',
    description: 'Build stunning resumes with real-time editing and professional templates. Export as PDF instantly.',
  },
  alternates: {
    canonical: 'https://profocto.tech/builder',
  },
}

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}