"use client";

import FormButton from "./FormButton";
import React, { useContext } from "react";
import { ResumeContext } from "../../contexts/ResumeContext";

const SocialMedia = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  // Auto-select text when input is focused
  const handleFocus = (e) => {
    e.target.select();
  };

  // Available platform options
  const platformOptions = [
    { value: "", label: "Select Platform" },
    { value: "LinkedIn", label: "LinkedIn" },
    { value: "GitHub", label: "GitHub" },
    { value: "Website", label: "Website" },
    { value: "Twitter", label: "Twitter" },
    { value: "Instagram", label: "Instagram" },
    { value: "Facebook", label: "Facebook" },
    { value: "YouTube", label: "YouTube" },
    { value: "Medium", label: "Medium" },
    { value: "Stack Overflow", label: "Stack Overflow" },
    { value: "Behance", label: "Behance" },
    { value: "Dribbble", label: "Dribbble" },
    { value: "GitLab", label: "GitLab" },
    { value: "Custom", label: "Custom" },
  ];

  // social media
  const handleSocialMedia = (e, index) => {
    const newSocialMedia = [...resumeData.socialMedia];
    const fieldName = e.target.name;
    const fieldValue = e.target.value.replace("https://", "");
    
    newSocialMedia[index][fieldName] = fieldValue;
    
    // Auto-update displayText when platform changes
    if (fieldName === "socialMedia") {
      // Always update displayText to match platform name
      newSocialMedia[index].displayText = fieldValue;
    }
    
    setResumeData({ ...resumeData, socialMedia: newSocialMedia });
  };

  const addSocialMedia = () => {
    setResumeData({
      ...resumeData,
      socialMedia: [...resumeData.socialMedia, { socialMedia: "", displayText: "", link: "" }],
    });
  };

  const removeSocialMedia = (index) => {
    const newSocialMedia = [...resumeData.socialMedia];
    newSocialMedia[index] = newSocialMedia[newSocialMedia.length - 1];
    newSocialMedia.pop();
    setResumeData({ ...resumeData, socialMedia: newSocialMedia });
  };

  return (
    <div className="form-section">
      <h2 className="form-section-title">Social Media</h2>
      {resumeData.socialMedia.map((socialMedia, index) => (
        <div key={index} className="space-y-2 mb-4 p-4 border border-gray-700/40 rounded-lg bg-gray-800/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Platform</label>
              <select
                name="socialMedia"
                className="other-input w-full cursor-pointer"
                value={socialMedia.socialMedia}
                onChange={(e) => handleSocialMedia(e, index)}
              >
                {platformOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {socialMedia.socialMedia === "Custom" && (
                <input
                  type="text"
                  placeholder="Enter custom platform name"
                  name="socialMedia"
                  className="other-input w-full mt-2"
                  value={socialMedia.socialMedia === "Custom" ? "" : socialMedia.socialMedia}
                  onChange={(e) => handleSocialMedia(e, index)}
                  onFocus={handleFocus}
                />
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Display Text</label>
              <input
                type="text"
                placeholder="e.g., LinkedIn, GitHub, Website"
                name="displayText"
                className="other-input w-full"
                value={socialMedia.displayText || ""}
                onChange={(e) => handleSocialMedia(e, index)}
                onFocus={handleFocus}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Profile URL</label>
            <input
              type="text"
              placeholder="Full profile URL (e.g., linkedin.com/in/johndoe)"
              name="link"
              className="other-input w-full"
              value={socialMedia.link}
              onChange={(e) => handleSocialMedia(e, index)}
              onFocus={handleFocus}
            />
          </div>
        </div>
      ))}
      <FormButton
        size={resumeData.socialMedia.length}
        add={addSocialMedia}
        remove={removeSocialMedia}
        sectionName="social media"
      />
    </div>
  );
};

export default SocialMedia;