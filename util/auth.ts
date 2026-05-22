import type { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import bcrypt from 'bcrypt';
import { connectDB, DB_NAME } from '@/util/database';
import type { UserCred } from '@/util/types';

const githubAuthId = process.env.githubAuthId;
const githubAuthPw = process.env.githubAuthPw;
const authSecret = process.env.NEXTAUTH_SECRET ?? process.env.myJWTsecret;

if (!authSecret) {
  throw new Error(
    'NEXTAUTH_SECRET(or myJWTsecret) 환경변수가 설정되지 않았습니다.'
  );
}

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: githubAuthId ?? '',
      clientSecret: githubAuthPw ?? '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const db = (await connectDB).db(DB_NAME);
        const user = await db
          .collection<UserCred>('user_cred')
          .findOne({ email: credentials.email });
        if (!user) return null;
        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = {
          name: user.name ?? undefined,
          email: user.email ?? undefined,
        };
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token.user) {
        session.user = token.user as typeof session.user;
      }
      return session;
    },
  },
  secret: authSecret,
  adapter: MongoDBAdapter(connectDB),
};
