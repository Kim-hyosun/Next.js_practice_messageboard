import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { connectDB } from '@/util/database';

import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

const githubAuthId = process.env.githubAuthId;
const githubAuthPw = process.env.githubAuthPw;
const myJWTsecret = process.env.myJWTsecret;

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: githubAuthId,
      clientSecret: githubAuthPw,
    }),

    CredentialsProvider({
      //1. 로그인페이지 폼 자동생성해주는 코드
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },

      //2. 로그인요청시 실행되는코드
      //직접 DB에서 아이디,비번 비교하고
      //아이디,비번 맞으면 return 결과, 틀리면 return null 해야함
      async authorize(credentials) {
        let db = (await connectDB).db('forum_next');
        let user = await db
          .collection('user_cred')
          .findOne({ email: credentials.email });
        if (!user) {
          console.log('해당 이메일은 가입되지 않았습니다. ');
          return null;
        }
        const pwcheck = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!pwcheck) {
          console.log('입력한 비밀번호는 가입정보와 다릅니다');
          return null;
        }
        return user;
      },
    }),
  ],
  //3. jwt 써놔야 잘됩니다 + jwt 만료일설정
  session: {
    strategy: 'jwt', //sesstion일지, jwt일지
    maxAge: 30 * 24 * 60 * 60, //30일
  },

  callbacks: {
    //4. jwt 만들 때 실행되는 코드
    //user변수는 DB의 유저정보담겨있고 token.user에 무엇인가 저장하면 jwt에 들어갑니다.
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = {};
        token.user.name = user.name;
        token.user.email = user.email;
        //관리자인지 아닌지도 보낼수있음
      }
      return token;
    },
    //5. 유저 세션이 조회될 때 마다 실행되는 코드
    session: async ({ session, token }) => {
      session.user = token.user; //토큰정보를 컴포넌트에서 조회가능
      return session;
    },
  },

  secret: myJWTsecret,
  adapter: MongoDBAdapter(connectDB),
};
export default NextAuth(authOptions);
