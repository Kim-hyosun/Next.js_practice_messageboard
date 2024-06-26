'use client';

import Link from 'next/link';

export default function RegisterBtn() {
  return (
    <Link href="/register" className="registerBtn">
      회원가입하기
    </Link>
  );
}
