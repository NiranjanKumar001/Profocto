"use client";

import FormButton from "./FormButton";
import React, { useContext } from "react";
import { ResumeContext } from "../../contexts/ResumeContext";
import EditableFormTitle from './EditableFormTitle';

const WorkExperience = () => {
  const {
    resumeData,
    setResumeData,
  } = useContext(ResumeContext);

  const handleWorkExperience = (e, index) => {
    const newworkExperience = [...resumeData.workExperience];
    newworkExperience[index][e.target.name] = e.target.value;
    setResumeData({ ...resumeData, workExperience: newworkExperience });
  };

  const addWorkExperience = () => {
    setResumeData({
      ...resumeData,
      workExperience: [
        ...resumeData.workExperience,
        {
          company: "",
          position: "",
          description: "",
          keyAchievements: "",
          startYear: "",
          endYear: "",
        },
      ],
    });
  };

  const removeWorkExperience = (index) => {
    const newworkExperience = [...resumeData.workExperience];
    newworkExperience[index] = newworkExperience[newworkExperience.length - 1];
    newworkExperience.pop();
    setResumeData({ ...resumeData, workExperience: newworkExperience });
  };

  return (
    <div className="form-section">
      <div className="form-section-title">
        <EditableFormTitle 
          sectionKey="experience" 
          defaultTitle="Work Experience" 
        />
      </div>

      {resumeData.workExperience.map((workExperience, index) => (
        <div key={index} className="section-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label-text">Company Name</label>
              <input
                type="text"
                placeholder="Company or Organization"
                name="company"
                className="other-input w-full"
                value={workExperience.company}
                onChange={(e) => handleWorkExperience(e, index)}
              />
            </div>
            <div>
              <label className="label-text">Job Title</label>
              <input
                type="text"
                placeholder="Your position"
                name="position"
                className="other-input w-full"
                value={workExperience.position}
                onChange={(e) => handleWorkExperience(e, index)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label-text">Start Date</label>
              <input
                type="date"
                name="startYear"
                value={workExperience.startYear}
                onChange={(e) => handleWorkExperience(e, index)}
                className="other-input w-full"
                max={new Date().toISOString().split('T')[0]}
                min="1950-01-01"
              />
            </div>
            <div>
              <label className="label-text">End Date</label>
              <input
                type="date"
                name="endYear"
                value={workExperience.endYear}
                onChange={(e) => handleWorkExperience(e, index)}
                className="other-input w-full"
                max={new Date().toISOString().split('T')[0]}
                min="1950-01-01"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="label-text">Job Description</label>
            <textarea
              placeholder="Describe your responsibilities and daily tasks..."
              name="description"
              className="other-input w-full h-24 resize-none"
              value={workExperience.description}
              maxLength="250"
              onChange={(e) => handleWorkExperience(e, index)}
            />
          </div>
          
          <div>
            <label className="label-text">Key Achievements</label>
            <textarea
              placeholder="List your major accomplishments and measurable results..."
              name="keyAchievements"
              className="other-input w-full h-28 resize-none"
              value={workExperience.keyAchievements}
              onChange={(e) => handleWorkExperience(e, index)}
            />
          </div>
        </div>
      ))}

      <FormButton
        size={resumeData.workExperience.length}
        add={addWorkExperience}
        remove={removeWorkExperience}
        sectionName="work experience"
      />
    </div>
  );
};

export default WorkExperience;
