"use client";

import React, { useState, useEffect } from "react";
import {
  FaExternalLinkAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaLinkedin,
} from "react-icons/fa";
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`cursor-move ${isDragging ? "shadow-lg" : ""}`}>
      {children}
    </div>
  );
};

// Sortable Section Component
const SortableSection = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`cursor-move ${isDragging ? "shadow-lg rounded" : ""}`}>
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
  awardsData, 
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
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Handle section drag end
  const handleSectionDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id && onDragEnd) {
      const result = {
        draggableId: active.id,
        type: "SECTION",
        source: { index: sectionOrder.indexOf(active.id) },
        destination: { index: sectionOrder.indexOf(over.id) },
      };
      onDragEnd(result);
    }
  };

  // Handle item drag end within sections
  const handleItemDragEnd = (event, sectionType) => {
    const { active, over } = event;
    if (active.id === over?.id) return;

    const moveData = (data, key, prefix) => {
      const oldIndex = parseInt(active.id.replace(`${prefix}-`, ""));
      const newIndex = parseInt(over.id.replace(`${prefix}-`, ""));
      if (oldIndex !== -1 && newIndex !== -1) {
        const newData = arrayMove(data, oldIndex, newIndex);
        setResumeData((prev) => ({ ...prev, [key]: newData }));
      }
    };

    switch (sectionType) {
      case "projects":
        moveData(projectsData, "projects", "project");
        break;
      case "experience":
        moveData(workExperienceData, "workExperience", "work");
        break;
      case "education":
        moveData(educationData, "education", "edu");
        break;
      case "awards":
        moveData(awardsData, "awards", "award");
        break;
      default:
        break;
    }
  };

  // Define sections
  const sections = [
    { id: "summary", title: "Profile", content: summaryData },
    { id: "education", title: "Education", content: educationData },
    { id: "experience", title: "Professional Experience", content: workExperienceData },
    { id: "projects", title: "Projects", content: projectsData },
    { id: "skills", title: "Skills", content: skillsData },
    {
      id: "softskills",
      title: "Soft Skills",
      content: skillsData?.find((s) => s.title === "Soft Skills")?.skills || [],
    },
    { id: "languages", title: "Languages", content: languagesData },
    { id: "certifications", title: "Certifications", content: certificationsData },
    { id: "awards", title: "Awards & Achievements", content: awardsData }, // ✅ Added
  ];

  const orderedSections = sectionOrder
    .map((id) => sections.find((s) => s.id === id))
    .filter((s) => s && (!enabledSections || enabledSections[s.id]) && (Array.isArray(s.content) ? s.content.length > 0 : s.content));

  // Render Section
  const renderSection = (section) => {
    switch (section.id) {
      case "summary":
        return (
          <div className="mb-2.5">
            <h2 className="text-sm font-bold border-b border-black pb-0.5 mb-1.5 uppercase">
              {customSectionTitles.summary || "Profile"}
            </h2>
            <p className="text-xs text-justify text-gray-900">{summaryData}</p>
          </div>
        );

      case "education":
        return educationData?.length ? (
          <div className="mb-2.5">
            <h2 className="text-sm font-bold border-b border-black pb-0.5 mb-1.5 uppercase">
              {customSectionTitles.education || "Education"}
            </h2>
            <DndContext sensors={sensors} onDragEnd={(e) => handleItemDragEnd(e, "education")}>
              <SortableContext items={educationData.map((_, i) => `edu-${i}`)} strategy={verticalListSortingStrategy}>
                {educationData.map((edu, idx) => (
                  <SortableItem key={`edu-${idx}`} id={`edu-${idx}`}>
                    <div className="mb-2">
                      <div className="flex justify-between">
                        <DateRange startYear={edu.startYear} endYear={edu.endYear} className="text-xs" />
                        <h3 className="text-sm font-bold">{edu.degree}</h3>
                      </div>
                      <div className="flex justify-between text-xs">
                        <p>{edu.school}</p>
                        <p>{edu.location}</p>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        ) : null;

      case "experience":
        return workExperienceData?.length ? (
          <div className="mb-2.5">
            <h2 className="text-sm font-bold border-b border-black pb-0.5 mb-1.5 uppercase">
              {customSectionTitles.experience || "Professional Experience"}
            </h2>
            <DndContext sensors={sensors} onDragEnd={(e) => handleItemDragEnd(e, "experience")}>
              <SortableContext items={workExperienceData.map((_, i) => `work-${i}`)} strategy={verticalListSortingStrategy}>
                {workExperienceData.map((work, idx) => (
                  <SortableItem key={`work-${idx}`} id={`work-${idx}`}>
                    <div className="mb-2.5">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <DateRange startYear={work.startYear} endYear={work.endYear} className="text-xs" />
                        <h3 className="text-sm font-bold">{work.position}</h3>
                      </div>
                      <p className="text-xs italic text-gray-700">{work.company}</p>
                      {work.description && <p className="text-xs text-gray-900 mt-0.5">{work.description}</p>}
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        ) : null;

      case "projects":
        return projectsData?.length ? (
          <div className="mb-2.5">
            <h2 className="text-sm font-bold border-b border-black pb-0.5 mb-1.5 uppercase">
              {customSectionTitles.projects || "Projects"}
            </h2>
            <DndContext sensors={sensors} onDragEnd={(e) => handleItemDragEnd(e, "projects")}>
              <SortableContext items={projectsData.map((_, i) => `project-${i}`)} strategy={verticalListSortingStrategy}>
                {projectsData.map((project, idx) => (
                  <SortableItem key={`project-${idx}`} id={`project-${idx}`}>
                    <div className="mb-2.5">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-bold">{project.name}</h3>
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700">
                            <FaExternalLinkAlt className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                      {project.description && <p className="text-xs text-gray-900 mt-0.5">{project.description}</p>}
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        ) : null;

      case "skills":
        const technicalSkills = skillsData?.filter((s) => s.title !== "Soft Skills") || [];
        return technicalSkills.length > 0 ? (
          <div className="mb-2.5">
            <h2 className="text-sm font-bold border-b border-black pb-0.5 mb-1.5 uppercase">
              {customSectionTitles.skills || "Skills"}
            </h2>
            {technicalSkills.map((skillGroup, idx) => (
              <div key={idx} className="mb-1.5">
                <h3 className="text-xs font-bold">{skillGroup.title}</h3>
                <p className="text-xs text-gray-900">{skillGroup.skills.join(" • ")}</p>
              </div>
            ))}
          </div>
        ) : null;

      case "softskills":
        const softSkillsGroup = skillsData?.find((s) => s.title === "Soft Skills");
        return softSkillsGroup?.skills?.length > 0 ? (
          <div className="mb-2.5">
            <h2 className="text-sm font-bold border-b border-black pb-0.5 mb-1.5 uppercase">
              {customSectionTitles.softskills || "Soft Skills"}
            </h2>
            <p className="text-xs text-gray-900">{softSkillsGroup.skills.join(" • ")}</p>
          </div>
        ) : null;

      case "languages":
        return languagesData?.length ? (
          <div className="mb-2.5">
            <h2 className="text-sm font-bold border-b border-black pb-0.5 mb-1.5 uppercase">
              {customSectionTitles.languages || "Languages"}
            </h2>
            <p className="text-xs font-light text-gray-900 leading-relaxed">
              {languagesData.map((lang) => 
                typeof lang === 'string' ? lang : lang.name
              ).join(", ")}
            </p>
          </div>
        ) : null;

      case "certifications":
        return certificationsData?.length ? (
          <div className="mb-2.5">
            <h2 className="text-sm font-bold border-b border-black pb-0.5 mb-1.5 uppercase">
              {customSectionTitles.certifications || "Certifications"}
            </h2>
            {certificationsData.map((cert, idx) => {
              // Format date to match DateRange style
              const formatDate = (dateString) => {
                if (!dateString) return '';
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return dateString;
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return `${months[date.getMonth()]}, ${date.getFullYear()}`;
              };
              
              return (
                <div key={idx} className="mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold">{cert.name}</h3>
                    {cert.link && (
                      <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700">
                        <FaExternalLinkAlt className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                  {cert.issuer && <p className="text-xs italic text-gray-700">{cert.issuer}</p>}
                  {cert.date && <p className="text-xs text-gray-700">{formatDate(cert.date)}</p>}
                </div>
              );
            })}
          </div>
        ) : null;

      case "awards":
        return awardsData?.length ? (
          <div className="mb-2.5">
            <h2 className="text-sm font-bold border-b border-black pb-0.5 mb-1.5 uppercase">
              {customSectionTitles.awards || "Awards & Achievements"}
            </h2>
            <DndContext sensors={sensors} onDragEnd={(e) => handleItemDragEnd(e, "awards")}>
              <SortableContext items={awardsData.map((_, i) => `award-${i}`)} strategy={verticalListSortingStrategy}>
                {awardsData.map((award, idx) => {
                  // Format date to match DateRange style
                  const formatDate = (dateString) => {
                    if (!dateString) return '';
                    const date = new Date(dateString);
                    if (isNaN(date.getTime())) return dateString;
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return `${months[date.getMonth()]}, ${date.getFullYear()}`;
                  };
                  
                  return (
                    <SortableItem key={`award-${idx}`} id={`award-${idx}`}>
                      <div className="mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-xs font-bold">{award.title || award.name}</h3>
                          {award.link && (
                            <a href={award.link} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700">
                              <FaExternalLinkAlt className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                        {award.issuer && <p className="text-xs italic text-gray-700">{award.issuer}</p>}
                        {award.date && <p className="text-xs text-gray-700">{formatDate(award.date)}</p>}
                        {award.description && <p className="text-xs text-gray-900 mt-0.5">{award.description}</p>}
                      </div>
                    </SortableItem>
                  );
                })}
              </SortableContext>
            </DndContext>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  if (!isClient)
    return <div className="w-full h-full bg-gray-100 animate-pulse p-8 rounded">Loading...</div>;

  return (
    <div className="w-full h-full bg-white" style={{ fontFamily: "serif" }}>
      <div className="max-w-[210mm] mx-auto px-4 py-3">
        {/* Header */}
        <div className="mb-2.5 pb-1.5">
          <div className="flex items-baseline gap-3 mb-1">
            <h1 className="text-3xl font-bold">{namedata}</h1>
            <p className="text-base italic text-gray-700">{positionData}</p>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-x-8 text-xs">
            <div className="space-y-0.5">
              {addressData && (
                <div className="flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-gray-700 text-sm" />
                  <span>{addressData}</span>
                </div>
              )}
              {contactData && (
                <div className="flex items-center gap-1.5">
                  <FaPhoneAlt className="text-gray-700 text-sm" />
                  <span>{contactData}</span>
                </div>
              )}
              {emailData && (
                <div className="flex items-center gap-1.5">
                  <FaEnvelope className="text-gray-700 text-sm" />
                  <span>{emailData}</span>
                </div>
              )}
            </div>
            <div className="space-y-0.5">
              {/* Social Media Links */}
              {resumeData?.socialMedia?.length > 0 && resumeData.socialMedia.map((socialMedia, index) => {
                const icon = icons?.find(
                  (icon) => icon.name === socialMedia.socialMedia.toLowerCase()
                );
                return (
                  <a
                    href={`${
                      socialMedia.socialMedia.toLowerCase() === "website"
                        ? "https://"
                        : socialMedia.socialMedia.toLowerCase() === "linkedin"
                        ? "https://www."
                        : "https://www."
                    }${socialMedia.link}`}
                    key={index}
                    className="flex items-center gap-1.5 text-gray-900 hover:text-gray-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {icon && React.cloneElement(icon.icon, { className: 'text-gray-700 text-sm' })}
                    <span>{socialMedia.displayText || socialMedia.link}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sections */}
        <DndContext sensors={sensors} onDragEnd={handleSectionDragEnd}>
          <SortableContext items={orderedSections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
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