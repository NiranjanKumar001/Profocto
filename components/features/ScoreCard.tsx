'use client';

import React, { useContext, useMemo } from 'react';
import { analyzeResumeText } from '../../lib/analysis';
import { ResumeContext } from '../../contexts/ResumeContext';

export default function ScoreCard() {
  const { resumeData } = useContext(ResumeContext) as any;

  const textToAnalyze = useMemo(() => {
    const parts = [resumeData.summary];
    resumeData.workExperience.forEach((w: any) => {
      parts.push(w.description || '');
    });
    return parts.join(' ');
  }, [resumeData]);

  const analysis = analyzeResumeText(textToAnalyze, resumeData.skills.flatMap((s: any) => s.skills));

  return (
    <div className="p-3 bg-white/80 rounded shadow-sm border">
      <h3 className="font-semibold mb-2">Resume Score</h3>
      <div className="text-2xl font-bold text-pink-600">{analysis.score}</div>
      <div className="text-sm text-gray-600">Based on keywords, length and achievement hints.</div>
    </div>
  );
}
