import { notFound, redirect } from 'next/navigation';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/auth';
import { connectDB, DB_NAME } from '@/util/database';
import type { Post } from '@/util/types';

export default async function Edit({
  params,
}: {
  params: { routeId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect('/api/auth/signin?callbackUrl=/list');
  }
  if (!ObjectId.isValid(params.routeId)) notFound();

  const client = await connectDB;
  const db = client.db(DB_NAME);
  const result = await db
    .collection<Post>('post')
    .findOne({ _id: new ObjectId(params.routeId) });

  if (!result) notFound();
  if (result.user !== session.user.email) {
    redirect('/list');
  }

  return (
    <div className="p-20">
      <h4>글 수정</h4>
      <form action="/api/post/edit" method="POST">
        <input type="text" name="title" defaultValue={result.title} required />
        <input
          type="text"
          name="content"
          defaultValue={result.content}
          required
        />
        <input type="hidden" name="_id" defaultValue={result._id.toString()} />
        <button type="submit">수정 완료</button>
      </form>
    </div>
  );
}
