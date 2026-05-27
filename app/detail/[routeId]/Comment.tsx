'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { SerializedComment } from '@/util/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

async function fetchComments(postId: string): Promise<SerializedComment[]> {
  const res = await fetch(`/api/comment?postId=${postId}`);
  if (!res.ok) throw new Error('댓글 조회 실패');
  return res.json();
}

async function postComment(input: {
  comment: string;
  postId: string;
}): Promise<SerializedComment[]> {
  const res = await fetch('/api/comment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message ?? '댓글 등록 실패');
  }
  return res.json();
}

export default function Comment({
  postId,
  canComment,
}: {
  postId: string;
  canComment: boolean;
}) {
  const [comment, setComment] = useState('');
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
  });

  const mutation = useMutation({
    mutationFn: postComment,
    onSuccess: (data) => {
      qc.setQueryData(['comments', postId], data);
      setComment('');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = () => {
    const trimmed = comment.trim();
    if (!trimmed) return;
    mutation.mutate({ comment: trimmed, postId });
  };

  const count = query.data?.length ?? 0;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">댓글 {count > 0 && count}</h2>

      {canComment ? (
        <div className="flex gap-2">
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
          />
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            게시
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => signIn()}
          className="text-muted-foreground hover:bg-accent rounded-md border border-dashed px-4 py-3 text-left text-sm transition-colors"
        >
          댓글을 작성하려면 로그인하세요
        </button>
      )}

      <div className="flex flex-col gap-3">
        {query.isLoading && (
          <>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-3/4" />
          </>
        )}
        {query.isError && (
          <p className="text-destructive text-sm">댓글을 불러오지 못했습니다</p>
        )}
        {query.data &&
          (query.data.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              아직 댓글이 없습니다. 첫 댓글을 달아보세요!
            </p>
          ) : (
            query.data.map((item) => (
              <div key={item._id} className="flex gap-3">
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback className="text-xs">
                    {(item.username || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {item.username || '익명'}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {item.content}
                  </span>
                </div>
              </div>
            ))
          ))}
      </div>
    </section>
  );
}
