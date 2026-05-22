export default function Register() {
  return (
    <div className="p-20">
      <h4>회원가입</h4>
      <form method="POST" action="/api/auth/signup">
        <input name="name" type="text" placeholder="이름" required />
        <input name="email" type="email" placeholder="이메일" required />
        <input
          name="password"
          type="password"
          placeholder="비밀번호 (8자 이상)"
          minLength={8}
          required
        />
        <button type="submit">회원가입하기</button>
      </form>
    </div>
  );
}
