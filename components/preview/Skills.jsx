"use client";

import React, { useContext } from "react";
import { ResumeContext } from "../../contexts/ResumeContext";

const Skills = ({ title, skills }) => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  const handleTitleChange = (e) => {
    const newSkills = [...resumeData.skills];
    newSkills.find((skillType) => skillType.title === title).title = e.target.innerText;
    setResumeData({ ...resumeData, skills: newSkills });
  };

  return (
    skills.length > 0 && (
      <>
        <h2
          className="section-title mb-3 pb-1 border-b-2 border-pink-200 editable text-xl font-bold text-pink-700 tracking-wide"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTitleChange}
        >
          {title}
        </h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-4 py-1 rounded-full bg-gradient-to-r from-pink-100 via-blue-100 to-pink-100 text-pink-700 font-semibold shadow hover:scale-105 transition-transform duration-200 border border-pink-200 text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </>
    )
  );
};

export default Skills;