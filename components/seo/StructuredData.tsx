import Script from 'next/script';

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://profocto.tech/#webapp",
      "name": "Profocto - Profile Élegante",
      "alternateName": ["Profocto", "Profile Elegante", "Resume Builder"],
      "url": "https://profocto.tech",
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
        "url": "https://profocto.tech"
      },
      "provider": {
        "@type": "Organization",
        "name": "Profocto",
        "url": "https://profocto.tech"
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
      "@id": "https://profocto.tech/#organization",
      "name": "Profocto",
      "url": "https://profocto.tech",
      "logo": "https://profocto.tech/assets/logo.png",
      "description": "Profocto provides elegant and modern resume building tools to help professionals create stunning CVs and resumes online.",
      "foundingDate": "2025",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "url": "https://profocto.tech"
      },
      "sameAs": [
        "https://github.com/NiranjanKumar001/Profocto"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://profocto.tech/#website", 
      "url": "https://profocto.tech",
      "name": "Profocto - Profile Élegante Resume Builder",
      "description": "Create professional resumes and CVs with our elegant, modern resume builder. Free online tool with beautiful templates and real-time editing.",
      "publisher": {
        "@id": "https://profocto.tech/#organization"
      },
      "potentialAction": [
        {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://profocto.tech/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      ],
      "inLanguage": "en-US"
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://profocto.tech/#software",
      "name": "Profocto Resume Builder",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Any",
      "url": "https://profocto.tech",
      "description": "Free online resume builder with professional templates, real-time editing, and PDF export. Create elegant CVs and resumes in minutes.",
      "softwareVersion": "0.3.0",
      "datePublished": "2025-09-29",
      "downloadUrl": "https://profocto.tech",
      "screenshot": "https://ik.imagekit.io/profocto/Screenshot%202025-09-29%20122924.png?updatedAt=1759129229692",
      "author": {
        "@id": "https://profocto.tech/#organization"
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