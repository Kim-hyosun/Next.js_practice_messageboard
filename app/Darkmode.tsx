'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ONE_YEAR = 60 * 60 * 24 * 365;

export default function Darkmode({
  initialMode,
}: {
  initialMode: 'light' | 'dark';
}) {
  const router = useRouter();
  const [mode, setMode] = useState<'light' | 'dark'>(initialMode);

  const toggle = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    document.cookie = `mode=${next}; max-age=${ONE_YEAR}; path=/`;
    setMode(next);
    router.refresh();
  };

  return (
    <span
      className="modeBtn"
      role="button"
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') toggle();
      }}
    >
      {mode === 'light' ? '🌙' : '☀️'}
    </span>
  );
}
