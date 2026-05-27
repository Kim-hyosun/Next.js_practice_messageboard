import { notFound, redirect } from 'next/navigation';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/auth';
import { getDb } from '@/util/database';
import type { Post } from '@/util/types';
import EditForm from './EditForm';

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

  const db = await getDb();
  const result = await db
    .collection<Post>('post')
    .findOne({ _id: new ObjectId(params.routeId) });

  if (!result) notFound();
  if (result.user !== session.user.email) {
    redirect('/list');
  }

  return (
    <EditForm
      id={result._id.toString()}
      title={result.title}
      content={result.content}
    />
  );
}
