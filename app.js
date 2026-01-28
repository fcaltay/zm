/* =========================================================
   ZIKIR MATIK - app.js (FULL)
   - Comments are in English by request
   - Free counter pinned on the left
   - Other counters on the right
   - Select opens the counter immediately (no "Devam Et")
   - Add/Edit/Delete modal included
   - localStorage persistence + daily reset
   - PWA service worker register
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
   Utility helpers
========================= */

// Returns YYYY-MM-DD for local date
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

// Force positive integer
function clampInt(val, def = 1) {
  const n = Number(val);
  if (!Number.isFinite(n) || n <= 0) return def;
  return Math.floor(n);
}

// Escape HTML for safe rendering inside innerHTML
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
const STORAGE_KEY = "zikir-matik-state-v3";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* =========================
   Default items
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
    description: "Hedefsiz sayaç. İstediğin kadar say."
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
      'Ya Latif" (c.c.) zikrini okuyanlar, genellikle rızık bolluğu, zor işlerin kolaylaşması, sıkıntıların feraha çıkması ve manevi huzur gibi lütuf ve ikramların tecelli ettiğini belirtmektedir.'
  },
  {
    id: "ya-safi",
    name: "Ya Şâfi (c.c.)",
    hasTarget: true,
    target: 100,
    step: 1,
    today: 0,
    total: 0,
    description: "Şifa, hastalıkların hafiflemesi ve manevi/bedeni iyilik için okunur."
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
`🕌 Arapça:
أَعُوذُ بِكَلِمَاتِ اللّٰهِ التَّامَّاتِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ

🔤 Okunuş:
Eûzü bi-kelimâtillâhi’t-tâmmâti min kulli şeytânin ve hâmmetin ve min kulli aynin lâmmeth.

ℹ️ Açıklama:
Nazar, şeytan ve her türlü zararlı etkiden korunmak için okunan güçlü bir duadır.`
  },
  {
    id: "in-yekadu",
    name: "İn Yekâdû (Kalem 51–52)",
    hasTarget: true,
    target: 3,
    step: 1,
    today: 0,
    total: 0,
    description:
`🕌 Arapça:
وَإِنْ يَكَادُ الَّذِينَ كَفَرُوا لَيُزْلِقُونَكَ بِأَبْصَارِهِمْ لَمَّا سَمِعُوا الذِّكْرَ وَيَقُولُونَ إِنَّهُ لَمَجْنُونٌ
وَمَا هُوَ إِلَّا ذِكْرٌ لِلْعَالَمِينَ

🔤 Okunuş:
Ve in yekēdullezîne keferû le yuzlikûneke bi-ebsârihim lemmâ semîʿûz-zikra ve yekûlûne innehû le mecnûn.
Ve mâ huve illâ zikrun lil-ʿâlemîn.

ℹ️ Açıklama:
Kalem Suresi 51–52. Nazar, haset ve kötü bakışlara karşı korunmak amacıyla okunur.`
  }
];

/* =========================
   Initialize state
========================= */
let state =
  loadState() ||
  {
    date: todayStamp(),
    activeId: "free-counter",
    dhikrs: DEFAULT_DHIKRS
  };

// Daily reset if date changed
if (state.date !== todayStamp()) {
  state.dhikrs.forEach((d) => (d.today = 0));
  state.date = todayStamp();
  saveState();
}

// Ensure there is always a free counter
function ensureFreeCounter() {
  let free = state.dhikrs.find((d) => d.hasTarget === false);
  if (!free) {
    free = {
      id: uuid(),
      name: "Serbest Sayaç",
      hasTarget: false,
      target: null,
      step: 1,
      today: 0,
      total: 0,
      description: "Hedefsiz sayaç. İstediğin kadar say."
    };
    state.dhikrs.unshift(free);
    if (!state.activeId) state.activeId = free.id;
    saveState();
  }
}
ensureFreeCounter();

/* =========================
   DOM references
========================= */
const menuView = document.getElementById("menuView");
const counterView = document.getElementById("counterView");

const freeSlot = document.getElementById("freeSlot");
const dhikrList = document.getElementById("dhikrList");

const backBtn = document.getElementById("backBtn");

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

const openAddBtn = document.getElementById("openAddBtn");

// Modal DOM
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");
const dangerZone = document.getElementById("dangerZone");

const nameInput = document.getElementById("nameInput");
const descInput = document.getElementById("descInput");
const stepInput = document.getElementById("stepInput");
const targetInput = document.getElementById("targetInput");
const noTargetInput = document.getElementById("noTargetInput");

let editingId = null;

