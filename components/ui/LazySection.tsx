"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  height?: string;
  threshold?: number;
}

export default function LazySection({ 
  children, 
  height = "300px",
  threshold = 0.1 
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRendered) {
          setIsVisible(true);
          setHasRendered(true);
        }
      },
      {
        rootMargin: "200px", // Load 200px before element comes into view
        threshold: threshold,
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasRendered, threshold]);

  return (
    <div
      ref={sectionRef}
      style={{
        minHeight: isVisible ? 'auto' : height,
        contentVisibility: isVisible ? 'visible' : 'auto',
        containIntrinsicSize: isVisible ? 'none' : `0 ${height}`,
      }}
    >
      {isVisible ? (
        children
      ) : (
        <div 
          className="animate-pulse bg-gray-800/30 rounded-lg border border-gray-700/30 p-4"
          style={{ height }}
        >
          <div className="h-6 bg-gray-700/50 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-700/40 rounded"></div>
            <div className="h-10 bg-gray-700/40 rounded"></div>
          </div>
        </div>
      )}
    </div>
  );
}
