'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SerializedComment } from '@/util/types';

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

export default function Comment({ postId }: { postId: string }) {
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
    onError: (err: Error) => alert(err.message),
  });

  const handleSubmit = () => {
    const trimmed = comment.trim();
    if (!trimmed) return;
    mutation.mutate({ comment: trimmed, postId });
  };

  return (
    <>
      <hr />
      <div className="comment-box">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="댓글을 입력하세요"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={mutation.isPending}
        >
          게시
        </button>
      </div>
      <div>
        {query.isLoading && '댓글 로드중...'}
        {query.isError && '댓글을 불러오지 못했습니다'}
        {query.data &&
          (query.data.length === 0
            ? '현재 댓글이 없습니다. 첫 댓글을 달아보세요'
            : query.data.map((item) => (
                <p key={item._id}>
                  <strong>{item.username}</strong>
                  <br />
                  <span>{item.content}</span>
                </p>
              )))}
      </div>
    </>
  );
}
