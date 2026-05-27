import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { ArrowLeft, Pencil } from 'lucide-react';
import { authOptions } from '@/util/auth';
import { getDb } from '@/util/database';
import { getImageUrl } from '@/util/s3';
import { serializePost } from '@/util/serialize';
import type { Post } from '@/util/types';
import { Button } from '@/components/ui/button';
import LikeButton from '@/app/LikeButton';
import Comment from './Comment';

export default async function Detail({
  params,
}: {
  params: { routeId: string };
}) {
  if (!ObjectId.isValid(params.routeId)) notFound();

  const session = await getServerSession(authOptions);
  const currentUser = session?.user?.email ?? null;

  const db = await getDb();
  const found = await db
    .collection<Post>('post')
    .findOne({ _id: new ObjectId(params.routeId) });
  if (!found) notFound();

  const post = serializePost(found, currentUser);
  const isOwner = currentUser === post.user;
  // 비공개 버킷: key가 있으면 presigned URL 발급, 구 데이터는 기존 URL 사용
  const imageUrl = found.imgKey
    ? await getImageUrl(found.imgKey)
    : (found.imgUrl ?? null);

  return (
    <article className="flex flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="self-start -ml-2">
        <Link href="/list">
          <ArrowLeft />
          목록
        </Link>
      </Button>

      <header className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
          {isOwner && (
            <Button asChild variant="outline" size="sm" className="shrink-0">
              <Link href={`/edit/${post._id}`}>
                <Pencil />
                수정
              </Link>
            </Button>
          )}
        </div>
        {post.username && (
          <p className="text-muted-foreground text-sm">
            작성자 {post.username}
          </p>
        )}
      </header>

      {imageUrl && (
        <div className="bg-muted overflow-hidden rounded-xl border">
          <Image
            src={imageUrl}
            alt={post.title}
            width={768}
            height={480}
            className="h-auto w-full object-contain"
            unoptimized
          />
        </div>
      )}

      <p className="leading-relaxed whitespace-pre-wrap">{post.content}</p>

      <div className="flex items-center gap-4 border-y py-4">
        <LikeButton
          postId={post._id}
          initialCount={post.likeCount}
          initialLiked={post.likedByMe}
          canLike={Boolean(currentUser)}
        />
      </div>

      <Comment postId={post._id} canComment={Boolean(currentUser)} />
    </article>
  );
}
