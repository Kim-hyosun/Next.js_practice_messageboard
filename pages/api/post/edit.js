import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

// [post] : "/post/edit"
export default async function handler(요청, 응답) {
  let session = await getServerSession(요청, 응답, authOptions);

  if (요청.method === 'POST') {
    if (!session) {
      return res.status(401).json('로그인이 필요합니다.');
    }
    if (요청.body.title == '') {
      return 응답.status(500).json('제목을 입력해주세요');
    }
    if (요청.body.content == '') {
      return 응답.status(500).json('본문내용을 입력해주세요');
    }

    try {
      const db = (await connectDB).db('forum_next');
      let result = await db.collection('post').updateOne(
        {
          //수정하고싶은 doc추출
          _id: new ObjectId(요청.body._id.toString()),
        },
        {
          $set: {
            //수정할내용
            title: 요청.body.title,
            content: 요청.body.content,
          },
        }
      );
      응답.status(200).redirect('/list');
    } catch (err) {
      응답.status(500).json(err);
    }
  }
}
