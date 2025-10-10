"use client";

import { FaExternalLinkAlt } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import DateRange from "../utility/DateRange";
import Link from "next/link";
import { useSectionTitles } from "../../contexts/SectionTitleContext";
import { useEffect, useState } from "react";

/**
 * Template Nine - Executive/Senior Level
 * Sophisticated design with bold headers and professional spacing
 * Perfect for senior executives, managers, and leadership roles
 */
const TemplateNine = ({
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
    <div className="w-full h-full bg-white text-gray-900">
      {/* Header with Dark Background */}
      <header className="bg-gray-900 text-white p-8 print:p-6">
        <h1 className="text-5xl font-bold mb-2 tracking-wide">
          {resumeData.personalInformation.name || "Your Name"}
        </h1>
        
        {/* Contact Bar */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm border-t border-gray-700 pt-4 mt-4">
          {resumeData.personalInformation.email && (
            <div className="flex items-center gap-2">
              <MdEmail className="w-4 h-4" />
              <span>{resumeData.personalInformation.email}</span>
            </div>
          )}
          {resumeData.personalInformation.phone && (
            <div className="flex items-center gap-2">
              <MdPhone className="w-4 h-4" />
              <span>{resumeData.personalInformation.phone}</span>
            </div>
          )}
          {resumeData.personalInformation.location && (
            <div className="flex items-center gap-2">
              <MdLocationOn className="w-4 h-4" />
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
                    className="flex items-center gap-2 text-sm hover:text-gray-300 transition-colors"
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
                <section key="summary" className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-4 border-gray-900">
                    {customSectionTitles.summary || "EXECUTIVE SUMMARY"}
                  </h2>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {resumeData.summary}
                  </p>
                </section>
              ) : null;

            case "experience":
              return resumeData.workExperience && resumeData.workExperience.length > 0 ? (
                <section key="experience" className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-4 border-gray-900">
                    {customSectionTitles.experience || "PROFESSIONAL EXPERIENCE"}
                  </h2>
                  {resumeData.workExperience.map((exp, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                          <p className="text-base font-semibold text-gray-700">{exp.company}</p>
                        </div>
                        <div className="text-sm text-gray-600 text-right">
                          <DateRange startDate={exp.startDate} endDate={exp.endDate} />
                          {exp.location && <div className="mt-1">{exp.location}</div>}
                        </div>
                      </div>
                      {exp.description && (
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1.5 ml-2">
                          {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                            <li key={i}>{line.trim()}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </section>
              ) : null;

            case "education":
              return resumeData.education && resumeData.education.length > 0 ? (
                <section key="education" className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-4 border-gray-900">
                    {customSectionTitles.education || "EDUCATION"}
                  </h2>
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                          <p className="text-base text-gray-700">{edu.school}</p>
                          {edu.gpa && <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>}
                        </div>
                        <div className="text-sm text-gray-600 text-right">
                          <DateRange startDate={edu.startDate} endDate={edu.endDate} />
                          {edu.location && <div className="mt-1">{edu.location}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              ) : null;

            case "projects":
              return resumeData.projects && resumeData.projects.length > 0 ? (
                <section key="projects" className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-4 border-gray-900">
                    {customSectionTitles.projects || "KEY PROJECTS"}
                  </h2>
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="mb-5 last:mb-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                        {project.link && (
                          <Link
                            href={project.link}
                            target="_blank"
                            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
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
                        <p className="text-xs text-gray-600">
                          <span className="font-semibold">Technologies:</span> {project.technologies}
                        </p>
                      )}
                    </div>
                  ))}
                </section>
              ) : null;

            case "skills":
              const technicalSkills = resumeData.skills?.filter(s => s.title !== "Soft Skills") || [];
              return technicalSkills.length > 0 ? (
                <section key="skills" className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-4 border-gray-900">
                    {customSectionTitles.skills || "CORE COMPETENCIES"}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {technicalSkills.map((skillGroup, index) => (
                      <div key={index}>
                        <h3 className="font-bold text-sm text-gray-900 mb-2">{skillGroup.title}</h3>
                        <p className="text-sm text-gray-700">
                          {skillGroup.skills.join(" • ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case "softSkills":
              const softSkillsData = resumeData.skills?.find(s => s.title === "Soft Skills");
              return softSkillsData && softSkillsData.skills.length > 0 ? (
                <section key="softSkills" className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-4 border-gray-900">
                    {customSectionTitles.softSkills || "LEADERSHIP SKILLS"}
                  </h2>
                  <p className="text-sm text-gray-700">
                    {softSkillsData.skills.join(" • ")}
                  </p>
                </section>
              ) : null;

            case "languages":
              return resumeData.languages && resumeData.languages.length > 0 ? (
                <section key="languages" className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-4 border-gray-900">
                    {customSectionTitles.languages || "LANGUAGES"}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                    {resumeData.languages.map((lang, index) => (
                      <span key={index}>
                        <span className="font-semibold">{lang.language}</span>
                        {lang.proficiency && ` (${lang.proficiency})`}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null;

            case "certifications":
              return resumeData.certifications && resumeData.certifications.length > 0 ? (
                <section key="certifications" className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-4 border-gray-900">
                    {customSectionTitles.certifications || "CERTIFICATIONS"}
                  </h2>
                  {resumeData.certifications.map((cert, index) => (
                    <div key={index} className="mb-3 last:mb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-sm text-gray-900">{cert.name}</h3>
                          <p className="text-sm text-gray-700">{cert.issuer}</p>
                        </div>
                        {cert.date && (
                          <span className="text-sm text-gray-600">{cert.date}</span>
                        )}
                      </div>
                    </div>
                  ))}
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

export default TemplateNine;
