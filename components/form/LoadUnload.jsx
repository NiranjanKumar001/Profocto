"use client";

import { FaCloudUploadAlt, FaCloudDownloadAlt, FaRedo } from "react-icons/fa";
import React, { useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ResumeContext } from "../../contexts/ResumeContext";
import DefaultResumeData from "../utility/DefaultResumeData";

const LoadUnload = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);
  const [showResetModal, setShowResetModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // load backup resume data
  const handleLoad = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const resumeData = JSON.parse(event.target.result);
      setResumeData(resumeData);
    };
    reader.readAsText(file);
  };

  // download resume data
  const handleDownload = (data, filename, event) => {
    event.preventDefault();
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // reset to default data
  const handleResetClick = () => {
    setShowResetModal(true);
  };

  const confirmReset = () => {
    // Clear localStorage
    localStorage.removeItem("resumeData");
    // Reset to default data - create a deep copy to avoid reference issues
    setResumeData(JSON.parse(JSON.stringify(DefaultResumeData)));
    setShowResetModal(false);
  };

  const cancelReset = () => {
    setShowResetModal(false);
  };

  return (
    <>
      <div className="flex flex-nowrap gap-2 sm:gap-4 mb-2 justify-center items-center">
        <div className="inline-flex flex-row items-center gap-1 sm:gap-2">
          <h2 className="text-[0.85rem] sm:text-[1.2rem] text-white whitespace-nowrap">Load Data</h2>
          <label className="tooltip p-1.5 sm:p-2 text-white bg-zinc-800 rounded cursor-pointer hover:bg-zinc-700 transition-colors">
            <FaCloudUploadAlt className="text-[0.95rem] sm:text-[1.2rem] text-white" />
            <span className="tooltiptext">Upload JSON file</span>
            <input
              aria-label="Load Data"
              type="file"
              className="hidden"
              onChange={handleLoad}
              accept=".json"
            />
          </label>
        </div>
        <div className="inline-flex flex-row items-center gap-1 sm:gap-2">
          <h2 className="text-[0.85rem] sm:text-[1.2rem] text-white whitespace-nowrap">Save Data</h2>
          <div className="tooltip">
            <button
              aria-label="Save Data"
              className="p-1.5 sm:p-2 text-white bg-zinc-800 rounded hover:bg-zinc-700 transition-colors"
              onClick={(event) =>
                handleDownload(
                  resumeData,
                  resumeData.name + " - Profocto.json",
                  event
                )
              }
            >
              <FaCloudDownloadAlt className="text-[0.95rem] sm:text-[1.2rem] text-white" />
            </button>
            <span className="tooltiptext">Download JSON file</span>
          </div>
        </div>
        <div className="inline-flex flex-row items-center gap-1 sm:gap-2">
          <h2 className="text-[0.85rem] sm:text-[1.2rem] text-white whitespace-nowrap">Reset</h2>
          <div className="tooltip">
            <button
              aria-label="Reset to Default"
              className="p-1.5 sm:p-2 text-white bg-red-700 rounded hover:bg-red-600 transition-colors"
              onClick={handleResetClick}
            >
              <FaRedo className="text-[0.95rem] sm:text-[1.2rem] text-white" />
            </button>
            <span className="tooltiptext">Reset to default data</span>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal - Using Portal to render outside scroll container */}
      {mounted && showResetModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-black/50 exclude-print">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 max-w-sm w-[90%]">
            <div className="flex flex-col space-y-4">
              {/* Title with Icon */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <FaRedo className="text-red-500 text-lg" />
                </div>
                <h3 className="text-white text-lg font-semibold">
                  Reset to Default?
                </h3>
              </div>
              
              {/* Message */}
              <p className="text-white/70 text-sm">
                This will clear all your current information and cannot be undone.
              </p>
              
              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={cancelReset}
                  className="flex-1 px-4 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-all font-medium border border-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReset}
                  className="flex-1 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-500 transition-all font-semibold"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default LoadUnload;
