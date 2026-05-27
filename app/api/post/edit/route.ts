import { NextResponse, type NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/auth';
import { getDb } from '@/util/database';
import { postEditSchema } from '@/util/schemas';
import {
  errorResponse,
  internalErrorResponse,
  zodErrorResponse,
} from '@/util/api-response';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return errorResponse('로그인이 필요합니다', 401);
    }

    const contentType = req.headers.get('content-type') ?? '';
    let raw: Record<string, unknown>;
    if (contentType.includes('application/json')) {
      raw = await req.json();
    } else {
      const form = await req.formData();
      raw = Object.fromEntries(form.entries());
    }

    const parsed = postEditSchema.safeParse(raw);
    if (!parsed.success) return zodErrorResponse(parsed.error);
    const { _id, title, content } = parsed.data;

    if (!ObjectId.isValid(_id)) {
      return errorResponse('잘못된 게시글 id 입니다');
    }
    const objectId = new ObjectId(_id);

    const db = await getDb();
    const post = await db.collection('post').findOne({ _id: objectId });
    if (!post) return errorResponse('게시글을 찾을 수 없습니다', 404);
    if (post.user !== session.user.email) {
      return errorResponse('수정 권한이 없습니다', 403);
    }

    await db
      .collection('post')
      .updateOne({ _id: objectId }, { $set: { title, content } });

    if (!contentType.includes('application/json')) {
      return NextResponse.redirect(new URL('/list', req.url), { status: 303 });
    }
    return NextResponse.json({ message: '수정 완료' });
  } catch (err) {
    return internalErrorResponse(err);
  }
}
