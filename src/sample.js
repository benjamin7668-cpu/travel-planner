// API 키 없이도 화면을 확인할 수 있는 예시 일정
export const SAMPLE_DESTINATION = "제주도";

export const SAMPLE_PLAN = {
  title: "바람 따라 걷는 제주 1박 2일",
  summary:
    "첫날은 제주 동쪽 해안을 따라 오름과 바다를 즐기고, 둘째 날은 제주 시내에서 시장과 카페를 둘러본 뒤 여유롭게 공항으로 향하는 일정이에요.",
  bestSeason: "4~6월, 9~10월 — 날씨가 온화하고 유채꽃·억새를 볼 수 있어요.",
  transport: "동쪽 해안은 버스 간격이 길어 렌터카를 추천해요. 시내 일정은 버스·택시로 충분해요.",
  days: [
    {
      day: 1,
      theme: "동쪽 해안 드라이브",
      items: [
        { time: "10:00", title: "제주공항 도착 · 렌터카 픽업", place: "제주국제공항", category: "이동", description: "렌터카 하우스에서 차량을 받고 동쪽으로 출발해요.", tip: "렌터카는 미리 예약하면 훨씬 저렴해요." },
        { time: "11:00", title: "함덕 바다 산책", place: "함덕해수욕장", category: "관광", description: "에메랄드빛 바다와 서우봉 산책로를 걸어요.", tip: "" },
        { time: "12:30", title: "점심 · 고기국수", place: "함덕 고기국수", category: "식사", description: "진한 돼지 육수에 두툼한 수육이 올라간 제주식 국수.", tip: "점심 피크 전에 가면 대기가 짧아요." },
        { time: "14:30", title: "성산일출봉 등반", place: "성산일출봉", category: "관광", description: "왕복 약 50분, 정상에서 분화구와 바다를 한눈에.", tip: "편한 운동화 필수!" },
        { time: "17:00", title: "섭지코지 노을", place: "섭지코지", category: "관광", description: "해안 절벽을 따라 걸으며 해 질 녘 풍경을 감상해요.", tip: "" },
        { time: "19:00", title: "저녁 · 흑돼지 구이", place: "성산 흑돼지", category: "식사", description: "멜젓에 찍어 먹는 제주 흑돼지 근고기.", tip: "" },
      ],
    },
    {
      day: 2,
      theme: "제주 시내와 시장 구경",
      items: [
        { time: "09:30", title: "브런치 카페", place: "카페 델문도", category: "카페", description: "바다 바로 앞 통창 카페에서 여유로운 아침.", tip: "" },
        { time: "11:00", title: "동문재래시장", place: "동문재래시장", category: "쇼핑", description: "오메기떡, 감귤 초콜릿 등 기념품 쇼핑.", tip: "택배 발송 가능한 가게가 많아요." },
        { time: "12:30", title: "점심 · 해물뚝배기", place: "동문시장 해물뚝배기", category: "식사", description: "전복과 보말이 듬뿍 들어간 뚝배기.", tip: "" },
        { time: "14:00", title: "용두암 산책", place: "용두암", category: "관광", description: "공항에서 10분 거리, 마지막 바다 구경.", tip: "" },
        { time: "15:30", title: "렌터카 반납 · 공항", place: "제주국제공항", category: "이동", description: "출발 1시간 30분 전까지 공항 도착.", tip: "" },
      ],
    },
  ],
  budget: {
    items: [
      { label: "항공권 (왕복)", amount: "약 8만~15만 원" },
      { label: "숙박 (1박)", amount: "약 5만~8만 원" },
      { label: "렌터카 · 유류비", amount: "약 3만~5만 원" },
      { label: "식비", amount: "약 8만 원" },
      { label: "입장료 · 기타", amount: "약 2만 원" },
    ],
    total: "약 26만~38만 원",
    note: "2인 여행 시 1인 기준, 렌터카·숙박은 2인 분할 금액이에요.",
  },
  tips: [
    "제주는 날씨 변화가 잦으니 실내 대체 일정을 하나쯤 알아두세요.",
    "성산일출봉은 일출 시간대에 가장 붐벼요.",
    "주유소가 띄엄띄엄 있으니 연료를 넉넉히 채워 두세요.",
  ],
  packing: ["바람막이", "편한 운동화", "선크림", "보조배터리", "접이식 우산"],
};
