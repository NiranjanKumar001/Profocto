"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

/**
 * TemplateWrapper - Ensures resume looks exactly the same in preview and print/export
 * Fixed A4 dimensions with proper scaling for all devices
 * Optimized for mobile performance
 */
const TemplateWrapper = ({ children }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [scale, setScale] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const contentRef = useRef(null);
  const containerRef = useRef(null);
  const resizeTimeoutRef = useRef(null);
  const observerTimeoutRef = useRef(null);

  // A4 dimensions in pixels at 96 DPI (standard screen resolution)
  const A4_WIDTH_PX = 794; // 210mm = 794px at 96 DPI
  const A4_HEIGHT_PX = 1123; // 297mm = 1123px at 96 DPI
  
  // Professional resume margins (left/right: 12mm, top/bottom: 10mm)
  const MARGIN_TOP_BOTTOM = 38; // 10mm
  const MARGIN_LEFT_RIGHT = 45; // 12mm (~0.47 inches)

  // Memoized overflow check with debouncing
  const checkOverflow = useCallback(() => {
    if (!contentRef.current) return;
    
    // Use RAF for better performance
    requestAnimationFrame(() => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        const newIsOverflowing = contentHeight > A4_HEIGHT_PX;
        setIsOverflowing(prev => prev !== newIsOverflowing ? newIsOverflowing : prev);
      }
    });
  }, [A4_HEIGHT_PX]);

  // Memoized scale calculation with debouncing
  const calculateScale = useCallback(() => {
    if (!containerRef.current || typeof window === 'undefined') return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const padding = 32; // Total horizontal padding
    const availableWidth = containerWidth - padding;
    const newScale = Math.min(availableWidth / A4_WIDTH_PX, 1);
    
    // Only update if scale changed significantly (avoid micro-updates)
    setScale(prev => Math.abs(prev - newScale) > 0.01 ? newScale : prev);
  }, [A4_WIDTH_PX]);

  // Client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initial setup and resize handling
  useEffect(() => {
    if (!isClient) return;

    // Initial calculations with slight delay for DOM to settle
    const initTimeout = setTimeout(() => {
      calculateScale();
      checkOverflow();
    }, 100);

    // Debounced resize handler
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      resizeTimeoutRef.current = setTimeout(() => {
        calculateScale();
        checkOverflow();
      }, 150); // Debounce resize events
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(initTimeout);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isClient, calculateScale, checkOverflow]);

  // Optimized mutation observer - only for critical changes
  useEffect(() => {
    if (!isClient || !contentRef.current) return;

    // Debounced observer callback
    const handleMutation = () => {
      if (observerTimeoutRef.current) {
        clearTimeout(observerTimeoutRef.current);
      }
      
      observerTimeoutRef.current = setTimeout(() => {
        checkOverflow();
      }, 200); // Debounce mutations
    };

    const observer = new MutationObserver(handleMutation);

    observer.observe(contentRef.current, {
      childList: true,
      subtree: true,
      characterData: false, // Don't watch text changes
      attributes: false, // Don't watch attribute changes
    });

    return () => {
      if (observerTimeoutRef.current) {
        clearTimeout(observerTimeoutRef.current);
      }
      observer.disconnect();
    };
  }, [isClient, checkOverflow]);

  // Show loading skeleton before client hydration
  if (!isClient) {
    return (
      <div className="w-full flex justify-center items-start bg-slate-100 min-h-screen py-8 px-4">
        <div className="animate-pulse space-y-4" style={{ width: '794px', maxWidth: '100%' }}>
          {/* A4 Paper Skeleton */}
          <div className="bg-white rounded-lg shadow-lg" style={{ height: '1123px', maxHeight: '80vh' }}>
            <div className="p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-3 border-b border-gray-200 pb-6">
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              {/* Content */}
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Container - responsive background with GPU acceleration */}
      <div 
        ref={containerRef}
        className="w-full flex justify-center items-start bg-slate-100 min-h-screen py-8 px-4 print:p-0 print:bg-white print:min-h-0"
        style={{
          willChange: 'auto',
          contain: 'layout style paint',
        }}
      >
        {/* A4 Paper Container with scaling - GPU accelerated */}
        <div
          style={{
            width: `${A4_WIDTH_PX}px`,
            height: `${A4_HEIGHT_PX}px`,
            transform: `scale(${scale}) translateZ(0)`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            WebkitFontSmoothing: 'antialiased',
          }}
          className="print:!transform-none"
        >
          {/* A4 Paper with shadow and proper styling */}
          <div 
            className="relative w-full h-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1),0_8px_24px_rgba(0,0,0,0.1)] print:shadow-none"
            style={{
              width: `${A4_WIDTH_PX}px`,
              height: `${A4_HEIGHT_PX}px`,
              willChange: 'auto',
            }}
          >
            {/* Resume Content - Fixed dimensions with margins */}
            <div
              ref={contentRef}
              className="w-full h-full overflow-hidden"
              style={{
                width: `${A4_WIDTH_PX}px`,
                height: `${A4_HEIGHT_PX}px`,
                paddingTop: `${MARGIN_TOP_BOTTOM}px`,
                paddingBottom: `${MARGIN_TOP_BOTTOM}px`,
                paddingLeft: `${MARGIN_LEFT_RIGHT}px`,
                paddingRight: `${MARGIN_LEFT_RIGHT}px`,
                boxSizing: 'border-box',
                printColorAdjust: 'exact',
                WebkitPrintColorAdjust: 'exact',
                colorAdjust: 'exact',
                contain: 'layout style paint',
              }}
            >
              {children}
            </div>

            {/* Overflow Warning */}
            {isOverflowing && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-red-50 via-red-50/70 to-transparent pointer-events-none print:hidden z-[9999]">
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-red-100 text-red-800 text-xs font-semibold px-4 py-2 rounded-lg shadow-lg border border-red-300">
                  <svg 
                    className="w-4 h-4 flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>⚠️ Content exceeds one page - will overflow in print</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Print-specific global styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          
          body {
            margin: 0;
            padding: 0;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }

          * {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }

          /* Hide everything except the resume */
          body > :not(.print\\:p-0) {
            display: none !important;
          }

          /* Ensure resume prints at exact A4 size */
          html, body {
            width: 210mm;
            height: 297mm;
          }
        }
      `}</style>
    </>
  );
};

export default TemplateWrapper;
