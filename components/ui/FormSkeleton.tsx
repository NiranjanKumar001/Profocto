"use client";

export default function FormSkeleton() {
  return (
    <div className="p-2.5 sm:p-4 lg:p-5 space-y-4">
      {/* Header Skeleton */}
      <div className="hidden lg:block">
        <div className="h-12 bg-gray-700/50 rounded-full mb-6 animate-pulse"></div>
      </div>

      {/* Form Sections Skeleton */}
      {[
        { height: 'h-48', fields: 3 }, // Personal Info
        { height: 'h-32', fields: 2 }, // Social Media
        { height: 'h-28', fields: 1 }, // Summary
        { height: 'h-40', fields: 3 }, // Education
        { height: 'h-44', fields: 4 }, // Work Experience
        { height: 'h-40', fields: 3 }, // Projects
        { height: 'h-36', fields: 2 }, // Skills
        { height: 'h-28', fields: 2 }, // Languages
        { height: 'h-36', fields: 3 }, // Certifications
      ].map((section, i) => (
        <div
          key={i}
          className={`bg-gray-800/50 rounded-lg p-4 sm:p-6 border border-gray-700/50 ${section.height}`}
          style={{
            animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) ${i * 0.1}s infinite`,
          }}
        >
          {/* Section Title */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 sm:h-6 bg-gray-700/70 rounded w-32 sm:w-40"></div>
            <div className="h-5 w-5 bg-gray-700/50 rounded"></div>
          </div>
          
          {/* Form Fields */}
          <div className="space-y-3">
            {Array.from({ length: section.fields }).map((_, fieldIndex) => (
              <div key={fieldIndex}>
                <div className="h-3 bg-gray-700/40 rounded w-20 mb-1.5"></div>
                <div className={`${fieldIndex === section.fields - 1 && section.fields > 2 ? 'h-16' : 'h-9'} bg-gray-700/50 rounded`}></div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
