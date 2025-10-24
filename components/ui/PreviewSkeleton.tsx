"use client";

export default function PreviewSkeleton() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-100 py-8 px-4">
      <div className="w-full max-w-3xl animate-pulse">
        {/* A4 Paper Skeleton */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Header Skeleton */}
          <div className="text-center space-y-3 border-b border-gray-200 pb-6">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="flex justify-center gap-4 mt-4">
              <div className="h-3 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>

          {/* Content Sections Skeleton */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded"></div>
                <div className="h-4 bg-gray-100 rounded"></div>
                <div className="h-4 bg-gray-100 rounded w-4/5"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Text */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading preview...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
