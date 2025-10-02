"use client 
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";


import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from "uuid";

export default function BuilderRedirect() {
  const router = useRouter();

  useEffect(() => {

    const uniqueId = Math.random().toString(36).substring(2, 15);

    // Generate a unique ID for the resume
    const uniqueId = uuidv4();

    router.push(`/builder/${uniqueId}`);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden transition-colors duration-300">
      <motion.div
        className="relative z-10 text-center px-8 py-10 rounded-xl shadow-md bg-[var(--card)] border border-[var(--border)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto mb-6 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-xl font-semibold mb-2">
          Redirecting to your Resume Builder
        </h2>
        <p className="text-[var(--muted-foreground)] text-sm">
          Please wait while we set up your workspace...
        </p>
      </motion.div>
    </div>
  );
}
