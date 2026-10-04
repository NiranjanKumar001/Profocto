import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/builder/private*',
          '/_next/',
          '/admin/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/builder/private*',
        ],
      },
    ],
    sitemap: 'https://profile-elegante.vercel.app/sitemap.xml',
    host: 'https://profile-elegante.vercel.app',
  }
}