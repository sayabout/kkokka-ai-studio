# KKOKKA.AI STUDIO

AI 영상 디렉팅 스튜디오 · by SAYABOUT

## 이건 뭔가요
Next.js(App Router) + TypeScript + Tailwind + Supabase 기반 브랜드 사이트 + 관리자 시스템.
자세한 방향과 요구사항은 **SPEC.md** 참고.

## 지금 단계 (1차 = 화면)
- 홈 / Works / Works 상세 / Process / About / Contact / Login
- 정책 페이지(privacy, terms, no-email, ai-policy) 자리
- 관리자(/admin) 레이아웃 + 메뉴 + 메모/회원(CSV·페이징·검색)/홈영상/푸터 데모
- ※ Supabase 연결·Google 로그인·비밀글은 2단계

## 로컬 실행
```bash
npm install
npm run dev
```
http://localhost:3000 접속

## 환경변수
`.env.example` 을 복사해 `.env.local` 로 만들고 Supabase 키를 채웁니다. (2단계)

## 배포
GitHub 푸시 → Vercel 자동 배포.
