'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { LogOut, PenLine } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function UserMenu({ name }: { name: string | null | undefined }) {
  const display = name?.trim() || '사용자';
  const initial = display.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="cursor-pointer rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          aria-label="사용자 메뉴"
        >
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              {initial}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="truncate">
          {display}님
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/write">
            <PenLine />
            글쓰기
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
