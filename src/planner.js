import Anthropic from "@anthropic-ai/sdk";

// Claude가 반드시 이 형태의 JSON으로 답하도록 강제하는 스키마 (Structured Outputs)
const PLAN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "summary", "bestSeason", "transport", "days", "budget", "tips", "packing"],
  properties: {
    title: { type: "string", description: "여행 제목 (짧고 감성적으로)" },
    summary: { type: "string", description: "여행 전체 요약 2~3문장" },
    bestSeason: { type: "string", description: "추천 여행 시기와 그 이유 한 줄" },
    transport: { type: "string", description: "현지 이동 수단 추천 한두 문장" },
    days: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["day", "theme", "items"],
        properties: {
          day: { type: "integer" },
          theme: { type: "string", description: "그날의 테마 (예: 동쪽 해안 드라이브)" },
          items: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["time", "title", "place", "category", "description", "tip"],
              properties: {
                time: { type: "string", description: "HH:MM 형식" },
                title: { type: "string" },
                place: { type: "string", description: "지도 검색이 가능한 실제 장소명" },
                category: {
                  type: "string",
                  enum: ["관광", "식사", "카페", "쇼핑", "액티비티", "숙소", "이동"],
                },
                description: { type: "string", description: "한두 문장 설명" },
                tip: { type: "string", description: "짧은 꿀팁. 없으면 빈 문자열" },
              },
            },
          },
        },
      },
    },
    budget: {
      type: "object",
      additionalProperties: false,
      required: ["items", "total", "note"],
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["label", "amount"],
            properties: {
              label: { type: "string", description: "항목 (숙박, 식비, 교통 등)" },
              amount: { type: "string", description: "1인 기준 예상 금액 (원화, 예: 약 15만 원)" },
            },
          },
        },
        total: { type: "string", description: "1인 기준 총 예상 비용 (원화)" },
        note: { type: "string", description: "항공권 포함 여부 등 예산 기준 설명" },
      },
    },
    tips: { type: "array", items: { type: "string" }, description: "현지 여행 팁 3~5개" },
    packing: { type: "array", items: { type: "string" }, description: "챙길 준비물 4~6개" },
  },
};

const SYSTEM_PROMPT = `당신은 10년 경력의 여행 플래너입니다. 사용자의 여행지와 조건에 맞춰 실제로 따라갈 수 있는 일정을 한국어로 짭니다.

원칙:
- 실제로 존재하는 장소만 추천하고, place에는 지도에서 검색되는 정확한 이름을 씁니다.
- 하루 동선은 지리적으로 가까운 곳끼리 묶어 이동 시간을 줄입니다.
- 하루 5~7개 일정으로, 식사 시간(점심·저녁)을 반드시 포함합니다.
- 첫날은 도착, 마지막 날은 출발을 고려해 일정을 가볍게 잡습니다.
- 동행·예산·여행 스타일 조건을 장소 선택에 반영합니다.
- 예산은 1인 기준 원화로 대략적인 범위를 제시합니다.`;

function buildUserPrompt({ destination, days, startDate, companions, budget, styles, notes }) {
  const lines = [
    `여행지: ${destination}`,
    `기간: ${days === 1 ? "당일치기" : `${days - 1}박 ${days}일`} (days 배열은 정확히 ${days}개)`,
    startDate && `출발일: ${startDate} (이 시기의 날씨·축제를 고려해 주세요)`,
    `동행: ${companions}`,
    `예산 수준: ${budget}`,
    styles.length > 0 && `선호 스타일: ${styles.join(", ")}`,
    notes && `추가 요청: ${notes}`,
  ];
  return `${lines.filter(Boolean).join("\n")}\n\n위 조건으로 여행 일정을 짜 주세요.`;
}

export class PlannerError extends Error {}

export async function generatePlan(options, { apiKey, model }) {
  // 정적 사이트(GitHub Pages)라 서버가 없으므로 브라우저에서 직접 호출합니다.
  // 키는 사용자 본인 것이 localStorage에만 저장되며, 저장소에는 포함되지 않습니다.
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const request = {
    model,
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(options) }],
    output_config: {
      effort: "medium",
      format: { type: "json_schema", schema: PLAN_SCHEMA },
    },
  };

  let response;
  try {
    // Haiku는 서버 측 폴백을 지원하지 않으므로 Opus/Sonnet에서만 켭니다.
    response = model.startsWith("claude-haiku")
      ? await client.messages.create(request)
      : await client.beta.messages.create({
          ...request,
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
        });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      throw new PlannerError("API 키가 올바르지 않아요. 설정에서 키를 다시 확인해 주세요.");
    }
    if (err instanceof Anthropic.PermissionDeniedError) {
      throw new PlannerError("이 API 키로는 선택한 모델을 쓸 수 없어요. 다른 모델을 골라 보세요.");
    }
    if (err instanceof Anthropic.RateLimitError) {
      throw new PlannerError("요청이 너무 많아요. 잠시 후 다시 시도해 주세요.");
    }
    if (err instanceof Anthropic.APIConnectionError) {
      throw new PlannerError("네트워크 연결을 확인해 주세요.");
    }
    if (err instanceof Anthropic.APIError) {
      throw new PlannerError(`API 오류 (${err.status ?? "알 수 없음"}): ${err.message}`);
    }
    throw err;
  }

  if (response.stop_reason === "refusal") {
    throw new PlannerError("이 요청은 처리할 수 없어요. 여행지나 요청 내용을 바꿔 보세요.");
  }
  if (response.stop_reason === "max_tokens") {
    throw new PlannerError("일정이 너무 길어 중간에 끊겼어요. 기간을 줄여서 다시 시도해 주세요.");
  }

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  try {
    return JSON.parse(text);
  } catch {
    throw new PlannerError("응답을 해석하지 못했어요. 다시 시도해 주세요.");
  }
}
