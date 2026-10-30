# 이어서 개발하기 (집 PC 세팅 가이드)

## 1. 처음 한 번: 개발 환경 준비

| 설치할 것 | 받는 곳 | 확인 명령 |
|---|---|---|
| Git | https://git-scm.com | `git --version` |
| Node.js (LTS, 22 이상) | https://nodejs.org | `node --version` |
| GitHub CLI | https://cli.github.com | `gh --version` |
| (선택) VS Code | https://code.visualstudio.com | |
| (선택) Claude Code | https://claude.com/claude-code | `claude --version` |

## 2. 처음 한 번: GitHub 로그인

```bash
gh auth login
```
`GitHub.com` → `HTTPS` → `Y` → **Login with a web browser**를 고르고 브라우저에서 승인하면 끝이에요.
개인 PC라면 토큰을 따로 만들 필요 없이 이 방법이 가장 편해요.

## 3. 처음 한 번: 코드 내려받기

```bash
git clone https://github.com/benjamin7668-cpu/travel-planner.git
cd travel-planner
git config user.name "benjamin7668-cpu"
git config user.email "281532997+benjamin7668-cpu@users.noreply.github.com"
npm install
```
> `git config` 두 줄은 커밋이 GitHub 계정(잔디)에 제대로 잡히게 해 줘요.

## 4. 매번: 개발 → 확인 → 올리기

```bash
git pull                # 1) 최신 코드 받기
npm run dev             # 2) http://localhost:5173 에서 확인하며 수정 (Ctrl+C로 종료)
npm run build           # 3) 배포 전에 빌드가 되는지 확인
git add .
git commit -m "무엇을 바꿨는지 한 줄 설명"
git push                # 4) push하면 GitHub Actions가 자동으로 사이트에 배포
```
배포 상태는 https://github.com/benjamin7668-cpu/travel-planner/actions 에서 볼 수 있어요. 초록 체크면 1~2분 뒤 사이트에 반영돼요.

## Claude Code + MCP로 개발하기

저장소의 `.mcp.json`에 개발용 MCP 서버 2개가 설정돼 있어요. 둘 다 **API 키가 필요 없어요.**

| MCP | 하는 일 | 이렇게 부탁하면 돼요 |
|---|---|---|
| **Playwright** | Claude가 실제 브라우저를 띄워 사이트를 클릭·입력하고 스크린샷으로 확인 | "localhost:5173 띄워서 모바일 화면 깨지는 데 없는지 봐줘" |
| **Context7** | Gemini·Anthropic SDK, Vite 등의 최신 공식 문서를 찾아 줌 | "context7로 @google/genai 스트리밍 사용법 찾아서 적용해줘" |

1. 프로젝트 폴더에서 `claude` 실행
2. 처음에 "이 프로젝트의 MCP 서버를 사용할까요?"라고 물으면 승인
3. `/mcp`를 입력하면 연결 상태를 볼 수 있어요.

> Windows 기준으로 `cmd /c npx ...` 형태로 적혀 있어요. Mac/Linux에서 쓴다면 `.mcp.json`에서 `"command": "npx"`로 바꾸고 args 앞의 `"/c", "npx"`를 지우세요.
> Playwright가 브라우저를 못 찾으면 `npx playwright install chrome`을 한 번 실행하세요.

**GitHub MCP:** Claude Code의 GitHub 플러그인이 설치돼 있다면 `gh auth login` 후 `/mcp`에서 GitHub 서버를 다시 인증하세요. 그러면 Claude가 Actions 결과나 이슈를 직접 확인할 수 있어요. (공용 PC에서는 로그인 정보가 남으니 하지 마세요.)

## 코드 구조

```
travel-planner/
├── index.html              # 화면 구조: 입력 폼, API 설정 창
├── src/
│   ├── main.js             # 버튼·폼 이벤트, 설정(localStorage) 저장/불러오기
│   ├── planner.js          # AI 호출: 프롬프트, 일정 JSON 스키마, Gemini/Claude 분기
│   ├── render.js           # 일정 JSON → HTML (타임라인, 경비표, 팁)
│   ├── sample.js           # API 키 없이 보는 예시 일정(제주도)
│   └── style.css           # 디자인 (라이트/다크 모드, 모바일, 인쇄)
├── public/favicon.svg
├── .github/workflows/deploy.yml   # main에 push하면 GitHub Pages로 자동 배포
├── .mcp.json               # Claude Code용 MCP 서버 (Playwright, Context7)
├── USAGE.md                # 사용자용 사용법
└── DEVELOPMENT.md          # 이 문서
```

### 자주 고칠 곳

| 하고 싶은 것 | 고칠 파일 |
|---|---|
| AI가 짜는 일정 스타일 바꾸기 | `src/planner.js`의 `SYSTEM_PROMPT` |
| 일정에 새 항목 추가 (예: 숙소 추천) | `src/planner.js`의 `PLAN_SCHEMA` → `src/render.js`에 표시 코드 추가 |
| 입력 옵션 추가 | `index.html` 폼 → `src/main.js`의 `readForm()` → `src/planner.js`의 `buildUserPrompt()` |
| Gemini 모델 바꾸기 | `src/planner.js`의 `GEMINI_MODEL` |
| 색상·글꼴 | `src/style.css` 맨 위 `:root` 변수 |

## 다음에 해 볼 만한 것 (아이디어)

- [x] 만든 일정을 브라우저에 저장해서 다시 보기 (최근 일정 10개)
- [ ] 일정 공유 링크 만들기
- [ ] 날짜별 날씨 예보 함께 보여 주기
- [ ] 장소를 지도 위에 핀으로 표시하기
- [ ] 생성 중에 결과가 조금씩 나타나게 (스트리밍)
- [ ] 일정 중 한 항목만 "다른 곳 추천" 받기

## 문제 해결

| 증상 | 해결 |
|---|---|
| `git push`가 403 오류 | `gh auth status`로 로그인 확인 → `gh auth login` 다시 하기 |
| `npm run dev`가 안 됨 | `npm install`을 먼저 실행 |
| Actions 배포 실패 (Pages 404) | 저장소 **Settings → Pages → Source**가 **GitHub Actions**인지 확인 |
| 사이트에 변경이 안 보임 | Actions가 끝났는지 확인 후 `Ctrl + F5` |
