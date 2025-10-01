"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* About Section */}
        <div>
          <h2 className="text-lg font-bold mb-2 text-indigo-600 dark:text-indigo-400">About Profocto</h2>
          <p className="text-sm">
            Profocto is an elegant and modern resume builder that helps you create professional resumes
            quickly with customizable templates and live preview.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-bold mb-2 text-indigo-600 dark:text-indigo-400">Quick Links</h2>
          <ul className="space-y-1">
            <li><Link href="/" className="hover:text-indigo-600">Home</Link></li>
            <li><Link href="/features" className="hover:text-indigo-600">Features</Link></li>
            <li><Link href="/about" className="hover:text-indigo-600">About</Link></li>
            <li><Link href="/contact" className="hover:text-indigo-600">Contact</Link></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="text-lg font-bold mb-2 text-indigo-600 dark:text-indigo-400">Connect with us</h2>
          <div className="flex space-x-4">
            <Link href="https://github.com/NiranjanKumar001" target="_blank" className="hover:text-indigo-600">
              <FaGithub size={20} />
            </Link>
            <Link href="https://www.linkedin.com" target="_blank" className="hover:text-indigo-600">
              <FaLinkedin size={20} />
            </Link>
            <Link href="https://twitter.com" target="_blank" className="hover:text-indigo-600">
              <FaTwitter size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="mt-8 border-t border-gray-300 dark:border-gray-700 pt-4 text-sm text-center text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Profocto. All rights reserved. Built with Next.js, TailwindCSS, and love 
      </div>
    </footer>
  );
}
