/* =========================
   PWA: service worker
========================= */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(()=>{});
  });
}

// iOS PWA hint: sadece Safari/iOS ve standalone değilse göster
(function(){
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
  const hint = document.getElementById("pwaHint");
  if (!hint) return;
  if (isIOS && !isStandalone) hint.classList.remove("hidden");
  else hint.classList.add("hidden");
})();

/* =========================
   State + storage
========================= */
const STORAGE_KEY = "zikir-matik-state-v1";

function todayStamp() {
  // Amsterdam TZ farkı için basit: locale date string yeterli
  // (tarayıcı zaten yerel saat ile verir)
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function uuid() {
  return (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + "-" + Math.random().toString(16).slice(2);
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* =========================
   Default dhikrs
========================= */
const DEFAULT_DHIKRS = [
  {
    id: "ya-latif",
    name: "Ya Latif (c.c.)",
    hasTarget: true,
    target: 100,
    step: 1,
    today: 0,
    total: 0,
    description:
`Ya Latif" (c.c.) zikrini okuyanlar, genellikle rızık bolluğu, zor işlerin kolaylaşması, sıkıntıların feraha çıkması ve manevi huzur gibi lütuf ve ikramların tecelli ettiğini belirtmektedir.`
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
`Şifa, hastalıkların hafiflemesi ve manevi/bedeni iyilik için okunur.`
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
  },
  {
    id: "serbest-sayac",
    name: "Serbest Sayaç",
    hasTarget: false,
    target: null,
    step: 1,
    today: 0,
    total: 0,
    description: "Hedefsiz. İstediğin kadar say."
  }
];

/* =========================
   Initialize
========================= */
let state = loadState() || {
  date: todayStamp(),
  activeId: "ya-latif",
  dhikrs: DEFAULT_DHIKRS
};

// Gün değiştiyse today sıfırla
if (state.date !== todayStamp()) {
  state.dhikrs.forEach(d => d.today = 0);
  state.date = todayStamp();
  saveState();
}

/* =========================
   DOM
========================= */
const menuView = document.getElementById("menuView");
const counterView = document.getElementById("counterView");
const dhikrList = document.getElementById("dhikrList");

const goCounterBtn = document.getElementById("goCounterBtn");
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

// Modal
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
   Helpers
========================= */
function getActive() {
  return state.dhikrs.find(d => d.id === state.activeId) || state.dhikrs[0];
}

function setView(which) {
  if (which === "menu") {
    counterView.classList.add("hidden");
    menuView.classList.remove("hidden");
  } else {
    menuView.classList.add("hidden");
    counterView.classList.remove("hidden");
  }
}

function clampInt(n, def=1) {
  const x = Number(n);
  if (!Number.isFinite(x) || x <= 0) return def;
  return Math.floor(x);
}

/* =========================
   Render menu cards
========================= */
function renderMenu() {
  dhikrList.innerHTML = "";

  state.dhikrs.forEach(d => {
    const card = document.createElement("div");
    card.className = "card" + (d.id === state.activeId ? " selected" : "");

    const badgeSelected = d.id === state.activeId ? `<span class="badge sel">Seçildi</span>` : "";
    const badgeFree = !d.hasTarget ? `<span class="badge free">Serbest ∞</span>` : "";
    const badgeTarget = d.hasTarget ? `<span class="badge">Hedef: ${d.target}</span>` : "";

    const descPreview = (d.description || "").trim();
    const preview = descPreview ? descPreview : "";

    card.innerHTML = `
      <div class="cardTop">
        <div>
          <p class="title">${escapeHtml(d.name)}</p>
          <div class="meta">
            <span>Bugün: <b>${d.today}</b>${d.hasTarget ? ` / <b>${d.target}</b>` : " / <b>∞</b>"}</span>
            <span>Toplam: <b>${d.total}</b></span>
            <span>Adım: <b>${d.step || 1}</b></span>
          </div>
        </div>
        <div class="badges">
          ${badgeSelected}
          ${badgeFree}
          ${badgeTarget}
        </div>
      </div>

      <div class="descPreview">${escapeHtml(preview)}</div>

      <div class="cardBtns">
        <button class="smallBtn" data-action="select" data-id="${d.id}">Seç</button>
        <button class="smallBtn" data-action="edit" data-id="${d.id}">Düzenle</button>
        <button class="smallBtn danger" data-action="delete" data-id="${d.id}">Sil</button>
      </div>
    `;

    dhikrList.appendChild(card);
  });

  // event delegation
  dhikrList.querySelectorAll("button[data-action]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      const action = e.currentTarget.getAttribute("data-action");
      if (action === "select") {
        state.activeId = id;
        saveState();
        renderMenu();
      }
      if (action === "edit") openEdit(id);
      if (action === "delete") deleteDhikr(id);
    });
  });
}

