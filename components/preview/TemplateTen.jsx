"use client";

import { FaExternalLinkAlt, FaGithub, FaCode } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import DateRange from "../utility/DateRange";
import Link from "next/link";
import { useSectionTitles } from "../../contexts/SectionTitleContext";
import { useEffect, useState } from "react";

/**
 * Template Ten - Tech/Developer Focused
 * Code-inspired design with monospace accents and tech-friendly layout
 * Perfect for software developers, engineers, and tech professionals
 */
const TemplateTen = ({
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
    <div className="w-full h-full bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-green-400 p-8 print:p-6 font-mono">
        <div className="flex items-center gap-2 text-sm mb-2">
          <span className="text-green-500">$</span>
          <span className="text-gray-400">whoami</span>
        </div>
        <h1 className="text-4xl font-bold mb-3">
          {resumeData.personalInformation.name || "developer@localhost"}
        </h1>
        
        {/* Contact Info - Terminal Style */}
        <div className="space-y-1 text-sm">
          {resumeData.personalInformation.email && (
            <div className="flex items-center gap-2">
              <span className="text-green-500">→</span>
              <MdEmail className="w-4 h-4" />
              <span className="text-gray-300">{resumeData.personalInformation.email}</span>
            </div>
          )}
          {resumeData.personalInformation.phone && (
            <div className="flex items-center gap-2">
              <span className="text-green-500">→</span>
              <MdPhone className="w-4 h-4" />
              <span className="text-gray-300">{resumeData.personalInformation.phone}</span>
            </div>
          )}
          {resumeData.personalInformation.location && (
            <div className="flex items-center gap-2">
              <span className="text-green-500">→</span>
              <MdLocationOn className="w-4 h-4" />
              <span className="text-gray-300">{resumeData.personalInformation.location}</span>
            </div>
          )}
        </div>

        {/* Social Links */}
        {resumeData.socialMedia && resumeData.socialMedia.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-700">
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
                    className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
                  >
                    {iconData && <span>{iconData.icon}</span>}
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
        {sectionOrder.map((sectionId) => {
          if (!enabledSections[sectionId]) return null;

          switch (sectionId) {
            case "summary":
              return resumeData.summary ? (
                <section key="summary" className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-green-600 font-mono text-lg">{'<'}</span>
                    <h2 className="text-xl font-bold text-gray-900 font-mono">
                      {customSectionTitles.summary || "summary"}
                    </h2>
                    <span className="text-green-600 font-mono text-lg">{'/>'}</span>
                  </div>
                  <div className="bg-white p-4 rounded border-l-4 border-green-600 shadow-sm">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {resumeData.summary}
                    </p>
                  </div>
                </section>
              ) : null;

            case "experience":
              return resumeData.workExperience && resumeData.workExperience.length > 0 ? (
                <section key="experience" className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-green-600 font-mono text-lg">{'<'}</span>
                    <h2 className="text-xl font-bold text-gray-900 font-mono">
                      {customSectionTitles.experience || "experience"}
                    </h2>
                    <span className="text-green-600 font-mono text-lg">{'/>'}</span>
                  </div>
                  <div className="space-y-4">
                    {resumeData.workExperience.map((exp, index) => (
                      <div key={index} className="bg-white p-5 rounded border-l-4 border-blue-600 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                            <p className="text-sm font-semibold text-blue-600 font-mono">{exp.company}</p>
                          </div>
                          <div className="text-xs text-gray-600 text-right font-mono bg-gray-100 px-2 py-1 rounded">
                            <DateRange startDate={exp.startDate} endDate={exp.endDate} />
                            {exp.location && <div className="mt-1">{exp.location}</div>}
                          </div>
                        </div>
                        {exp.description && (
                          <ul className="list-none text-sm text-gray-700 space-y-1 ml-2">
                            {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-green-600 mt-1">▹</span>
                                <span>{line.trim()}</span>
                              </li>
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
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-green-600 font-mono text-lg">{'<'}</span>
                    <h2 className="text-xl font-bold text-gray-900 font-mono">
                      {customSectionTitles.education || "education"}
                    </h2>
                    <span className="text-green-600 font-mono text-lg">{'/>'}</span>
                  </div>
                  <div className="space-y-3">
                    {resumeData.education.map((edu, index) => (
                      <div key={index} className="bg-white p-4 rounded border-l-4 border-purple-600 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                            <p className="text-sm font-semibold text-purple-600 font-mono">{edu.school}</p>
                            {edu.gpa && (
                              <p className="text-xs text-gray-600 mt-1 font-mono">
                                GPA: {edu.gpa}
                              </p>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 text-right font-mono bg-gray-100 px-2 py-1 rounded">
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
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-green-600 font-mono text-lg">{'<'}</span>
                    <h2 className="text-xl font-bold text-gray-900 font-mono">
                      {customSectionTitles.projects || "projects"}
                    </h2>
                    <span className="text-green-600 font-mono text-lg">{'/>'}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {resumeData.projects.map((project, index) => (
                      <div key={index} className="bg-white p-4 rounded border-l-4 border-orange-600 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-gray-900 font-mono">{project.name}</h3>
                          {project.link && (
                            <Link
                              href={project.link}
                              target="_blank"
                              className="text-sm text-orange-600 hover:text-orange-800 flex items-center gap-1"
                            >
                              <FaGithub className="w-4 h-4" />
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
                              <span key={i} className="text-xs bg-gray-900 text-green-400 px-2 py-1 rounded font-mono">
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
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-green-600 font-mono text-lg">{'<'}</span>
                    <h2 className="text-xl font-bold text-gray-900 font-mono">
                      {customSectionTitles.skills || "tech_stack"}
                    </h2>
                    <span className="text-green-600 font-mono text-lg">{'/>'}</span>
                  </div>
                  <div className="bg-white p-5 rounded shadow-sm">
                    <div className="space-y-3">
                      {technicalSkills.map((skillGroup, index) => (
                        <div key={index}>
                          <h3 className="font-bold text-sm text-gray-900 mb-2 font-mono text-green-600">
                            {skillGroup.title}:
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {skillGroup.skills.map((skill, i) => (
                              <span key={i} className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-xs font-mono border border-gray-300">
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
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-green-600 font-mono text-lg">{'<'}</span>
                    <h2 className="text-xl font-bold text-gray-900 font-mono">
                      {customSectionTitles.softSkills || "soft_skills"}
                    </h2>
                    <span className="text-green-600 font-mono text-lg">{'/>'}</span>
                  </div>
                  <div className="bg-white p-4 rounded shadow-sm">
                    <div className="flex flex-wrap gap-2">
                      {softSkillsData.skills.map((skill, i) => (
                        <span key={i} className="bg-blue-50 text-blue-800 px-3 py-1 rounded text-sm border border-blue-200">
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
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-green-600 font-mono text-lg">{'<'}</span>
                    <h2 className="text-xl font-bold text-gray-900 font-mono">
                      {customSectionTitles.languages || "languages"}
                    </h2>
                    <span className="text-green-600 font-mono text-lg">{'/>'}</span>
                  </div>
                  <div className="bg-white p-4 rounded shadow-sm">
                    <div className="flex flex-wrap gap-3">
                      {resumeData.languages.map((lang, index) => (
                        <div key={index} className="font-mono text-sm">
                          <span className="font-bold text-gray-900">{lang.language}</span>
                          {lang.proficiency && (
                            <span className="text-gray-600 ml-2">({lang.proficiency})</span>
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
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-green-600 font-mono text-lg">{'<'}</span>
                    <h2 className="text-xl font-bold text-gray-900 font-mono">
                      {customSectionTitles.certifications || "certifications"}
                    </h2>
                    <span className="text-green-600 font-mono text-lg">{'/>'}</span>
                  </div>
                  <div className="space-y-3">
                    {resumeData.certifications.map((cert, index) => (
                      <div key={index} className="bg-white p-4 rounded shadow-sm border-l-4 border-yellow-600">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-sm text-gray-900">{cert.name}</h3>
                            <p className="text-sm text-yellow-600 font-mono">{cert.issuer}</p>
                          </div>
                          {cert.date && (
                            <span className="text-xs text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
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

export default TemplateTen;
