"use client";

export default function FormSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-5 space-y-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-12 bg-gray-700/50 rounded-full mb-6"></div>

      {/* Form Sections Skeleton */}
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50"
        >
          {/* Section Title */}
          <div className="h-6 bg-gray-700/70 rounded w-1/3 mb-4"></div>
          
          {/* Form Fields */}
          <div className="space-y-3">
            <div className="h-10 bg-gray-700/50 rounded"></div>
            <div className="h-10 bg-gray-700/50 rounded"></div>
            <div className="h-20 bg-gray-700/50 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
