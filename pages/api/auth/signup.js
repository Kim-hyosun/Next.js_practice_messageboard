import { connectDB } from '@/util/database';
import bcrypt from 'bcrypt';

export default async function handler(요청, 응답) {
  if (요청.body.name == '') {
    return 응답.status(500).json('이름을 입력해주세요');
  }
  if (요청.body.email == '') {
    return 응답.status(500).json('이메일을 입력해주세요');
  }
  if (요청.body.password == '') {
    return 응답.status(500).json('비밀번호를 입력해주세요');
  }

  let db = (await connectDB).db('forum_next');
  const existingUser = await db
    .collection('user_cred')
    .findOne({ email: 요청.body.email });

  if (existingUser) {
    return 응답.status(400).json('이메일 중복으로 가입이 어렵습니다');
  }

  if (요청.method == 'POST') {
    let hash = await bcrypt.hash(요청.body.password, 10);

    await db.collection('user_cred').insertOne({
      name: 요청.body.name,
      email: 요청.body.email,
      password: hash,
    });
    응답.redirect('/');
  }
}
