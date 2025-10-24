"use client";

import React, { useState, useEffect } from "react";
import { FaExternalLinkAlt, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaLinkedin } from "react-icons/fa";
import { ImGithub } from "react-icons/im";
import { CgWebsite } from "react-icons/cg";
import DateRange from "../utility/DateRange";
import { useSectionTitles } from "../../contexts/SectionTitleContext";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Item Component
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
      className={`cursor-move ${isDragging ? "shadow-lg" : ""}`}
    >
      {children}
    </div>
  );
};

// Sortable Section Component
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
      className={`cursor-move ${isDragging ? "shadow-lg rounded" : ""}`}
    >
      {children}
    </div>
  );
};

const TemplateTwo = ({
  namedata,
  positionData,
  contactData,
  emailData,
  addressData,
  summaryData,
  educationData,
  projectsData,
  workExperienceData,
  skillsData,
  languagesData,
  certificationsData,
  sectionOrder,
  enabledSections,
  onDragEnd,
  resumeData,
  setResumeData,
  icons,
}) => {
  const [isClient, setIsClient] = useState(false);
  const { customSectionTitles } = useSectionTitles();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle section drag end
  const handleSectionDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      if (onDragEnd) {
        const result = {
          draggableId: active.id,
          type: "SECTION",
          source: { index: sectionOrder.indexOf(active.id) },
          destination: { index: sectionOrder.indexOf(over.id) },
        };
        onDragEnd(result);
      }
    }
  };

  // Handle item drag end within sections
  const handleItemDragEnd = (event, sectionType) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      if (sectionType === "projects" && setResumeData) {
        const oldIndex = parseInt(active.id.replace("project-", ""));
        const newIndex = parseInt(over.id.replace("project-", ""));

        if (oldIndex !== -1 && newIndex !== -1) {
          const newProjects = arrayMove(projectsData, oldIndex, newIndex);
          setResumeData((prev) => ({ ...prev, projects: newProjects }));
        }
      } else if (sectionType === "experience" && setResumeData) {
        const oldIndex = parseInt(active.id.replace("work-", ""));
        const newIndex = parseInt(over.id.replace("work-", ""));

        if (oldIndex !== -1 && newIndex !== -1) {
          const newExperience = arrayMove(
            workExperienceData,
            oldIndex,
            newIndex
          );
          setResumeData((prev) => ({
            ...prev,
            workExperience: newExperience,
          }));
        }
      } else if (sectionType === "education" && setResumeData) {
        const oldIndex = parseInt(active.id.replace("edu-", ""));
        const newIndex = parseInt(over.id.replace("edu-", ""));

        if (oldIndex !== -1 && newIndex !== -1) {
          const newEducation = arrayMove(educationData, oldIndex, newIndex);
          setResumeData((prev) => ({ ...prev, education: newEducation }));
        }
      }
    }
  };

  // Define sections
  const sections = [
    { id: "summary", title: "Profile", content: summaryData },
    { id: "education", title: "Education", content: educationData },
    {
      id: "experience",
      title: "Professional Experience",
      content: workExperienceData,
    },
    { id: "projects", title: "Projects", content: projectsData },
    { id: "skills", title: "Skills", content: skillsData },
    {
      id: "softskills",
      title: "Soft Skills",
      content:
        skillsData?.find((skill) => skill.title === "Soft Skills")?.skills ||
        [],
    },
    { id: "languages", title: "Languages", content: languagesData },
    {
      id: "certifications",
      title: "Awards",
      content: certificationsData,
    },
  ];

  const orderedSections = sectionOrder
    .map((id) => sections.find((section) => section.id === id))
    .filter((section) => {
      if (!section || (enabledSections && !enabledSections[section.id]))
        return false;
      if (Array.isArray(section.content)) {
        return section.content.length > 0;
      }
      return section.content && section.content.trim().length > 0;
    });

  // Render section content
  const renderSection = (section) => {
    switch (section.id) {
      case "summary":
        return (
          <div className="mb-2.5">
            <h2 className="text-sm font-bold border-b border-black pb-0.5 mb-1.5 uppercase tracking-wide">
              {customSectionTitles.summary || "Profile"}
            </h2>
            <p className="text-xs text-justify leading-relaxed text-gray-900 font-sans">
              {summaryData}
            </p>
          </div>
        );

      case "experience":
        return workExperienceData && workExperienceData.length > 0 ? (
          <div className="mb-2.5">
            <h2 className="text-sm font-bold border-b border-black pb-0.5 mb-1.5 uppercase tracking-wide">
              {customSectionTitles.experience || "Professional Experience"}
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleItemDragEnd(event, "experience")}
            >
              <SortableContext
                items={workExperienceData.map((_, idx) => `work-${idx}`)}
                strategy={verticalListSortingStrategy}
              >
                {workExperienceData.map((work, idx) => (
                  <SortableItem key={`work-${idx}`} id={`work-${idx}`}>
                    <div className="mb-2.5">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <DateRange
                          startYear={work.startYear}
                          endYear={work.endYear}
                          id={`work-range-${idx}`}
                          className="text-xs font-normal text-gray-800"
                        />
                        <h3 className="text-sm font-bold">{work.position}</h3>
                      </div>
                      <div className="flex justify-between items-baseline mb-0.5">
                        <p className="text-xs text-gray-700">
                          {work.location || ""}
                        </p>
                        <p className="text-xs italic text-gray-700">
                          {work.company}
                        </p>
                      </div>
                      {work.description && (
                        <p className="text-xs text-gray-900 leading-relaxed font-sans mt-0.5">
                          {work.description}
                        </p>
                      )}
                      {work.keyAchievements && (
                        <ul className="list-disc ml-4 text-xs text-gray-900 space-y-0.5 mt-0.5 leading-relaxed font-sans">
                          {work.keyAchievements
                            .split("\n")
                            .filter((item) => item.trim())
                            .map((achievement, i) => (
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
        return educationData && educationData.length > 0 ? (
          <div className="mb-2.5">
            <h2 className="text-sm font-bold border-b border-black pb-0.5 mb-1.5 uppercase tracking-wide">
              {customSectionTitles.education || "Education"}
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleItemDragEnd(event, "education")}
            >
              <SortableContext
                items={educationData.map((_, idx) => `edu-${idx}`)}
                strategy={verticalListSortingStrategy}
              >
                {educationData.map((edu, idx) => (
                  <SortableItem key={`edu-${idx}`} id={`edu-${idx}`}>
                    <div className="mb-2">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <DateRange
                          startYear={edu.startYear}
                          endYear={edu.endYear}
                          id={`edu-range-${idx}`}
                          className="text-xs font-normal text-gray-800"
                        />
                        <h3 className="text-sm font-bold">{edu.degree}</h3>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <p className="text-xs text-gray-700">
                          {edu.location || ""}
                        </p>
                        <p className="text-xs italic text-gray-700">
                          {edu.school}
                        </p>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        ) : null;

      case "projects":
        return projectsData && projectsData.length > 0 ? (
          <div className="mb-2.5">
            <h2 className="text-sm font-bold border-b border-black pb-0.5 mb-1.5 uppercase tracking-wide">
              {customSectionTitles.projects || "Projects"}
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleItemDragEnd(event, "projects")}
            >
              <SortableContext
                items={projectsData.map((_, idx) => `project-${idx}`)}
                strategy={verticalListSortingStrategy}
              >
                {projectsData.map((project, idx) => (
                  <SortableItem key={`project-${idx}`} id={`project-${idx}`}>
                    <div className="mb-2.5">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <DateRange
                          startYear={project.startYear}
                          endYear={project.endYear}
                          id={`project-range-${idx}`}
                          className="text-xs font-normal text-gray-800"
                        />
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold">{project.name}</h3>
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black hover:text-gray-700"
                              >
                              <FaExternalLinkAlt className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                      {project.description && (
                        <p className="text-xs text-gray-900 leading-relaxed font-sans">
                          {project.description}
                        </p>
                      )}
                      {project.keyAchievements && (
                        <ul className="list-disc ml-4 text-xs text-gray-900 space-y-0.5 mt-0.5 leading-relaxed font-sans">
                          {project.keyAchievements
                            .split("\n")
                            .filter((item) => item.trim())
                            .map((achievement, i) => (
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
        const technicalSkills = skillsData?.filter((skill) => skill.title !== "Soft Skills") || [];
        
        return technicalSkills.length > 0 ? (
          <div className="mb-2.5">
            <h2 className="text-sm font-bold border-b border-black pb-0.5 mb-1.5 uppercase tracking-wide">
              {customSectionTitles.skills || "Skills"}
            </h2>
            {technicalSkills.map((skillGroup, idx) => (
              <div key={idx} className="mb-1.5">
                <h3 className="text-xs font-semibold text-gray-900 mb-0.5">
                  {skillGroup.title}
                </h3>
                <p className="text-xs text-gray-800 font-sans">
                  {skillGroup.skills.join(", ")}
                </p>
              </div>
            ))}
          </div>
        ) : null;

      case "softskills":
        return section.content && section.content.length > 0 ? (
          <div className="mb-2.5">
            <h2 className="text-sm font-bold border-b border-black pb-0.5 mb-1.5 uppercase tracking-wide">
              {customSectionTitles.softskills || "Soft Skills"}
            </h2>
            <p className="text-xs text-gray-900 font-sans">
              {section.content.join(", ")}
            </p>
          </div>
        ) : null;

      case "languages":
        return section.content &&
          Array.isArray(section.content) &&
          section.content.length > 0 ? (
          <div className="mb-2.5">
            <h2 className="text-sm font-bold border-b border-black pb-0.5 mb-1.5 uppercase tracking-wide">
              {customSectionTitles.languages || "Languages"}
            </h2>
            <div className="flex gap-x-8 text-xs text-gray-900 font-sans">
              {section.content.map((lang, idx) => (
                <span key={idx}>• {lang}</span>
              ))}
            </div>
          </div>
        ) : null;

      case "certifications":
        return certificationsData && certificationsData.length > 0 ? (
          <div className="mb-2.5">
            <h2 className="text-sm font-bold border-b border-black pb-0.5 mb-1.5 uppercase tracking-wide">
              {customSectionTitles.certifications || "Awards"}
            </h2>
            {certificationsData.map((cert, i) => (
              <div key={i} className="mb-1.5">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold">{cert.name || cert}</h3>
                  {cert.link && cert.link.trim() !== '' && (
                    <a
                      href={cert.link}
                      className="text-black hover:text-gray-700 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaExternalLinkAlt className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                {cert.issuer && (
                  <p className="text-xs italic text-gray-700">{cert.issuer}</p>
                )}
              </div>
            ))}
          </div>
        ) : null;

      default:
        return null;
    }
  };

  // Client-side only rendering
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
    <div
      className="w-full h-full bg-white"
      style={{ fontFamily: "serif" }}
    >
      <div
        className="max-w-[210mm] mx-auto px-4 py-3 print:px-0 print:py-0"
        style={{ fontSize: "11pt", lineHeight: "1.3" }}
      >
        {/* Header Section */}
        <div className="mb-2.5 pb-1.5">
          {/* Name and Position on same line */}
          <div className="flex items-baseline gap-3 mb-1">
            <h1
              className="text-3xl font-bold"
              style={{ letterSpacing: "0.02em", lineHeight: "1" }}
            >
              {namedata}
            </h1>
            <p className="text-base italic text-gray-700 font-serif">
              {positionData}
            </p>
          </div>

          {/* Contact Information - Two columns */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-0.5 text-xs mt-1.5">
            {/* Left column */}
            <div className="space-y-0.5">
              {addressData && (
                <div className="flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-gray-700 text-sm flex-shrink-0" />
                  <span className="text-gray-800 font-normal">{addressData}</span>
                </div>
              )}
              {contactData && (
                <div className="flex items-center gap-1.5">
                  <FaPhoneAlt className="text-gray-700 text-sm flex-shrink-0" />
                  <span className="text-gray-800 font-medium">{contactData}</span>
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-0.5">
              {emailData && (
                <div className="flex items-center gap-1.5">
                  <FaEnvelope className="text-gray-700 text-sm flex-shrink-0" />
                  <span className="text-gray-800 font-normal">{emailData}</span>
                </div>
              )}
              {resumeData &&
                resumeData.socialMedia &&
                resumeData.socialMedia.map((social, index) => {
                  const socialName = social.socialMedia.toLowerCase();
                  const icon = icons?.find(
                    (icon) => icon.name === socialName
                  );
                  return (
                    <div key={index} className="flex items-center gap-1.5">
                      {icon && React.cloneElement(icon.icon, { className: "text-gray-700 text-sm flex-shrink-0" })}
                      <a
                        href={
                          social.link.startsWith("http")
                            ? social.link
                            : `https://${social.link}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-800 hover:text-gray-900 font-medium"
                      >
                        {social.displayText || social.link}
                      </a>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Draggable Sections */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleSectionDragEnd}
        >
          <SortableContext
            items={orderedSections.map((section) => section.id)}
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