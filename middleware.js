import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth/react';
import { getSession } from 'next-auth/react';

import { NextResponse, NextRequest } from 'next/server';

const secret = process.env.myJWTsecret;

export async function middleware(req) {
  /* 
  1. default키워드 없이 작성
  2. user가 GET, POSt요청, 페이지 접속시
  middleware먼저 실행후 서버코드 실행 
  3. req.cookies와 req.headers는 Map자료형으로 get()메서드로 꺼내야 함

  console.log('nextURL: ', req.nextUrl); //유저가 요청중인 URL 출력해줌

  console.log('cookies: ', req.cookies.get('next-auth.session-token')); //유저가 보낸 쿠키 출력해줌

  console.log('headers: ', req.headers.get('user-agent')); //유저의 headers 정보 출력해줌

  마지막에는 꼭 아래 내용중 하나를 반환해야함 

  1. NextResponse.next(); //통과
  2. NextResponse.redirect(); //다른페이지 이동(주소창 변경)
  3. NextResponse.rewrite(); //다른페이지 이동(주소창 변경안됨)


  쿠키 다루기 
  request.cookies.get('쿠키이름')  //출력
  request.cookies.has('쿠키이름')  //존재확인
  request.cookies.delete('쿠키이름')  //삭제
  
  const response = NextResponse.next()
  response.cookies.set({
    name: 'mode',
    value: 'dark',
    maxAge: 3600,
    httpOnly : true
  })  
  return response  //쿠키생성

  */
  /*  if (request.nextUrl.pathname.startsWith('/list')) {
    //list경로에 접속하면
    console.log('사용자의 접속 OS', request.headers.get('sec-ch-ua-platform'));

    // 헤더에서 IP 주소 추출
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded
      ? forwarded.split(/, /)[0]
      : request.headers.get('x-real-ip') || 'IP address not found';

    console.log('사용자의 접속 IP: ', ip); // 클라이언트 IP 주소 출력
    return NextResponse.next();
  } */

  const session = await getToken({ req, secret });
  //const session = await getServerSession({ req });
  //const session = await getSession({ req });
  //console.log('로그인중인지 ', session);

  if (req.nextUrl.pathname.startsWith('/write')) {
    //'write'페이지 접속시
    if (session === null) {
      //로그인안했으면
      return NextResponse.redirect('http://localhost:3000/api/auth/signin'); //로그인화면으로 이동
    }
  }
}
