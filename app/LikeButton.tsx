'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface LikeResponse {
  liked: boolean;
  likeCount: number;
}

async function toggleLike(postId: string): Promise<LikeResponse> {
  const res = await fetch('/api/post/like', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId }),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message ?? '좋아요 처리 실패');
  }
  return res.json();
}

export default function LikeButton({
  postId,
  initialCount,
  initialLiked,
  canLike,
  size = 'md',
}: {
  postId: string;
  initialCount: number;
  initialLiked: boolean;
  canLike: boolean;
  size?: 'sm' | 'md';
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const mutation = useMutation({
    mutationFn: () => toggleLike(postId),
    onMutate: () => {
      // optimistic
      const prev = { liked, count };
      setLiked(!liked);
      setCount((c) => c + (liked ? -1 : 1));
      return prev;
    },
    onError: (err: Error, _v, ctx) => {
      if (ctx) {
        setLiked(ctx.liked);
        setCount(ctx.count);
      }
      toast.error(err.message);
    },
    onSuccess: (data) => {
      // 서버 확정값으로 동기화
      setLiked(data.liked);
      setCount(data.likeCount);
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canLike) {
      toast.info('좋아요를 누르려면 로그인이 필요합니다');
      signIn();
      return;
    }
    if (!mutation.isPending) mutation.mutate();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={liked}
      aria-label="좋아요"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full text-muted-foreground transition-colors hover:text-red-500',
        liked && 'text-red-500',
        size === 'sm' ? 'text-xs' : 'text-sm'
      )}
    >
      <Heart
        className={cn(size === 'sm' ? 'size-4' : 'size-5', liked && 'fill-current')}
      />
      <span className="tabular-nums">{count}</span>
    </button>
  );
}
