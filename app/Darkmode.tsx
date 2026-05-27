'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={mode === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
    >
      {mode === 'light' ? <Moon /> : <Sun />}
    </Button>
  );
}
