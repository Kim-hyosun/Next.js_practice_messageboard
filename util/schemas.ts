import { z } from 'zod';

export const postCreateSchema = z.object({
  title: z.string().trim().min(1, '제목을 입력해주세요').max(200),
  content: z.string().trim().min(1, '본문내용을 입력해주세요').max(10000),
  // S3 객체 key (presigned 업로드 후 받은 값). 이미지 없으면 빈 문자열.
  imgKey: z.string().max(1024).optional().or(z.literal('')),
});
export type PostCreateInput = z.infer<typeof postCreateSchema>;

export const postEditSchema = postCreateSchema.extend({
  _id: z.string().min(1),
});
export type PostEditInput = z.infer<typeof postEditSchema>;

export const postDeleteSchema = z.object({
  postId: z.string().min(1),
});

export const commentCreateSchema = z.object({
  comment: z.string().trim().min(1, '댓글내용을 입력해주세요').max(2000),
  postId: z.string().min(1),
});
export type CommentCreateInput = z.infer<typeof commentCreateSchema>;

export const postLikeSchema = z.object({
  postId: z.string().min(1),
});

export const signupSchema = z.object({
  name: z.string().trim().min(1, '이름을 입력해주세요').max(50),
  email: z.string().trim().email('이메일 형식이 올바르지 않습니다'),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .max(100, '비밀번호가 너무 깁니다'),
});
export type SignupInput = z.infer<typeof signupSchema>;