/* =========================
   View navigation
========================= */
function switchView(view) {
  if (view === "menu") {
    menuView.classList.remove("hidden");
    counterView.classList.add("hidden");
  } else {
    counterView.classList.remove("hidden");
    menuView.classList.add("hidden");
  }
}

function getActive() {
  return state.dhikrs.find((d) => d.id === state.activeId) || state.dhikrs[0];
}

/* =========================
   Rendering
========================= */

// Formats description for preview; keeps it simple (safe)
function formatPreview(text) {
  return escapeHtml((text || "").trim());
}

function buildCard(d, pinned) {
  const card = document.createElement("div");
  card.className =
    "card" +
    (pinned ? " freePinned" : "") +
    (d.id === state.activeId ? " selected" : "");

  const badgeSelected = d.id === state.activeId ? `<span class="badge sel">Active</span>` : "";
  const badgeFree = !d.hasTarget ? `<span class="badge free">Free ∞</span>` : "";
  const badgeTarget = d.hasTarget ? `<span class="badge">Target: ${d.target}</span>` : "";

  card.innerHTML = `
    <div class="cardTop">
      <div>
        <p class="title">${escapeHtml(d.name)}</p>
        <div class="meta">
          <span>Today: <b>${d.today}</b>${d.hasTarget ? ` / <b>${d.target}</b>` : ` / <b>∞</b>`}</span>
          <span>Total: <b>${d.total}</b></span>
          <span>Step: <b>${d.step || 1}</b></span>
        </div>
      </div>
      <div class="badges">
        ${badgeSelected}
        ${badgeFree}
        ${badgeTarget}
      </div>
    </div>

    <div class="descPreview">${formatPreview(d.description)}</div>

    <div class="cardBtns">
      <button data-action="select" data-id="${d.id}">Select</button>
      <button data-action="edit" data-id="${d.id}">Edit</button>
      <button data-action="delete" data-id="${d.id}">Delete</button>
    </div>
  `;

  // Attach events
  card.querySelectorAll("button[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const action = btn.getAttribute("data-action");

      if (action === "select") {
        // Select and open counter immediately
        state.activeId = id;
        saveState();
        renderMenu();
        renderCounter();
        switchView("counter");
      }

      if (action === "edit") {
        openEdit(id);
      }

      if (action === "delete") {
        deleteDhikr(id);
      }
    });
  });

  return card;
}

function renderMenu() {
  ensureFreeCounter();

  freeSlot.innerHTML = "";
  dhikrList.innerHTML = "";

  // Free counter goes to the left column
  const free = state.dhikrs.find((d) => d.hasTarget === false);
  if (free) freeSlot.appendChild(buildCard(free, true));

  // All target-based dhikrs go to the right column
  state.dhikrs
    .filter((d) => d.hasTarget === true)
    .forEach((d) => dhikrList.appendChild(buildCard(d, false)));
}

function renderCounter() {
  const d = getActive();

  activeNameEl.textContent = d.name;
  activeSubEl.textContent = d.hasTarget ? `Target: ${d.target} | Step: ${d.step || 1}` : `Free counter | Step: ${d.step || 1}`;

  countEl.textContent = d.today;
  todayLabelEl.textContent = d.today;
  totalLabelEl.textContent = d.total;

  if (d.hasTarget) {
    targetTitleEl.textContent = "Target";
    targetLabelEl.textContent = String(d.target);
  } else {
    targetTitleEl.textContent = "Mode";
    targetLabelEl.textContent = "∞";
  }

  // For counter view, use plain text so newlines are preserved naturally
  descBoxEl.textContent = (d.description || "").trim();
}

/* =========================
   Counter actions
========================= */
function tap() {
  const d = getActive();
  const step = clampInt(d.step || 1, 1);
  d.today += step;
  d.total += step;
  saveState();
  renderMenu();
  renderCounter();
}

function undo() {
  const d = getActive();
  const step = clampInt(d.step || 1, 1);
  d.today = Math.max(0, d.today - step);
  d.total = Math.max(0, d.total - step);
  saveState();
  renderMenu();
  renderCounter();
}

function resetToday() {
  const d = getActive();
  if (!confirm("Reset today's count?")) return;
  d.today = 0;
  saveState();
  renderMenu();
  renderCounter();
}

/* =========================
   Modal: open/close
========================= */
function openModal() {
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  editingId = null;
}

function openAdd() {
  editingId = null;
  modalTitle.textContent = "Yeni Zikir";
  dangerZone.classList.add("hidden");

  nameInput.value = "";
  descInput.value = "";
  stepInput.value = "1";
  targetInput.value = "100";
  noTargetInput.checked = false;
  targetInput.disabled = false;

  openModal();
}

