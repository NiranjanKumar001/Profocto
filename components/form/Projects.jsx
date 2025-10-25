"use client";

import FormButton from "./FormButton";
import React, { useContext } from "react";
import { ResumeContext } from "../../contexts/ResumeContext";
import EditableFormTitle from './EditableFormTitle';
import { useTodayDate, MIN_DATE } from "../../lib/dateUtils";

const Projects = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);
  const todayDate = useTodayDate();

  // Auto-select text when input is focused
  const handleFocus = (e) => {
    e.target.select();
  };

  const handleProjects = (e, index) => {
    const newProjects = [...resumeData.projects];
    newProjects[index][e.target.name] = e.target.value;
    setResumeData({ ...resumeData, projects: newProjects });
  };

  const addProjects = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        {
          title: "",
          link: "",
          description: "",
          keyAchievements: "",
          startYear: "",
          endYear: "",
        },
      ],
    });
  };

  const removeProjects = (index) => {
    const newProjects = [...resumeData.projects];
    newProjects[index] = newProjects[newProjects.length - 1];
    newProjects.pop();
    setResumeData({ ...resumeData, projects: newProjects });
  };



  return (
    <div className="form-section">
      <div className="form-section-title">
        <EditableFormTitle 
          sectionKey="projects" 
          defaultTitle="Projects" 
        />
      </div>

      {resumeData.projects.map((project, index) => (
        <div key={index} className="section-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label-text">Project Name</label>
              <input
                type="text"
                placeholder="Project Title"
                name="name"
                className="other-input w-full"
                value={project.name}
                onChange={(e) => handleProjects(e, index)}
                onFocus={handleFocus}
              />
            </div>
            <div>
              <label className="label-text">Project Link</label>
              <input
                type="url"
                placeholder="https://example.com/project"
                name="link"
                className="other-input w-full"
                value={project.link}
                onChange={(e) => handleProjects(e, index)}
                onFocus={handleFocus}
                pattern="https?://.+"
                title="Please enter a valid URL starting with http:// or https://"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label-text">Start Date</label>
              <input
                type="date"
                name="startYear"
                value={project.startYear}
                onChange={(e) => handleProjects(e, index)}
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
                value={project.endYear}
                onChange={(e) => handleProjects(e, index)}
                className="other-input w-full"
                max={new Date().toISOString().split('T')[0]}
                min="1950-01-01"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="label-text">Project Description</label>
            <textarea
              placeholder="Describe your project, technologies used, and your role..."
              name="description"
              className="other-input w-full h-24 resize-none"
              value={project.description}
              maxLength="250"
              onChange={(e) => handleProjects(e, index)}
              onFocus={handleFocus}
            />
          </div>

          <div>
            <label className="label-text">Key Achievements</label>
            <textarea
              placeholder="List major accomplishments and measurable results..."
              name="keyAchievements"
              className="other-input w-full h-28 resize-none"
              value={project.keyAchievements}
              onChange={(e) => handleProjects(e, index)}
              onFocus={handleFocus}
            />
          </div>
        </div>
      ))}

      <FormButton
        size={resumeData.projects.length}
        add={addProjects}
        remove={removeProjects}
        sectionName="project"
      />
    </div>
  );
};

export default Projects;
