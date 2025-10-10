"use client";

import { FaExternalLinkAlt } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import DateRange from "../utility/DateRange";
import Link from "next/link";
import { useSectionTitles } from "../../contexts/SectionTitleContext";
import { useEffect, useState } from "react";

/**
 * Template Eleven - Academic/Research
 * Traditional academic CV style with serif fonts and formal structure
 * Perfect for academics, researchers, and PhD candidates
 */
const TemplateEleven = ({
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
    <div className="w-full h-full bg-white text-gray-900 p-10 print:p-8" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header - Centered Academic Style */}
      <header className="text-center mb-8 pb-6 border-b-2 border-gray-400">
        <h1 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          {resumeData.personalInformation.name || "Your Name"}
        </h1>
        
        {/* Contact Information - Centered */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-700">
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
        </div>

        {/* Social Links */}
        {resumeData.socialMedia && resumeData.socialMedia.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mt-3 text-sm">
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
                    className="text-gray-600 hover:text-gray-900 underline"
                  >
                    {social.platform}
                  </Link>
                )
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content */}
      <div>
        {sectionOrder.map((sectionId) => {
          if (!enabledSections[sectionId]) return null;

          switch (sectionId) {
            case "summary":
              return resumeData.summary ? (
                <section key="summary" className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
                    {customSectionTitles.summary || "Research Interests"}
                  </h2>
                  <p className="text-sm text-gray-800 leading-relaxed text-justify" style={{ fontFamily: 'Georgia, serif' }}>
                    {resumeData.summary}
                  </p>
                </section>
              ) : null;

            case "education":
              return resumeData.education && resumeData.education.length > 0 ? (
                <section key="education" className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
                    {customSectionTitles.education || "Education"}
                  </h2>
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>{edu.degree}</h3>
                          <p className="text-sm text-gray-700 italic">{edu.school}</p>
                          {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                        </div>
                        <div className="text-sm text-gray-600 text-right ml-4">
                          <DateRange startDate={edu.startDate} endDate={edu.endDate} />
                          {edu.location && <div>{edu.location}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              ) : null;

            case "experience":
              return resumeData.workExperience && resumeData.workExperience.length > 0 ? (
                <section key="experience" className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
                    {customSectionTitles.experience || "Academic Appointments"}
                  </h2>
                  {resumeData.workExperience.map((exp, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>{exp.position}</h3>
                          <p className="text-sm text-gray-700 italic">{exp.company}</p>
                        </div>
                        <div className="text-sm text-gray-600 text-right ml-4">
                          <DateRange startDate={exp.startDate} endDate={exp.endDate} />
                          {exp.location && <div>{exp.location}</div>}
                        </div>
                      </div>
                      {exp.description && (
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                          {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                            <li key={i} className="text-justify">{line.trim()}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </section>
              ) : null;

            case "projects":
              return resumeData.projects && resumeData.projects.length > 0 ? (
                <section key="projects" className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
                    {customSectionTitles.projects || "Research Projects"}
                  </h2>
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900 flex-1" style={{ fontFamily: 'Georgia, serif' }}>{project.name}</h3>
                        {project.link && (
                          <Link
                            href={project.link}
                            target="_blank"
                            className="text-sm text-gray-600 hover:text-gray-900 ml-2"
                          >
                            <FaExternalLinkAlt className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-sm text-gray-700 leading-relaxed text-justify">
                          {project.description}
                        </p>
                      )}
                      {project.technologies && (
                        <p className="text-xs text-gray-600 mt-1 italic">
                          {project.technologies}
                        </p>
                      )}
                    </div>
                  ))}
                </section>
              ) : null;

            case "skills":
              const technicalSkills = resumeData.skills?.filter(s => s.title !== "Soft Skills") || [];
              return technicalSkills.length > 0 ? (
                <section key="skills" className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
                    {customSectionTitles.skills || "Technical Skills"}
                  </h2>
                  <div className="space-y-2">
                    {technicalSkills.map((skillGroup, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-bold text-gray-900">{skillGroup.title}:</span>{" "}
                        <span className="text-gray-700">{skillGroup.skills.join(", ")}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case "softSkills":
              const softSkillsData = resumeData.skills?.find(s => s.title === "Soft Skills");
              return softSkillsData && softSkillsData.skills.length > 0 ? (
                <section key="softSkills" className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
                    {customSectionTitles.softSkills || "Professional Skills"}
                  </h2>
                  <p className="text-sm text-gray-700">
                    {softSkillsData.skills.join(", ")}
                  </p>
                </section>
              ) : null;

            case "languages":
              return resumeData.languages && resumeData.languages.length > 0 ? (
                <section key="languages" className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
                    {customSectionTitles.languages || "Languages"}
                  </h2>
                  <div className="text-sm text-gray-700">
                    {resumeData.languages.map((lang, index) => (
                      <span key={index}>
                        {index > 0 && ", "}
                        <span className="font-semibold">{lang.language}</span>
                        {lang.proficiency && ` (${lang.proficiency})`}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null;

            case "certifications":
              return resumeData.certifications && resumeData.certifications.length > 0 ? (
                <section key="certifications" className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
                    {customSectionTitles.certifications || "Certifications & Awards"}
                  </h2>
                  {resumeData.certifications.map((cert, index) => (
                    <div key={index} className="mb-3 last:mb-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-sm text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>{cert.name}</h3>
                          <p className="text-sm text-gray-700 italic">{cert.issuer}</p>
                        </div>
                        {cert.date && (
                          <span className="text-sm text-gray-600 ml-4">{cert.date}</span>
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

export default TemplateEleven;
