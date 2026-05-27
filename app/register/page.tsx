'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { signupSchema, type SignupInput } from '@/util/schemas';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

async function signup(input: SignupInput): Promise<void> {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message ?? '회원가입 실패');
  }
}

export default function Register() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: async (_data, vars) => {
      toast.success('가입이 완료되었습니다');
      // 가입 직후 자동 로그인
      const result = await signIn('credentials', {
        email: vars.email,
        password: vars.password,
        redirect: false,
      });
      if (result?.ok) {
        router.push('/list');
        router.refresh();
      } else {
        router.push('/api/auth/signin');
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="flex justify-center py-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">회원가입</CardTitle>
          <CardDescription>
            가입하고 글쓰기·좋아요·댓글을 시작하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((v) => mutation.mutate(v))}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                placeholder="이름"
                aria-invalid={Boolean(errors.name)}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-destructive text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-destructive text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="8자 이상"
                aria-invalid={Boolean(errors.password)}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-destructive text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="animate-spin" />}
              회원가입하기
            </Button>
          </form>

          <p className="text-muted-foreground mt-4 text-center text-sm">
            이미 계정이 있나요?{' '}
            <Link
              href="/api/auth/signin"
              className="text-foreground font-medium underline-offset-4 hover:underline"
            >
              로그인
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
