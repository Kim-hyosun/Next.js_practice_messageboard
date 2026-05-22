'use client';
import { signOut } from 'next-auth/react';

export default function LogOutBtn() {
  return (
    <button
      type="button"
      className="logoutBtn"
      onClick={() => {
        signOut();
      }}
    >
      로그아웃
    </button>
  );
}
