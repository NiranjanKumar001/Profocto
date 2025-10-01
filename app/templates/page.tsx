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
    name: "Minimal Classic",
    image: "/assets/resume.jpg",
    description: "Simple, elegant, and professional layout",
    style: "minimal",
    features: [
      "Clean typography",
      "Perfect spacing",
      "Traditional structure"
    ]
  },
  {
    id: 6,
    name: "Elegant Gradient",
    image: "/assets/resume.jpg",
    description: "Modern resume with soft gradients and card sections",
    style: "gradient",
    features: [
      "Gradient backgrounds",
      "Card-style sections",
      "Subtle shadows"
    ]
  },
  {
    id: 7,
    name: "Creative Portfolio",
    image: "/assets/resume.jpg",
    description: "Showcase creative work and skills with gallery layout",
    style: "portfolio",
    features: [
      "Gallery for projects",
      "Visual skill bars",
      "Profile photo highlight"
    ]
  },
  {
    id: 8,
    name: "Professional Timeline",
    image: "/assets/resume.jpg",
    description: "Timeline-based layout for career progression",
    style: "timeline",
    features: [
      "Vertical timeline",
      "Milestone highlights",
      "Year markers"
    ]
  },
  {
    id: 9,
    name: "Business Executive",
    image: "/assets/resume.jpg",
    description: "Executive style with bold headings and summary highlights",
    style: "executive",
    features: [
      "Bold section headings",
      "Summary highlights",
      "Achievements spotlight"
    ]
  },
  {
    id: 10,
    name: "Academic CV",
    image: "/assets/resume.jpg",
    description: "Detailed CV for academic and research positions",
    style: "academic",
    features: [
      "Publication list",
      "Research experience",
      "Education focus"
    ]
  },
  {
    id: 11,
    name: "Infographic Resume",
    image: "/assets/resume.jpg",
    description: "Visual resume with charts and infographics",
    style: "infographic",
    features: [
      "Skill charts",
      "Infographic sections",
      "Visual timeline"
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
