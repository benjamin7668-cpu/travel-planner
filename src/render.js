const CATEGORY_ICON = {
  관광: "📍",
  식사: "🍽",
  카페: "☕",
  쇼핑: "🛍",
  액티비티: "🏄",
  숙소: "🛏",
  이동: "🚗",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function mapUrl(place, destination) {
  const query = encodeURIComponent(`${place} ${destination}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function renderItem(item, destination) {
  const icon = CATEGORY_ICON[item.category] ?? "📍";
  return `
    <li class="item" data-category="${escapeHtml(item.category)}">
      <span class="item-time">${escapeHtml(item.time)}</span>
      <span class="item-dot" aria-hidden="true">${icon}</span>
      <div class="item-body">
        <h4>${escapeHtml(item.title)}</h4>
        <a class="item-place" href="${mapUrl(item.place, destination)}" target="_blank" rel="noopener">
          ${escapeHtml(item.place)} ↗
        </a>
        <p>${escapeHtml(item.description)}</p>
        ${item.tip ? `<p class="item-tip">💡 ${escapeHtml(item.tip)}</p>` : ""}
      </div>
    </li>`;
}

function renderDay(day, destination) {
  return `
    <article class="day">
      <header class="day-head">
        <span class="day-num">DAY ${escapeHtml(day.day)}</span>
        <h3>${escapeHtml(day.theme)}</h3>
      </header>
      <ol class="timeline">
        ${day.items.map((item) => renderItem(item, destination)).join("")}
      </ol>
    </article>`;
}

function renderList(items) {
  return `<ul>${items.map((text) => `<li>${escapeHtml(text)}</li>`).join("")}</ul>`;
}

export function renderPlan(plan, destination) {
  return `
    <div class="result-head">
      <p class="eyebrow">${escapeHtml(destination)}</p>
      <h2>${escapeHtml(plan.title)}</h2>
      <p class="lead">${escapeHtml(plan.summary)}</p>
      <div class="facts">
        <div><span>추천 시기</span>${escapeHtml(plan.bestSeason)}</div>
        <div><span>이동 수단</span>${escapeHtml(plan.transport)}</div>
      </div>
      <div class="result-actions">
        <button type="button" class="ghost-btn" data-action="copy">📋 텍스트 복사</button>
        <button type="button" class="ghost-btn" data-action="print">🖨 인쇄 / PDF</button>
      </div>
    </div>

    <div class="days">
      ${plan.days.map((day) => renderDay(day, destination)).join("")}
    </div>

    <div class="extras">
      <section class="card">
        <h3>💰 예상 경비 <small>(1인 기준)</small></h3>
        <table class="budget">
          ${plan.budget.items
            .map((row) => `<tr><th>${escapeHtml(row.label)}</th><td>${escapeHtml(row.amount)}</td></tr>`)
            .join("")}
          <tr class="total"><th>합계</th><td>${escapeHtml(plan.budget.total)}</td></tr>
        </table>
        <p class="muted">${escapeHtml(plan.budget.note)}</p>
      </section>
      <section class="card">
        <h3>🧭 여행 팁</h3>
        ${renderList(plan.tips)}
      </section>
      <section class="card">
        <h3>🎒 준비물</h3>
        ${renderList(plan.packing)}
      </section>
    </div>`;
}

export function planToText(plan, destination) {
  const lines = [`[${destination}] ${plan.title}`, plan.summary, ""];
  for (const day of plan.days) {
    lines.push(`■ DAY ${day.day} — ${day.theme}`);
    for (const item of day.items) {
      lines.push(`  ${item.time}  ${item.title} (${item.place})`);
    }
    lines.push("");
  }
  lines.push(`예상 경비(1인): ${plan.budget.total}`);
  return lines.join("\n");
}
