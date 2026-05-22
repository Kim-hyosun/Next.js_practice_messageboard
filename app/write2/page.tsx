import { connectDB, DB_NAME } from '@/util/database';
import { saveMyName } from './actions';

interface NameDoc {
  _id: { toString(): string };
  mynameis: string;
}

export default async function Write2() {
  const db = (await connectDB).db(DB_NAME);
  const result = (await db
    .collection('post_test')
    .find()
    .toArray()) as unknown as NameDoc[];

  return (
    <div className="p-20">
      <h4>Server Actions 학습용</h4>
      <form action={saveMyName}>
        <input
          type="text"
          name="mynameis"
          placeholder="내 이름을 적어보세요"
          required
        />
        <button type="submit">내 이름 저장</button>
      </form>
      {result.map((item) => (
        <p key={item._id.toString()}>내 이름은? {item.mynameis}</p>
      ))}
    </div>
  );
}
