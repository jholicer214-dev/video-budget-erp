# 영상 제작 예산 ERP

Next.js 기반 예산 관리 웹앱입니다. 접속자는 첫 화면에서 비밀번호를 입력해야 `/budget` 예산표 화면으로 이동할 수 있습니다.

## 로컬 실행

```bash
npm install
cp .env.example .env.local
npm run dev
```

`.env.local`에 실제 비밀번호를 설정합니다.

```bash
APP_PASSWORD=원하는_비밀번호
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## Vercel 배포

### GitHub 업로드 전 확인

- `.env.local`은 업로드하지 않습니다. `.gitignore`에 이미 포함되어 있습니다.
- `node_modules`, `.next`, `next-build`도 업로드하지 않습니다.
- GitHub에는 `pages/`, `lib/`, `package.json`, `package-lock.json`, `next.config.js`, `README.md`, `.env.example` 등을 올리면 됩니다.

### 배포 순서

1. 이 폴더를 GitHub 저장소에 올립니다.
2. Vercel에서 `New Project`를 선택합니다.
3. 해당 GitHub 저장소를 Import합니다.
4. Framework Preset은 `Next.js`로 둡니다.
5. Build Command는 기본값 `npm run build`를 사용합니다.
6. Vercel 프로젝트 설정의 `Environment Variables`에 아래 값을 추가합니다.

```bash
APP_PASSWORD=원하는_비밀번호
```

7. Deploy를 실행합니다.

배포 후 제공되는 Vercel 링크로 접속하면 로그인 화면이 먼저 표시됩니다.
비밀번호 입력에 성공하면 `/budget` 페이지로 이동합니다.

## 데이터 저장

- 예산 데이터와 프로젝트 목록은 기존처럼 브라우저 `localStorage`에 저장됩니다.
- 브라우저나 기기가 바뀌면 localStorage가 공유되지 않으므로 `JSON 내보내기`와 `JSON 가져오기` 버튼으로 프로젝트 목록을 백업/복원할 수 있습니다.
- Excel 내보내기 기능은 기존 방식대로 유지됩니다.

## 인증 구조

- 비밀번호는 코드에 저장하지 않습니다.
- 서버 API가 `APP_PASSWORD` 환경변수와 입력값을 비교합니다.
- 인증 성공 시 HTTP-only 쿠키를 저장하고 `/budget` 페이지 접근을 허용합니다.
- `로그아웃` 버튼을 누르면 인증 쿠키가 삭제됩니다.
