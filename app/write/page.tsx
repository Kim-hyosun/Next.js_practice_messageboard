'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, ImagePlus, Loader2, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';
import { postCreateSchema, type PostCreateInput } from '@/util/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PresignedPostResponse {
  url: string;
  fields: Record<string, string>;
}

type UploadState = 'idle' | 'uploading' | 'done' | 'failed';

async function createPost(input: PostCreateInput): Promise<void> {
  const res = await fetch('/api/post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message ?? '작성 실패');
  }
}

export default function Write() {
  const router = useRouter();
  // 선택 즉시 보여줄 로컬 미리보기(blob URL). 업로드 성공 여부와 무관.
  const [previewSrc, setPreviewSrc] = useState('');
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const objectUrlRef = useRef<string>('');

  // 컴포넌트 언마운트 시 마지막 objectURL 정리
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostCreateInput>({
    resolver: zodResolver(postCreateSchema),
    defaultValues: { title: '', content: '', imgKey: '' },
  });

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success('글이 등록되었습니다');
      router.push('/list');
      router.refresh();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1) 선택 즉시 로컬 미리보기 (브라우저 메모리)
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const localUrl = URL.createObjectURL(file);
    objectUrlRef.current = localUrl;
    setPreviewSrc(localUrl);

    // 2) S3 업로드는 별개로 진행해 저장용 imgKey 확보
    setUploadState('uploading');
    setValue('imgKey', '', { shouldValidate: false });
    try {
      const filename = encodeURIComponent(file.name);
      const presignRes = await fetch(`/api/post/image?file=${filename}`);
      if (!presignRes.ok) {
        const data = (await presignRes.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(data.message ?? '업로드 URL 발급 실패');
      }
      const { url, fields } =
        (await presignRes.json()) as PresignedPostResponse;

      const formData = new FormData();
      Object.entries({ ...fields, file }).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });
      const uploadRes = await fetch(url, { method: 'POST', body: formData });
      if (!uploadRes.ok) throw new Error('S3 업로드 실패');

      // 비공개 버킷이므로 전체 URL이 아닌 객체 key만 저장. 표시 시 서버가 presigned URL 발급.
      setValue('imgKey', fields.key, { shouldValidate: true });
      setUploadState('done');
    } catch (err) {
      setUploadState('failed');
      toast.error((err as Error).message);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">글 작성</h1>

      <form
        onSubmit={handleSubmit((v) => mutation.mutate(v))}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">제목</Label>
          <Input
            id="title"
            placeholder="제목을 입력하세요"
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
            placeholder="글의 내용을 작성하세요"
            aria-invalid={Boolean(errors.content)}
            {...register('content')}
          />
          {errors.content && (
            <p className="text-destructive text-sm">{errors.content.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="image">이미지 (선택)</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploadState === 'uploading'}
          />
          <input type="hidden" {...register('imgKey')} />

          {uploadState === 'uploading' && (
            <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <Loader2 className="size-4 animate-spin" />
              업로드 중...
            </p>
          )}
          {uploadState === 'done' && (
            <p className="flex items-center gap-1.5 text-sm text-green-600">
              <CheckCircle2 className="size-4" />
              업로드 완료
            </p>
          )}
          {uploadState === 'failed' && (
            <p className="text-destructive flex items-center gap-1.5 text-sm">
              <TriangleAlert className="size-4" />
              업로드 실패 — 미리보기만 보이고, 이 상태로 저장하면 이미지는
              저장되지 않습니다.
            </p>
          )}

          {previewSrc && (
            <div className="bg-muted mt-1 w-fit overflow-hidden rounded-lg border">
              {/* 로컬 blob 미리보기라 next/image 대신 img 사용 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewSrc}
                alt="미리보기"
                className="h-auto w-80 object-contain"
              />
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={uploadState === 'uploading' || mutation.isPending}
          className="self-start"
        >
          {mutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            '글 '
          )}
          게시하기
        </Button>
      </form>
    </div>
  );
}
