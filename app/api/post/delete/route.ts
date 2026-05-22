import { NextResponse, type NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/auth';
import { connectDB, DB_NAME } from '@/util/database';
import { postDeleteSchema } from '@/util/schemas';
import {
  errorResponse,
  internalErrorResponse,
  zodErrorResponse,
} from '@/util/api-response';

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return errorResponse('로그인이 필요합니다', 401);
    }

    const body = await req.json();
    const parsed = postDeleteSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);
    const { postId } = parsed.data;

    if (!ObjectId.isValid(postId)) {
      return errorResponse('잘못된 게시글 id 입니다');
    }
    const objectId = new ObjectId(postId);

    const db = (await connectDB).db(DB_NAME);
    const post = await db.collection('post').findOne({ _id: objectId });
    if (!post) return errorResponse('게시글을 찾을 수 없습니다', 404);
    if (post.user !== session.user.email) {
      return errorResponse('삭제 권한이 없습니다', 403);
    }

    const result = await db.collection('post').deleteOne({ _id: objectId });
    if (result.deletedCount === 0) {
      return errorResponse('삭제 실패', 500);
    }

    // 해당 글의 댓글도 함께 삭제 (orphan 방지)
    await db.collection('comment').deleteMany({ postId: objectId });

    return NextResponse.json({ message: '삭제 완료' });
  } catch (err) {
    return internalErrorResponse(err);
  }
}
