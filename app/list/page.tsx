import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { PenLine } from 'lucide-react';
import { authOptions } from '@/util/auth';
import { getDb } from '@/util/database';
import { serializePost } from '@/util/serialize';
import type { Post } from '@/util/types';
import { Button } from '@/components/ui/button';
import ListItem from './ListItem';
import Pagination from './Pagination';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 10;

export default async function List({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const session = await getServerSession(authOptions);
  const currentUser = session?.user?.email ?? null;

  const db = await getDb();
  const collection = db.collection<Post>('post');

  const total = await collection.countDocuments();
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const requested = Number(searchParams.page) || 1;
  const page = Math.min(Math.max(1, requested), totalPages);

  const raw = await collection
    .find()
    .sort({ _id: -1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .toArray();
  const result = raw.map((p) => serializePost(p, currentUser));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">글 목록</h1>
          <p className="text-muted-foreground text-sm">
            총 {total}개의 글
            {totalPages > 1 && ` · ${page}/${totalPages} 페이지`}
          </p>
        </div>
        {currentUser && (
          <Button asChild>
            <Link href="/write">
              <PenLine />
              글쓰기
            </Link>
          </Button>
        )}
      </div>

      <ListItem result={result} currentUser={currentUser} />

      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
