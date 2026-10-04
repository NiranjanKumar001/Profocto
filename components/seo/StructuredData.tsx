import Script from 'next/script';

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://profile-elegante.vercel.app/#webapp",
      "name": "Profocto - Profile Élegante",
      "alternateName": ["Profocto", "Profile Elegante", "Resume Builder"],
      "url": "https://profile-elegante.vercel.app",
      "description": "Professional resume builder and CV creator with elegant templates, real-time editing, and PDF export capabilities. Create stunning resumes online for free.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "featureList": [
        "Professional resume templates",
        "Real-time editing",
        "PDF export",
        "Google OAuth authentication",
        "Cloud storage",
        "Responsive design",
        "Drag and drop interface"
      ],
      "screenshot": "https://ik.imagekit.io/profocto/Screenshot%202025-09-29%20122924.png?updatedAt=1759129229692",
      "author": {
        "@type": "Organization",
        "name": "Profocto",
        "url": "https://profile-elegante.vercel.app"
      },
      "provider": {
        "@type": "Organization",
        "name": "Profocto",
        "url": "https://profile-elegante.vercel.app"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "150",
        "bestRating": "5",
        "worstRating": "1"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://profile-elegante.vercel.app/#organization",
      "name": "Profocto",
      "url": "https://profile-elegante.vercel.app",
      "logo": "https://profile-elegante.vercel.app/assets/logo.png",
      "description": "Profocto provides elegant and modern resume building tools to help professionals create stunning CVs and resumes online.",
      "foundingDate": "2025",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "url": "https://profile-elegante.vercel.app"
      },
      "sameAs": [
        "https://github.com/NiranjanKumar001/Profocto"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://profile-elegante.vercel.app/#website", 
      "url": "https://profile-elegante.vercel.app",
      "name": "Profocto - Profile Élegante Resume Builder",
      "description": "Create professional resumes and CVs with our elegant, modern resume builder. Free online tool with beautiful templates and real-time editing.",
      "publisher": {
        "@id": "https://profile-elegante.vercel.app/#organization"
      },
      "potentialAction": [
        {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://profile-elegante.vercel.app/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      ],
      "inLanguage": "en-US"
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://profile-elegante.vercel.app/#software",
      "name": "Profocto Resume Builder",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Any",
      "url": "https://profile-elegante.vercel.app",
      "description": "Free online resume builder with professional templates, real-time editing, and PDF export. Create elegant CVs and resumes in minutes.",
      "softwareVersion": "0.3.0",
      "datePublished": "2025-09-29",
      "downloadUrl": "https://profile-elegante.vercel.app",
      "screenshot": "https://ik.imagekit.io/profocto/Screenshot%202025-09-29%20122924.png?updatedAt=1759129229692",
      "author": {
        "@id": "https://profile-elegante.vercel.app/#organization"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  ]
};

export default function StructuredData() {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}