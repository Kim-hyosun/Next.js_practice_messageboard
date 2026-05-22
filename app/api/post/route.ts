import { NextResponse, type NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/auth';
import { connectDB, DB_NAME } from '@/util/database';
import { postCreateSchema } from '@/util/schemas';
import {
  errorResponse,
  internalErrorResponse,
  zodErrorResponse,
} from '@/util/api-response';

// 게시글 생성
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

    const parsed = postCreateSchema.safeParse(raw);
    if (!parsed.success) return zodErrorResponse(parsed.error);
    const { title, content, imgUrl } = parsed.data;

    const db = (await connectDB).db(DB_NAME);
    await db.collection('post').insertOne({
      title,
      content,
      user: session.user.email,
      username: session.user.name ?? '',
      imgUrl: imgUrl ?? '',
    });

    if (!contentType.includes('application/json')) {
      return NextResponse.redirect(new URL('/list', req.url), { status: 303 });
    }
    return NextResponse.json({ message: '작성 완료' }, { status: 201 });
  } catch (err) {
    return internalErrorResponse(err);
  }
}

// 게시글 목록
export async function GET() {
  try {
    const db = (await connectDB).db(DB_NAME);
    const result = await db.collection('post').find().toArray();
    return NextResponse.json(
      result.map((p) => ({ ...p, _id: p._id.toString() }))
    );
  } catch (err) {
    return internalErrorResponse(err);
  }
}
