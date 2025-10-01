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
    document.title =`${userName} - Resume by Profocto`;
    
    window.print();
    
    // Restore original title after print
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

return (
    <button
        aria-label="Download Resume"
        title="Download Resume"
        className="exclude-print fixed bottom-5 right-10 font-bold rounded-full bg-white text-zinc-800 shadow-lg border-2 border-white p-3 hover:bg-gray-50 transition-colors duration-200"
        onClick={print}
      >
       <MdPictureAsPdf className="w-6 h-6" />
      </button>
    );
};

export default WinPrint;
