import { NextResponse } from 'next/server';
import type { ZodError } from 'zod';

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

export function zodErrorResponse(err: ZodError) {
  const message = err.issues[0]?.message ?? '입력값이 올바르지 않습니다';
  return NextResponse.json({ message, issues: err.issues }, { status: 400 });
}

export function internalErrorResponse(err: unknown) {
  // 서버 로그에만 상세 노출, 클라이언트는 일반 메시지
  console.error('[api] internal error:', err);
  return NextResponse.json(
    { message: '서버 오류가 발생했습니다' },
    { status: 500 }
  );
}
