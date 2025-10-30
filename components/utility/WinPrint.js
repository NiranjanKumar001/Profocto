"use client";

import { MdPictureAsPdf, MdClose, MdInfo } from "react-icons/md";
import { useContext, useState, useEffect } from "react";
import { ResumeContext } from "@/contexts/ResumeContext";

const WinPrint = ({ mobileView }) => {
  const { resumeData } = useContext(ResumeContext);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePrintClick = () => {
    if (isMobile) {
      setShowMobileModal(true);
    } else {
      print();
    }
  };

  const print = () => {
    setShowMobileModal(false);
    
    // Set document title for better PDF filename
    const originalTitle = document.title;
    const userName = resumeData?.name || "Resume";
    document.title = `${userName}_Resume_Profocto`;
    
    // Store original viewport
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    const originalViewport = viewportMeta?.content;
    
    // Set viewport for consistent rendering on mobile
    if (viewportMeta) {
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0';
    } else {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0';
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
      {/* Mobile Instructions Modal */}
      {showMobileModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MdInfo className="text-2xl text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Export Instructions
                  </h3>
                </div>
                <button
                  onClick={() => setShowMobileModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <MdClose className="text-2xl" />
                </button>
              </div>

              <div className="space-y-4 text-gray-700">
                <p className="text-sm leading-relaxed">
                  To get the best PDF export without margins on mobile:
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <ol className="list-decimal list-inside space-y-3 text-sm">
                    <li>
                      <span className="font-semibold">In the print dialog, tap on &quot;More options&quot;</span>
                    </li>
                    <li>
                      <span className="font-semibold">Set &quot;Paper size&quot; to &quot;A4&quot;</span> (not Letter)
                    </li>
                    <li>
                      <span className="font-semibold">Set &quot;Margins&quot; to &quot;None&quot;</span> or &quot;Minimum&quot;
                    </li>
                    <li>
                      <span className="font-semibold">Make sure &quot;Scale&quot; is set to &quot;100%&quot;</span>
                    </li>
                    <li>
                      Tap &quot;Save as PDF&quot; or your printer name
                    </li>
                  </ol>
                </div>

                <p className="text-xs text-gray-600 italic">
                  💡 Setting margins to &quot;None&quot; will remove the extra white space around your resume.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowMobileModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={print}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg transition-all"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
    </>
  );
};

export default WinPrint;