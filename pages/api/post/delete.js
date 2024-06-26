import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

// [post] : "/api/post/delete"
export default async function handler(요청, 응답) {
  let session = await getServerSession(요청, 응답, authOptions);
  try {
    if (요청.method === 'DELETE') {
      if (!session) {
        return res.status(401).json('로그인이 필요합니다.');
      }
      const db = (await connectDB).db('forum_next');
      let result = await db.collection('post').deleteOne({
        _id: new ObjectId(JSON.parse(요청.body.postId)),
      });
      if (result.deletedCount === 0) {
        //삭제한 게시물이 없음
        응답.status(500).json({ message: '삭제실패' });
      } else {
        응답.status(200).json({ message: '삭제완료' });
      }
    }
  } catch (err) {
    응답.status(500).json(err);
  }
}
