import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ObjectId } from 'mongodb';
import { connectDB, DB_NAME } from '@/util/database';
import type { Post } from '@/util/types';
import Comment from './Comment';

export default async function Detail({
  params,
}: {
  params: { routeId: string };
}) {
  if (!ObjectId.isValid(params.routeId)) notFound();

  const client = await connectDB;
  const db = client.db(DB_NAME);
  const result = await db
    .collection<Post>('post')
    .findOne({ _id: new ObjectId(params.routeId) });

  if (!result) notFound();

  return (
    <div className="p-20">
      <h4>상세페이지</h4>
      <h4>{result.title}</h4>
      <p className="writer">
        {result.username ? `작성자: ${result.username}` : ''}
      </p>
      <hr />
      {result.imgUrl && (
        <Image
          src={result.imgUrl}
          alt={result.title}
          width={400}
          height={300}
          style={{ objectFit: 'contain' }}
        />
      )}
      <p>{result.content}</p>
      <Comment postId={result._id.toString()} />
    </div>
  );
}
