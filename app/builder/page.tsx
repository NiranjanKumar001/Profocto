'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BuilderRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Generate a unique ID for the resume
    const uniqueId = Math.random().toString(36).substring(2, 15);
    router.push(`/builder/${uniqueId}`);
  }, [router]);

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-blue-100 to-white relative overflow-hidden">
      <motion.div
        className="relative z-10 text-center px-8 py-10 rounded-2xl shadow-2xl backdrop-blur-lg bg-white/60 border border-pink-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto mb-6 flex items-center justify-center">
          <div className="w-20 h-20 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-400 via-blue-400 to-pink-200 opacity-30 animate-pulse"></div>
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
        <h2 className="text-2xl font-extrabold text-pink-700 mb-2 tracking-tight drop-shadow">Redirecting to your Resume Builder</h2>
        <p className="text-gray-600 font-medium">Please wait while we set up your workspace...</p>
      </motion.div>

      <motion.div
  whileHover={{ scale: 1.02 }}
  className="group rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-sm hover:shadow-md transition-all duration-300"
>
  <div className="aspect-[4/3] relative">
    <Image
      src={template.image}
      alt={`${template.name} resume template preview`}
      width={400}
      height={300}
      priority={index < 2}
      className="object-contain w-full h-full p-4 bg-[var(--muted)]"
    />
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
      <Link
        href={`/builder?template=${template.id}`}
        className="rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] px-5 py-2 text-sm font-medium hover:opacity-90 transition-colors"
      >
        Use Template
      </Link>
    </div>
  </div>
  <div className="p-4">
    <h3 className="text-lg font-semibold text-[var(--foreground)]">
      {template.name}
    </h3>
    <p className="text-[var(--muted-foreground)] mt-2 text-sm">
      {template.description}
    </p>
  </div>
</motion.div>

      {/* Decorative blurred gradient shapes */}
      <div className="absolute left-0 top-0 w-72 h-72 bg-pink-300 opacity-20 rounded-full blur-3xl animate-pulse" style={{zIndex:0}}></div>
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-blue-300 opacity-20 rounded-full blur-3xl animate-pulse" style={{zIndex:0}}></div>
    </div>
  );
}