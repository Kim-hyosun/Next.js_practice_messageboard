//'use client'
//import {handleSubmit} from './actions
import { connectDB } from '@/util/database';
import { revalidatePath } from 'next/cache';

export default async function Write2() {
  const db = (await connectDB).db('forum_next');
  let result = await db.collection('post_test').find().toArray();

  async function handleSubmit(formData) {
    'use server'; //api 코드 작성가능
    const db = (await connectDB).db('forum_next');
    await db
      .collection('post_test')
      .insertOne({ mynameis: formData.get('mynameis') });
    //console.log(formData.get('mynameis'));
    revalidatePath('/write2'); //새로고침을 위해
  }

  return (
    <>
      <form action={handleSubmit}>
        <input type="text" name="mynameis" placeholder="내 이름을 적어보세요" />
        <button type="submit">내이름저장</button>
      </form>
      {result ? result.map((item) => <p>내이름은? {item.mynameis}</p>) : ''}
    </>
  );
}
