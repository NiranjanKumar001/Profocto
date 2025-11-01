"use client";
import React from "react";
import { FaExternalLinkAlt, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaLinkedin } from "react-icons/fa";
import { ImGithub } from "react-icons/im";
import { CgWebsite } from "react-icons/cg";
import Image from "next/image";
import DateRange from "../utility/DateRange";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { DndContext, closestCenter } from "@dnd-kit/core";
import Link from "next/link";
import { useSectionTitles } from "../../contexts/SectionTitleContext";
import { SortableItem, SortableSection } from "./Preview";
import { useEffect, useState } from "react";

// Smart Template - Catherine Bale Style with Profile Picture Support
const TemplateFive = ({
  resumeData,
  sectionOrder,
  enabledSections,
  handleDragEnd,
  sensors,
  icons,
  setResumeData,
}) => {
  const { customSectionTitles } = useSectionTitles();
  const [isClient, setIsClient] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle drag end for items within sections
  const handleItemDragEnd = (event, sectionType) => {
    const { active, over } = event;

    if (active.id !== over?.id && setResumeData) {
      const moveData = (prefix, dataKey) => {
        const oldIndex = parseInt(active.id.replace(prefix, ""));
        const newIndex = parseInt(over.id.replace(prefix, ""));
        if (oldIndex !== -1 && newIndex !== -1) {
          const newData = arrayMove(resumeData[dataKey], oldIndex, newIndex);
          setResumeData((prev) => ({ ...prev, [dataKey]: newData }));
        }
      };

      switch (sectionType) {
        case "projects":
          moveData("project-", "projects");
          break;
        case "experience":
          moveData("work-", "workExperience");
          break;
        case "education":
          moveData("edu-", "education");
          break;
        case "skills":
          const filteredSkills = resumeData.skills.filter(group => group.title !== "Soft Skills");
          const oldIndex = parseInt(active.id.replace("skill-", ""));
          const newIndex = parseInt(over.id.replace("skill-", ""));
          if (oldIndex !== -1 && newIndex !== -1) {
            const newSkills = arrayMove(filteredSkills, oldIndex, newIndex);
            const softSkills = resumeData.skills.find(group => group.title === "Soft Skills");
            const finalSkills = softSkills ? [...newSkills, softSkills] : newSkills;
            setResumeData((prev) => ({ ...prev, skills: finalSkills }));
          }
          break;
        case "certifications":
          moveData("cert-", "certifications");
          break;
        case "awards":
          moveData("award-", "awards");
          break;
      }
    }
  };

  const sections = [
    {
      id: "summary",
      title: "Professional Summary",
      content: resumeData.summary,
    },
    { id: "education", title: "Education", content: resumeData.education },
    {
      id: "experience",
      title: "Experience",
      content: resumeData.workExperience,
    },
    { id: "projects", title: "Projects", content: resumeData.projects },
    { id: "skills", title: "Skills", content: resumeData.skills },
    {
      id: "softSkills",
      title: "Soft Skills",
      content:
        resumeData.skills.find((skill) => skill.title === "Soft Skills")
          ?.skills || [],
    },
    { id: "languages", title: "Languages", content: resumeData.languages || [] },
    {
      id: "certifications",
      title: "Certifications",
      content: resumeData.certifications,
    },
    {
      id: "awards",
      title: "Awards",
      content: resumeData.awards,
    },
  ];

  const orderedSections = sectionOrder
    .map((id) => sections.find((section) => section.id === id))
    .filter((section) => {
      if (!section || !enabledSections[section.id]) return false;
      // Filter out sections with empty content
      if (Array.isArray(section.content)) {
        return section.content.length > 0;
      }
      return section.content && section.content.trim().length > 0;
    });

  const renderSection = (section) => {
    switch (section.id) {
      case "summary":
        return (
          <div className='mb-4'>
            <h2 className='text-sm font-bold uppercase mb-2 pb-0.5 border-b border-gray-400'>
              {customSectionTitles.summary || "Summary"}
            </h2>
            <p className='text-xs leading-relaxed font-sans text-gray-800'>
              {resumeData.summary}
            </p>
          </div>
        );

      case "education":
        return resumeData.education.length > 0 ? (
          <div className='mb-4'>
            <h2 className='text-sm font-bold uppercase mb-2 pb-0.5 border-b border-gray-400'>
              {customSectionTitles.education || "Education"}
            </h2>
            {!isMobileView ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleItemDragEnd(event, "education")}
              >
                <SortableContext
                  items={resumeData.education.map((_, idx) => `edu-${idx}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {resumeData.education.map((item, index) => (
                    <SortableItem key={`edu-${index}`} id={`edu-${index}`}>
                      <div className='mb-3'>
                        <div className='flex justify-between items-baseline mb-1'>
                          <h3 className='text-xs font-semibold text-black'>
                            {item.degree}
                          </h3>
                          <DateRange
                            startYear={item.startYear}
                            endYear={item.endYear}
                            id={`education-${index}`}
                            className='text-xs text-gray-600'
                          />
                        </div>
                        <p className='text-xs font-light text-black'>{item.school}</p>
                      </div>
                    </SortableItem>
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              resumeData.education.map((item, index) => (
                <div
                  key={index}
                  className='mb-3'
                >
                  <div className='flex justify-between items-baseline mb-1'>
                    <h3 className='text-xs font-semibold text-black'>
                      {item.degree}
                    </h3>
                    <DateRange
                      startYear={item.startYear}
                      endYear={item.endYear}
                      id={`education-${index}`}
                      className='text-xs text-gray-600'
                    />
                  </div>
                  <p className='text-xs font-light text-black'>{item.school}</p>
                </div>
              ))
            )}
          </div>
        ) : null;

      case "experience":
        return resumeData.workExperience.length > 0 ? (
          <div className='mb-4'>
            <h2 className='text-sm font-bold uppercase mb-2 pb-0.5 border-b border-gray-400'>
              {customSectionTitles.experience || "Professional Experience"}
            </h2>
            {!isMobileView ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleItemDragEnd(event, "experience")}
              >
                <SortableContext
                  items={resumeData.workExperience.map((_, idx) => `work-${idx}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {resumeData.workExperience.map((item, index) => (
                  <SortableItem key={`work-${index}`} id={`work-${index}`}>
                    <div className='mb-3'>
                      <div className='flex justify-between items-baseline mb-1'>
                        <h3 className='text-xs font-bold'>
                          {item.position}
                        </h3>
                        <DateRange
                          startYear={item.startYear}
                          endYear={item.endYear}
                          id={`work-experience-${index}`}
                          className='text-xs text-gray-600'
                        />
                      </div>
                      <p className='text-xs text-gray-700 mb-1'>{item.company}</p>
                      {item.description && (
                        <p className='text-xs font-sans leading-relaxed mb-1.5 text-gray-800'>
                          {item.description}
                        </p>
                      )}
                      {typeof item.keyAchievements === "string" &&
                        item.keyAchievements.trim() && (
                          <ul className='list-disc list-inside text-xs font-sans leading-relaxed space-y-0.5 text-gray-800'>
                            {item.keyAchievements
                              .split("\n")
                              .filter((achievement) => achievement.trim())
                              .map((achievement, subIndex) => (
                                <li key={`${item.company}-${index}-${subIndex}`}>
                                  {achievement}
                                </li>
                              ))}
                          </ul>
                        )}
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
            ) : (
              resumeData.workExperience.map((item, index) => (
                <div key={index} className='mb-3'>
                  <div className='flex justify-between items-baseline mb-1'>
                    <h3 className='text-xs font-bold'>
                      {item.position}
                    </h3>
                    <DateRange
                      startYear={item.startYear}
                      endYear={item.endYear}
                      id={`work-experience-mobile-${index}`}
                      className='text-xs text-gray-600'
                    />
                  </div>
                  <p className='text-xs text-gray-700 mb-1'>{item.company}</p>
                  {item.description && (
                    <p className='text-xs font-sans leading-relaxed mb-1.5 text-gray-800'>
                      {item.description}
                    </p>
                  )}
                  {typeof item.keyAchievements === "string" &&
                    item.keyAchievements.trim() && (
                      <ul className='list-disc list-inside text-xs font-sans leading-relaxed space-y-0.5 text-gray-800'>
                        {item.keyAchievements
                          .split("\n")
                          .filter((achievement) => achievement.trim())
                          .map((achievement, subIndex) => (
                            <li key={`${item.company}-mobile-${index}-${subIndex}`}>
                              {achievement}
                            </li>
                          ))}
                      </ul>
                    )}
                </div>
              ))
            )}
          </div>
        ) : null;

      case "projects":
        return resumeData.projects.length > 0 ? (
          <div className='mb-4'>
            <h2 className='text-sm font-bold uppercase mb-2 pb-0.5 border-b border-gray-400'>
              {customSectionTitles.projects || "Projects"}
            </h2>
            {!isMobileView ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleItemDragEnd(event, "projects")}
              >
                <SortableContext
                  items={resumeData.projects.map((_, idx) => `project-${idx}`)}
                  strategy={verticalListSortingStrategy}
                >
                {resumeData.projects.map((item, index) => (
                  <SortableItem
                    key={`project-${index}`}
                    id={`project-${index}`}
                  >
                    <div className='mb-3'>
                      <div className='flex justify-between items-baseline mb-1'>
                        <div className='flex items-center gap-2'>
                          <h3 className='text-xs font-bold'>
                            {item.name}
                          </h3>
                          {item.link && (
                            <Link
                              href={item.link}
                              className='text-black hover:text-gray-700 transition-colors'
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              <FaExternalLinkAlt className='w-3 h-3 text-black' />
                            </Link>
                          )}
                        </div>
                        <DateRange
                          startYear={item.startYear}
                          endYear={item.endYear}
                          id={`projects-${index}`}
                          className='text-xs text-gray-600'
                        />
                      </div>
                      {item.description && (
                        <p className='text-xs font-sans leading-relaxed mb-1.5 text-gray-800'>
                          {item.description}
                        </p>
                      )}
                      {typeof item.keyAchievements === "string" &&
                        item.keyAchievements.trim() && (
                          <ul className='list-disc list-inside text-xs font-sans leading-relaxed space-y-0.5 text-gray-800'>
                            {item.keyAchievements
                              .split("\n")
                              .filter((achievement) => achievement.trim())
                              .map((achievement, subIndex) => (
                                <li key={`${item.name}-${index}-${subIndex}`}>
                                  {achievement}
                                </li>
                              ))}
                          </ul>
                        )}
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
            ) : (
              resumeData.projects.map((item, index) => (
                <div key={index} className='mb-3'>
                  <div className='flex justify-between items-baseline mb-1'>
                    <div className='flex items-center gap-2'>
                      <h3 className='text-xs font-bold'>
                        {item.name}
                      </h3>
                      {item.link && (
                        <Link
                          href={item.link}
                          className='text-black hover:text-gray-700 transition-colors'
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <FaExternalLinkAlt className='w-3 h-3 text-black' />
                        </Link>
                      )}
                    </div>
                    <DateRange
                      startYear={item.startYear}
                      endYear={item.endYear}
                      id={`projects-mobile-${index}`}
                      className='text-xs text-gray-600'
                    />
                  </div>
                  {item.description && (
                    <p className='text-xs font-sans leading-relaxed mb-1.5 text-gray-800'>
                      {item.description}
                    </p>
                  )}
                  {typeof item.keyAchievements === "string" &&
                    item.keyAchievements.trim() && (
                      <ul className='list-disc list-inside text-xs font-sans leading-relaxed space-y-0.5 text-gray-800'>
                        {item.keyAchievements
                          .split("\n")
                          .filter((achievement) => achievement.trim())
                          .map((achievement, subIndex) => (
                            <li key={`${item.name}-mobile-${index}-${subIndex}`}>
                              {achievement}
                            </li>
                          ))}
                      </ul>
                    )}
                </div>
              ))
            )}
          </div>
        ) : null;

      case "skills":
        return (
          <div className='mb-4'>
            <h2 className='text-sm font-bold uppercase mb-2 pb-0.5 border-b border-gray-400'>
              {customSectionTitles.skills || "Skills"}
            </h2>
            <div className='space-y-2'>
              {!isMobileView ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(event) => handleItemDragEnd(event, "skills")}
                >
                  <SortableContext
                    items={resumeData.skills.filter((skill) => skill.title !== "Soft Skills").map((_, idx) => `skill-${idx}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    {resumeData.skills
                      .filter((skill) => skill.title !== "Soft Skills")
                      .map((skill, index) => (
                        <SortableItem key={`skill-${index}`} id={`skill-${index}`}>
                          <div>
                            <h3 className='text-xs font-bold mb-1 text-gray-900'>
                              {skill.title}
                            </h3>
                            <p className='text-xs font-sans leading-relaxed text-gray-800'>
                              {skill.skills.join(" • ")}
                            </p>
                          </div>
                        </SortableItem>
                      ))}
                  </SortableContext>
                </DndContext>
              ) : (
                resumeData.skills
                  .filter((skill) => skill.title !== "Soft Skills")
                  .map((skill, index) => (
                    <div key={`SKILLS-${index}`}>
                      <h3 className='text-xs font-bold mb-1 text-gray-900'>
                        {skill.title}
                      </h3>
                      <p className='text-xs font-sans leading-relaxed text-gray-800'>
                        {skill.skills.join(" • ")}
                      </p>
                    </div>
                  ))
              )}
            </div>
          </div>
        );

      case "softSkills":
        return (
          <div className='mb-4'>
            <h2 className='text-sm font-bold uppercase mb-2 pb-0.5 border-b border-gray-400'>
              {customSectionTitles.softSkills || "Soft Skills"}
            </h2>
            <p className='text-xs font-sans leading-relaxed text-gray-800'>
              {section.content.join(" • ")}
            </p>
          </div>
        );

      case "languages":
        console.log("Languages Debug:", {
          sectionContent: section.content,
          resumeLanguages: resumeData.languages,
          hasContent: section.content && section.content.length > 0
        });
        return section.content && section.content.length > 0 ? (
          <div className='mb-4'>
            <h2 className='text-sm font-bold uppercase mb-2 pb-0.5 border-b border-gray-400'>
              {customSectionTitles.languages || "Languages"}
            </h2>
            <p className='text-xs font-light leading-relaxed text-black'>
              {section.content.map((lang) => 
                typeof lang === "string" ? lang : (lang.name || lang)
              ).join(", ")}
            </p>
          </div>
        ) : null;

      case "certifications":
        return resumeData.certifications.length > 0 ? (
          <div className='mb-4'>
            <h2 className='text-sm font-bold uppercase mb-2 pb-0.5 border-b border-gray-400'>
              {customSectionTitles.certifications || "Certifications"}
            </h2>
            {!isMobileView ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleItemDragEnd(event, "certifications")}
              >
                <SortableContext
                  items={resumeData.certifications.map((_, idx) => `cert-${idx}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {resumeData.certifications.map((cert, index) => {
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
                      <SortableItem key={`cert-${index}`} id={`cert-${index}`}>
                        <div className='mb-2'>
                          <div className='flex justify-between items-baseline mb-0.5'>
                            <div className='flex items-center gap-2'>
                              <h3 className='text-xs font-bold text-gray-900'>
                                {typeof cert === "string" ? cert : cert.name}
                              </h3>
                              {typeof cert === "object" &&
                                cert.link &&
                                cert.link.trim() !== "" && (
                                  <Link
                                    href={cert.link}
                                    className='text-black hover:text-gray-700 transition-colors'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                  >
                                    <FaExternalLinkAlt className='w-3 h-3 text-black' />
                                  </Link>
                                )}
                            </div>
                            {typeof cert === "object" && cert.date && (
                              <span className='text-xs text-gray-600'>{formatDate(cert.date)}</span>
                            )}
                          </div>
                          {typeof cert === "object" && cert.issuer && (
                            <p className='text-xs text-gray-700'>{cert.issuer}</p>
                          )}
                        </div>
                      </SortableItem>
                    );
                  })}
                </SortableContext>
              </DndContext>
            ) : (
              resumeData.certifications.map((cert, index) => {
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
                  <div key={index} className='mb-2'>
                    <div className='flex justify-between items-baseline mb-0.5'>
                      <div className='flex items-center gap-2'>
                        <h3 className='text-xs font-bold text-gray-900'>
                          {typeof cert === "string" ? cert : cert.name}
                        </h3>
                        {typeof cert === "object" &&
                          cert.link &&
                          cert.link.trim() !== "" && (
                            <Link
                              href={cert.link}
                              className='text-black hover:text-gray-700 transition-colors'
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              <FaExternalLinkAlt className='w-3 h-3 text-black' />
                            </Link>
                          )}
                      </div>
                      {typeof cert === "object" && cert.date && (
                        <span className='text-xs text-gray-600'>{formatDate(cert.date)}</span>
                      )}
                    </div>
                    {typeof cert === "object" && cert.issuer && (
                      <p className='text-xs text-gray-700'>{cert.issuer}</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : null;

      case "awards":
  return resumeData.awards && resumeData.awards.length > 0 ? (
    <div className='mb-4'>
      <h2 className='text-sm font-bold uppercase mb-2 pb-0.5 border-b border-gray-400'>
        {customSectionTitles.awards || "Awards"}
      </h2>
      {!isMobileView ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => handleItemDragEnd(event, "awards")}
        >
          <SortableContext
            items={resumeData.awards.map((_, idx) => `award-${idx}`)}
            strategy={verticalListSortingStrategy}
          >
            {resumeData.awards.map((award, index) => {
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
                <SortableItem key={`award-${index}`} id={`award-${index}`}>
                  <div className='mb-2'>
                    <div className='flex justify-between items-baseline mb-0.5'>
                      {/* Award Name (now main heading) */}
                      <h3 className='text-xs font-bold text-gray-900'>
                        {award.name || "Award Name"}
                      </h3>

                      {/* Date or Year on the Right */}
                      <div className='text-xs text-gray-600'>
                        {award.date ? (
                          <span>{formatDate(award.date)}</span>
                        ) : (
                          <DateRange
                            startYear={award.startYear}
                            endYear={award.endYear}
                            id={`award-${index}`}
                          />
                        )}
                      </div>
                    </div>

                    {/* Issuer */}
                    {award.issuer && (
                      <p className='text-xs text-gray-700'>
                        Issued by: {award.issuer}
                      </p>
                    )}

                    {/* Description (optional) */}
                    {award.description && (
                      <p className='text-xs text-gray-800 font-sans leading-relaxed'>
                        {award.description}
                      </p>
                    )}
                  </div>
                </SortableItem>
              );
            })}
          </SortableContext>
        </DndContext>
      ) : (
        resumeData.awards.map((award, index) => {
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
            <div key={index} className='mb-2'>
              <div className='flex justify-between items-baseline mb-0.5'>
                {/* Award Name (now main heading) */}
                <h3 className='text-xs font-bold text-gray-900'>
                  {award.name || "Award Name"}
                </h3>

                {/* Date or Year on the Right */}
                <div className='text-xs text-gray-600'>
                  {award.date ? (
                    <span>{formatDate(award.date)}</span>
                  ) : (
                    <DateRange
                      startYear={award.startYear}
                      endYear={award.endYear}
                      id={`award-mobile-${index}`}
                    />
                  )}
                </div>
              </div>

              {/* Issuer */}
              {award.issuer && (
                <p className='text-xs text-gray-700'>
                  Issued by: {award.issuer}
                </p>
              )}

              {/* Description (optional) */}
              {award.description && (
                <p className='text-xs text-gray-800 font-sans leading-relaxed'>
                  {award.description}
                </p>
              )}
            </div>
          );
        })
      )}
    </div>
  ) : null;



      default:
        return null;
    }
  };

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className='max-w-[210mm] mx-auto bg-white p-6 print:p-0'>
        <div className='mb-4'>
          <h1 className='text-3xl font-bold'>
            {resumeData.name}
          </h1>
          <p className='text-base italic text-gray-700'>{resumeData.position}</p>
        </div>
        <div className='animate-pulse'>
          <div className='space-y-4'>
            {orderedSections.map((section) => (
              <div key={section.id} className='h-16 bg-gray-200 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className='max-w-[210mm] mx-auto bg-white p-4 print:p-0'
      style={{
        fontFamily: "sans-serif",
        fontSize: "11pt",
        lineHeight: "1.4",
        color: "#000000",
      }}
    >
      {/* Header Section with Profile Picture */}
      <div className='flex justify-between items-start mb-3 no-break'>
        <div className='flex-1 pr-4'>
          <h1 className='text-3xl font-bold mb-1'>{resumeData.name}</h1>
          <p className='text-base italic text-gray-700 mb-2'>{resumeData.position}</p>
          
          {/* Contact Info - Max 3 items per line */}
          <div className='text-xs space-y-1'>
            {/* First Line - Email, Phone, Address (max 3) */}
            <div className='flex flex-wrap items-center gap-x-4 gap-y-1'>
              {resumeData.email && (
                <div className='flex items-center gap-1.5 flex-shrink-0'>
                  <FaEnvelope className='text-gray-600 flex-shrink-0' />
                  <a href={`mailto:${resumeData.email}`} className='truncate max-w-[200px]'>
                    {resumeData.email}
                  </a>
                </div>
              )}
              {resumeData.contactInformation && (
                <div className='flex items-center gap-1.5 flex-shrink-0'>
                  <FaPhoneAlt className='text-gray-600 flex-shrink-0' />
                  <a href={`tel:${resumeData.contactInformation}`} className='whitespace-nowrap'>
                    {resumeData.contactInformation}
                  </a>
                </div>
              )}
              {resumeData.address && (
                <div className='flex items-center gap-1.5 flex-shrink-0'>
                  <FaMapMarkerAlt className='text-gray-600 flex-shrink-0' />
                  <span className='truncate max-w-[250px]'>{resumeData.address}</span>
                </div>
              )}
            </div>
            
            {/* Second Line - Social Media */}
            {resumeData.socialMedia && resumeData.socialMedia.length > 0 && (
              <div className='flex flex-wrap items-center gap-x-4 gap-y-1'>
                {resumeData.socialMedia.slice(0, 3).map((social, index) => {
                  const socialName = social.socialMedia?.toLowerCase();
                  const icon = icons?.find((icon) => icon.name === socialName);
                  return (
                    <div key={index} className='flex items-center gap-1.5 flex-shrink-0'>
                      {icon && React.cloneElement(icon.icon, { className: 'text-gray-600 flex-shrink-0' })}
                      <span className='truncate max-w-[200px]'>{social.displayText || social.link}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Profile Picture - Always visible, uses default if not uploaded */}
        <div className='flex-shrink-0 ml-4'>
          <div className='w-32 h-32 overflow-hidden bg-gray-100'>
            <Image
              src={resumeData.profilePicture || "https://ik.imagekit.io/profocto/christopher-campbell-rDEOVtE7vOs-unsplash.jpg?updatedAt=1760968464715"}
              alt={resumeData.name || "Profile"}
              width={128}
              height={128}
              className='object-cover w-full h-full'
              style={{ objectPosition: 'center' }}
              onError={(e) => {
                e.currentTarget.src = "/assets/smart.jpg";
              }}
            />
          </div>
        </div>
      </div>

      {/* Social Media Links - Fallback */}
      {resumeData.socialMedia && resumeData.socialMedia.length > 6 && (
        <div className='text-red-500 mb-2'>
          Social Media links are limited to 6 entries
        </div>
      )}

      {/* Draggable Sections with Same System as Modern Template */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
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
  );
};

export default TemplateFive;
