import { connectDB } from '@/util/database';

export default async function Home() {
  const client = await connectDB;
  const db = client.db('forum_next');
  /* let result = await db.collection('post').find().toArray();
  console.log(result); */

  return (
    <>
      <h1>하이</h1>
    </>
  );
}
