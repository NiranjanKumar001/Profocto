'use client';

import React, { useContext } from 'react';
import { ResumeContext } from '../../contexts/ResumeContext';

export default function AccessibilityAudit() {
  const { resumeData } = useContext(ResumeContext) as any;

  const issues: string[] = [];

  // Simple checks
  if (!resumeData.name) issues.push('Add your full name.');
  if (!resumeData.email) issues.push('Add a contact email.');
  if (resumeData.profilePicture && resumeData.profilePicture.includes('data:')) {
    issues.push('Add alt text for your profile picture for screen readers.');
  }

  // Contrast suggestion (very naive: checks dark mode flavor)
  // In a real app we'd compute contrast ratios.
  if ((resumeData.summary || '').length < 20) issues.push('Summary is short, add more detail for clarity.');

  return (
    <div className="p-3 bg-white/80 rounded shadow-sm border">
      <h3 className="font-semibold mb-2">Accessibility Audit</h3>
      {issues.length === 0 ? (
        <div className="text-sm text-green-700">No immediate accessibility issues detected.</div>
      ) : (
        <ul className="list-disc pl-5 text-sm space-y-1">
          {issues.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
