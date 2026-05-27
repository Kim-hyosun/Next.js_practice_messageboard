'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { postEditSchema, type PostEditInput } from '@/util/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

async function editPost(input: PostEditInput): Promise<void> {
  const res = await fetch('/api/post/edit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message ?? '수정 실패');
  }
}

export default function EditForm({
  id,
  title,
  content,
}: {
  id: string;
  title: string;
  content: string;
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostEditInput>({
    resolver: zodResolver(postEditSchema),
    defaultValues: { _id: id, title, content },
  });

  const mutation = useMutation({
    mutationFn: editPost,
    onSuccess: () => {
      toast.success('수정되었습니다');
      router.push(`/detail/${id}`);
      router.refresh();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">글 수정</h1>

      <form
        onSubmit={handleSubmit((v) => mutation.mutate(v))}
        className="flex flex-col gap-5"
      >
        <input type="hidden" {...register('_id')} />

        <div className="flex flex-col gap-2">
          <Label htmlFor="title">제목</Label>
          <Input
            id="title"
            aria-invalid={Boolean(errors.title)}
            {...register('title')}
          />
          {errors.title && (
            <p className="text-destructive text-sm">{errors.title.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="content">내용</Label>
          <Textarea
            id="content"
            rows={8}
            aria-invalid={Boolean(errors.content)}
            {...register('content')}
          />
          {errors.content && (
            <p className="text-destructive text-sm">{errors.content.message}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="animate-spin" />}
            수정 완료
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
