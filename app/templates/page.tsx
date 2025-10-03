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
  whileHover={{ scale: 1.02 }}
  className="relative group rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
>
  <div className="aspect-[4/3] relative">
    <Image
      src={template.image}
      alt={`${template.name} resume template preview`}
      width={400}
      height={300}
      priority={index < 2}
      className="object-contain w-full h-full p-4 bg-gray-50"
    />
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
      <Link
        href={`/builder?template=${template.id}`}
        className="rounded-md bg-gray-900 text-white px-5 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        Use Template
      </Link>
    </div>
  </div>
  <div className="p-4">
    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
    <p className="text-gray-600 mt-2 text-sm">{template.description}</p>
  </div>
</motion.div>
  );
}
