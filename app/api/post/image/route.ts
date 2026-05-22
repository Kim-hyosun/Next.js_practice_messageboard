import { NextResponse, type NextRequest } from 'next/server';
import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/auth';
import { errorResponse, internalErrorResponse } from '@/util/api-response';

const region = 'ap-northeast-2';
const accessKeyId = process.env.s3_ACCESS_KEY;
const secretAccessKey = process.env.s3_SECRET_KEY;
const Bucket = process.env.s3_myBucketName;

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return errorResponse('로그인이 필요합니다', 401);
    }

    const file = req.nextUrl.searchParams.get('file');
    if (!file) return errorResponse('file 파라미터가 필요합니다');

    if (!Bucket || !accessKeyId || !secretAccessKey) {
      return internalErrorResponse(new Error('S3 환경변수 누락'));
    }

    const client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });

    const { url, fields } = await createPresignedPost(client, {
      Bucket,
      Key: file,
      Conditions: [['content-length-range', 0, 1_048_576]],
      Expires: 60,
    });

    return NextResponse.json({ url, fields });
  } catch (err) {
    return internalErrorResponse(err);
  }
}
