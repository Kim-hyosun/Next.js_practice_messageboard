import { NextResponse, type NextRequest } from 'next/server';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/auth';
import { getS3Client, S3_BUCKET } from '@/util/s3';
import { errorResponse, internalErrorResponse } from '@/util/api-response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return errorResponse('로그인이 필요합니다', 401);
    }

    const file = req.nextUrl.searchParams.get('file');
    if (!file) return errorResponse('file 파라미터가 필요합니다');

    if (!S3_BUCKET) {
      return internalErrorResponse(new Error('S3 버킷 환경변수 누락'));
    }

    const { url, fields } = await createPresignedPost(getS3Client(), {
      Bucket: S3_BUCKET,
      Key: file,
      Conditions: [['content-length-range', 0, 1_048_576]],
      Expires: 60,
    });

    return NextResponse.json({ url, fields });
  } catch (err) {
    return internalErrorResponse(err);
  }
}
