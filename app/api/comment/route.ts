import { NextResponse, type NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/auth';
import { getDb } from '@/util/database';
import { commentCreateSchema } from '@/util/schemas';
import {
  errorResponse,
  internalErrorResponse,
  zodErrorResponse,
} from '@/util/api-response';

function serialize(
  c: { _id: ObjectId; postId: ObjectId } & Record<string, unknown>
) {
  return { ...c, _id: c._id.toString(), postId: c.postId.toString() };
}

export async function GET(req: NextRequest) {
  try {
    const postId = req.nextUrl.searchParams.get('postId');
    if (!postId || !ObjectId.isValid(postId)) {
      return errorResponse('postId가 올바르지 않습니다');
    }
    const db = await getDb();
    const comments = await db
      .collection('comment')
      .find({ postId: new ObjectId(postId) })
      .toArray();
    return NextResponse.json(
      comments.map((c) =>
        serialize(
          c as { _id: ObjectId; postId: ObjectId } & Record<string, unknown>
        )
      )
    );
  } catch (err) {
    return internalErrorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return errorResponse('로그인이 필요합니다', 401);
    }
    const body = await req.json();
    const parsed = commentCreateSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);
    const { comment, postId } = parsed.data;

    if (!ObjectId.isValid(postId)) {
      return errorResponse('postId가 올바르지 않습니다');
    }
    const postObjectId = new ObjectId(postId);

    const db = await getDb();
    await db.collection('comment').insertOne({
      content: comment,
      user: session.user.email,
      postId: postObjectId,
      username: session.user.name ?? '',
    });

    const comments = await db
      .collection('comment')
      .find({ postId: postObjectId })
      .toArray();
    return NextResponse.json(
      comments.map((c) =>
        serialize(
          c as { _id: ObjectId; postId: ObjectId } & Record<string, unknown>
        )
      )
    );
  } catch (err) {
    return internalErrorResponse(err);
  }
}
