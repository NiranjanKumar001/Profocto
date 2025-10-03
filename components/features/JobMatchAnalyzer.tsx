'use client';

import React, { useState, useContext } from 'react';
import { analyzeJobDescription } from '../../lib/analysis';
import { ResumeContext } from '../../contexts/ResumeContext';

export default function JobMatchAnalyzer() {
  const [jobText, setJobText] = useState('');
  const [result, setResult] = useState<any>(null);
  const { resumeData } = useContext(ResumeContext) as any;

  const handleAnalyze = () => {
    const skills = resumeData.skills.flatMap((s: any) => s.skills);
    const r = analyzeJobDescription(jobText, skills);
    setResult(r);
  };

  return (
    <div className="p-4 bg-white/80 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-2">Job Description Match</h3>
      <textarea
        value={jobText}
        onChange={(e) => setJobText(e.target.value)}
        placeholder="Paste job description here"
        className="w-full p-2 border rounded h-24 mb-2"
      />
      <div className="flex gap-2">
        <button onClick={handleAnalyze} className="px-3 py-1 bg-pink-500 text-white rounded">Analyze</button>
      </div>

      {result && (
        <div className="mt-3 text-sm">
          <p>Match: <strong>{result.matchPercent}%</strong></p>
          <p>Matched keywords: {result.matched.join(', ') || 'None'}</p>
          <p>Suggested: {result.missing.join(', ') || 'None'}</p>
        </div>
      )}
    </div>
  );
}
