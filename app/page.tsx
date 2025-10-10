import React from 'react';
import { Suspense } from 'react';
import Hero from '@/components/hero/Hero';
import SEOContent from '@/components/seo/SEOContent';

export default function Home() {
  return (
    <>
      <Suspense fallback={
        <div 
          role="status" 
          aria-live="polite" 
          className="w-full h-screen bg-black flex items-center justify-center"
        >
          <span className="sr-only">Loading...</span>
        </div>
      }>
        <Hero />
      </Suspense>
      
      {/* Hidden SEO content for search engines */}
      <section className="sr-only">
        <h1>Profocto - Professional Resume Builder and CV Creator</h1>
        <p>
          Create stunning professional resumes with Profocto&apos;s Profile Élegante resume builder. 
          Our free online resume maker offers elegant templates, real-time editing, PDF export, 
          and cloud storage. Build your perfect CV in minutes with our modern, intuitive interface.
        </p>
        <ul>
          <li>Free online resume builder with professional templates</li>
          <li>Real-time editing and live preview</li>
          <li>PDF export and download functionality</li>
          <li>Google OAuth secure authentication</li>
          <li>Cloud storage and sync across devices</li>
          <li>Responsive design for mobile and desktop</li>
          <li>Drag and drop interface for easy customization</li>
          <li>Multiple elegant resume templates to choose from</li>
        </ul>
        <p>
          Join thousands of professionals who trust Profocto to create their resumes. 
          Whether you&apos;re a recent graduate, experienced professional, or career changer, 
          our resume builder helps you create the perfect CV for your job applications.
        </p>
      </section>
      
      {/* Comprehensive SEO Content and FAQ Schema */}
      <SEOContent />
    </>
  );
}
