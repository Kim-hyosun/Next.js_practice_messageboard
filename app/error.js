'use client'; //error.js에서는 무조건 필요

export default function Error({ error, reset }) {
  return (
    <>
      <h1>에러발생: {error.message}</h1>
      <button onClick={reset}>다시 페이지 로드 요청 하기</button>
    </>
  );
}
