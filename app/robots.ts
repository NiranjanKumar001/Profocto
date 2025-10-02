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
    sitemap: 'https://profocto.tech/sitemap.xml',
    host: 'https://profocto.tech',
  }
}