'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Darkmode() {
  let router = useRouter();
  const [mode, setMode] = useState('light');

  useEffect(() => {
    //렌더링이후 쿠키값을 조회
    const 쿠키값 = ('; ' + document.cookie)
      .split(`; mode=`)
      .pop()
      .split(';')[0];
    if (쿠키값 == '') {
      //쿠키값이 없으면
      document.cookie = `mode=light; max-age=${3600 * 24 * 400}`; //기본 lightmode
    } else {
      setMode(쿠키값); //mode값이 있으면
    }
  }, []);

  const handleDarkMode = () => {
    const 쿠키값 = ('; ' + document.cookie)
      .split(`; mode=`)
      .pop()
      .split(';')[0];
    const newMode = 쿠키값 === 'light' ? 'dark' : 'light';
    document.cookie = `mode=${newMode}; max-age=${3600 * 24 * 400}`;
    setMode(newMode);
    router.refresh();
  };
  return (
    <>
      <span className="modeBtn" onClick={handleDarkMode}>
        {mode === 'light' ? '🌙' : '☀️'}
      </span>
    </>
  );
}
