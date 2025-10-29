"use client";

import { MdPictureAsPdf } from "react-icons/md";
import { useContext } from "react";
import { ResumeContext } from "@/contexts/ResumeContext";

const WinPrint = ({ mobileView }) => {
  const { resumeData } = useContext(ResumeContext);

  const print = () => {
    // Set document title for better PDF filename
    const originalTitle = document.title;
    const userName = resumeData?.name || "Resume";
    document.title = `${userName}_Resume_Profocto`;
    
    // Store original viewport
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    const originalViewport = viewportMeta?.content;
    
    // Set viewport for consistent A4 rendering on mobile
    if (viewportMeta) {
      viewportMeta.content = 'width=794, initial-scale=1'; // 794px ≈ 210mm at 96dpi
    } else {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      viewportMeta.content = 'width=794, initial-scale=1';
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
    <button
      aria-label="Download Resume"
      title="Download Resume as PDF - Use 'Print to PDF' in the print dialog"
      className={`exclude-print fixed bottom-32 right-4 lg:bottom-5 lg:right-10 font-bold rounded-full bg-white text-zinc-800 shadow-lg border-2 border-white p-3 hover:bg-gray-50 transition-colors duration-200 z-40 ${
        mobileView === "edit" ? "lg:block hidden" : "block"
      }`}
      onClick={print}
    >
      <MdPictureAsPdf className="w-5 h-5 lg:w-6 lg:h-6" />
    </button>
  );
};

export default WinPrint;