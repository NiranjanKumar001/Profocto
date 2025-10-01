"use client";

import React, { useState, useEffect } from "react";
import ContactInfo from "./ContactInfo";
import Link from "next/link";
import { FaExternalLinkAlt, FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import Certification from "./Certification";
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
    { id: "softskills", title: customSectionTitles.softskills || "Soft Skills", content: skillsdata.find(skill => skill.title === "Soft Skills")?.skills || [] },
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
    .filter(section => section !== undefined && (!enabledSections || enabledSections[section.id]));

  // Prevent hydration issues by only rendering on client
  if (!isClient) {
    return <div className="w-full h-96 bg-gray-50 animate-pulse rounded-lg"></div>;
  }

  const renderSection = (section) => {
    switch(section.id) {
      case "certifications":
        return (
          <div>
            <h2 className="section-title text-xl font-bold text-pink-700 border-b-2 border-pink-200 mb-3 pb-1 tracking-wide">
              {customSectionTitles.certifications || "Certifications"}
            </h2>
        <ul className="list-disc pl-4 content text-gray-700">
              {certificationsdata && certificationsdata.map((cert, i) => (
                <li key={i} className="content">
                  <div className="flex items-center gap-2">
                    <span>
                      {cert.name}
                      {cert.issuer && (
                        <span className="text-gray-600"> - {cert.issuer}</span>
                      )}
                    </span>
                    {cert.link && cert.link.trim() !== '' && (
                      <Link
                        href={cert.link}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaExternalLinkAlt className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      case "summary":
        return (
          <div>
            <h2 className="section-title text-xl font-bold text-pink-700 border-b-2 border-pink-200 mb-3 pb-1 tracking-wide">
              {customSectionTitles.summary || "Summary"}
            </h2>
            <p className="content text-gray-800 text-base leading-relaxed">{summarydata}</p>
          </div>
        );
      case "education":
        return (
          <div>
            <h2 className="section-title text-xl font-bold text-pink-700 border-b-2 border-pink-200 mb-3 pb-1 tracking-wide">
              {customSectionTitles.education || "Education"}
            </h2>
            {educationdata && educationdata.map((edu, idx) => (
              <div key={idx} className="mb-1 flex justify-between items-start">
                <div className="flex-1">
                  <p className="content font-semibold text-gray-900">{edu.school}</p>
                  <p className="content text-gray-700">{edu.degree}</p>
                </div>
                <div className="ml-4 text-right">
                  <p className="sub-content font-medium text-pink-600">
                    {new Date(edu.startYear).getFullYear()} - {new Date(edu.endYear).getFullYear()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
      case "projects":
        return (
          <div>
            <h2 className="section-title text-xl font-bold text-pink-700 border-b-2 border-pink-200 mb-3 pb-1 tracking-wide">
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
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <p className="content i-bold text-gray-900 font-semibold">{project.name}</p>
                        {project.link && (
                          <Link
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                            title={project.link}
                          >
                            <FaExternalLinkAlt size={12} />
                          </Link>
                        )}
                      </div>
                      <p className="sub-content font-medium text-pink-600">
                        {new Date(project.startYear).getFullYear()} - {new Date(project.endYear).getFullYear()}
                      </p>
                    </div>
                    <p className="content text-gray-700">{project.description}</p>
                    {project.keyAchievements && (
                      <ul className="list-disc pl-4 content">
                        {project.keyAchievements.split('\n').map((achievement, i) => (
                          <li key={i} className="content text-gray-700">{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        );
      case "experience":
        return (
          <div>
            <h2 className="section-title text-xl font-bold text-pink-700 border-b-2 border-pink-200 mb-3 pb-1 tracking-wide">
              {customSectionTitles.experience || "Work Experience"}
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleItemDragEnd(event, 'experience')}
            >
              <SortableContext
                items={workExperiencedata && workExperiencedata.length > 0 ? workExperiencedata.map((_, idx) => `work-${idx}`) : []}
                strategy={verticalListSortingStrategy}
              >
                {workExperiencedata && workExperiencedata.map((work, idx) => (
                  <SortableItem key={`work-${idx}`} id={`work-${idx}`}>
                    <div className="flex justify-between items-center">
                      <p className="content text-gray-900 font-semibold">
                        <span>{work.company}</span>
                        <span className="mx-1">-</span>
                        <span className="text-pink-700">{work.position}</span>
                      </p>
                      <p className="sub-content font-medium text-pink-600">
                        {new Date(work.startYear).getFullYear()} - {new Date(work.endYear).getFullYear()}
                      </p>
                    </div>
                    <p className="content text-gray-700">{work.description}</p>
                    <p className="content text-gray-700">{work.keyAchievements}</p>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        );
      case "skills":
        return (
          <div>
            <h2 className="section-title text-xl font-bold text-pink-700 border-b-2 border-pink-200 mb-3 pb-1 tracking-wide">
              {customSectionTitles.skills || "Technical Skills"}
            </h2>
            <div className="content text-gray-700">
              {skillsdata && skillsdata
                .filter(skill => skill.title !== "Soft Skills")
                .map((skillCategory, index) => (
                  <div key={index} className="mb-3">
                    <h3 className="font-semibold text-sm text-pink-700 mb-1">
                      {skillCategory.title}
                    </h3>
                    <p className="text-gray-700">
                      {skillCategory.skills && skillCategory.skills.join(", ")}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        );
      case "softskills":
        return (
          <div>
            <h2 className="section-title text-xl font-bold text-pink-700 border-b-2 border-pink-200 mb-3 pb-1 tracking-wide">
              {customSectionTitles.softskills || "Soft Skills"}
            </h2>
            <p className="content text-gray-700">
              {skillsdata && skillsdata.find(skill => skill.title === "Soft Skills")?.skills?.join(", ")}
            </p>
          </div>
        );
      case "languages":
        return (
          <div>
            <h2 className="section-title text-xl font-bold text-pink-700 border-b-2 border-pink-200 mb-3 pb-1 tracking-wide">
              {customSectionTitles.languages || "Languages"}
            </h2>
            <p className="content text-gray-700">
              {section.content && Array.isArray(section.content) ? section.content.join(", ") : ""}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const icons = [
    { name: "linkedin", icon: <FaLinkedin /> },
    { name: "twitter", icon: <FaTwitter /> },
    { name: "facebook", icon: <FaFacebook /> },
    { name: "instagram", icon: <FaInstagram /> },
    { name: "youtube", icon: <FaYoutube /> },
    { name: "website", icon: <CgWebsite /> },
  ];

  // Function to extract username from URL
  const getUsername = (url) => {
    return url.split('/').pop();
  };

  // Prevent hydration mismatch by showing a simple loading state on server
  if (!isClient) {
    return (
      <div className="w-full h-full bg-white p-4">
        <div className="text-center mb-2">
          <h1 className="name">{namedata}</h1>
          <p className="profession">{positiondata}</p>
        </div>
        <div className="animate-pulse">
          <div className="space-y-4">
            {orderedSections.map((section) => (
              <div key={section.id} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
  <div className="w-full h-full bg-gradient-to-br from-gray-50 via-pink-50 to-white p-4 min-h-screen">
      {/* Header Section */}
  <div className="text-center mb-6 p-6 rounded-xl shadow-2xl bg-gradient-to-r from-white via-pink-50 to-white border border-pink-100 relative transition-all duration-500">
        {/* Profile Picture */}
        {resumeData?.profilePicture && resumeData.profilePicture.trim() !== "" && (
          <img
            src={resumeData.profilePicture}
            alt="Profile"
            className="mx-auto mb-3 w-24 h-24 rounded-full object-cover border-4 border-pink-300 shadow-2xl transition-all duration-500 hover:scale-105"
            style={{ fontFamily: '"Playfair Display", serif' }}
          />
        )}
  <h1 className="name text-4xl font-extrabold text-pink-800 tracking-tight mb-1" style={{ fontFamily: '"Playfair Display", serif' }}>{namedata}</h1>
  <p className="profession text-lg text-pink-600 font-semibold mb-2" style={{ fontFamily: '"Montserrat", sans-serif' }}>{positiondata}</p>
        <ContactInfo
          mainclass="flex flex-row gap-3 contact justify-center mb-2"
          linkclass="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white hover:bg-pink-100 transition-all duration-300 text-gray-700 shadow-sm border border-pink-100"
          teldata={contactdata}
          emaildata={emaildata}
          addressdata={addressdata}
          telicon={telicon}
          emailicon={emailicon}
          addressicon={addressicon}
        />
  <div className="flex justify-center items-center gap-2 mt-2 text-base">
          {resumeData && resumeData.socialMedia && resumeData.socialMedia.map((socialMedia, index) => {
            return (
              <a
                href={`http://${socialMedia.link}`}
                aria-label={socialMedia.socialMedia}
                key={index}
                title={socialMedia.socialMedia}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-100 hover:bg-pink-200 transition-all duration-300 text-pink-700 font-semibold shadow border border-pink-200"
              >
                {icons.map((icon, idx) => {
                  if (icon.name === socialMedia.socialMedia.toLowerCase()) {
                    return <span key={idx} className="text-lg">{icon.icon}</span>;
                  }
                })}
                <span className="ml-1">{getUsername(socialMedia.link)}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Draggable Sections with Modern @dnd-kit */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleSectionDragEnd}
      >
        <SortableContext
          items={orderedSections.map(section => section.id)}
          strategy={verticalListSortingStrategy}
        >
          {orderedSections.map((section, index) => (
            <SortableSection key={section.id} id={section.id}>
              <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-6 mb-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                {renderSection(section)}
              </div>
            </SortableSection>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TemplateTwo;