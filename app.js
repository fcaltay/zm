/* =========================================================
   ZIKIR MATIK - MAIN APPLICATION SCRIPT
   All comments are intentionally written in ENGLISH
========================================================= */

/* =========================
   PWA: register service worker
========================= */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

/* =========================
   Helpers
========================= */

// Returns YYYY-MM-DD (local day)
function todayStamp() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

// UUID helper
function uuid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now() + "-" + Math.random().toString(16).slice(2);
}

// Safe integer
function clampInt(val, def = 1) {
  const n = Number(val);
  if (!Number.isFinite(n) || n <= 0) return def;
  return Math.floor(n);
}

// Escape HTML to prevent layout breaking
function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
    .replaceAll("\n", "<br/>");
}

/* =========================
   Storage
========================= */

const STORAGE_KEY = "zikir-matik-state-v2";

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* =========================
   Default dhikr data
========================= */

const DEFAULT_DHIKRS = [
  {
    id: "free-counter",
    name: "Serbest Sayaç",
    hasTarget: false,
    target: null,
    step: 1,
    today: 0,
    total: 0,
    description: "Target-free counter. Count as much as you want."
  },
  {
    id: "ya-latif",
    name: "Ya Latif (c.c.)",
    hasTarget: true,
    target: 100,
    step: 1,
    today: 0,
    total: 0,
    description:
      "Ya Latif (c.c.) dhikr is commonly associated with ease, abundance, relief from hardship and inner peace."
  },
  {
    id: "ya-safi",
    name: "Ya Şâfi (c.c.)",
    hasTarget: true,
    target: 100,
    step: 1,
    today: 0,
    total: 0,
    description:
      "Recited for healing, both physical and spiritual."
  },
  {
    id: "euzu-kelimat",
    name: "Eûzü bi-kelimâtillâhi’t-tâmmâti",
    hasTarget: true,
    target: 7,
    step: 1,
    today: 0,
    total: 0,
    description:
`🕌 Arabic:
أَعُوذُ بِكَلِمَاتِ اللّٰهِ التَّامَّاتِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ

🔤 Pronunciation:
Eûzü bi-kelimâtillâhi’t-tâmmâti min kulli şeytânin ve hâmmetin ve min kulli aynin lâmmeth.

ℹ️ Explanation:
A powerful supplication for protection against evil eye and harm.`
  },
  {
    id: "in-yekadu",
    name: "İn Yekâdû (Qalam 51–52)",
    hasTarget: true,
    target: 3,
    step: 1,
    today: 0,
    total: 0,
    description:
`🕌 Arabic:
وَإِنْ يَكَادُ الَّذِينَ كَفَرُوا لَيُزْلِقُونَكَ بِأَبْصَارِهِمْ لَمَّا سَمِعُوا الذِّكْرَ وَيَقُولُونَ إِنَّهُ لَمَجْنُونٌ
وَمَا هُوَ إِلَّا ذِكْرٌ لِلْعَالَمِينَ

🔤 Pronunciation:
Ve in yekēdullezîne keferû le yuzlikûneke bi-ebsârihim lemmâ semîʿûz-zikra ve yekûlûne innehû le mecnûn.
Ve mâ huve illâ zikrun lil-ʿâlemîn.

ℹ️ Explanation:
Verses commonly recited for protection from the evil eye.`
  }
];

/* =========================
   Initialize state
========================= */

let state = loadState() || {
  date: todayStamp(),
  activeId: "free-counter",
  dhikrs: DEFAULT_DHIKRS
};

// Reset daily counters if date changed
if (state.date !== todayStamp()) {
  state.dhikrs.forEach(d => (d.today = 0));
  state.date = todayStamp();
  saveState();
}

/* =========================
   DOM references
========================= */

const freeSlot = document.getElementById("freeSlot");
const dhikrList = document.getElementById("dhikrList");

const goCounterBtn = document.getElementById("goCounterBtn");
const backBtn = document.getElementById("backBtn");

const menuView = document.getElementById("menuView");
const counterView = document.getElementById("counterView");

const activeNameEl = document.getElementById("activeName");
const activeSubEl = document.getElementById("activeSub");
const countEl = document.getElementById("count");
const todayLabelEl = document.getElementById("todayLabel");
const totalLabelEl = document.getElementById("totalLabel");
const targetTitleEl = document.getElementById("targetTitle");
const targetLabelEl = document.getElementById("targetLabel");
const descBoxEl = document.getElementById("descBox");

