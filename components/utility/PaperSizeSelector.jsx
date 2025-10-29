"use client";

import { useState, useEffect } from "react";
import { IoMdDocument } from "react-icons/io";
import { MdClose } from "react-icons/md";

const PaperSizeSelector = () => {
  const [paperSize, setPaperSize] = useState("A4");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedSize = localStorage.getItem("paperSize");
    if (savedSize) {
      setPaperSize(savedSize);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("paperSize", paperSize);
    const event = new CustomEvent('paperSizeChanged', { detail: paperSize });
    window.dispatchEvent(event);
  }, [paperSize]);

  const paperSizes = [
    { id: "A4", name: "A4", dimensions: "210 × 297 mm", region: "International" },
    { id: "Letter", name: "Letter", dimensions: "8.5 × 11 in", region: "US/Canada" }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="exclude-print fixed bottom-[240px] right-4 lg:bottom-[80px] lg:right-10 bg-zinc-800 text-white rounded-full p-3 shadow-lg hover:bg-zinc-700 transition-all duration-200 hover:scale-105 z-40"
        title="Paper Size"
        aria-label="Select Paper Size"
      >
        <IoMdDocument className="w-5 h-5 lg:w-6 lg:h-6" />
      </button>

      {isOpen && (
        <>
          <div 
            className="exclude-print fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          
          <div 
            className="exclude-print fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-xl w-[90%] max-w-sm border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Paper Size</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
                aria-label="Close"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-2.5">
              {paperSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => {
                    setPaperSize(size.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                    paperSize === size.id
                      ? "border-pink-500/50 bg-pink-50/50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      paperSize === size.id ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-600"
                    }`}>
                      <IoMdDocument className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 text-sm">{size.name}</div>
                      <div className="text-xs text-gray-500">{size.dimensions}</div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    paperSize === size.id
                      ? "border-pink-500 bg-pink-500"
                      : "border-gray-300"
                  }`}>
                    {paperSize === size.id && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PaperSizeSelector;
