export default function handler(요청, 응답) {
  /* if (요청.method == 'GET') {
    //같은 url로 오는 요청마다 다른 처리
    console.log(124);
    응답.status(200).json('처리완료');
  } */
  console.log(요청.query);
  응답.status(200).json('처리완료');
}
