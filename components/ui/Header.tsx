"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            Profocto
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-indigo-600">Home</Link>
            <Link href="/features" className="hover:text-indigo-600">Features</Link>
            <Link href="/about" className="hover:text-indigo-600">About</Link>
            <Link href="/contact" className="hover:text-indigo-600">Contact</Link>
          </nav>
          <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-4 py-3 space-y-2 shadow-md">
          <Link href="/" className="block hover:text-indigo-600">Home</Link>
          <Link href="/features" className="block hover:text-indigo-600">Features</Link>
          <Link href="/about" className="block hover:text-indigo-600">About</Link>
          <Link href="/contact" className="block hover:text-indigo-600">Contact</Link>
        </div>
      )}
    </header>
  );
}
