import { NextResponse, type NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/auth';
import { getDb } from '@/util/database';
import { postLikeSchema } from '@/util/schemas';
import type { Post } from '@/util/types';
import {
  errorResponse,
  internalErrorResponse,
  zodErrorResponse,
} from '@/util/api-response';

// 좋아요 토글 (로그인 필요)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return errorResponse('로그인이 필요합니다', 401);
    }
    const email = session.user.email;

    const body = await req.json();
    const parsed = postLikeSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);
    const { postId } = parsed.data;

    if (!ObjectId.isValid(postId)) {
      return errorResponse('잘못된 게시글 id 입니다');
    }
    const objectId = new ObjectId(postId);

    const db = await getDb();
    const post = await db.collection<Post>('post').findOne({ _id: objectId });
    if (!post) return errorResponse('게시글을 찾을 수 없습니다', 404);

    const liked = post.likedBy?.includes(email) ?? false;
    // 이미 눌렀으면 취소($pull), 아니면 추가($addToSet)
    await db
      .collection<Post>('post')
      .updateOne(
        { _id: objectId },
        liked
          ? { $pull: { likedBy: email } }
          : { $addToSet: { likedBy: email } }
      );

    const likeCount = (post.likedBy?.length ?? 0) + (liked ? -1 : 1);
    return NextResponse.json({ liked: !liked, likeCount });
  } catch (err) {
    return internalErrorResponse(err);
  }
}
