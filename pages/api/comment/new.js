import { connectDB } from '@/util/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { ObjectId } from 'mongodb';

export default async function handler(요청, 응답) {
  try {
    let session = await getServerSession(요청, 응답, authOptions); //server에서 쓸때는 요청 응답을 함께 보내야함

    if (요청.method === 'POST') {
      const { comment, postId } = JSON.parse(요청.body);

      if (!session) {
        return 응답.status(401).json('로그인이 필요합니다.');
      }
      if (!comment) {
        return 응답.status(500).json('댓글내용을 입력해주세요');
      }
      const db = (await connectDB).db('forum_next');
      let result = await db.collection('comment').insertOne({
        content: comment,
        user: session ? session.user.email : '',
        postId: new ObjectId(postId),
        username: session ? session.user.name : '',
      });
      //post요청 성공시 댓글 리스트를 다시 조회해서 반환
      const comments = await db
        .collection('comment')
        .find({ postId: new ObjectId(postId) })
        .toArray();
      응답.status(200).json(comments);
    } else {
      응답.status(405).json('http-method를 post로 접근해주세요 ');
    }
  } catch (err) {
    응답.status(500).json('Error', err);
  }
}
