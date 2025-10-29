"use client";

import React, { useContext } from "react";
import { ResumeContext } from "../../contexts/ResumeContext";
import FormButton from "./FormButton";
import EditableFormTitle from './EditableFormTitle';

const Skill = ({ title }) => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  // Auto-select text when input is focused
  const handleFocus = (e) => {
    e.target.select();
  };

  // skills
  const handleSkill = (e, index, title) => {
    const newSkills = [
      ...resumeData.skills.find((skillType) => skillType.title === title)
        .skills,
    ];
    newSkills[index] = e.target.value;
    setResumeData((prevData) => ({
      ...prevData,
      skills: prevData.skills.map((skill) =>
        skill.title === title ? { ...skill, skills: newSkills } : skill
      ),
    }));
  };

  const addSkill = (title) => {
    setResumeData((prevData) => {
      const skillType = prevData.skills.find(
        (skillType) => skillType.title === title
      );
      const newSkills = [...skillType.skills, ""];
      const updatedSkills = prevData.skills.map((skill) =>
        skill.title === title ? { ...skill, skills: newSkills } : skill
      );
      return {
        ...prevData,
        skills: updatedSkills,
      };
    });
  };

  const removeSkill = (title, index) => {
    setResumeData((prevData) => {
      const skillType = prevData.skills.find(
        (skillType) => skillType.title === title
      );
      const newSkills = [...skillType.skills];
      newSkills.pop();
      const updatedSkills = prevData.skills.map((skill) =>
        skill.title === title ? { ...skill, skills: newSkills } : skill
      );
      return {
        ...prevData,
        skills: updatedSkills,
      };
    });
  };

  const skillType = resumeData.skills.find(
    (skillType) => skillType.title === title
  );

  // If skillType is not found, don't render the component
  if (!skillType) {
    // Skill type not found in resumeData.skills
    return null;
  }

  // Map skill titles to section keys
  const getSectionKey = (title) => {
    if (title === "Programming Languages") return "programming";
    if (title === "Frameworks & Technologies") return "frameworks";
    if (title === "Cloud & Databases") return "clouddb";
    if (title === "Soft Skills") return "softskills";
    if (title === "Technical Skills") return "skills";
    return "skills"; // default fallback
  };

  return (
    <div className="form-section">
      <div className="form-section-title">
        <EditableFormTitle 
          sectionKey={getSectionKey(title)} 
          defaultTitle={title} 
          className="input-title"
        />
      </div>

      <div className="section-card">
        {skillType.skills.map((skill, index) => (
          <div key={index} className="mb-3 last:mb-0">
            <input
              type="text"
              placeholder={`Add ${title.toLowerCase()}`}
              name={title}
              className="w-full other-input"
              value={skill}
              onChange={(e) => handleSkill(e, index, title)}
              onFocus={handleFocus}
            />
          </div>
        ))}
      </div>

      <FormButton
        size={skillType.skills.length}
        add={() => addSkill(title)}
        remove={() => removeSkill(title)}
        sectionName="skill"
      />
    </div>
  );
};

export default Skill;
