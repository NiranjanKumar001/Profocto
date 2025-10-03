"use client";

import { MdAddCircle, MdRemoveCircle } from "react-icons/md";
import { useState } from "react";

const FormButton = ({ size, remove, add, sectionName = "item" }) => {
  const [announcement, setAnnouncement] = useState("");

  const handleAdd = () => {
    add();
    const message = `${sectionName} added. Total ${sectionName}s: ${size + 1}`;
    setAnnouncement(message);
    // Clear announcement after screen reader reads it
    setTimeout(() => setAnnouncement(""), 2000);
  };

  const handleRemove = () => {
    remove();
    const message = `${sectionName} removed. Total ${sectionName}s: ${size - 1}`;
    setAnnouncement(message);
    // Clear announcement after screen reader reads it
    setTimeout(() => setAnnouncement(""), 2000);
  };

  return (
    <>
      {/* Screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {announcement}
      </div>
      
      <div className="flex gap-3 mt-6 pt-2" role="group" aria-label={`${sectionName} management controls`}>
        <button 
          type="button" 
          onClick={handleAdd}
          aria-label={`Add new ${sectionName}`}
          title={`Add new ${sectionName}`}
          className="clean-button group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <MdAddCircle className="text-base group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
          <span className="text-xs font-medium hidden sm:inline">Add</span>
        </button>
        {
          size > 0 &&
          <button 
            type="button" 
            onClick={handleRemove}
            aria-label={`Remove last ${sectionName} (${size} total)`}
            title={`Remove last ${sectionName}`}
            className="danger-button group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <MdRemoveCircle className="text-base group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
            <span className="text-xs font-medium hidden sm:inline">Remove</span>
          </button>
        }
      </div>
    </>
  )
}

export default FormButton;