/* Simple HTML escape */
function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;")
    .replaceAll("\n","<br/>");
}

/* =========================
   Counter render
========================= */
function renderCounter() {
  const d = getActive();
  activeNameEl.textContent = d.name;

  const mode = d.hasTarget ? `Hedef: ${d.target}` : "Serbest sayaç (∞)";
  activeSubEl.textContent = mode;

  countEl.textContent = d.today;
  todayLabelEl.textContent = d.today;
  totalLabelEl.textContent = d.total;

  if (d.hasTarget) {
    targetTitleEl.textContent = "Hedef";
    targetLabelEl.textContent = String(d.target);
  } else {
    targetTitleEl.textContent = "Serbest";
    targetLabelEl.textContent = "∞";
  }

  descBoxEl.textContent = (d.description || "").trim();
}

/* =========================
   Modal (Add/Edit)
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
  const d = state.dhikrs.find(x => x.id === id);
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

  let hasTarget = !isNoTarget;
  let target = null;

  if (hasTarget) {
    target = clampInt(targetInput.value, 100);
  }

  const description = (descInput.value || "").trim();

  if (!editingId) {
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
    state.dhikrs.unshift(newDhikr);
    state.activeId = newDhikr.id;
  } else {
    const d = state.dhikrs.find(x => x.id === editingId);
    if (!d) return;

    d.name = name;
    d.description = description;
    d.step = step;
    d.hasTarget = hasTarget;
    d.target = target;

    // Hedefsiz olduysa hedefi null yap
    if (!hasTarget) d.target = null;
  }

  saveState();
  renderMenu();
  renderCounter();
  closeModal();
}

function deleteDhikr(id) {
  const d = state.dhikrs.find(x => x.id === id);
  if (!d) return;

  if (!confirm(`"${d.name}" silinsin mi?`)) return;

  state.dhikrs = state.dhikrs.filter(x => x.id !== id);

  // aktif silindiyse: ilkine geç
  if (state.activeId === id) {
    state.activeId = state.dhikrs[0]?.id || null;
  }

  saveState();
  renderMenu();
  if (state.activeId) renderCounter();
}

function deleteFromModal() {
  if (!editingId) return;
  deleteDhikr(editingId);
  closeModal();
}

/* Target toggle */
noTargetInput.addEventListener("change", () => {
  targetInput.disabled = noTargetInput.checked;
});

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
  if (d.today <= 0 || d.total <= 0) return;
  d.today = Math.max(0, d.today - step);
  d.total = Math.max(0, d.total - step);
  saveState();
  renderMenu();
  renderCounter();
}

function resetToday() {
  const d = getActive();
  if (!confirm("Bugünkü sayım sıfırlansın mı?")) return;
  d.today = 0;
  saveState();
  renderMenu();
  renderCounter();
}

/* =========================
   Events
========================= */
openAddBtn.addEventListener("click", openAdd);

goCounterBtn.addEventListener("click", () => {
  if (!state.activeId) {
    alert("Önce bir zikir seç.");
    return;
  }
  setView("counter");
  renderCounter();
});

backBtn.addEventListener("click", () => {
  setView("menu");
});

tapBtn.addEventListener("click", tap);
undoBtn.addEventListener("click", undo);
resetBtn.addEventListener("click", resetToday);

closeModalBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);
saveBtn.addEventListener("click", saveFromModal);
deleteBtn.addEventListener("click", deleteFromModal);

// modal backdrop click
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// ESC close
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
});

/* =========================
   Initial render
========================= */
renderMenu();
renderCounter();
setView("menu");
saveState();
