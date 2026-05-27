'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { SerializedPost } from '@/util/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import LikeButton from '@/app/LikeButton';

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
    onSuccess: () => {
      toast.success('삭제되었습니다');
      router.refresh();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (result.length === 0) {
    return (
      <div className="text-muted-foreground rounded-xl border border-dashed py-20 text-center">
        아직 작성된 글이 없습니다.
        {currentUser && ' 첫 글을 남겨보세요!'}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {result.map((item) => (
        <Card key={item._id} className="gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md">
          <Link href={`/detail/${item._id}`} className="block">
            <CardHeader className="pt-6">
              <h2 className="line-clamp-1 text-lg font-semibold">
                {item.title}
              </h2>
              {item.username && (
                <p className="text-muted-foreground text-xs">
                  작성자 {item.username}
                </p>
              )}
            </CardHeader>
            <CardContent className="pt-3">
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {item.content}
              </p>
            </CardContent>
          </Link>
          <CardFooter className="mt-auto justify-between py-4">
            <LikeButton
              postId={item._id}
              initialCount={item.likeCount}
              initialLiked={item.likedByMe}
              canLike={Boolean(currentUser)}
              size="sm"
            />
            {currentUser === item.user && (
              <div className="flex items-center gap-1">
                <Button asChild variant="ghost" size="icon">
                  <Link href={`/edit/${item._id}`} aria-label="수정">
                    <Pencil />
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="삭제"
                      disabled={mutation.isPending}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>글을 삭제할까요?</AlertDialogTitle>
                      <AlertDialogDescription>
                        삭제하면 이 글과 달린 댓글이 모두 사라지며 되돌릴 수
                        없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => mutation.mutate(item._id)}
                      >
                        삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
