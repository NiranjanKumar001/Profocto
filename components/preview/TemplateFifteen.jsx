"use client";

import { FaExternalLinkAlt } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import DateRange from "../utility/DateRange";
import Link from "next/link";
import { useSectionTitles } from "../../contexts/SectionTitleContext";
import { useEffect, useState } from "react";

/**
 * Template Fifteen - Modern Gradient
 * Sleek design with smooth gradients and contemporary styling
 * Perfect for modern professionals in tech, marketing, and design
 */
const TemplateFifteen = ({
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
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      {/* Gradient Header */}
      <header className="relative bg-gradient-to-r from-slate-900 via-gray-900 to-zinc-900 text-white p-8 print:p-6">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {resumeData.personalInformation.name || "Your Name"}
          </h1>
          
          {/* Contact Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            {resumeData.personalInformation.email && (
              <div className="flex items-center gap-2">
                <MdEmail className="w-4 h-4 text-blue-400" />
                <span>{resumeData.personalInformation.email}</span>
              </div>
            )}
            {resumeData.personalInformation.phone && (
              <div className="flex items-center gap-2">
                <MdPhone className="w-4 h-4 text-purple-400" />
                <span>{resumeData.personalInformation.phone}</span>
              </div>
            )}
            {resumeData.personalInformation.location && (
              <div className="flex items-center gap-2">
                <MdLocationOn className="w-4 h-4 text-pink-400" />
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
                      className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg"
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
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {customSectionTitles.summary || "Professional Summary"}
                  </h2>
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {resumeData.summary}
                    </p>
                  </div>
                </section>
              ) : null;

            case "experience":
              return resumeData.workExperience && resumeData.workExperience.length > 0 ? (
                <section key="experience" className="mb-6">
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {customSectionTitles.experience || "Experience"}
                  </h2>
                  <div className="space-y-4">
                    {resumeData.workExperience.map((exp, index) => (
                      <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                            <p className="text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {exp.company}
                            </p>
                          </div>
                          <div className="text-xs text-gray-600 text-right bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 rounded-lg">
                            <DateRange startDate={exp.startDate} endDate={exp.endDate} />
                            {exp.location && <div className="mt-1">{exp.location}</div>}
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
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {customSectionTitles.education || "Education"}
                  </h2>
                  <div className="space-y-3">
                    {resumeData.education.map((edu, index) => (
                      <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                            <p className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {edu.school}
                            </p>
                            {edu.gpa && (
                              <p className="text-xs text-gray-600 mt-1 bg-blue-50 inline-block px-2 py-1 rounded">
                                GPA: {edu.gpa}
                              </p>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 text-right bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 rounded-lg">
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
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {customSectionTitles.projects || "Projects"}
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {resumeData.projects.map((project, index) => (
                      <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-gray-900">{project.name}</h3>
                          {project.link && (
                            <Link
                              href={project.link}
                              target="_blank"
                              className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:from-blue-700 hover:to-purple-700 transition-all"
                            >
                              <FaExternalLinkAlt className="w-3 h-3" />
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
                              <span key={i} className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 px-3 py-1 rounded-full border border-blue-200">
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
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {customSectionTitles.skills || "Skills"}
                  </h2>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="space-y-4">
                      {technicalSkills.map((skillGroup, index) => (
                        <div key={index}>
                          <h3 className="font-bold text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            {skillGroup.title}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {skillGroup.skills.map((skill, i) => (
                              <span key={i} className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 px-3 py-1.5 rounded-lg text-sm border border-blue-200">
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
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {customSectionTitles.softSkills || "Soft Skills"}
                  </h2>
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {softSkillsData.skills.map((skill, i) => (
                        <span key={i} className="bg-gradient-to-r from-purple-50 to-pink-50 text-gray-800 px-3 py-1.5 rounded-lg text-sm border border-purple-200">
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
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {customSectionTitles.languages || "Languages"}
                  </h2>
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex flex-wrap gap-3">
                      {resumeData.languages.map((lang, index) => (
                        <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-lg border border-blue-200">
                          <span className="font-bold text-gray-900">{lang.language}</span>
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
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {customSectionTitles.certifications || "Certifications"}
                  </h2>
                  <div className="space-y-3">
                    {resumeData.certifications.map((cert, index) => (
                      <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900">{cert.name}</h3>
                            <p className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                              {cert.issuer}
                            </p>
                          </div>
                          {cert.date && (
                            <span className="text-xs text-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 rounded-lg border border-blue-200">
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

export default TemplateFifteen;
