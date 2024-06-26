export default function handler(요청, 응답) {
  console.log('hello world', 요청.query);
  응답.status(200);
}
