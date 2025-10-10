"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const templates = [
  {
    id: 1,
    name: "Google Style",
    image: "/assets/resume.jpg",
    description: "Clean, metrics-driven format preferred by Google recruiters",
    style: "modern",
    features: [
      "Quantifiable achievements",
      "Clear section hierarchy",
      "Bullet-point focused"
    ]
  },
  {
    id: 2,
    name: "Amazon Leadership",
    image: "/assets/resume.jpg",
    description: "Emphasizes leadership principles and results",
    style: "leadership",
    features: [
      "STAR format bullets",
      "Leadership principles aligned",
      "Metrics highlighted"
    ]
  },
  {
    id: 3,
    name: "Meta Technical",
    image: "/assets/resume.jpg",
    description: "Technical skills-focused layout for engineering roles",
    style: "technical",
    features: [
      "Technical skills matrix",
      "Project highlights",
      "System design experience"
    ]
  },
  {
    id: 4,
    name: "Apple Design",
    image: "/assets/resume.jpg",
    description: "Clean, minimalist design with strong typography",
    style: "minimal",
    features: [
      "Typography focused",
      "Whitespace optimized",
      "Visual hierarchy"
    ]
  },
  {
    id: 5,
    name: "Fancy Template",
    image: "/assets/resume.jpg",
    description: "New modern layout with elegant design",
    style: "modern",
    features: [
      "Modern aesthetics",
      "Clean sections",
      "Professional look"
    ]
  },
  {
    id: 6,
    name: "Smart Template",
    image: "/assets/resume.jpg",
    description: "Clean layout with clear divisions",
    style: "minimal",
    features: [
      "Organized sections",
      "Easy to read",
      "Professional format"
    ]
  },
  {
    id: 7,
    name: "Minimalist Professional",
    image: "/assets/resume.jpg",
    description: "Clean, ATS-friendly design perfect for corporate roles",
    style: "minimal",
    features: [
      "ATS-optimized format",
      "Black and white design",
      "Excellent readability"
    ]
  },
  {
    id: 8,
    name: "Creative Modern",
    image: "/assets/resume.jpg",
    description: "Colorful, eye-catching layout for creative industries",
    style: "modern",
    features: [
      "Gradient header design",
      "Card-based sections",
      "Modern UI elements"
    ]
  },
  {
    id: 9,
    name: "Executive Professional",
    image: "/assets/resume.jpg",
    description: "Sophisticated design for senior-level positions",
    style: "professional",
    features: [
      "Bold headers",
      "Leadership focused",
      "Executive presence"
    ]
  },
  {
    id: 10,
    name: "Tech Developer",
    image: "/assets/resume.jpg",
    description: "Code-inspired terminal style for developers",
    style: "technical",
    features: [
      "Terminal aesthetics",
      "Monospace fonts",
      "Developer friendly"
    ]
  },
  {
    id: 11,
    name: "Academic CV",
    image: "/assets/resume.jpg",
    description: "Traditional academic format for researchers",
    style: "academic",
    features: [
      "Serif typography",
      "Formal structure",
      "Research focused"
    ]
  },
  {
    id: 12,
    name: "Creative Portfolio",
    image: "/assets/resume.jpg",
    description: "Bold artistic design for creative professionals",
    style: "creative",
    features: [
      "Vibrant gradients",
      "Artistic flair",
      "Portfolio showcase"
    ]
  },
  {
    id: 13,
    name: "Startup Founder",
    image: "/assets/resume.jpg",
    description: "Dynamic entrepreneurial style for innovators",
    style: "modern",
    features: [
      "Energetic design",
      "Innovation focused",
      "Startup culture"
    ]
  },
  {
    id: 14,
    name: "Compact One-Page",
    image: "/assets/resume.jpg",
    description: "Space-efficient layout for concise resumes",
    style: "minimal",
    features: [
      "Two-column layout",
      "Space optimized",
      "One-page format"
    ]
  },
  {
    id: 15,
    name: "Modern Gradient",
    image: "/assets/resume.jpg",
    description: "Sleek contemporary design with smooth gradients",
    style: "modern",
    features: [
      "Gradient accents",
      "Contemporary style",
      "Professional polish"
    ]
  }
];

interface Template {
  id: number;
  name: string;
  image: string;
  description: string;
  style: string;
  features: string[];
}

export default function TemplatesPage() {
  return (
    <div className="min-h-screen relative w-full bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="relative z-10 pt-20 pb-16 px-4 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 pb-8">
          Choose Your Template
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {templates.map((template, index) => (
            <TemplateCard key={template.id} template={template} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ template, index }: { template: Template, index: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative group rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden hover:border-pink-500/30 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="aspect-[4/3] relative">
        <Image
          src={template.image}
          alt={`${template.name} resume template preview`}
          width={400}
          height={300}
          priority={index < 2}
          className="object-contain w-full h-full p-4 bg-white/5"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Link
            href={`/builder?template=${template.id}`}
            className="relative inline-flex h-12 items-center justify-center rounded-md border border-pink-500/20 bg-gradient-to-r from-pink-500/10 to-pink-600/10 backdrop-blur-sm px-6 font-medium text-pink-200 transition-all duration-300 hover:border-pink-500/40 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-pink-600/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
          >
            Use Template
          </Link>
        </div>
      </div>
      <div className="relative p-4">
        <h3 className="text-xl font-semibold text-white group-hover:text-pink-100 transition-colors duration-300">{template.name}</h3>
        <p className="text-slate-400 group-hover:text-slate-300 mt-2 text-sm transition-colors duration-300">{template.description}</p>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500/0 via-pink-500/50 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </motion.div>
  );
}
