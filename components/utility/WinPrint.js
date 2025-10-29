"use client";

import { MdPictureAsPdf, MdClose, MdCheckCircle } from "react-icons/md";
import { useContext, useState, useEffect } from "react";
import { ResumeContext } from "@/contexts/ResumeContext";

const WinPrint = ({ mobileView }) => {
  const { resumeData } = useContext(ResumeContext);
  const [showModal, setShowModal] = useState(false);
  const [paperSize, setPaperSize] = useState("A4");

  useEffect(() => {
    // Load paper size from localStorage
    const savedSize = localStorage.getItem("paperSize");
    if (savedSize) {
      setPaperSize(savedSize);
    }

    // Listen for paper size changes
    const handlePaperSizeChange = (e) => {
      if (e.detail) {
        setPaperSize(e.detail);
      }
    };

    window.addEventListener('paperSizeChanged', handlePaperSizeChange);
    return () => window.removeEventListener('paperSizeChanged', handlePaperSizeChange);
  }, []);

  const handlePrintClick = () => {
    setShowModal(true);
  };

  const print = () => {
    setShowModal(false);
    // Set document title for better PDF filename
    const originalTitle = document.title;
    const userName = resumeData?.name || "Resume";
    document.title = `${userName}_Resume_Profocto`;
    
    // Set paper size CSS variable for @page
    document.documentElement.style.setProperty('--paper-size', paperSize);
    
    // Store original viewport
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    const originalViewport = viewportMeta?.content;
    
    // Set viewport based on paper size for consistent rendering on mobile
    const viewportWidth = paperSize === "Letter" ? 816 : 794; // Letter: 816px, A4: 794px
    if (viewportMeta) {
      viewportMeta.content = `width=${viewportWidth}, initial-scale=1`;
    } else {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      viewportMeta.content = `width=${viewportWidth}, initial-scale=1`;
      document.head.appendChild(viewportMeta);
    }
    
    // Small delay to let viewport changes take effect
    setTimeout(() => {
      // Use browser's native print dialog (Print to PDF)
      // This preserves hyperlinks, text quality, and selectable text
      window.print();
      
      // Restore original viewport and title after print
      setTimeout(() => {
        if (originalViewport) {
          viewportMeta.content = originalViewport;
        }
        document.title = originalTitle;
      }, 500);
    }, 100);
  };

  return (
    <>
      <button
        aria-label="Download Resume"
        title="Download Resume as PDF - Use 'Print to PDF' in the print dialog"
        className={`exclude-print fixed bottom-32 right-4 lg:bottom-5 lg:right-10 font-bold rounded-full bg-white text-zinc-800 shadow-lg border-2 border-white p-3 hover:bg-gray-50 transition-colors duration-200 z-40 ${
          mobileView === "edit" ? "lg:block hidden" : "block"
        }`}
        onClick={handlePrintClick}
      >
        <MdPictureAsPdf className="w-5 h-5 lg:w-6 lg:h-6" />
      </button>

      {showModal && (
        <>
          <div 
            className="exclude-print fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setShowModal(false)}
          />
          
          <div 
            className="exclude-print fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-xl w-[90%] max-w-md border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MdPictureAsPdf className="w-4 h-4 text-gray-700" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">Export PDF</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
                aria-label="Close"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Paper size</span>
                  <span className="text-sm font-medium text-gray-900">{paperSize}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-sm font-medium text-gray-900">Print Settings</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 bg-gray-100 text-gray-700 rounded-md flex items-center justify-center text-xs font-medium">1</span>
                    <span>Select <strong className="text-gray-900">&quot;Save as PDF&quot;</strong> as destination</span>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 bg-gray-100 text-gray-700 rounded-md flex items-center justify-center text-xs font-medium">2</span>
                    <span>Ensure paper size is <strong className="text-gray-900">{paperSize}</strong></span>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 bg-gray-100 text-gray-700 rounded-md flex items-center justify-center text-xs font-medium">3</span>
                    <span>Set margins to <strong className="text-gray-900">&quot;None&quot;</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 p-5 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={print}
                className="flex-1 px-4 py-2.5 bg-zinc-800 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default WinPrint;