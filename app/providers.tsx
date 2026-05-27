'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/sonner';

export default function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, refetchOnWindowFocus: false },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={client}>
        {children}
        <Toaster position="top-center" richColors />
      </QueryClientProvider>
    </SessionProvider>
  );
}
