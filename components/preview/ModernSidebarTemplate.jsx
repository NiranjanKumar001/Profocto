import React from 'react';
import { ResumeData } from '@/types';

interface ModernSidebarTemplateProps {
  data: ResumeData;
}

const ModernSidebarTemplate: React.FC<ModernSidebarTemplateProps> = ({ data }) => {
  const accentColor = '#2563eb'; // Blue accent color

  return (
    <div className="w-full h-full bg-white flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Left Sidebar - 35% width */}
      <div 
        className="w-[35%] p-8 text-white flex flex-col"
        style={{ backgroundColor: accentColor }}
      >
        {/* Contact Information */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4 border-b border-white/30 pb-2">
            Contact
          </h2>
          <div className="space-y-3 text-sm">
            {data.phoneNumber && (
              <div className="flex items-start gap-2">
                <span className="mt-1">📞</span>
                <span className="break-words">{data.phoneNumber}</span>
              </div>
            )}
            {data.emailAddress && (
              <div className="flex items-start gap-2">
                <span className="mt-1">✉️</span>
                <span className="break-words">{data.emailAddress}</span>
              </div>
            )}
            {data.address && (
              <div className="flex items-start gap-2">
                <span className="mt-1">📍</span>
                <span className="break-words">{data.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Social Media */}
        {data.socialMedia && data.socialMedia.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4 border-b border-white/30 pb-2">
              Links
            </h2>
            <div className="space-y-2 text-sm">
              {data.socialMedia.map((social, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span>🔗</span>
                  <span className="break-all">{social.platform}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Skills */}
        {data.technicalSkills && data.technicalSkills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4 border-b border-white/30 pb-2">
              Technical Skills
            </h2>
            <div className="space-y-3">
              {data.technicalSkills.map((skillCategory, index) => (
                <div key={index} className="text-sm">
                  <div className="font-semibold mb-1">{skillCategory.category}</div>
                  <div className="text-white/90 text-xs leading-relaxed">
                    {skillCategory.skills.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4 border-b border-white/30 pb-2">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="text-sm">
                  <div className="font-semibold">{edu.institution}</div>
                  <div className="text-white/90 text-xs mt-1">{edu.degree}</div>
                  <div className="text-white/80 text-xs mt-1">{edu.duration}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area - 65% width */}
      <div className="w-[65%] p-8 bg-gray-50">
        {/* Header */}
        <div className="mb-8 pb-6 border-b-2" style={{ borderColor: accentColor }}>
          <h1 
            className="text-4xl font-bold mb-2"
            style={{ color: accentColor }}
          >
            {data.fullName || 'YOUR NAME'}
          </h1>
          <div className="text-xl text-gray-600 font-medium">
            {data.jobTitle || 'Your Job Title'}
          </div>
        </div>

        {/* Summary */}
        {data.summary && (
          <div className="mb-8">
            <h2 
              className="text-lg font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
              style={{ color: accentColor }}
            >
              <div className="w-1 h-5 rounded" style={{ backgroundColor: accentColor }}></div>
              Professional Summary
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              {data.summary}
            </p>
          </div>
        )}

        {/* Professional Experience */}
        {data.professionalExperience && data.professionalExperience.length > 0 && (
          <div className="mb-8">
            <h2 
              className="text-lg font-bold uppercase tracking-wide mb-4 flex items-center gap-2"
              style={{ color: accentColor }}
            >
              <div className="w-1 h-5 rounded" style={{ backgroundColor: accentColor }}></div>
              Professional Experience
            </h2>
            <div className="space-y-5">
              {data.professionalExperience.map((exp, index) => (
                <div key={index} className="relative pl-4 border-l-2 border-gray-300">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800">{exp.position}</h3>
                      <div className="text-gray-600 text-sm font-medium">{exp.company}</div>
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {exp.duration}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div>
            <h2 
              className="text-lg font-bold uppercase tracking-wide mb-4 flex items-center gap-2"
              style={{ color: accentColor }}
            >
              <div className="w-1 h-5 rounded" style={{ backgroundColor: accentColor }}></div>
              Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((project, index) => (
                <div key={index} className="relative pl-4 border-l-2 border-gray-300">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800">{project.name}</h3>
                    <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {project.duration}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {project.description}
                  </p>
                  {project.technologies && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.technologies.split(',').map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="text-xs px-2 py-1 rounded text-white"
                          style={{ backgroundColor: accentColor }}
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernSidebarTemplate;