"use client";

import { FaExternalLinkAlt } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import DateRange from "../utility/DateRange";
import Link from "next/link";
import { useSectionTitles } from "../../contexts/SectionTitleContext";
import { useEffect, useState } from "react";

/**
 * Template Eight - Creative Modern
 * Colorful, eye-catching design with accent colors and modern layout
 * Perfect for creative industries and tech roles
 */
const TemplateEight = ({
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
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
      {/* Header Section with Gradient Background */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 print:p-6">
        <h1 className="text-5xl font-bold mb-3 tracking-tight">
          {resumeData.personalInformation.name || "Your Name"}
        </h1>
        
        {/* Contact Information */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-blue-50">
          {resumeData.personalInformation.email && (
            <div className="flex items-center gap-2">
              <MdEmail className="w-5 h-5" />
              <span>{resumeData.personalInformation.email}</span>
            </div>
          )}
          {resumeData.personalInformation.phone && (
            <div className="flex items-center gap-2">
              <MdPhone className="w-5 h-5" />
              <span>{resumeData.personalInformation.phone}</span>
            </div>
          )}
          {resumeData.personalInformation.location && (
            <div className="flex items-center gap-2">
              <MdLocationOn className="w-5 h-5" />
              <span>{resumeData.personalInformation.location}</span>
            </div>
          )}
        </div>

        {/* Social Links */}
        {resumeData.socialMedia && resumeData.socialMedia.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-3">
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
                    className="flex items-center gap-2 text-sm text-white hover:text-blue-200 transition-colors bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm"
                  >
                    {iconData && <span className="text-base">{iconData.icon}</span>}
                    <span>{social.platform}</span>
                  </Link>
                )
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="p-8 print:p-6">
        {/* Dynamic Sections */}
        {sectionOrder.map((sectionId) => {
          if (!enabledSections[sectionId]) return null;

          switch (sectionId) {
            case "summary":
              return resumeData.summary ? (
                <section key="summary" className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {customSectionTitles.summary || "Professional Summary"}
                    </h2>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-600">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {resumeData.summary}
                    </p>
                  </div>
                </section>
              ) : null;

            case "experience":
              return resumeData.workExperience && resumeData.workExperience.length > 0 ? (
                <section key="experience" className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {customSectionTitles.experience || "Professional Experience"}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {resumeData.workExperience.map((exp, index) => (
                      <div key={index} className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow border-l-4 border-purple-500">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                            <p className="text-sm font-semibold text-purple-600">{exp.company}</p>
                          </div>
                          <div className="text-sm text-gray-600 text-right bg-gray-100 px-3 py-1 rounded-full">
                            <DateRange startDate={exp.startDate} endDate={exp.endDate} />
                            {exp.location && <div className="text-xs mt-1">{exp.location}</div>}
                          </div>
                        </div>
                        {exp.description && (
                          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                            {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                              <li key={i}>{line.trim()}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case "education":
              return resumeData.education && resumeData.education.length > 0 ? (
                <section key="education" className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {customSectionTitles.education || "Education"}
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {resumeData.education.map((edu, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                            <p className="text-sm font-semibold text-blue-600">{edu.school}</p>
                            {edu.gpa && (
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                                  GPA: {edu.gpa}
                                </span>
                              </p>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 text-right bg-gray-100 px-3 py-1 rounded-full">
                            <DateRange startDate={edu.startDate} endDate={edu.endDate} />
                            {edu.location && <div className="text-xs mt-1">{edu.location}</div>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case "projects":
              return resumeData.projects && resumeData.projects.length > 0 ? (
                <section key="projects" className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {customSectionTitles.projects || "Projects"}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {resumeData.projects.map((project, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border-l-4 border-green-500">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-gray-900">{project.name}</h3>
                          {project.link && (
                            <Link
                              href={project.link}
                              target="_blank"
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full"
                            >
                              <FaExternalLinkAlt className="w-3 h-3" />
                              <span className="text-xs">View</span>
                            </Link>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-sm text-gray-700 leading-relaxed mb-2">
                            {project.description}
                          </p>
                        )}
                        {project.technologies && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.technologies.split(',').map((tech, i) => (
                              <span key={i} className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 px-2 py-1 rounded-full">
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case "skills":
              const technicalSkills = resumeData.skills?.filter(s => s.title !== "Soft Skills") || [];
              return technicalSkills.length > 0 ? (
                <section key="skills" className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {customSectionTitles.skills || "Technical Skills"}
                    </h2>
                  </div>
                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <div className="space-y-3">
                      {technicalSkills.map((skillGroup, index) => (
                        <div key={index}>
                          <h3 className="font-bold text-sm text-purple-600 mb-2">{skillGroup.title}</h3>
                          <div className="flex flex-wrap gap-2">
                            {skillGroup.skills.map((skill, i) => (
                              <span key={i} className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 px-3 py-1 rounded-full text-sm border border-blue-200">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              ) : null;

            case "softSkills":
              const softSkillsData = resumeData.skills?.find(s => s.title === "Soft Skills");
              return softSkillsData && softSkillsData.skills.length > 0 ? (
                <section key="softSkills" className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {customSectionTitles.softSkills || "Soft Skills"}
                    </h2>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex flex-wrap gap-2">
                      {softSkillsData.skills.map((skill, i) => (
                        <span key={i} className="bg-gradient-to-r from-green-50 to-blue-50 text-gray-800 px-3 py-1 rounded-full text-sm border border-green-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>
              ) : null;

            case "languages":
              return resumeData.languages && resumeData.languages.length > 0 ? (
                <section key="languages" className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {customSectionTitles.languages || "Languages"}
                    </h2>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex flex-wrap gap-3">
                      {resumeData.languages.map((lang, index) => (
                        <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-lg border border-purple-200">
                          <span className="font-semibold text-gray-900">{lang.language}</span>
                          {lang.proficiency && (
                            <span className="text-sm text-gray-600 ml-2">• {lang.proficiency}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              ) : null;

            case "certifications":
              return resumeData.certifications && resumeData.certifications.length > 0 ? (
                <section key="certifications" className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {customSectionTitles.certifications || "Certifications"}
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {resumeData.certifications.map((cert, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-yellow-500">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900">{cert.name}</h3>
                            <p className="text-sm text-yellow-600 font-semibold">{cert.issuer}</p>
                          </div>
                          {cert.date && (
                            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                              {cert.date}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default TemplateEight;
