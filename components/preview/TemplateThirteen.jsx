"use client";

import { FaExternalLinkAlt, FaRocket } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import DateRange from "../utility/DateRange";
import Link from "next/link";
import { useSectionTitles } from "../../contexts/SectionTitleContext";
import { useEffect, useState } from "react";

/**
 * Template Thirteen - Startup/Entrepreneurial
 * Dynamic, energetic design with bold colors and modern elements
 * Perfect for startup founders, entrepreneurs, and innovators
 */
const TemplateThirteen = ({
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
    <div className="w-full h-full bg-white">
      {/* Dynamic Header with Diagonal Design */}
      <header className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white p-8 print:p-6 overflow-hidden">
        {/* Diagonal stripe */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-transparent to-black/10 transform skew-y-3"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <FaRocket className="w-8 h-8 text-yellow-300" />
            <h1 className="text-5xl font-black tracking-tight">
              {resumeData.personalInformation.name || "Your Name"}
            </h1>
          </div>
          
          {/* Contact Bar */}
          <div className="flex flex-wrap gap-4 text-sm mt-4">
            {resumeData.personalInformation.email && (
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                <MdEmail className="w-4 h-4" />
                <span>{resumeData.personalInformation.email}</span>
              </div>
            )}
            {resumeData.personalInformation.phone && (
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                <MdPhone className="w-4 h-4" />
                <span>{resumeData.personalInformation.phone}</span>
              </div>
            )}
            {resumeData.personalInformation.location && (
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                <MdLocationOn className="w-4 h-4" />
                <span>{resumeData.personalInformation.location}</span>
              </div>
            )}
          </div>

          {/* Social Links */}
          {resumeData.socialMedia && resumeData.socialMedia.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
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
                      className="flex items-center gap-2 text-sm bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg font-semibold transition-all"
                    >
                      {iconData && <span>{iconData.icon}</span>}
                      <span>{social.platform}</span>
                    </Link>
                  )
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8 print:p-6">
        {sectionOrder.map((sectionId) => {
          if (!enabledSections[sectionId]) return null;

          switch (sectionId) {
            case "summary":
              return resumeData.summary ? (
                <section key="summary" className="mb-6">
                  <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                    <span className="w-2 h-8 bg-gradient-to-b from-indigo-600 to-cyan-500 rounded-full"></span>
                    {customSectionTitles.summary || "VISION"}
                  </h2>
                  <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 p-5 rounded-xl border-l-4 border-indigo-600">
                    <p className="text-sm text-gray-800 leading-relaxed font-medium">
                      {resumeData.summary}
                    </p>
                  </div>
                </section>
              ) : null;

            case "experience":
              return resumeData.workExperience && resumeData.workExperience.length > 0 ? (
                <section key="experience" className="mb-6">
                  <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                    <span className="w-2 h-8 bg-gradient-to-b from-indigo-600 to-cyan-500 rounded-full"></span>
                    {customSectionTitles.experience || "JOURNEY"}
                  </h2>
                  <div className="space-y-4">
                    {resumeData.workExperience.map((exp, index) => (
                      <div key={index} className="relative pl-6 border-l-2 border-indigo-200">
                        {/* Timeline dot */}
                        <div className="absolute -left-2 top-2 w-4 h-4 bg-indigo-600 rounded-full border-4 border-white"></div>
                        
                        <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                              <p className="text-base font-bold text-indigo-600">{exp.company}</p>
                            </div>
                            <div className="text-xs text-gray-600 text-right bg-indigo-50 px-3 py-2 rounded-lg font-semibold">
                              <DateRange startDate={exp.startDate} endDate={exp.endDate} />
                              {exp.location && <div className="mt-1">{exp.location}</div>}
                            </div>
                          </div>
                          {exp.description && (
                            <ul className="list-none text-sm text-gray-700 space-y-2 mt-3">
                              {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-cyan-500 font-bold mt-1">→</span>
                                  <span>{line.trim()}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case "education":
              return resumeData.education && resumeData.education.length > 0 ? (
                <section key="education" className="mb-6">
                  <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                    <span className="w-2 h-8 bg-gradient-to-b from-indigo-600 to-cyan-500 rounded-full"></span>
                    {customSectionTitles.education || "EDUCATION"}
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {resumeData.education.map((edu, index) => (
                      <div key={index} className="bg-gradient-to-r from-indigo-50 to-cyan-50 p-5 rounded-xl border-l-4 border-cyan-500">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                            <p className="text-sm font-bold text-cyan-600">{edu.school}</p>
                            {edu.gpa && (
                              <p className="text-xs text-gray-700 mt-1 bg-white inline-block px-2 py-1 rounded font-semibold">
                                GPA: {edu.gpa}
                              </p>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 text-right bg-white px-3 py-2 rounded-lg font-semibold">
                            <DateRange startDate={edu.startDate} endDate={edu.endDate} />
                            {edu.location && <div className="mt-1">{edu.location}</div>}
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
                  <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                    <span className="w-2 h-8 bg-gradient-to-b from-indigo-600 to-cyan-500 rounded-full"></span>
                    {customSectionTitles.projects || "VENTURES"}
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {resumeData.projects.map((project, index) => (
                      <div key={index} className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-indigo-100 hover:border-indigo-300">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-black text-lg text-gray-900">{project.name}</h3>
                          {project.link && (
                            <Link
                              href={project.link}
                              target="_blank"
                              className="text-sm bg-gradient-to-r from-indigo-600 to-cyan-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-indigo-700 hover:to-cyan-600 transition-all font-bold"
                            >
                              <FaExternalLinkAlt className="w-3 h-3" />
                              <span>Launch</span>
                            </Link>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-sm text-gray-700 leading-relaxed mb-3">
                            {project.description}
                          </p>
                        )}
                        {project.technologies && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {project.technologies.split(',').map((tech, i) => (
                              <span key={i} className="text-xs bg-gradient-to-r from-indigo-100 to-cyan-100 text-indigo-800 px-3 py-1.5 rounded-full font-bold border border-indigo-200">
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
                  <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                    <span className="w-2 h-8 bg-gradient-to-b from-indigo-600 to-cyan-500 rounded-full"></span>
                    {customSectionTitles.skills || "ARSENAL"}
                  </h2>
                  <div className="bg-gradient-to-br from-indigo-50 via-cyan-50 to-blue-50 p-6 rounded-xl">
                    <div className="space-y-4">
                      {technicalSkills.map((skillGroup, index) => (
                        <div key={index}>
                          <h3 className="font-black text-sm text-indigo-700 mb-2 uppercase tracking-wide">
                            {skillGroup.title}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {skillGroup.skills.map((skill, i) => (
                              <span key={i} className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-bold shadow-sm border-2 border-indigo-200">
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
                  <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                    <span className="w-2 h-8 bg-gradient-to-b from-indigo-600 to-cyan-500 rounded-full"></span>
                    {customSectionTitles.softSkills || "SUPERPOWERS"}
                  </h2>
                  <div className="bg-white p-5 rounded-xl shadow-md">
                    <div className="flex flex-wrap gap-2">
                      {softSkillsData.skills.map((skill, i) => (
                        <span key={i} className="bg-gradient-to-r from-cyan-100 to-blue-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-bold border-2 border-cyan-200">
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
                  <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                    <span className="w-2 h-8 bg-gradient-to-b from-indigo-600 to-cyan-500 rounded-full"></span>
                    {customSectionTitles.languages || "LANGUAGES"}
                  </h2>
                  <div className="bg-white p-5 rounded-xl shadow-md">
                    <div className="flex flex-wrap gap-3">
                      {resumeData.languages.map((lang, index) => (
                        <div key={index} className="bg-gradient-to-r from-indigo-100 to-cyan-100 px-4 py-2 rounded-lg border-2 border-indigo-200">
                          <span className="font-bold text-gray-900">{lang.language}</span>
                          {lang.proficiency && (
                            <span className="text-sm text-gray-600 ml-2 font-semibold">• {lang.proficiency}</span>
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
                  <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                    <span className="w-2 h-8 bg-gradient-to-b from-indigo-600 to-cyan-500 rounded-full"></span>
                    {customSectionTitles.certifications || "ACHIEVEMENTS"}
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {resumeData.certifications.map((cert, index) => (
                      <div key={index} className="bg-white p-5 rounded-xl shadow-md border-l-4 border-yellow-400">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900">{cert.name}</h3>
                            <p className="text-sm text-indigo-600 font-bold">{cert.issuer}</p>
                          </div>
                          {cert.date && (
                            <span className="text-xs text-gray-600 bg-yellow-50 px-3 py-2 rounded-lg font-semibold border border-yellow-200">
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

export default TemplateThirteen;