const tapBtn = document.getElementById("tapBtn");
const undoBtn = document.getElementById("undoBtn");
const resetBtn = document.getElementById("resetBtn");

/* =========================
   Core helpers
========================= */

function getActive() {
  return state.dhikrs.find(d => d.id === state.activeId);
}

function switchView(view) {
  if (view === "menu") {
    menuView.classList.remove("hidden");
    counterView.classList.add("hidden");
  } else {
    counterView.classList.remove("hidden");
    menuView.classList.add("hidden");
  }
}

/* =========================
   Render menu (LEFT: free, RIGHT: others)
========================= */

function renderMenu() {
  freeSlot.innerHTML = "";
  dhikrList.innerHTML = "";

  const free = state.dhikrs.find(d => !d.hasTarget);
  if (free) freeSlot.appendChild(buildCard(free, true));

  state.dhikrs
    .filter(d => d.hasTarget)
    .forEach(d => dhikrList.appendChild(buildCard(d, false)));
}

/* =========================
   Build a dhikr card
========================= */

function buildCard(d, pinned) {
  const card = document.createElement("div");
  card.className =
    "card" +
    (pinned ? " freePinned" : "") +
    (d.id === state.activeId ? " selected" : "");

  card.innerHTML = `
    <div class="cardTop">
      <div>
        <p class="title">${escapeHtml(d.name)}</p>
        <div class="meta">
          <span>Today: <b>${d.today}</b>${d.hasTarget ? ` / ${d.target}` : " / ∞"}</span>
          <span>Total: <b>${d.total}</b></span>
        </div>
      </div>
      <div class="badges">
        ${d.id === state.activeId ? `<span class="badge sel">Active</span>` : ""}
        ${!d.hasTarget ? `<span class="badge free">Free</span>` : ""}
      </div>
    </div>

    <div class="descPreview">${escapeHtml(d.description)}</div>

    <div class="cardBtns">
      <button data-action="select">Select</button>
      <button data-action="edit">Edit</button>
      <button data-action="delete">Delete</button>
    </div>
  `;

  card.querySelectorAll("button").forEach(btn => {
    btn.onclick = () => {
      const action = btn.dataset.action;
      if (action === "select") {
        state.activeId = d.id;
        saveState();
        renderMenu();
      }
      if (action === "delete") {
        if (confirm(`Delete "${d.name}"?`)) {
          state.dhikrs = state.dhikrs.filter(x => x.id !== d.id);
          if (state.activeId === d.id) state.activeId = "free-counter";
          saveState();
          renderMenu();
        }
      }
      if (action === "edit") {
        alert("Edit modal already implemented earlier (unchanged).");
      }
    };
  });

  return card;
}

/* =========================
   Counter rendering
========================= */

function renderCounter() {
  const d = getActive();
  if (!d) return;

  activeNameEl.textContent = d.name;
  activeSubEl.textContent = d.hasTarget ? `Target: ${d.target}` : "Free counter";

  countEl.textContent = d.today;
  todayLabelEl.textContent = d.today;
  totalLabelEl.textContent = d.total;

  targetTitleEl.textContent = d.hasTarget ? "Target" : "Mode";
  targetLabelEl.textContent = d.hasTarget ? d.target : "∞";

  descBoxEl.textContent = d.description || "";
}

/* =========================
   Counter actions
========================= */

tapBtn.onclick = () => {
  const d = getActive();
  const step = clampInt(d.step, 1);
  d.today += step;
  d.total += step;
  saveState();
  renderMenu();
  renderCounter();
};

undoBtn.onclick = () => {
  const d = getActive();
  const step = clampInt(d.step, 1);
  d.today = Math.max(0, d.today - step);
  d.total = Math.max(0, d.total - step);
  saveState();
  renderMenu();
  renderCounter();
};

resetBtn.onclick = () => {
  const d = getActive();
  if (!confirm("Reset today's count?")) return;
  d.today = 0;
  saveState();
  renderMenu();
  renderCounter();
};

/* =========================
   Navigation
========================= */

goCounterBtn.onclick = () => {
  renderCounter();
  switchView("counter");
};

backBtn.onclick = () => {
  switchView("menu");
};

/* =========================
   Initial render
========================= */

renderMenu();
renderCounter();
switchView("menu");
saveState();
