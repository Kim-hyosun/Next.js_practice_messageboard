'use client';
import { signIn } from 'next-auth/react';

export default function LoginBtn() {
  return (
    <button
      type="button"
      className="loginBtn"
      onClick={() => {
        signIn();
      }}
    >
      로그인
    </button>
  );
}
