import { connectDB } from '@/util/database';
//import DetailLink from './DetailLink';
import ListItem from './ListItem';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export const dynamic = 'force-dynamic';
//강제로 다이나믹 렌더링 페이지로 만듦

//export const revalidate = 60; //60초동안 캐싱결과를 사용하고 서버의 업데이트 사항을 반영하지 않음

export default async function List() {
  const client = await connectDB;
  const db = client.db('forum_next');
  let result = await db.collection('post').find().toArray();

  // `_id`를 문자열로 변환
  result = result.map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));

  //console.log(result);

  let session = await getServerSession(authOptions);
  let currentUser = session?.user.email;

  return (
    <div className="list-bg">
      <ListItem result={result} currentUser={currentUser} />
    </div>
  );
}
