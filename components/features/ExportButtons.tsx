'use client';

import React, { useContext } from 'react';
import { ResumeContext } from '../../contexts/ResumeContext';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode.react';

export default function ExportButtons() {
  const { resumeData } = useContext(ResumeContext) as any;

  const exportPDF = async () => {
    // Simple approach: capture preview element and open image in new tab for printing to PDF
    const el = document.getElementById('resume-preview');
    if (!el) return;
    try {
      // use html-to-image to get PNG
      // Note: html-to-image isn't in package.json; this is a lightweight example. In production, use a server-side PDF generator.
      // @ts-ignore
      const dataUrl = await toPng(el);
      const w = window.open('about:blank');
      if (w) {
        w.document.write(`<img src="${dataUrl}" style="max-width:100%"/>`);
      }
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  const exportPlainText = () => {
    const parts: string[] = [];
    parts.push(resumeData.name || '');
    parts.push(resumeData.position || '');
    parts.push(resumeData.contactInformation || '');
    parts.push('SUMMARY:');
    parts.push(resumeData.summary || '');
    resumeData.workExperience.forEach((w: any) => {
      parts.push(`${w.position} at ${w.company} ${w.startYear}-${w.endYear}`);
      parts.push(w.description || '');
    });
    const txt = parts.join('\n');
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.name || 'resume'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-3 bg-white/80 rounded flex gap-2 items-center">
      <button onClick={exportPDF} className="px-3 py-1 bg-pink-500 text-white rounded">Export PDF</button>
      <button onClick={exportPlainText} className="px-3 py-1 bg-gray-800 text-white rounded">Export ATS Text</button>
      <div className="ml-2 text-xs text-gray-600">Share:</div>
      <div className="w-16 h-16 p-1 bg-white rounded border flex items-center justify-center">
        {/* Simple inline QR code using qrcode.react */}
        <QRCode value={`https://profocto.local/share/${encodeURIComponent(resumeData.name || 'resume')}`} size={64} />
      </div>
    </div>
  );
}
