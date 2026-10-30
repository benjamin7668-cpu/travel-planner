import "./style.css";
import { generatePlan, PlannerError } from "./planner.js";
import { renderPlan, planToText } from "./render.js";
import { SAMPLE_DESTINATION, SAMPLE_PLAN } from "./sample.js";

const STORAGE_KEY = "travel-planner:settings";
const DEFAULT_SETTINGS = {
  provider: "gemini",
  geminiKey: "",
  claudeKey: "",
  claudeModel: "claude-opus-5-5",
};

const form = document.getElementById("plan-form");
const submitBtn = document.getElementById("submit-btn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const settingsDialog = document.getElementById("settings-dialog");
const settingsForm = document.getElementById("settings-form");

let currentPlan = null;
let currentDestination = "";
let sessionSettings = loadSettings();

// localStorage는 시크릿 모드 등에서 막힐 수 있어 항상 try/catch로 감쌉니다.
function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    // 이전 버전(Claude 전용) 설정 { apiKey, model } 호환
    if (saved.apiKey && !saved.provider) {
      return { ...DEFAULT_SETTINGS, provider: "claude", claudeKey: saved.apiKey, claudeModel: saved.model };
    }
    return { ...DEFAULT_SETTINGS, ...saved };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function activeKey(settings) {
  return settings.provider === "claude" ? settings.claudeKey : settings.geminiKey;
}

function syncProviderFields() {
  for (const el of settingsForm.querySelectorAll(".provider-fields")) {
    el.hidden = el.dataset.provider !== settingsForm.provider.value;
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // 저장 실패 시에도 이번 세션 동안은 동작하도록 메모리에 유지
  }
  sessionSettings = settings;
}

function openSettings() {
  for (const name of Object.keys(DEFAULT_SETTINGS)) {
    settingsForm[name].value = sessionSettings[name];
  }
  syncProviderFields();
  settingsDialog.showModal();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showStatus(html, kind = "info") {
  statusEl.className = `status status-${kind}`;
  statusEl.innerHTML = html;
  statusEl.hidden = false;
}

function showResult(plan, destination) {
  currentPlan = plan;
  currentDestination = destination;
  statusEl.hidden = true;
  resultEl.innerHTML = renderPlan(plan, destination);
  resultEl.hidden = false;
  resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

function readForm() {
  const data = new FormData(form);
  return {
    destination: data.get("destination").trim(),
    days: Number(data.get("days")),
    startDate: data.get("startDate"),
    companions: data.get("companions"),
    budget: data.get("budget"),
    styles: data.getAll("styles"),
    notes: data.get("notes").trim(),
  };
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const options = readForm();
  if (!options.destination) return;

  if (!activeKey(sessionSettings)) {
    openSettings();
    return;
  }

  submitBtn.disabled = true;
  resultEl.hidden = true;
  showStatus(
    `<div class="loader" aria-hidden="true"><span></span><span></span><span></span></div>
     <p><strong>${escapeHtml(options.destination)}</strong> 일정을 짜는 중이에요… (30초~1분 정도 걸려요)</p>`,
  );

  try {
    const plan = await generatePlan(options, sessionSettings);
    showResult(plan, options.destination);
  } catch (err) {
    const message = err instanceof PlannerError ? err.message : "알 수 없는 오류가 발생했어요.";
    if (!(err instanceof PlannerError)) console.error(err);
    showStatus(`<p>⚠ ${message}</p>`, "error");
  } finally {
    submitBtn.disabled = false;
  }
});

document.getElementById("demo-btn").addEventListener("click", () => {
  form.destination.value = SAMPLE_DESTINATION;
  showResult(SAMPLE_PLAN, SAMPLE_DESTINATION);
});

document.getElementById("settings-btn").addEventListener("click", openSettings);

settingsForm.provider.addEventListener("change", syncProviderFields);

settingsForm.addEventListener("submit", () => {
  saveSettings({
    provider: settingsForm.provider.value,
    geminiKey: settingsForm.geminiKey.value.trim(),
    claudeKey: settingsForm.claudeKey.value.trim(),
    claudeModel: settingsForm.claudeModel.value,
  });
  // 키 입력 때문에 멈췄던 요청이 있으면 이어서 진행
  if (activeKey(sessionSettings) && form.destination.value.trim()) form.requestSubmit();
});

document.getElementById("clear-key-btn").addEventListener("click", () => {
  settingsForm.geminiKey.value = "";
  settingsForm.claudeKey.value = "";
  saveSettings({ ...sessionSettings, geminiKey: "", claudeKey: "" });
});

resultEl.addEventListener("click", async (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "print") {
    window.print();
  } else if (action === "copy" && currentPlan) {
    try {
      await navigator.clipboard.writeText(planToText(currentPlan, currentDestination));
      event.target.textContent = "✅ 복사됨";
    } catch {
      event.target.textContent = "복사 실패";
    }
  }
});
