'use client';

import React, { useContext, useMemo } from 'react';
import { ResumeContext } from '../../contexts/ResumeContext';
import { analyzeResumeText } from '../../lib/analysis';

export default function AISuggestions() {
  const { resumeData } = useContext(ResumeContext) as any;

  const textToAnalyze = useMemo(() => {
    // Concatenate summary, experience descriptions, projects and skills
    const parts = [resumeData.summary];
    resumeData.workExperience.forEach((w: any) => {
      parts.push(w.description || '');
      parts.push(w.keyAchievements || '');
    });
    resumeData.projects.forEach((p: any) => {
      parts.push(p.description || '');
      parts.push(p.keyAchievements || '');
    });
    resumeData.skills.forEach((s: any) => {
      parts.push(s.title);
      parts.push((s.skills || []).join(' '));
    });
    return parts.join(' ');
  }, [resumeData]);

  const analysis = analyzeResumeText(textToAnalyze, resumeData.skills.flatMap((s: any) => s.skills));

  return (
    <div className="p-4 bg-white/80 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-2">AI-Powered Suggestions</h3>
      <p className="text-sm text-gray-600 mb-3">Score: <strong>{analysis.score}</strong></p>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        {analysis.suggestions.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
      <div className="mt-3 text-sm">
        <strong>Missing important skills:</strong>
        <div className="flex flex-wrap gap-2 mt-2">
          {analysis.missingSkills.slice(0, 8).map((m) => (
            <span key={m} className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
