"use client";

import React, { useState, useEffect } from "react";
import { FaExternalLinkAlt, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { ImGithub } from "react-icons/im";
import { CgWebsite } from "react-icons/cg";
import DateRange from "../utility/DateRange";
import { useSectionTitles } from "../../contexts/SectionTitleContext";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Item Component for individual items within sections
const SortableItem = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`mb-2 cursor-move ${isDragging ? "bg-gray-50 shadow-lg" : ""}`}
    >
      {children}
    </div>
  );
};

// Sortable Section Component for main sections
const SortableSection = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`mb-2 cursor-move ${isDragging ? "bg-gray-50 shadow-lg rounded" : ""}`}
    >
      {children}
    </div>
  );
};

const TemplateTwo = ({ 
  namedata, 
  positiondata, 
  contactdata, 
  emaildata, 
  addressdata, 
  telicon, 
  emailicon, 
  addressicon,
  summarydata,
  educationdata,
  projectsdata,
  workExperiencedata,
  skillsdata,
  languagesdata,
  certificationsdata,
  sectionOrder,
  enabledSections,
  onDragEnd,
  resumeData,
  setResumeData
}) => {
  const [isClient, setIsClient] = useState(false);
  const { customSectionTitles } = useSectionTitles();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sections = [
    { id: "summary", title: customSectionTitles.summary || "Summary", content: summarydata },
    { id: "education", title: customSectionTitles.education || "Education", content: educationdata },
    { id: "projects", title: customSectionTitles.projects || "Projects", content: projectsdata },
    { id: "experience", title: customSectionTitles.experience || "Work Experience", content: workExperiencedata },
    { id: "skills", title: customSectionTitles.skills || "Technical Skills", content: skillsdata },
    { id: "softskills", title: customSectionTitles.softskills || "Soft Skills", content: skillsdata?.find(skill => skill.title === "Soft Skills")?.skills || [] },
    { id: "languages", title: customSectionTitles.languages || "Languages", content: languagesdata },
    { id: "certifications", title: customSectionTitles.certifications || "Certifications", content: certificationsdata }
  ];

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end for sections
  const handleSectionDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      if (onDragEnd) {
        // Create a mock event that matches the old react-beautiful-dnd format
        const result = {
          draggableId: active.id,
          type: 'SECTION',
          source: { index: sectionOrder.indexOf(active.id) },
          destination: { index: sectionOrder.indexOf(over.id) },
        };
        onDragEnd(result);
      }
    }
  };

  // Handle drag end for items within sections
  const handleItemDragEnd = (event, sectionType) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      // Handle reordering within the same section
      if (sectionType === 'projects' && setResumeData) {
        const oldIndex = parseInt(active.id.replace('project-', ''));
        const newIndex = parseInt(over.id.replace('project-', ''));
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newProjects = arrayMove(projectsdata, oldIndex, newIndex);
          setResumeData(prev => ({ ...prev, projects: newProjects }));
        }
      } else if (sectionType === 'experience' && setResumeData) {
        const oldIndex = parseInt(active.id.replace('work-', ''));
        const newIndex = parseInt(over.id.replace('work-', ''));
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newExperience = arrayMove(workExperiencedata, oldIndex, newIndex);
          setResumeData(prev => ({ ...prev, workExperience: newExperience }));
        }
      }
    }
  };

  const orderedSections = sectionOrder
    .map(id => sections.find(section => section.id === id))
    .filter(section => {
      if (!section || (enabledSections && !enabledSections[section.id])) return false;
      // Filter out sections with empty content
      if (Array.isArray(section.content)) {
        return section.content.length > 0;
      }
      if (typeof section.content === 'string') {
        return section.content && section.content.trim().length > 0;
      }
      // If content is not array or string, assume it exists
      return section.content != null;
    });

  // Prevent hydration issues by only rendering on client
  if (!isClient) {
    return <div className="w-full h-96 bg-gray-50 animate-pulse rounded-lg"></div>;
  }

  const renderSection = (section) => {
    switch(section.id) {
      case "summary":
        return (
          <div className="mb-5">
            <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-3">
              {customSectionTitles.summary || "Profile"}
            </h2>
            <p className="text-sm text-justify leading-relaxed text-gray-800">
              {summarydata}
            </p>
          </div>
        );
      
      case "experience":
        return workExperiencedata && workExperiencedata.length > 0 ? (
          <div className="mb-5">
            <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-3">
              {customSectionTitles.experience || "Professional Experience"}
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleItemDragEnd(event, 'experience')}
            >
              <SortableContext
                items={workExperiencedata.map((_, idx) => `work-${idx}`)}
                strategy={verticalListSortingStrategy}
              >
                {workExperiencedata.map((work, idx) => (
                  <SortableItem key={`work-${idx}`} id={`work-${idx}`}>
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1">
                          <div className="text-sm">
                            <DateRange
                              startYear={work.startYear}
                              endYear={work.endYear}
                              id={`work-range-${idx}`}
                              className="font-normal text-gray-700"
                            />
                          </div>
                          <h3 className="text-base font-bold mt-1">{work.position}</h3>
                          <p className="text-sm italic text-gray-700">{work.company}</p>
                        </div>
                      </div>
                      {work.description && (
                        <p className="text-sm text-gray-800 mb-2">{work.description}</p>
                      )}
                      {work.keyAchievements && (
                        <ul className="list-disc ml-5 text-sm text-gray-800 space-y-1">
                          {work.keyAchievements.split('\n').filter(item => item.trim()).map((achievement, i) => (
                            <li key={i}>{achievement.trim()}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        ) : null;

      case "education":
        return educationdata && educationdata.length > 0 ? (
          <div className="mb-5">
            <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-3">
              {customSectionTitles.education || "Education"}
            </h2>
            {educationdata && educationdata.map((edu, idx) => (
              <div key={idx} className="mb-3">
                <div className="text-sm text-gray-700">
                  <DateRange
                    startYear={edu.startYear}
                    endYear={edu.endYear}
                    id={`edu-range-${idx}`}
                    className="font-normal"
                  />
                </div>
                <h3 className="text-base font-bold mt-1">{edu.degree}</h3>
                <p className="text-sm italic text-gray-700">{edu.school}</p>
              </div>
            ))}
          </div>
        ) : null;

      case "projects":
        return projectsdata && projectsdata.length > 0 ? (
          <div className="mb-5">
            <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-3">
              {customSectionTitles.projects || "Projects"}
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleItemDragEnd(event, 'projects')}
            >
              <SortableContext
                items={projectsdata && projectsdata.length > 0 ? projectsdata.map((_, idx) => `project-${idx}`) : []}
                strategy={verticalListSortingStrategy}
              >
                {projectsdata && projectsdata.map((project, idx) => (
                  <SortableItem key={`project-${idx}`} id={`project-${idx}`}>
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold">{project.name}</h3>
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <FaExternalLinkAlt className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          <div className="text-sm text-gray-700">
                            <DateRange
                              startYear={project.startYear}
                              endYear={project.endYear}
                              id={`project-range-${idx}`}
                              className="font-normal"
                            />
                          </div>
                        </div>
                      </div>
                      {project.description && (
                        <p className="text-sm text-gray-800 mb-2">{project.description}</p>
                      )}
                      {project.keyAchievements && (
                        <ul className="list-disc ml-5 text-sm text-gray-800 space-y-1">
                          {project.keyAchievements.split('\n').filter(item => item.trim()).map((achievement, i) => (
                            <li key={i}>{achievement.trim()}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        ) : null;

      case "skills":
        return skillsdata && skillsdata.length > 0 ? (
          <div className="mb-5">
            <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-3">
              {customSectionTitles.skills || "Skills"}
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {skillsdata && skillsdata.filter(skill => skill.title !== "Soft Skills").map((skill, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-sm font-semibold min-w-fit">{skill.title}</span>
                  <span className="flex-1">
                    {Array(5).fill(0).map((_, i) => (
                      <span key={i} className="text-xs">●</span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "softskills":
        return section.content && section.content.length > 0 ? (
          <div className="mb-5">
            <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-3">
              {customSectionTitles.softskills || "Soft Skills"}
            </h2>
            <p className="text-sm text-gray-800">
              {section.content.join(", ")}
            </p>
          </div>
        ) : null;

      case "languages":
        return section.content && Array.isArray(section.content) && section.content.length > 0 ? (
          <div className="mb-5">
            <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-3">
              {customSectionTitles.languages || "Languages"}
            </h2>
            <div className="flex flex-wrap gap-x-6 text-sm text-gray-800">
              {section.content.map((lang, idx) => (
                <span key={idx}>• {lang}</span>
              ))}
            </div>
          </div>
        ) : null;

      case "certifications":
        return certificationsdata && certificationsdata.length > 0 ? (
          <div className="mb-5">
            <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-3">
              {customSectionTitles.certifications || "Awards"}
            </h2>
            {certificationsdata.map((cert, i) => (
              <div key={i} className="mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold">{cert.name}</h3>
                  {cert.link && cert.link.trim() !== '' && (
                    <a
                      href={cert.link}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaExternalLinkAlt className="w-3 h-3" />
                    </a>
                  )}
                </div>
                {cert.issuer && (
                  <p className="text-sm italic text-gray-700">{cert.issuer}</p>
                )}
              </div>
            ))}
          </div>
        ) : null;

      default:
        return null;
    }
  };

  // Prevent hydration mismatch by showing a simple loading state on server
  if (!isClient) {
    return (
      <div className="w-full h-full bg-white p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white exclude-print" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="max-w-[800px] mx-auto p-8 print:p-6">
        {/* Header Section */}
        <div className="mb-6">
          {/* Name and Title */}
          <h1 className="text-4xl font-bold mb-1" style={{ letterSpacing: '0.02em' }}>
            {namedata}
          </h1>
          <p className="text-lg italic text-gray-700 mb-3">
            {positiondata}
          </p>
          
          {/* Contact Information */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-700">
            {addressdata && (
              <div className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-gray-600" />
                <span>{addressdata}</span>
              </div>
            )}
            {emaildata && (
              <div className="flex items-center gap-1">
                <FaEnvelope className="text-gray-600" />
                <span>{emaildata}</span>
              </div>
            )}
            {contactdata && (
              <div className="flex items-center gap-1">
                <FaPhone className="text-gray-600" />
                <span>{contactdata}</span>
              </div>
            )}
            {resumeData && resumeData.socialMedia && resumeData.socialMedia.map((social, index) => {
              const socialName = social.socialMedia.toLowerCase();
              return (
                <div key={index} className="flex items-center gap-1">
                  {socialName === 'linkedin' && <FaLinkedin className="text-gray-600" />}
                  {socialName === 'github' && <ImGithub className="text-gray-600" />}
                  {socialName === 'website' && <CgWebsite className="text-gray-600" />}
                  <a 
                    href={`http://${social.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    {social.socialMedia.toLowerCase() === 'linkedin' || social.socialMedia.toLowerCase() === 'github' 
                      ? social.socialMedia.toLowerCase() 
                      : social.link}
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Draggable Sections */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleSectionDragEnd}
        >
          <SortableContext
            items={orderedSections.map(section => section.id)}
            strategy={verticalListSortingStrategy}
          >
            {orderedSections.map((section) => (
              <SortableSection key={section.id} id={section.id}>
                {renderSection(section)}
              </SortableSection>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default TemplateTwo;