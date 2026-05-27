# Next.js로 게시판만들기

Next.js 14 (App Router) + TypeScript + MongoDB + NextAuth + AWS S3 게시판 만들기

## Stack

- **Framework**: Next.js 14.2.4 (App Router)
- **Language**: TypeScript 5 (strict)
- **DB**: MongoDB 5
- **Auth**: NextAuth v4 (GitHub OAuth + Credentials)
- **Server state**: TanStack Query 5
- **Validation**: Zod 3
- **Storage**: AWS S3 (presigned POST, `@aws-sdk/client-s3` v3)
- **Tooling**: ESLint, Prettier
- **Package manager**: pnpm 9

## 실행

```bash
pnpm install
cp .env.example .env.local   # 값 채우기
pnpm dev                     # http://localhost:3000
```

## 명령어

| 명령 | 설명 |
| --- | --- |
| `pnpm dev` | 개발 서버 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 빌드 결과 실행 |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm type-check` | tsc --noEmit |
| `pnpm format` / `pnpm format:check` | Prettier |

## 환경변수 (.env.local)

| Key | 설명 |
| --- | --- |
| `MONGOKEY` | MongoDB 접속 URL (필수) |
| `NEXTAUTH_URL` | NextAuth 콜백 URL (예: `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | JWT 서명 시크릿 (필수) |
| `myJWTsecret` | (legacy alias, NEXTAUTH_SECRET 없을 때 fallback) |
| `githubAuthId` / `githubAuthPw` | GitHub OAuth 앱 자격증명 |
| `s3_ACCESS_KEY` / `s3_SECRET_KEY` / `s3_myBucketName` | AWS S3 |

## 디렉토리

```
app/
  api/                  # Route Handlers (App Router)
    auth/[...nextauth]  # NextAuth 엔드포인트
    auth/signup         # 가입 (form/json 둘 다 허용)
    post                # 글 CRUD
    post/edit           # 글 수정 (작성자 검증)
    post/delete         # 글 삭제 (작성자 검증 + 댓글 cascade)
    post/image          # S3 presigned POST 발급
    comment             # 댓글 GET/POST
  list, detail, edit, write, write2, register  # 페이지
util/
  database.ts           # MongoClient singleton + DB_NAME
  auth.ts               # next-auth authOptions
  schemas.ts            # zod input schemas
  types.ts              # Post/Comment/UserCred 타입
  api-response.ts       # 표준 에러 응답 helper
middleware.ts           # /write, /write2, /edit 인증 가드
```

## 주요 보완 사항

| 항목 | 내용 |
| --- | --- |
| 🛡️ 인가 | `post/edit`, `post/delete`에 작성자 검증 추가 — 본인 글만 수정/삭제 가능 |
| 🛡️ 인증 | `edit/[routeId]` 페이지 서버 단에서 세션 + 작성자 검증 → 미로그인/타인 글 차단 |
| 🐛 버그 | `edit/[routeId]` 페이지가 로드마다 title/content를 빈 문자열로 덮어쓰던 코드 제거 |
| 🐛 버그 | `pages/api/post/*` 의 `res.status(...)` (정의 안 된 변수) → 일관된 핸들러로 대체 |
| 🛡️ 정보누출 | `응답.status(500).json(err)` → 서버 로그에만 상세, 클라이언트는 일반 메시지 |
| 🛡️ middleware | localhost 하드코딩 제거, `callbackUrl` 추가 |
| ✅ Validation | Zod 스키마로 입력 검증 일원화. 비밀번호 8자 이상 정책 추가 |
| ⚡ AWS SDK | v2 (EOL) → v3 `@aws-sdk/client-s3` + `s3-presigned-post` |
| 🧹 이미지 | `<img>` → `next/image` |
| 🧹 댓글 | `useEffect + fetch.then()` → TanStack Query (캐시/상태 일원화) |
| 🧹 댓글 cascade | 게시글 삭제 시 해당 댓글도 함께 삭제 (orphan 방지) |
| 🧹 API 통일 | `pages/api/*` 전부 제거 → `app/api/*` Route Handlers로 이전 |
| 🧹 TS | 전 파일 TypeScript strict |
| 🧹 PM | npm → pnpm 전환 |
