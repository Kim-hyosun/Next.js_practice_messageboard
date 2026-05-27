import type { Post, SerializedPost } from '@/util/types';

/** Mongo Post 문서를 클라이언트로 보낼 SerializedPost로 변환. */
export function serializePost(
  post: Post,
  currentUser: string | null
): SerializedPost {
  const { _id, likedBy, ...rest } = post;
  const likes = likedBy ?? [];
  return {
    ...rest,
    _id: _id.toString(),
    likeCount: likes.length,
    likedByMe: currentUser ? likes.includes(currentUser) : false,
  };
}
