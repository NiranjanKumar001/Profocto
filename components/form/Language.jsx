"use client";

import React, { useContext } from "react";
import { ResumeContext } from "../../contexts/ResumeContext";
import FormButton from "./FormButton";
import EditableFormTitle from './EditableFormTitle';

const Language = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);
  const skillType = "languages";
  const title = "Languages";
  const placeholder = "Language";

  const handleSkills = (e, index, skillType) => {
    const newSkills = [...resumeData[skillType]];
    newSkills[index] = e.target.value;
    setResumeData({ ...resumeData, [skillType]: newSkills });
  };

  const addSkill = () => {
    setResumeData({ ...resumeData, [skillType]: [...resumeData[skillType], ""] });
  };

  const removeSkill = (index) => {
    const newSkills = [...resumeData[skillType]];
    newSkills.splice(-1, 1);
    setResumeData({ ...resumeData, [skillType]: newSkills });
  };  

  return (
    <div className="form-section">
      <div className="form-section-title">
        <EditableFormTitle 
          sectionKey="languages" 
          defaultTitle={title} 
        />
      </div>

      <div className="section-card">
        {resumeData[skillType].map((skill, index) => (
          <div key={index} className="mb-3 last:mb-0">
            <input
              type="text"
              placeholder="e.g., English (Native), Spanish (Fluent)"
              name="skill"
              className="w-full other-input"
              value={skill}
              onChange={(e) => handleSkills(e, index, skillType)}
            />
          </div>
        ))}
      </div>

      <FormButton 
        size={resumeData[skillType].length} 
        add={addSkill} 
        remove={removeSkill}
        sectionName="language"
      />
    </div>
  );
};

export default Language;