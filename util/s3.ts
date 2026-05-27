import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const region = 'ap-northeast-2';
const accessKeyId = process.env.s3_ACCESS_KEY;
const secretAccessKey = process.env.s3_SECRET_KEY;
export const S3_BUCKET = process.env.s3_myBucketName;

/** 자격증명이 모두 있을 때만 S3Client 생성. */
export function getS3Client(): S3Client {
  if (!accessKeyId || !secretAccessKey) {
    throw new Error('S3 환경변수(s3_ACCESS_KEY / s3_SECRET_KEY) 누락');
  }
  return new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });
}

// presigned GET URL 유효시간 (초). 페이지 렌더 때마다 새로 발급되므로 길 필요 없음.
const GET_URL_EXPIRES = 60 * 60; // 1시간

/**
 * 비공개 S3 객체에 대한 시간제한 GET URL을 발급.
 * key가 없거나 버킷 미설정이면 null.
 */
export async function getImageUrl(
  key?: string | null
): Promise<string | null> {
  if (!key || !S3_BUCKET) return null;
  const client = getS3Client();
  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }),
    { expiresIn: GET_URL_EXPIRES }
  );
}
