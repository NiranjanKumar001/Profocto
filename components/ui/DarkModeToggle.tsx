'use client';

import React, { useEffect, useState } from 'react';

export default function DarkModeToggle({ onToggle, initial }: { onToggle?: (v: boolean) => void; initial?: boolean }) {
  const [dark, setDark] = useState<boolean>(!!initial);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    onToggle && onToggle(dark);
  }, [dark, onToggle]);

  return (
    <button onClick={() => setDark((d) => !d)} className="px-2 py-1 border rounded">
      {dark ? 'Dark' : 'Light'}
    </button>
  );
}
