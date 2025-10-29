"use client";

import { MdPictureAsPdf } from "react-icons/md";
import { FaFileWord } from "react-icons/fa";
import { useContext, useState } from "react";
import { ResumeContext } from "@/contexts/ResumeContext";

const WinPrint = ({ mobileView }) => {
  const { resumeData } = useContext(ResumeContext);
  const [isExportingWord, setIsExportingWord] = useState(false);

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

  const exportToWord = async () => {
    try {
      setIsExportingWord(true);
      
      const response = await fetch('/api/export-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate Word document');
      }

      // Get the blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeData?.name || 'Resume'} - Profocto.docx`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting to Word:', error);
      alert('Failed to export to Word. Please try again.');
    } finally {
      setIsExportingWord(false);
    }
  };

return (
    <div className="exclude-print fixed bottom-5 right-10 flex flex-col gap-3">
      {/* PDF Download Button */}
      <button
        aria-label="Download as PDF"
        title="Download as PDF"
        className="font-bold rounded-full bg-white text-zinc-800 shadow-lg border-2 border-white p-3 hover:bg-gray-50 transition-colors duration-200"
        onClick={print}
      >
        <MdPictureAsPdf className="w-6 h-6" />
      </button>

      {/* Word Download Button */}
      <button
        aria-label="Download as Word"
        title="Download as Word"
        className="font-bold rounded-full bg-blue-600 text-white shadow-lg border-2 border-blue-600 p-3 hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={exportToWord}
        disabled={isExportingWord}
      >
        {isExportingWord ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <FaFileWord className="w-6 h-6" />
        )}
      </button>
    </div>
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