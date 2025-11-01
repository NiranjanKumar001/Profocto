"use client";

import React, { useContext, useState, useEffect, useRef } from "react";
import { ResumeContext } from "../../contexts/ResumeContext";
import { FaTrash } from "react-icons/fa";

const PersonalInformation = ({}) => {
  const { resumeData, setResumeData, handleProfilePicture, handleChange, saveResume, isSaving } =
    useContext(ResumeContext);

  // Ref for file input to reset it
  const fileInputRef = useRef(null);

  // State for uploaded filename
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Templates that support profile picture
  const TEMPLATES_WITH_PROFILE_PICTURE = ["template5"]; // Can add more templates here
  
  // Default profile picture - Use ImageKit URL with fallback
  const DEFAULT_PROFILE_PICTURE = "https://ik.imagekit.io/profocto/christopher-campbell-rDEOVtE7vOs-unsplash.jpg?updatedAt=1760968464715";
  const FALLBACK_PROFILE_PICTURE = "/assets/smart.jpg";
  
  // State to track if ImageKit URL failed to load
  const [imageError, setImageError] = useState(false);

  // Check current template from localStorage
  const [currentTemplate, setCurrentTemplate] = useState("");
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTemplate = localStorage.getItem("currentTemplate");
      setCurrentTemplate(savedTemplate || "template1");
    }

    // Listen for template changes via storage event
    const handleStorageChange = () => {
      if (typeof window !== "undefined") {
        const savedTemplate = localStorage.getItem("currentTemplate");
        setCurrentTemplate(savedTemplate || "template1");
      }
    };

    // Check for changes periodically (since localStorage events don't fire in same tab)
    const interval = setInterval(handleStorageChange, 500);

    return () => clearInterval(interval);
  }, []);

  // Check if current template supports profile picture
  const isImageUploadEnabled = TEMPLATES_WITH_PROFILE_PICTURE.includes(currentTemplate);

  // Handle removing profile picture - reset to default
  const handleRemoveProfilePicture = () => {
    setResumeData({ ...resumeData, profilePicture: DEFAULT_PROFILE_PICTURE });
    setUploadedFileName(""); // Clear filename
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle file upload with filename tracking
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      handleProfilePicture(e);
    }
  };

  // Check if current image is the default
  const isDefaultImage = resumeData.profilePicture === DEFAULT_PROFILE_PICTURE;

  // Auto-select text when input is focused
  const handleFocus = (e) => {
    e.target.select();
  };

  return (
    <div className="form-section">
      <div className="form-section-title">
        <span>Personal Information</span>
        {saveResume && (
          <button
            onClick={saveResume}
            disabled={isSaving}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              isSaving
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-pink-600 text-white hover:bg-pink-700 active:scale-95'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Resume'}
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              name="name"
              className="pi w-full"
              value={resumeData.name}
              onChange={handleChange}
              onFocus={handleFocus}
            />
          </div>
          <div>
            <label className="label-text">Job Title</label>
            <input
              type="text"
              placeholder="Your desired position"
              name="position"
              className="pi w-full"
              value={resumeData.position}
              onChange={handleChange}
              onFocus={handleFocus}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Phone Number</label>
            <input
              type="tel"
              placeholder="Your contact number (+1234567890)"
              name="contactInformation"
              className="pi w-full"
              value={resumeData.contactInformation}
              onChange={handleChange}
              onFocus={handleFocus}
              pattern="^\+?[1-9]\d{1,14}$"
              title="Please enter a valid international phone number"
              minLength="10"
              maxLength="15"
            />
          </div>
          <div>
            <label className="label-text">Email Address</label>
            <input
              type="email"
              placeholder="your.email@example.com"
              name="email"
              className="pi w-full"
              value={resumeData.email}
              onChange={handleChange}
              onFocus={handleFocus}
            />
          </div>
        </div>

        <div>
          <label className="label-text">Address</label>
          <input
            type="text"
            placeholder="Your location"
            name="address"
            className="pi w-full"
            value={resumeData.address}
            onChange={handleChange}
            onFocus={handleFocus}
          />
        </div>

        {/* Profile Picture Upload - Available for templates that support it */}
        {isImageUploadEnabled ? (
          <div>
            <label className="label-text">Profile Picture</label>
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-pink-500/10 file:text-pink-400
                  hover:file:bg-pink-500/20
                  file:cursor-pointer cursor-pointer
                  border border-gray-700/40 rounded-lg
                  bg-gray-800/30 p-2"
              />
              
              {/* Show filename with delete button only when file is uploaded */}
              {!isDefaultImage && uploadedFileName && (
                <div className="flex items-center justify-between bg-gray-800/40 border border-gray-700/40 rounded-lg p-3">
                  <span className="text-sm text-gray-300 truncate flex-1">{uploadedFileName}</span>
                  <button
                    type="button"
                    onClick={handleRemoveProfilePicture}
                    className="ml-3 p-2 bg-red-500/10 text-red-400 border border-red-500/30 
                      rounded-lg hover:bg-red-500/20 transition-colors flex-shrink-0"
                    title="Remove picture"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              )}
              
              <p className="text-xs text-gray-500">
                {isDefaultImage 
                  ? "Using default image. Upload your own photo to replace it."
                  : "Recommended: Square image, at least 400x400px for best quality"}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PersonalInformation;
