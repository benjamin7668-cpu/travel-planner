# CLAUDE.md

여행지를 입력하면 AI가 여행 일정을 짜 주는 정적 웹사이트. 사용자에게는 한국어로 답한다.

## 명령어

- `npm run dev`: 개발 서버 (http://localhost:5173)
- `npm run build`: `dist/`로 빌드. 커밋 전에 반드시 통과 확인
- 테스트 프레임워크는 없음. 빌드와 브라우저 확인으로 검증

## 구조와 규칙

- Vite + Vanilla JS. 프레임워크 없음. 서버 없음 (GitHub Pages 정적 배포)
- AI 호출은 브라우저에서 직접: `src/planner.js`
  - Gemini(`@google/genai`, 기본값, 무료) / Claude(`@anthropic-ai/sdk`, `dangerouslyAllowBrowser`) 두 경로
  - 두 경로 모두 같은 `PLAN_SCHEMA`(JSON Schema)로 구조화 출력을 받음. 스키마를 바꾸면 `src/render.js`와 `src/sample.js`도 같이 맞출 것
  - 사용자 오류 메시지는 `PlannerError`로 한국어로 던짐
- API 키는 사용자가 입력해 localStorage(`travel-planner:settings`)에만 저장. 저장소에 키를 절대 넣지 말 것
- 사용자 입력이나 AI 응답을 HTML에 넣을 때는 반드시 `escapeHtml` 처리
- 배포: `main`에 push하면 `.github/workflows/deploy.yml`이 자동 배포
- 커밋 작성자: `benjamin7668-cpu <281532997+benjamin7668-cpu@users.noreply.github.com>`

## 문서

- `USAGE.md`: 최종 사용자용 사용법
- `DEVELOPMENT.md`: 개발 환경 세팅, 작업 흐름, 아이디어 목록
