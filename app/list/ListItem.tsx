'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import type { SerializedPost } from '@/util/types';

async function deletePost(postId: string): Promise<void> {
  const res = await fetch('/api/post/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId }),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message ?? '삭제 실패');
  }
}

export default function ListItem({
  result,
  currentUser,
}: {
  result: SerializedPost[];
  currentUser: string | null;
}) {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => router.refresh(),
    onError: (err: Error) => alert(err.message),
  });

  return (
    <>
      {result.map((item) => (
        <div className="list-item" key={item._id}>
          <Link href={`/detail/${item._id}`}>
            <h4>{item.title}</h4>
            <span className="writer">
              {item.username ? `작성자: ${item.username}` : ''}
            </span>
            <p>{item.content}</p>
          </Link>
          {currentUser === item.user && (
            <div className="modify-buttons">
              <Link href={`/edit/${item._id}`}>✍🏻</Link>
              <button
                type="button"
                onClick={() => {
                  if (confirm('삭제하시겠어요?')) mutation.mutate(item._id);
                }}
                disabled={mutation.isPending}
                style={{
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  fontSize: 'inherit',
                  padding: 0,
                }}
              >
                🗑️
              </button>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
