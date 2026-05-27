import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/auth';
import { Button } from '@/components/ui/button';
import Providers from './providers';
import LoginBtn from './LoginBtn';
import RegisterBtn from './RegisterBtn';
import UserMenu from './UserMenu';
import Darkmode from './Darkmode';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'board | hs.kim',
  description: 'Next.js로 게시판 만들기 연습 프로젝트',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const modeCookie = cookies().get('mode');
  const isDark = modeCookie?.value === 'dark';

  return (
    <html lang="ko" className={isDark ? 'dark' : ''}>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
            <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-2 px-4">
              <nav className="flex items-center gap-1">
                <Link href="/" className="mr-2 text-lg font-bold tracking-tight">
                  위라이드
                </Link>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/list">List</Link>
                </Button>
              </nav>

              <div className="flex items-center gap-1.5">
                <Darkmode initialMode={isDark ? 'dark' : 'light'} />
                {session ? (
                  <UserMenu name={session.user?.name} />
                ) : (
                  <>
                    <LoginBtn />
                    <RegisterBtn />
                  </>
                )}
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>

          <footer className="mt-8 border-t">
            <div className="text-muted-foreground mx-auto max-w-3xl px-4 pt-8 text-center text-sm">
              기술 스택 : Next.js (SSR) &amp; AWS S3 &amp; MongoDB &amp; auth (GitHub OAuth + Credentials) &amp; tailwind / shadcn 
            </div>
            <div className="text-muted-foreground mx-auto max-w-3xl px-4 text-center text-sm">
              create by <Link className="font-bold" href="https://github.com/kim-hyosun">@kim-hyosun</Link> 
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
