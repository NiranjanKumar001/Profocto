"use client";

import { FaExternalLinkAlt, FaLinkedin } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { GiGraduateCap } from "react-icons/gi";
import { BiBriefcase, BiBookAlt, BiCodeAlt, BiAward } from "react-icons/bi";
import { ImGithub } from "react-icons/im";
import { CgWebsite } from "react-icons/cg";
import DateRange from "../utility/DateRange";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Link from "next/link";
import { useSectionTitles } from "../../contexts/SectionTitleContext";
import { SortableItem, SortableSection } from "./Preview";
import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import React from "react";


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
    
    // Check if mobile view
    const checkMobile = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        moveData(resumeData.projects, "projects", "project");
        break;
      case "experience":
        moveData(resumeData.workExperience, "workExperience", "work");
        break;
      case "education":
        moveData(resumeData.education, "education", "edu");
        break;
      case "skills":
        moveData(resumeData.skills, "skills", "skill");
        break;
      case "certifications":
        moveData(resumeData.certifications, "certifications", "cert");
        break;
      case "awards":
        moveData(resumeData.awards || [], "awards", "award");
        break;
      default:
        break;
    }
  };

  const sections = [
    { id: "summary", title: "Professional Summary", content: resumeData.summary },
    { id: "experience", title: "Experience", content: resumeData.workExperience },
    { id: "projects", title: "Projects", content: resumeData.projects },
    { id: "awards", title: "Awards", content: resumeData.awards || [] },
  ];

  const sidebarSections = [
    {
      id: "education",
      title: "Education",
      content: resumeData.education,
      icon: <GiGraduateCap />,
    },
    {
      id: "skills",
      title: "Technical Skills",
      content: resumeData.skills.filter((s) => s.title !== "Soft Skills"),
      icon: <BiCodeAlt />,
    },
    {
      id: "softSkills",
      title: "Soft Skills",
      content: resumeData.skills.find((s) => s.title === "Soft Skills")?.skills || [],
      icon: <BiBookAlt />,
    },
    { id: "languages", title: "Languages", content: resumeData.languages, icon: <BiBookAlt /> },
    { id: "certifications", title: "Certifications", content: resumeData.certifications, icon: <BiBookAlt /> },
    
  ];

  const orderedSections = sectionOrder
    .map((id) => sections.find((s) => s.id === id))
    .filter((s) => {
      if (!s || !enabledSections[s.id]) return false;
      if (Array.isArray(s.content)) return s.content.length > 0;
      return s.content && s.content.length > 0;
    });

  const renderMainSection = (section) => {
    switch (section.id) {
      case "summary":
      return (
        <div className="mb-3 print:mb-2">
          <h2 className="section-title-main flex items-center gap-1 text-black font-bold pb-0.5 mb-1 border-b border-gray-900">
              <BiBookAlt className="w-4 h-4" />{" "}
              {customSectionTitles.summary || "Professional Summary"}
          </h2>
            <p className="text-gray-800 text-justify text-sm leading-snug">
              {section.content}
            </p>
        </div>
      );
    }

    // For experience, projects, awards
    const sectionMap = {
      experience: { data: resumeData.workExperience, icon: <BiBriefcase />, key: "work" },
      projects: { data: resumeData.projects, icon: <BiCodeAlt />, key: "project" },
      awards: { data: resumeData.awards || [], icon: <BiAward />, key: "award" },
    };

    const sec = sectionMap[section.id];

    return (
      <div className="mb-3 print:mb-2">
        <h2 className="section-title-main flex items-center gap-1 text-black font-bold pb-0.5 mb-2 border-b border-gray-900">
          {sec.icon} {customSectionTitles[section.id] || section.title}
        </h2>
        {/* Desktop: Enable nested drag and drop */}
        {!isMobileView ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleItemDragEnd(e, section.id)}
          >
            <SortableContext
              items={sec.data.map((_, i) => `${sec.key}-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              {sec.data.map((item, index) => (
                <SortableItem key={`${sec.key}-${index}`} id={`${sec.key}-${index}`}>
                  <div className="relative pl-4 mb-2">
                    <div className="absolute left-0 top-1 w-2 h-2 bg-black rounded-full"></div>
                    <div className="p-0 bg-white ml-1">
                      {section.id === "awards" ? (
                        <>
                          <p className="font-bold text-gray-900 text-sm leading-snug">{item.title || item.name}</p>
                          {item.issuer && <p className="text-xs text-gray-700">{item.issuer}</p>}
                          {item.date && <p className="text-xs text-gray-700">{item.date}</p>}
                        </>
                      ) : (
                        <>
                          <h3 className="font-bold text-gray-900 text-sm leading-snug flex items-center gap-1">
                            {section.id === "experience" ? `${item.position} | ${item.company}` : item.name}
                            {section.id === "projects" && item.link && (
                              <Link href={item.link} target="_blank" className="text-black hover:text-gray-700">
                                <FaExternalLinkAlt className="w-3 h-3" />
                              </Link>
                            )}
                          </h3>
                          <DateRange
                            startYear={item.startYear}
                            endYear={item.endYear}
                            id={`${sec.key}-${index}`}
                            className="text-xs text-gray-700 block"
                          />
                          <p className="text-gray-800 mt-1 text-sm leading-snug">{item.description}</p>
                          {item.keyAchievements && section.id === "experience" && (
                            <ul className="list-disc list-inside text-gray-800 mt-1 ml-3 text-sm leading-snug">
                              {item.keyAchievements.split("\n").filter(a => a.trim()).map((a, idx) => <li key={idx}>{a}</li>)}
                            </ul>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          /* Mobile: Disable nested drag, show items normally */
          sec.data.map((item, index) => (
            <div key={`${sec.key}-${index}`} className="relative pl-4 mb-2">
              <div className="absolute left-0 top-1 w-2 h-2 bg-black rounded-full"></div>
              <div className="p-0 bg-white ml-1">
                {section.id === "awards" ? (
                  <>
                    <p className="font-bold text-gray-900 text-sm leading-snug">{item.title || item.name}</p>
                    {item.issuer && <p className="text-xs text-gray-700">{item.issuer}</p>}
                    {item.date && <p className="text-xs text-gray-700">{item.date}</p>}
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug flex items-center gap-1">
                      {section.id === "experience" ? `${item.position} | ${item.company}` : item.name}
                      {section.id === "projects" && item.link && (
                        <Link href={item.link} target="_blank" className="text-black hover:text-gray-700">
                          <FaExternalLinkAlt className="w-3 h-3" />
                        </Link>
                      )}
                    </h3>
                    <DateRange
                      startYear={item.startYear}
                      endYear={item.endYear}
                      id={`${sec.key}-${index}`}
                      className="text-xs text-gray-700 block"
                    />
                    <p className="text-gray-800 mt-1 text-sm leading-snug">{item.description}</p>
                    {item.keyAchievements && section.id === "experience" && (
                      <ul className="list-disc list-inside text-gray-800 mt-1 ml-3 text-sm leading-snug">
                        {item.keyAchievements.split("\n").filter(a => a.trim()).map((a, idx) => <li key={idx}>{a}</li>)}
                      </ul>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  const renderSidebarSection = (section) => {
    if (!section.content || (Array.isArray(section.content) && section.content.length === 0)) return null;

    return (
      <div className="mb-3 print:mb-2">
        <h2 className="flex items-center gap-1 text-black font-bold pb-0.5 mb-1 border-b border-gray-900">
          <span className="text-black">{section.icon}</span>{" "}
          <span className="text-sm uppercase">{customSectionTitles[section.id] || section.title}</span>
        </h2>

        {section.id === "education" ? (
          !isMobileView ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleItemDragEnd(event, "education")}
            >
              <SortableContext
                items={resumeData.education.map((_, idx) => `edu-${idx}`)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="text-gray-800 text-sm space-y-1">
                  {resumeData.education.map((item, idx) => (
                    <SortableItem key={`edu-${idx}`} id={`edu-${idx}`}>
                      <li>
                        <p className="font-semibold">{item.school}</p>
                        <div className="text-xs text-gray-700">
                          {item.degree} - <DateRange startYear={item.startYear} endYear={item.endYear} id={`edu-range-${idx}`} />
                        </div>
                      </li>
                    </SortableItem>
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          ) : (
            <ul className="text-gray-800 text-sm space-y-1">
              {resumeData.education.map((item, idx) => (
                <li key={idx}>
                  <p className="font-semibold">{item.school}</p>
                  <div className="text-xs text-gray-700">
                    {item.degree} - <DateRange startYear={item.startYear} endYear={item.endYear} id={`edu-range-${idx}`} />
                  </div>
                </li>
              ))}
            </ul>
          )
        ) : section.id === "certifications" ? (
          !isMobileView ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleItemDragEnd(event, "certifications")}
            >
              <SortableContext
                items={resumeData.certifications.map((_, idx) => `cert-${idx}`)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="text-gray-800 text-sm space-y-1.5">
                  {resumeData.certifications.map((cert, idx) => {
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
                      <SortableItem key={`cert-${idx}`} id={`cert-${idx}`}>
                        <li>
                          <div className="flex items-center gap-1">
                            <p className="font-semibold">{cert.name}</p>
                            {cert.link && (
                              <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                                <FaExternalLinkAlt className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                          {cert.issuer && <p className="text-xs italic text-gray-700">{cert.issuer}</p>}
                          {cert.date && <p className="text-xs text-gray-700">{formatDate(cert.date)}</p>}
                        </li>
                      </SortableItem>
                    );
                  })}
                </ul>
              </SortableContext>
            </DndContext>
          ) : (
            <ul className="text-gray-800 text-sm space-y-1.5">
              {resumeData.certifications.map((cert, idx) => {
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
                  <li key={idx}>
                    <div className="flex items-center gap-1">
                      <p className="font-semibold">{cert.name}</p>
                      {cert.link && (
                        <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                          <FaExternalLinkAlt className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                    {cert.issuer && <p className="text-xs italic text-gray-700">{cert.issuer}</p>}
                    {cert.date && <p className="text-xs text-gray-700">{formatDate(cert.date)}</p>}
                  </li>
                );
              })}
            </ul>
          )
        ) : Array.isArray(section.content) ? (
          section.id === "skills" || section.id === "softSkills" || section.id === "languages" ? (
            <div className="text-gray-800 text-sm leading-snug">
              {section.id === "skills" ? (
                !isMobileView ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => handleItemDragEnd(event, "skills")}
                  >
                    <SortableContext
                      items={section.content.filter(group => group.title !== "Soft Skills").map((_, idx) => `skill-${idx}`)}
                      strategy={verticalListSortingStrategy}
                    >
                      {section.content.filter(group => group.title !== "Soft Skills").map((group, idx) => (
                        <SortableItem key={`skill-${idx}`} id={`skill-${idx}`}>
                          <div className="mb-1">
                            <p className="font-semibold text-xs">{group.title}:</p>
                            <p className="text-sm font-light">{group.skills?.join(", ")}</p>
                          </div>
                        </SortableItem>
                      ))}
                    </SortableContext>
                  </DndContext>
                ) : (
                  section.content.map((group, idx) => (
                    <div key={idx} className="mb-1">
                      <p className="font-semibold text-xs">{group.title}:</p>
                      <p className="text-sm font-light">{group.skills?.join(", ")}</p>
                    </div>
                  ))
                )
              ) : section.id === "languages" ? (
                <p className="text-xs font-light text-black leading-relaxed">
                  {section.content.map((lang) => 
                    typeof lang === "string" ? lang : (lang.name || lang)
                  ).join(", ")}
                </p>
              ) : (
                <p className="font-light">
                  {section.content.map(s => (typeof s === "string" ? s : s.skills?.join(", "))).join(", ")}
                </p>
              )}
            </div>
          ) : (
            <ul className="list-disc list-inside text-gray-800 text-sm ml-2 space-y-1">
              {section.content.map((item, idx) => (
                <li key={idx}>{typeof item === "string" ? item : item.school || item.name}</li>
              ))}
            </ul>
          )
        ) : (
          <p className="text-gray-800 text-sm">{section.content}</p>
        )}
      </div>
    );
  };

  if (!isClient) return <div className="animate-pulse p-4 bg-white h-full w-full"></div>;

  return (
    <div className="max-w-[210mm] mx-auto bg-white p-6 print:p-0" style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div className="text-center mb-4 border-b border-gray-900 pb-1">
        <h1 className="text-2xl font-bold text-gray-900 inline-block px-0 py-0">{resumeData.name}</h1>
        <h2 className="text-base font-semibold text-gray-800 mt-0.5">{resumeData.position}</h2>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-0.5 mt-1 text-gray-700 text-sm">
          {resumeData.contactInformation && (
            <div className="flex items-center gap-1">
              <MdPhone className="w-3 h-3 text-gray-700" />
              <a href={`tel:${resumeData.contactInformation}`}>
                {resumeData.contactInformation}
              </a>
            </div>
          )}
          {resumeData.email && (
            <div className="flex items-center gap-1">
              <MdEmail className="w-3 h-3 text-gray-700" />
              <a href={`mailto:${resumeData.email}`}>
                {resumeData.email}
              </a>
            </div>
          )}
          {resumeData.address && (
            <div className="flex items-center gap-1">
              <MdLocationOn className="w-3 h-3 text-gray-700" />
              <span>{resumeData.address}</span>
            </div>
          )}
          
          {resumeData.socialMedia?.length > 0 && resumeData.socialMedia.map((socialMedia, index) => {
            const icon = icons?.find(
              (icon) => icon.name === socialMedia.socialMedia.toLowerCase()
            );
            
            // Check if link already has protocol
            const hasProtocol = socialMedia.link.startsWith('http://') || socialMedia.link.startsWith('https://');
            const prefix = hasProtocol ? '' : 
              socialMedia.socialMedia.toLowerCase() === "website"
                ? "https://"
                : socialMedia.socialMedia.toLowerCase() === "linkedin"
                  ? "https://www."
                  : "https://www.";
            
            return (
              <a
                href={`${prefix}${socialMedia.link}`}
                key={index}
                className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
                target="_blank"
                rel="noopener noreferrer"
              >
                {icon && React.cloneElement(icon.icon, { className: 'w-3 h-3 text-gray-700' })}
                <span>{socialMedia.displayText || socialMedia.link}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-3 gap-4 print:gap-3">
        <div className="col-span-1 p-0 bg-white">
          {sidebarSections.map(section => (
            <div key={section.id}>{renderSidebarSection(section)}</div>
          ))}
        </div>

        <div className="col-span-2 p-0 border-l border-gray-300 pl-4 print:pl-3">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={orderedSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {orderedSections.map(section => (
                <SortableSection key={section.id} id={section.id}>
                  {renderMainSection(section)}
                </SortableSection>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default TemplateFive;