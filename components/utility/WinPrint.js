"use client";

import { MdPictureAsPdf } from "react-icons/md";
import { useContext } from "react";
import { ResumeContext } from "@/contexts/ResumeContext";

const WinPrint = () => {
  const { resumeData } = useContext(ResumeContext);

  const print = () => {
    // Set document title for better PDF filename
    const originalTitle = document.title;
    const userName = resumeData?.name || "Resume";
    document.title = `${userName}_Resume_Profocto`;
    
    // Use browser's native print dialog (Print to PDF)
    // This preserves hyperlinks, text quality, and selectable text
    window.print();
    
    // Restore original title after print
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  

  return (
    <>
      <button
        aria-label="Download Resume"
        title="Download Resume as PDF - Use 'Print to PDF' in the print dialog"
        className="exclude-print fixed bottom-5 right-10 font-bold rounded-full bg-white text-zinc-800 shadow-lg border-2 border-white p-3 hover:bg-gray-50 transition-colors duration-200"
        onClick={print}
      >
        <MdPictureAsPdf className="w-6 h-6" />
      </button>
      
      {/* Print Instructions Tooltip */}
      <div className="exclude-print fixed bottom-16 right-10 bg-gray-900 text-white text-xs px-3 py-2 rounded-md shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none max-w-xs">
        💡 <strong>Print Tips:</strong><br/>
        • Select "Save as PDF"<br/>
        • Set margins to "None"<br/>
        • Enable "Background graphics"<br/>
        • Scale: 100%
      </div>
    </>
  );
};

export default WinPrint;