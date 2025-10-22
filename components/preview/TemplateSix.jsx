"use client";

import React, { useEffect, useState } from "react";
import DateRange from "../utility/DateRange";
import { useSectionTitles } from "../../contexts/SectionTitleContext";

const TemplateSix = ({
  resumeData,
  sectionOrder,
  enabledSections,
  handleDragEnd,
  sensors,
  icons,
  setResumeData,
}) => {
  const { customSectionTitles } = useSectionTitles();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Simple modern two-column layout with left accent sidebar
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
        {/* Left Sidebar */}
  <aside className="col-span-4 bg-pink-600 text-white rounded-lg p-6 flex flex-col gap-4 print:rounded-none print:p-4">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              {resumeData.profilePicture ? (
                <img src={resumeData.profilePicture} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <div className="text-xl font-bold">{(resumeData.name || "").split(" ").map(n=>n[0]).join("")}</div>
              )}
            </div>
            <h1 className="mt-3 text-lg font-bold">{resumeData.name}</h1>
            <p className="text-sm opacity-90">{resumeData.position}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Contact</h3>
            <ul className="text-sm mt-2 space-y-1">
              <li>{resumeData.email}</li>
              <li>{resumeData.contactInformation}</li>
              <li>{resumeData.address}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Skills</h3>
            <div className="mt-2 space-y-2">
              {resumeData.skills && resumeData.skills.slice(0,5).map((group, idx) => (
                <div key={idx}>
                  <div className="text-xs font-medium">{group.title}</div>
                  <div className="w-full bg-white/25 rounded h-2 mt-1 overflow-hidden">
                    <div className="h-2 bg-white" style={{ width: `${Math.min(90, (group.skills?.length || 1) * 10)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto text-xs opacity-90">
            <div className="font-semibold">Languages</div>
            <div>{(resumeData.languages || []).join(", ")}</div>
          </div>
        </aside>

        {/* Main content */}
        <main className="col-span-8 bg-white rounded-lg p-6 print:rounded-none print:p-4">
          <section className="mb-4">
            <h2 className="text-lg font-bold">{customSectionTitles.summary || "Professional Summary"}</h2>
            <p className="text-sm text-gray-800 mt-2">{resumeData.summary}</p>
          </section>

          <section className="mb-4">
            <h2 className="text-md font-semibold border-b pb-1">{customSectionTitles.experience || "Experience"}</h2>
            <div className="mt-3 space-y-3">
              {(resumeData.workExperience || []).map((w, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{w.position}</h3>
                      <span className="text-sm text-gray-600">@ {w.company}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{w.description}</p>
                    {w.keyAchievements && (
                      <ul className="list-disc ml-4 text-sm mt-1">
                        {w.keyAchievements.split('\n').map((a, k) => <li key={k}>{a}</li>)}
                      </ul>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 ml-4">
                    <DateRange startYear={w.startYear} endYear={w.endYear} id={`ts6-${i}`} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-md font-semibold border-b pb-1">{customSectionTitles.education || "Education"}</h2>
            <div className="mt-3 space-y-2">
              {(resumeData.education || []).map((e, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{e.degree}</div>
                    <div className="text-sm text-gray-700">{e.school}</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <DateRange startYear={e.startYear} endYear={e.endYear} id={`ts6edu-${i}`} />
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

export default TemplateSix;
