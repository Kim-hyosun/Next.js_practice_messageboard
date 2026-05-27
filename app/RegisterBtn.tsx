import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RegisterBtn() {
  return (
    <Button asChild size="sm">
      <Link href="/register">회원가입</Link>
    </Button>
  );
}
