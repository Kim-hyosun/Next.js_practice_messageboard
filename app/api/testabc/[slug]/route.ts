import { NextResponse, type NextRequest } from 'next/server';

// 학습용 dynamic route. unicode 폴더명은 일부 OS/git 환경에서 깨질 수 있어 영문화
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const query = Object.fromEntries(req.nextUrl.searchParams.entries());
  return NextResponse.json({
    message: 'hello world',
    slug: params.slug,
    query,
  });
}
