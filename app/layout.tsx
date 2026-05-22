import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/auth';
import Providers from './providers';
import LoginBtn from './LoginBtn';
import LogOutBtn from './LogOutBtn';
import RegisterBtn from './RegisterBtn';
import Darkmode from './Darkmode';

export const metadata: Metadata = {
  title: 'next.js_게시판',
  description: 'Next.js 게시판 연습 프로젝트',
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
    <html lang="ko">
      <body
        className={isDark ? 'dark-mode' : ''}
        suppressHydrationWarning={true}
      >
        <Providers>
          <div className="navbar">
            <Link href="/" className="logo">
              myBlog
            </Link>
            <Link href="/list">List</Link>

            {session ? (
              <>
                <Link href="/write">write</Link>
                <span className="welcome">
                  {session.user?.name}님 환영합니다
                </span>
                <LogOutBtn />
              </>
            ) : (
              <>
                <RegisterBtn />
                <LoginBtn />
              </>
            )}
            <Darkmode initialMode={isDark ? 'dark' : 'light'} />
          </div>

          {children}
        </Providers>
      </body>
    </html>
  );
}
