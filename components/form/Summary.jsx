"use client";

import React, { useContext } from "react";
import { ResumeContext } from "../../contexts/ResumeContext";
import EditableFormTitle from './EditableFormTitle';

const Summary = () => {
  const { resumeData, handleChange } = useContext(ResumeContext);

  // Auto-select text when input is focused
  const handleFocus = (e) => {
    e.target.select();
  };

  return (
    <div className="form-section">
      <div className="form-section-title">
        <EditableFormTitle 
          sectionKey="summary" 
          defaultTitle="Summary" 
        />
      </div>
      
      <div>
        <label className="label-text">Professional Summary</label>
        <textarea
          placeholder="Write a compelling summary that highlights your key skills, experience, and career objectives..."
          name="summary"
          className="other-input w-full h-32 resize-none"
          value={resumeData.summary}
          onChange={handleChange}
          onFocus={handleFocus}
          maxLength="500"
        />
        <p className="text-gray-500 text-xs mt-1">{resumeData.summary.length}/500 characters</p>
      </div>
    </div>
  );
};

export default Summary;