function openEdit(id) {
  const d = state.dhikrs.find((x) => x.id === id);
  if (!d) return;

  editingId = id;
  modalTitle.textContent = "Zikir Düzenle";
  dangerZone.classList.remove("hidden");

  nameInput.value = d.name || "";
  descInput.value = d.description || "";
  stepInput.value = String(d.step || 1);

  noTargetInput.checked = !d.hasTarget;
  targetInput.value = String(d.target || 100);
  targetInput.disabled = !d.hasTarget;

  openModal();
}

function saveFromModal() {
  const name = (nameInput.value || "").trim();
  if (!name) {
    alert("Zikir adı boş olamaz.");
    return;
  }

  const step = clampInt(stepInput.value, 1);
  const isNoTarget = !!noTargetInput.checked;

  const hasTarget = !isNoTarget;
  const target = hasTarget ? clampInt(targetInput.value, 100) : null;

  const description = (descInput.value || "").trim();

  if (!editingId) {
    // Create new
    const newDhikr = {
      id: uuid(),
      name,
      hasTarget,
      target,
      step,
      today: 0,
      total: 0,
      description
    };

    // If it's a free counter, replace existing free counter
    if (!hasTarget) {
      const idx = state.dhikrs.findIndex((d) => d.hasTarget === false);
      if (idx >= 0) {
        // Keep counts if user wants, but here we replace as new free
        newDhikr.today = state.dhikrs[idx].today;
        newDhikr.total = state.dhikrs[idx].total;
        state.dhikrs[idx] = newDhikr;
      } else {
        state.dhikrs.unshift(newDhikr);
      }
    } else {
      state.dhikrs.push(newDhikr);
    }

    state.activeId = newDhikr.id;
  } else {
    // Update existing
    const d = state.dhikrs.find((x) => x.id === editingId);
    if (!d) return;

    // Do not allow converting any item into a "second" free counter; free must be unique
    if (!hasTarget && d.hasTarget === true) {
      // If user tries to make a normal dhikr free, we swap with the existing free counter
      const freeIdx = state.dhikrs.findIndex((x) => x.hasTarget === false);
      if (freeIdx >= 0) {
        // Move this item to free slot by swapping content (keep ids stable)
        const free = state.dhikrs[freeIdx];

        // Swap key fields
        free.name = name;
        free.description = description;
        free.step = step;
        free.hasTarget = false;
        free.target = null;

        // Update the edited one (now will become a normal dhikr again)
        d.hasTarget = true;
        d.target = clampInt(targetInput.value, 100);

        // Ensure active points to free if editing free
        state.activeId = free.id;
      }
    } else {
      d.name = name;
      d.description = description;
      d.step = step;
      d.hasTarget = hasTarget;
      d.target = target;

      if (!hasTarget) d.target = null;
    }
  }

  ensureFreeCounter();
  saveState();
  renderMenu();
  renderCounter();
  closeModal();
}

function deleteDhikr(id) {
  const d = state.dhikrs.find((x) => x.id === id);
  if (!d) return;

  // Prevent deleting the pinned free counter (always keep one)
  if (!d.hasTarget) {
    alert("Serbest Sayaç silinemez. İstersen Düzenle ile adını/açıklamasını değiştirebilirsin.");
    return;
  }

  if (!confirm(`"${d.name}" silinsin mi?`)) return;

  state.dhikrs = state.dhikrs.filter((x) => x.id !== id);

  // If active deleted, fall back to free counter
  if (state.activeId === id) {
    const free = state.dhikrs.find((x) => x.hasTarget === false);
    state.activeId = free ? free.id : state.dhikrs[0]?.id || null;
  }

  saveState();
  renderMenu();
  renderCounter();
}

function deleteFromModal() {
  if (!editingId) return;
  deleteDhikr(editingId);
  closeModal();
}

/* Disable target input when free counter is checked */
noTargetInput.addEventListener("change", () => {
  targetInput.disabled = noTargetInput.checked;
});

/* =========================
   Event bindings
========================= */
openAddBtn.addEventListener("click", openAdd);
backBtn.addEventListener("click", () => switchView("menu"));

tapBtn.addEventListener("click", tap);
undoBtn.addEventListener("click", undo);
resetBtn.addEventListener("click", resetToday);

closeModalBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);
saveBtn.addEventListener("click", saveFromModal);
deleteBtn.addEventListener("click", deleteFromModal);

// Close modal when clicking outside
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// Close modal with ESC key
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

/* =========================
   Initial render
========================= */
renderMenu();
renderCounter();
switchView("menu");
saveState();
