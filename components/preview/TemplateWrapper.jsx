"use client";

import React, { useEffect, useRef, useState } from 'react';

/**
 * TemplateWrapper - Ensures resume looks exactly the same in preview and print/export
 * Fixed A4 dimensions with proper scaling for all devices
 */
const TemplateWrapper = ({ children }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [scale, setScale] = useState(1);
  const contentRef = useRef(null);
  const containerRef = useRef(null);

  // A4 dimensions in pixels at 96 DPI (standard screen resolution)
  const A4_WIDTH_PX = 794; // 210mm = 794px at 96 DPI
  const A4_HEIGHT_PX = 1123; // 297mm = 1123px at 96 DPI
  
  // Professional resume margins (left/right: 12mm, top/bottom: 10mm)
  const MARGIN_TOP_BOTTOM = 38; // 10mm
  const MARGIN_LEFT_RIGHT = 45; // 12mm (~0.47 inches)

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        setIsOverflowing(contentHeight > A4_HEIGHT_PX);
      }
    };

    const calculateScale = () => {
      if (containerRef.current && typeof window !== 'undefined') {
        const containerWidth = containerRef.current.offsetWidth;
        const padding = 32; // Total horizontal padding
        const availableWidth = containerWidth - padding;
        const newScale = Math.min(availableWidth / A4_WIDTH_PX, 1);
        setScale(newScale);
      }
    };

    // Initial calculations
    const timeoutId = setTimeout(() => {
      checkOverflow();
      calculateScale();
    }, 100);

    // Resize handler
    const handleResize = () => {
      checkOverflow();
      calculateScale();
    };

    window.addEventListener('resize', handleResize);

    // Mutation observer for content changes
    const observer = new MutationObserver(() => {
      setTimeout(checkOverflow, 50);
    });

    if (contentRef.current) {
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
      });
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [A4_WIDTH_PX, A4_HEIGHT_PX]);

  return (
    <>
      {/* Container - responsive background */}
      <div 
        ref={containerRef}
        className="w-full flex justify-center items-start bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 min-h-screen py-8 px-4 print:p-0 print:bg-white print:min-h-0"
      >
        {/* A4 Paper Container with scaling */}
        <div
          style={{
            width: `${A4_WIDTH_PX}px`,
            height: `${A4_HEIGHT_PX}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="print:!transform-none"
        >
          {/* A4 Paper with shadow and proper styling */}
          <div 
            className="relative w-full h-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1),0_8px_24px_rgba(0,0,0,0.1)] print:shadow-none"
            style={{
              width: `${A4_WIDTH_PX}px`,
              height: `${A4_HEIGHT_PX}px`,
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
