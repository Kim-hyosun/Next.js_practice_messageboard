import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { ArrowRight, PenLine } from 'lucide-react';
import { authOptions } from '@/util/auth';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const session = await getServerSession(authOptions);
  const name = session?.user?.name;

  return (
    <section className="flex flex-col items-center gap-6 py-16 text-center">
      <span className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs font-medium">
        위라이드 | 누구나 읽고 쓰고 나누는 공간
      </span>

      {session ? (
        <>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {name?.trim() || '회원'}님, 환영합니다 👋
          </h1>
          <p className="text-muted-foreground max-w-md">
            오늘은 어떤 이야기를 남겨볼까요? 
          </p>

        <p className="text-muted-foreground max-w-md">
            새 글을 작성하거나 다른 사람들의
            글을 둘러보세요.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/write">
                <PenLine />
                글쓰기
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/list">
                글 목록 보기
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            생각을 나누는 가장 간단한 방법
          </h1>
          <p className="text-muted-foreground max-w-md">
            글은 누구나 둘러볼 수 있어요. 직접 글을 쓰고 좋아요·댓글을 남기려면
            가입하고 로그인해 주세요.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/register">
                회원가입하고 시작하기
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/list">글 둘러보기</Link>
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
