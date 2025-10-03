'use client';

import React, { useContext, useState, useEffect } from 'react';
import { ResumeContext } from '../../contexts/ResumeContext';
import { v4 as uuidv4 } from 'uuid';

export default function VersionControl() {
  const { resumeData, setResumeData } = useContext(ResumeContext) as any;
  const [versions, setVersions] = useState<any[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    const v = localStorage.getItem('resumeVersions');
    if (v) setVersions(JSON.parse(v));
  }, []);

  const saveVersion = (label?: string) => {
    const id = uuidv4();
    const entry = { id, name: label || `Version ${new Date().toLocaleString()}`, timestamp: Date.now(), data: resumeData };
    const next = [entry, ...versions].slice(0, 30);
    setVersions(next);
    localStorage.setItem('resumeVersions', JSON.stringify(next));
  };

  const restore = (id: string) => {
    const v = versions.find((x) => x.id === id);
    if (v) {
      setResumeData(v.data);
    }
  };

  const remove = (id: string) => {
    const next = versions.filter((x) => x.id !== id);
    setVersions(next);
    localStorage.setItem('resumeVersions', JSON.stringify(next));
  };

  return (
    <div className="p-4 bg-white/80 rounded shadow-sm border">
      <h3 className="font-semibold mb-2">Version Control</h3>
      <div className="flex gap-2 mb-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Label (optional)" className="p-1 border rounded flex-1" />
        <button onClick={() => saveVersion(name)} className="px-3 py-1 bg-pink-500 text-white rounded">Save</button>
      </div>
      <div className="max-h-40 overflow-auto">
        {versions.map((v) => (
          <div key={v.id} className="flex items-center justify-between p-2 border-b">
            <div>
              <div className="text-sm font-medium">{v.name}</div>
              <div className="text-xs text-gray-500">{new Date(v.timestamp).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => restore(v.id)} className="px-2 py-1 bg-green-500 text-white rounded text-xs">Restore</button>
              <button onClick={() => remove(v.id)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Delete</button>
            </div>
          </div>
        ))}
        {versions.length === 0 && <div className="text-xs text-gray-500">No versions saved</div>}
      </div>
    </div>
  );
}
