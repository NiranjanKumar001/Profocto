"use client";

import { FiEdit, FiEye } from "react-icons/fi";

interface MobileBottomNavProps {
  activeView: "edit" | "preview";
  onViewChange: (view: "edit" | "preview") => void;
  className?: string;
}

export default function MobileBottomNav({
  activeView,
  onViewChange,
  className = "",
}: MobileBottomNavProps) {
  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[hsl(240_10%_3.9%)] border-t border-[hsl(240_3.7%_15.9%)] backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.3)] ${className}`}
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div className="grid grid-cols-2 gap-0">
        {/* Edit Button */}
        <button
          onClick={() => onViewChange("edit")}
          className={`flex flex-col items-center justify-center py-4 px-6 transition-all duration-300 active:scale-95 touch-manipulation ${
            activeView === "edit"
              ? "bg-pink-500/10 text-pink-400 border-t-2 border-pink-500"
              : "text-gray-400 hover:text-gray-300 hover:bg-[hsl(240_3.7%_10%)] active:bg-[hsl(240_3.7%_15%)]"
          }`}
          type="button"
          aria-label="Switch to Edit mode"
          aria-pressed={activeView === "edit"}
        >
          <FiEdit
            className={`text-2xl mb-1 transition-all duration-300 ${
              activeView === "edit" ? "scale-110" : ""
            }`}
          />
          <span className="text-sm font-medium">Edit</span>
        </button>

        {/* Preview Button */}
        <button
          onClick={() => onViewChange("preview")}
          className={`flex flex-col items-center justify-center py-4 px-6 transition-all duration-300 active:scale-95 touch-manipulation ${
            activeView === "preview"
              ? "bg-pink-500/10 text-pink-400 border-t-2 border-pink-500"
              : "text-gray-400 hover:text-gray-300 hover:bg-[hsl(240_3.7%_10%)] active:bg-[hsl(240_3.7%_15%)]"
          }`}
          type="button"
          aria-label="Switch to Preview mode"
          aria-pressed={activeView === "preview"}
        >
          <FiEye
            className={`text-2xl mb-1 transition-all duration-300 ${
              activeView === "preview" ? "scale-110" : ""
            }`}
          />
          <span className="text-sm font-medium">Preview</span>
        </button>
      </div>
    </div>
  );
}
