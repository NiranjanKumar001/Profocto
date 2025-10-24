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
    
    // Use browser's native print dialog (Print to PDF)
    // This preserves hyperlinks, text quality, and selectable text
    window.print();
    
    // Restore original title after print
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
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