# ✈ 여행 플래너

여행지만 입력하면 AI(Google Gemini 무료 / Claude)가 **날짜별 동선, 맛집, 예상 경비, 준비물**까지 정리된 여행 일정을 짜주는 웹사이트입니다.

## 주요 기능

- 🗺 **여행지 하나만 입력해도 일정 생성** — 기간·동행·예산·여행 스타일은 선택 옵션
- 🕒 **시간대별 타임라인** — 하루 5~7개 일정, 장소마다 Google 지도 링크
- 💰 **1인 기준 예상 경비**, 🧭 현지 팁, 🎒 준비물 목록
- 📋 텍스트 복사 / 🖨 인쇄·PDF 저장
- 👀 API 키 없이 볼 수 있는 **예시 일정(제주도)**
- 🌙 다크 모드, 📱 모바일 대응

## 기술 스택

| 구분 | 사용 기술 |
|---|---|
| 프론트엔드 | Vanilla JavaScript, HTML, CSS |
| 빌드 | [Vite](https://vite.dev) |
| AI | [Gemini API](https://ai.google.dev) (`@google/genai`, 무료 등급) / [Claude API](https://platform.claude.com/docs) (`@anthropic-ai/sdk`) — JSON Schema로 일정 형식 고정 |
| 배포 | GitHub Pages + GitHub Actions |

## 동작 방식

```
사용자 입력 (여행지 + 옵션)
      │
      ▼
src/planner.js ── 프롬프트 + JSON 스키마 ──▶ Gemini 또는 Claude API
      │                                        │
      │◀────────── 일정 JSON (스키마 보장) ──────┘
      ▼
src/render.js ── 타임라인 / 예산 / 팁 카드로 렌더링
```

- 서버가 없는 정적 사이트라 **브라우저에서 AI API를 직접 호출**합니다.
- API 키는 사용자가 직접 입력하며 **브라우저 localStorage에만 저장**됩니다. 저장소 코드에는 키가 들어가지 않습니다.
- Claude Opus / Sonnet 모델에서는 서버 측 폴백(`fallbacks: "default"`)을 켜서, 드물게 요청이 거절되면 다른 모델이 자동으로 이어받습니다.

## 실행 방법

```bash
npm install
npm run dev      # http://localhost:5173
```

1. 우측 상단 **⚙ API 설정**에서 AI를 고르고 키를 입력
   - **Gemini (무료)**: [Google AI Studio](https://aistudio.google.com/apikey)에서 Google 계정으로 무료 키 발급 (카드 불필요)
   - **Claude (유료)**: [Claude Console](https://platform.claude.com/settings/keys)에서 크레딧 충전 후 키 발급
2. 여행지를 입력하고 **일정 짜기** 클릭

## GitHub Pages 배포

1. 이 폴더를 GitHub 저장소로 push (`main` 브랜치)
2. 저장소 **Settings → Pages → Source**를 **GitHub Actions**로 변경
3. push할 때마다 `.github/workflows/deploy.yml`이 자동으로 빌드·배포
   → `https://<아이디>.github.io/<저장소명>/`

## 폴더 구조

```
travel-planner/
├── index.html          # 화면 구조 (입력 폼, 설정 다이얼로그)
├── src/
│   ├── main.js         # 이벤트 처리, 설정 저장
│   ├── planner.js      # Gemini / Claude API 호출, 프롬프트, JSON 스키마
│   ├── render.js       # 일정 JSON → HTML
│   ├── sample.js       # 예시 일정 데이터
│   └── style.css
├── public/favicon.svg
└── .github/workflows/deploy.yml
```

## 참고

- AI가 생성한 일정은 추천일 뿐이니 영업시간·요금은 방문 전에 확인하세요.
- Gemini 무료 등급은 분당·일일 요청 횟수 제한이 있습니다. Claude는 사용량만큼 요금이 부과됩니다.
