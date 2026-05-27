'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function LoginBtn() {
  return (
    <Button variant="ghost" size="sm" onClick={() => signIn()}>
      로그인
    </Button>
  );
}
