'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <div className="bg-destructive/10 text-destructive flex size-14 items-center justify-center rounded-full">
        <AlertTriangle className="size-7" />
      </div>
      <h1 className="text-xl font-semibold">문제가 발생했습니다</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        {error.message || '알 수 없는 오류가 발생했습니다.'}
      </p>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  );
}
