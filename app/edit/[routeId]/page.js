import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';

const Edit = async (props) => {
  const client = await connectDB;
  const db = client.db('forum_next');
  let result = await db
    .collection('post')
    .findOne({ _id: new ObjectId(props.params.routeId) });
  console.log(result);

  await db
    .collection('post')
    .updateOne(
      { _id: new ObjectId(props.params.routeId) },
      { $set: { title: '', content: '' } }
    );
  return (
    <div className="p-20">
      <h4>글 수정</h4>
      <form action="/api/post/edit" method="POST">
        <input type="text" name="title" defaultValue={result.title} />
        <input type="text" name="content" defaultValue={result.content} />
        <input
          type="text"
          name="_id"
          defaultValue={result._id.toString()}
          className="none"
        />
        <button type="submit">게시</button>
      </form>
    </div>
  );
};

export default Edit;
