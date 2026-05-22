import { NextResponse, type NextRequest } from 'next/server';

// 학습용 echo. query string을 그대로 반환
export async function GET(req: NextRequest) {
  const query = Object.fromEntries(req.nextUrl.searchParams.entries());
  return NextResponse.json({ message: '처리완료', query });
}
