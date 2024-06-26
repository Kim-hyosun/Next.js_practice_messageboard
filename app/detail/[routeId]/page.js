import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';
import Comment from './Comment';

export default async function Detail(props) {
  const client = await connectDB;
  const db = client.db('forum_next');
  let result = await db
    .collection('post')
    .findOne({ _id: new ObjectId(props.params.routeId) });
  //console.log(props);

  return (
    <div>
      <h4>상세페이지</h4>
      <h4>{result.title} </h4>
      <p className="writer">
        {result.username ? '작성자: ' + result.username : ''}
      </p>
      <hr />
      {result.imgUrl ? <img src={result.imgUrl} alt={result.title} /> : ''}
      <p>{result.content}</p>
      <Comment postId={result._id.toString()} />
    </div>
  );
}
