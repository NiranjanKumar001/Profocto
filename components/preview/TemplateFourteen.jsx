"use client";

import { FaExternalLinkAlt } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import DateRange from "../utility/DateRange";
import Link from "next/link";
import { useSectionTitles } from "../../contexts/SectionTitleContext";
import { useEffect, useState } from "react";

/**
 * Template Fourteen - Compact/One-Page
 * Space-efficient design optimized for single-page resumes
 * Perfect for entry-level, career changers, or concise profiles
 */
const TemplateFourteen = ({
  resumeData,
  sectionOrder,
  enabledSections,
  icons,
}) => {
  const { customSectionTitles } = useSectionTitles();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="w-full h-full bg-white text-gray-900 p-6 print:p-4">
      {/* Compact Header */}
      <header className="mb-4 pb-3 border-b-2 border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {resumeData.personalInformation.name || "Your Name"}
        </h1>
        
        {/* Compact Contact Info - Single Line */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-700">
          {resumeData.personalInformation.email && (
            <span className="flex items-center gap-1">
              <MdEmail className="w-3 h-3" />
              {resumeData.personalInformation.email}
            </span>
          )}
          {resumeData.personalInformation.phone && (
            <span className="flex items-center gap-1">
              <MdPhone className="w-3 h-3" />
              {resumeData.personalInformation.phone}
            </span>
          )}
          {resumeData.personalInformation.location && (
            <span className="flex items-center gap-1">
              <MdLocationOn className="w-3 h-3" />
              {resumeData.personalInformation.location}
            </span>
          )}
          {/* Social Links Inline */}
          {resumeData.socialMedia && resumeData.socialMedia.length > 0 && (
            <>
              {resumeData.socialMedia.map((social, index) => {
                const iconData = icons.find(
                  (i) => i.name.toLowerCase() === social.platform.toLowerCase()
                );
                return (
                  social.url && (
                    <Link
                      key={index}
                      href={social.url}
                      target="_blank"
                      className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                    >
                      {iconData && <span className="text-xs">{iconData.icon}</span>}
                      <span className="underline">{social.platform}</span>
                    </Link>
                  )
                );
              })}
            </>
          )}
        </div>
      </header>

      {/* Two Column Layout for Space Efficiency */}
      <div className="grid grid-cols-3 gap-4">
        {/* Left Column - Sidebar */}
        <div className="col-span-1 space-y-3">
          {/* Skills */}
          {enabledSections.skills && (() => {
            const technicalSkills = resumeData.skills?.filter(s => s.title !== "Soft Skills") || [];
            return technicalSkills.length > 0 ? (
              <section>
                <h2 className="text-sm font-bold text-gray-900 mb-2 pb-1 border-b border-gray-300 uppercase">
                  {customSectionTitles.skills || "Skills"}
                </h2>
                <div className="space-y-2">
                  {technicalSkills.map((skillGroup, index) => (
                    <div key={index}>
                      <h3 className="text-xs font-bold text-gray-800">{skillGroup.title}</h3>
                      <p className="text-xs text-gray-700 leading-tight">
                        {skillGroup.skills.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null;
          })()}

          {/* Soft Skills */}
          {enabledSections.softSkills && (() => {
            const softSkillsData = resumeData.skills?.find(s => s.title === "Soft Skills");
            return softSkillsData && softSkillsData.skills.length > 0 ? (
              <section>
                <h2 className="text-sm font-bold text-gray-900 mb-2 pb-1 border-b border-gray-300 uppercase">
                  {customSectionTitles.softSkills || "Soft Skills"}
                </h2>
                <p className="text-xs text-gray-700 leading-tight">
                  {softSkillsData.skills.join(", ")}
                </p>
              </section>
            ) : null;
          })()}

          {/* Languages */}
          {enabledSections.languages && resumeData.languages && resumeData.languages.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-2 pb-1 border-b border-gray-300 uppercase">
                {customSectionTitles.languages || "Languages"}
              </h2>
              <div className="text-xs text-gray-700 space-y-1">
                {resumeData.languages.map((lang, index) => (
                  <div key={index}>
                    <span className="font-semibold">{lang.language}</span>
                    {lang.proficiency && <span className="text-gray-600"> ({lang.proficiency})</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {enabledSections.certifications && resumeData.certifications && resumeData.certifications.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-2 pb-1 border-b border-gray-300 uppercase">
                {customSectionTitles.certifications || "Certifications"}
              </h2>
              <div className="space-y-2">
                {resumeData.certifications.map((cert, index) => (
                  <div key={index}>
                    <h3 className="text-xs font-bold text-gray-900">{cert.name}</h3>
                    <p className="text-xs text-gray-600">{cert.issuer}</p>
                    {cert.date && <p className="text-xs text-gray-500">{cert.date}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Main Content */}
        <div className="col-span-2 space-y-3">
          {sectionOrder.map((sectionId) => {
            if (!enabledSections[sectionId]) return null;

            switch (sectionId) {
              case "summary":
                return resumeData.summary ? (
                  <section key="summary">
                    <h2 className="text-sm font-bold text-gray-900 mb-2 pb-1 border-b border-gray-300 uppercase">
                      {customSectionTitles.summary || "Summary"}
                    </h2>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {resumeData.summary}
                    </p>
                  </section>
                ) : null;

              case "experience":
                return resumeData.workExperience && resumeData.workExperience.length > 0 ? (
                  <section key="experience">
                    <h2 className="text-sm font-bold text-gray-900 mb-2 pb-1 border-b border-gray-300 uppercase">
                      {customSectionTitles.experience || "Experience"}
                    </h2>
                    {resumeData.workExperience.map((exp, index) => (
                      <div key={index} className="mb-3 last:mb-0">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex-1">
                            <h3 className="text-xs font-bold text-gray-900">{exp.position}</h3>
                            <p className="text-xs text-gray-700">{exp.company}</p>
                          </div>
                          <div className="text-xs text-gray-600 text-right ml-2">
                            <DateRange startDate={exp.startDate} endDate={exp.endDate} />
                          </div>
                        </div>
                        {exp.description && (
                          <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5 ml-2">
                            {exp.description.split('\n').filter(line => line.trim()).slice(0, 3).map((line, i) => (
                              <li key={i} className="leading-tight">{line.trim()}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </section>
                ) : null;

              case "education":
                return resumeData.education && resumeData.education.length > 0 ? (
                  <section key="education">
                    <h2 className="text-sm font-bold text-gray-900 mb-2 pb-1 border-b border-gray-300 uppercase">
                      {customSectionTitles.education || "Education"}
                    </h2>
                    {resumeData.education.map((edu, index) => (
                      <div key={index} className="mb-2 last:mb-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xs font-bold text-gray-900">{edu.degree}</h3>
                            <p className="text-xs text-gray-700">{edu.school}</p>
                            {edu.gpa && <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>}
                          </div>
                          <div className="text-xs text-gray-600 text-right ml-2">
                            <DateRange startDate={edu.startDate} endDate={edu.endDate} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </section>
                ) : null;

              case "projects":
                return resumeData.projects && resumeData.projects.length > 0 ? (
                  <section key="projects">
                    <h2 className="text-sm font-bold text-gray-900 mb-2 pb-1 border-b border-gray-300 uppercase">
                      {customSectionTitles.projects || "Projects"}
                    </h2>
                    {resumeData.projects.slice(0, 3).map((project, index) => (
                      <div key={index} className="mb-2 last:mb-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-xs font-bold text-gray-900 flex-1">{project.name}</h3>
                          {project.link && (
                            <Link
                              href={project.link}
                              target="_blank"
                              className="text-xs text-gray-600 hover:text-gray-900 ml-2"
                            >
                              <FaExternalLinkAlt className="w-2.5 h-2.5" />
                            </Link>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-xs text-gray-700 leading-tight line-clamp-2">
                            {project.description}
                          </p>
                        )}
                        {project.technologies && (
                          <p className="text-xs text-gray-600 mt-0.5">
                            {project.technologies.split(',').slice(0, 5).join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </section>
                ) : null;

              // Skip skills, softSkills, languages, certifications as they're in sidebar
              case "skills":
              case "softSkills":
              case "languages":
              case "certifications":
                return null;

              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default TemplateFourteen;
