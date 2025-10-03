"use client";

import { FaCloudUploadAlt, FaCloudDownloadAlt } from "react-icons/fa";
import React, { useContext } from "react";
import { ResumeContext } from "../../contexts/ResumeContext";

const LoadUnload = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

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

  return (
    <div className="flex flex-wrap gap-4 mb-2 justify-center">
      <div className="inline-flex flex-row items-center gap-2">
        <h2 className="text-[1.2rem] text-white">Load Data</h2>
        <label className="tooltip p-2 text-white bg-zinc-800 rounded cursor-pointer hover:bg-zinc-700 transition-colors">
          <FaCloudUploadAlt className="text-[1.2rem] text-white" />
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
      <div className="inline-flex flex-row items-center gap-2">
        <h2 className="text-[1.2rem] text-white">Save Data</h2>
        <div className="tooltip">
          <button
            aria-label="Save Data"
            className="p-2 text-white bg-zinc-800 rounded hover:bg-zinc-700 transition-colors"
            onClick={(event) =>
              handleDownload(
                resumeData,
                resumeData.name + " - Profocto.json",
                event
              )
            }
          >
            <FaCloudDownloadAlt className="text-[1.2rem] text-white" />
          </button>
          <span className="tooltiptext">Download JSON file</span>
        </div>
      </div>
    </div>
  );
};

export default LoadUnload;
