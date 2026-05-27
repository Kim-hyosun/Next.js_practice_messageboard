import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <p className="text-muted-foreground text-6xl font-bold">404</p>
      <h1 className="text-xl font-semibold">페이지를 찾을 수 없습니다</h1>
      <p className="text-muted-foreground text-sm">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Button asChild>
        <Link href="/">홈으로</Link>
      </Button>
    </div>
  );
}
