import { NextResponse, type NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import { getDb } from '@/util/database';
import { signupSchema } from '@/util/schemas';
import {
  errorResponse,
  internalErrorResponse,
  zodErrorResponse,
} from '@/util/api-response';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') ?? '';
    let raw: Record<string, unknown>;
    if (contentType.includes('application/json')) {
      raw = await req.json();
    } else {
      const form = await req.formData();
      raw = Object.fromEntries(form.entries());
    }

    const parsed = signupSchema.safeParse(raw);
    if (!parsed.success) return zodErrorResponse(parsed.error);
    const { name, email, password } = parsed.data;

    const db = await getDb();
    const existing = await db.collection('user_cred').findOne({ email });
    if (existing) {
      return errorResponse('이메일 중복으로 가입이 어렵습니다');
    }

    const hash = await bcrypt.hash(password, 10);
    await db.collection('user_cred').insertOne({ name, email, password: hash });

    // form submit 호환: HTML form일 경우 redirect
    if (!contentType.includes('application/json')) {
      return NextResponse.redirect(new URL('/', req.url), { status: 303 });
    }
    return NextResponse.json({ message: '가입 완료' }, { status: 201 });
  } catch (err) {
    return internalErrorResponse(err);
  }
}
