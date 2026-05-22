import type { ObjectId } from 'mongodb';

export interface Post {
  _id: ObjectId;
  title: string;
  content: string;
  user: string;
  username: string;
  imgUrl?: string;
}

export interface SerializedPost extends Omit<Post, '_id'> {
  _id: string;
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
