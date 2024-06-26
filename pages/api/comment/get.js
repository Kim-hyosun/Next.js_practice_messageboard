import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';

export default async function handler(요청, 응답) {
  try {
    if (요청.method === 'GET') {
      const postId = 요청.query.postId;
      const db = (await connectDB).db('forum_next');
      let comments = await db
        .collection('comment')
        .find({
          postId: new ObjectId(postId),
        })
        .toArray();
      응답.status(200).json(comments);
    } else {
      응답.status(405).json('http-method를 get로 접근해주세요 ');
    }
  } catch (err) {
    응답.status(500).json('Error', err);
  }
}
