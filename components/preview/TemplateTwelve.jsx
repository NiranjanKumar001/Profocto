"use client";

import { FaExternalLinkAlt } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import DateRange from "../utility/DateRange";
import Link from "next/link";
import { useSectionTitles } from "../../contexts/SectionTitleContext";
import { useEffect, useState } from "react";

/**
 * Template Twelve - Creative Portfolio
 * Bold, artistic design with vibrant colors and unique layout
 * Perfect for designers, artists, and creative professionals
 */
const TemplateTwelve = ({
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
    <div className="w-full h-full bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Artistic Header */}
      <header className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white p-10 print:p-8 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10">
          <h1 className="text-5xl font-black mb-4 tracking-tight">
            {resumeData.personalInformation.name || "Your Name"}
          </h1>
          
          {/* Contact Info with Icons */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {resumeData.personalInformation.email && (
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <MdEmail className="w-4 h-4" />
                <span>{resumeData.personalInformation.email}</span>
              </div>
            )}
            {resumeData.personalInformation.phone && (
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <MdPhone className="w-4 h-4" />
                <span>{resumeData.personalInformation.phone}</span>
              </div>
            )}
            {resumeData.personalInformation.location && (
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
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
                      className="flex items-center gap-2 text-sm bg-white/30 hover:bg-white/40 px-4 py-2 rounded-full backdrop-blur-sm transition-all"
                    >
                      {iconData && <span className="text-lg">{iconData.icon}</span>}
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
                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                      {customSectionTitles.summary || "About Me"}
                    </h2>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {resumeData.summary}
                    </p>
                  </div>
                </section>
              ) : null;

            case "experience":
              return resumeData.workExperience && resumeData.workExperience.length > 0 ? (
                <section key="experience" className="mb-6">
                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                      {customSectionTitles.experience || "Experience"}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {resumeData.workExperience.map((exp, index) => (
                      <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                            <p className="text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {exp.company}
                            </p>
                          </div>
                          <div className="text-xs text-gray-600 text-right bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-2 rounded-full">
                            <DateRange startDate={exp.startDate} endDate={exp.endDate} />
                            {exp.location && <div className="mt-1">{exp.location}</div>}
                          </div>
                        </div>
                        {exp.description && (
                          <ul className="list-none text-sm text-gray-700 space-y-2">
                            {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">●</span>
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
                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                      {customSectionTitles.education || "Education"}
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {resumeData.education.map((edu, index) => (
                      <div key={index} className="bg-white p-5 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                            <p className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {edu.school}
                            </p>
                            {edu.gpa && (
                              <p className="text-xs text-gray-600 mt-1 bg-purple-100 inline-block px-2 py-1 rounded-full">
                                GPA: {edu.gpa}
                              </p>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 text-right bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-2 rounded-full">
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
                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                      {customSectionTitles.projects || "Portfolio"}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {resumeData.projects.map((project, index) => (
                      <div key={index} className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-gray-900">{project.name}</h3>
                          {project.link && (
                            <Link
                              href={project.link}
                              target="_blank"
                              className="text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full flex items-center gap-1 hover:from-purple-600 hover:to-pink-600 transition-all"
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
                          <div className="flex flex-wrap gap-2 mt-3">
                            {project.technologies.split(',').map((tech, i) => (
                              <span key={i} className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
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
                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                      {customSectionTitles.skills || "Skills"}
                    </h2>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="space-y-4">
                      {technicalSkills.map((skillGroup, index) => (
                        <div key={index}>
                          <h3 className="font-bold text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                            {skillGroup.title}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {skillGroup.skills.map((skill, i) => (
                              <span key={i} className="bg-gradient-to-r from-purple-50 to-pink-50 text-gray-800 px-4 py-2 rounded-full text-sm border-2 border-purple-200 font-semibold">
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
                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                      {customSectionTitles.softSkills || "Soft Skills"}
                    </h2>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-lg">
                    <div className="flex flex-wrap gap-2">
                      {softSkillsData.skills.map((skill, i) => (
                        <span key={i} className="bg-gradient-to-r from-orange-50 to-pink-50 text-gray-800 px-4 py-2 rounded-full text-sm border-2 border-orange-200 font-semibold">
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
                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                      {customSectionTitles.languages || "Languages"}
                    </h2>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-lg">
                    <div className="flex flex-wrap gap-3">
                      {resumeData.languages.map((lang, index) => (
                        <div key={index} className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full">
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
                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                      {customSectionTitles.certifications || "Certifications"}
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {resumeData.certifications.map((cert, index) => (
                      <div key={index} className="bg-white p-5 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900">{cert.name}</h3>
                            <p className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
                              {cert.issuer}
                            </p>
                          </div>
                          {cert.date && (
                            <span className="text-xs text-gray-600 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-2 rounded-full">
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

export default TemplateTwelve;
