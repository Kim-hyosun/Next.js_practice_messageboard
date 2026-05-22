import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/auth';
import { connectDB, DB_NAME } from '@/util/database';
import type { Post, SerializedPost } from '@/util/types';
import ListItem from './ListItem';

export const dynamic = 'force-dynamic';

export default async function List() {
  const client = await connectDB;
  const db = client.db(DB_NAME);
  const raw = await db.collection<Post>('post').find().toArray();
  const result: SerializedPost[] = raw.map((p) => ({
    ...p,
    _id: p._id.toString(),
  }));

  const session = await getServerSession(authOptions);
  const currentUser = session?.user?.email ?? null;

  return (
    <div className="list-bg">
      <ListItem result={result} currentUser={currentUser} />
    </div>
  );
}
