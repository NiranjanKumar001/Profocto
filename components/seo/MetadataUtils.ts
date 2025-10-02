import { Metadata } from 'next'

export function generateResumeBuilderMetadata(resumeName?: string): Metadata {
  const title = resumeName 
    ? `Edit ${resumeName} - Resume Builder | Profocto`
    : 'Resume Builder - Create Professional CV | Profocto'
    
  const description = resumeName
    ? `Edit and customize your ${resumeName} resume with Profocto's professional resume builder. Real-time editing, elegant templates, and instant PDF export.`
    : 'Build your professional resume with Profocto\'s intuitive resume builder. Choose from elegant templates, customize with drag-and-drop editing, and export as PDF.'

  return {
    title,
    description,
    keywords: [
      'resume builder',
      'cv editor',
      'professional resume',
      'resume maker',
      'online cv creator',
      'profocto',
      'resume templates',
      'pdf export',
      'real-time editing'
    ],
    openGraph: {
      title,
      description,
      url: 'https://profocto.tech/builder',
      type: 'website',
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export function generateTemplateMetadata(templateName?: string): Metadata {
  const title = templateName
    ? `${templateName} Template - Professional Resume Design | Profocto`
    : 'Resume Templates - Professional CV Designs | Profocto'
    
  const description = templateName
    ? `Use the ${templateName} resume template to create a professional CV. Modern design, ATS-friendly format, fully customizable with Profocto's resume builder.`
    : 'Browse our collection of professional resume templates. Modern, elegant designs perfect for any industry. Choose your favorite template and customize it.'

  return {
    title,
    description,
    keywords: [
      'resume templates',
      'cv templates',
      'professional resume design',
      templateName || 'resume template',
      'modern resume',
      'ats friendly',
      'profocto templates',
      'free resume template'
    ],
    openGraph: {
      title,
      description,
      url: 'https://profocto.tech/templates',
      type: 'website',
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
    },
  }
}