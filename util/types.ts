import type { ObjectId } from 'mongodb';

export interface Post {
  _id: ObjectId;
  title: string;
  content: string;
  user: string;
  username: string;
  /** S3 객체 key. 표시할 때 presigned GET URL로 변환 (신규 글) */
  imgKey?: string;
  /** @deprecated 공개 버킷 시절 저장된 전체 URL (구 데이터 호환용) */
  imgUrl?: string;
  /** 좋아요를 누른 사용자 이메일 목록 */
  likedBy?: string[];
}

export interface SerializedPost extends Omit<Post, '_id' | 'likedBy'> {
  _id: string;
  /** 좋아요 수 */
  likeCount: number;
  /** 현재 로그인 사용자가 좋아요를 눌렀는지 */
  likedByMe: boolean;
}

export interface Comment {
  _id: ObjectId;
  content: string;
  postId: ObjectId;
  user: string;
  username: string;
}

export interface SerializedComment extends Omit<Comment, '_id' | 'postId'> {
  _id: string;
  postId: string;
}

export interface UserCred {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
}
