"use client";

import React, { useEffect, useState } from "react";
import DateRange from "../utility/DateRange";
import { useSectionTitles } from "../../contexts/SectionTitleContext";

const ContactChip = ({ children }) => (
  <div className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mr-2 mb-1">{children}</div>
);

const SkillBadge = ({ name }) => (
  <span className="inline-block bg-pink-50 text-pink-700 text-xs px-2 py-1 rounded-full mr-2 mb-2">{name}</span>
);

const TemplateSeven = ({ resumeData }) => {
  const { customSectionTitles } = useSectionTitles();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  return (
    <div className="max-w-[210mm] mx-auto bg-white p-6 print:p-4 w-full h-full">
      <style jsx>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>
      <div className="max-w-4xl mx-auto grid grid-cols-12 gap-6 print:gap-4">
        {/* Left Column - slim */}
        <aside className="col-span-4 border-r pr-4 print:pr-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-xl font-bold">
              {resumeData.profilePicture ? (
                <img src={resumeData.profilePicture} alt={`${resumeData.name} profile`} className="w-full h-full object-cover" />
              ) : (
                (resumeData.name || "").split(" ").map(n=>n[0]).slice(0,2).join("")
              )}
            </div>
            <div>
              <h1 className="text-lg font-semibold">{resumeData.name}</h1>
              <div className="text-sm text-gray-600">{resumeData.position}</div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xs uppercase text-gray-500 mb-2">Contact</h3>
            <div>
              <ContactChip>{resumeData.email}</ContactChip>
              <ContactChip>{resumeData.contactInformation}</ContactChip>
              <ContactChip>{resumeData.address}</ContactChip>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xs uppercase text-gray-500 mb-2">Skills</h3>
            <div>
              {(resumeData.skills || []).flatMap(s=>s.skills || []).slice(0,10).map((skill, i)=> (
                <SkillBadge key={i} name={skill} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase text-gray-500 mb-2">Languages</h3>
            <div className="text-sm text-gray-700">{(resumeData.languages || []).join(", ")}</div>
          </div>
        </aside>

        {/* Right Column - content */}
        <main className="col-span-8 pl-4 print:pl-3">
          <section className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-pink-600">{customSectionTitles.summary || 'Summary'}</h2>
            <p className="mt-2 text-sm text-gray-800 leading-relaxed">{resumeData.summary}</p>
          </section>

          <section className="mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-pink-600">{customSectionTitles.experience || 'Experience'}</h2>
            </div>
            <div className="mt-3 space-y-3">
              {(resumeData.workExperience || []).map((w, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{w.position}</h3>
                      <span className="text-sm text-gray-600">{w.company}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{w.description}</p>
                    {w.keyAchievements && (
                      <ul className="list-disc ml-4 text-sm mt-1 text-gray-700">
                        {w.keyAchievements.split('\n').map((a, k) => <li key={k}>{a}</li>)}
                      </ul>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 ml-4 w-28 text-right">
                    <DateRange startYear={w.startYear} endYear={w.endYear} id={`ts7-${i}`} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-pink-600">{customSectionTitles.education || 'Education'}</h2>
            <div className="mt-2 space-y-2">
              {(resumeData.education || []).map((e, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-900">{e.degree}</div>
                    <div className="text-sm text-gray-600">{e.school}</div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <DateRange startYear={e.startYear} endYear={e.endYear} id={`ts7edu-${i}`} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default TemplateSeven;
