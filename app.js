document.addEventListener("DOMContentLoaded", () => {
  // -------- Storage helpers --------
  const KEY = "zikir-matik-state-v1";

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  // -------- Default data --------
  const DEFAULT_STATE = {
    dhikrs: [
      { id: "tefriciye", name: "Salât-ı Tefriciye (Nâriye)", target: 11, today: 0, total: 0,
        desc:
`🕌 Arapça:
اللَّهُمَّ صَلِّ صَلَاةً كَامِلَةً وَسَلِّمْ سَلَامًا تَامًّا عَلَى سَيِّدِنَا مُحَمَّدٍ الَّذِي تُنْحَلُّ بِهِ الْعُقَدُ وَتَنْفَرِجُ بِهِ الْكُرَبُ وَتُقْضَى بِهِ الْحَوَائِجُ وَتُنَالُ بِهِ الرَّغَائِبُ وَحُسْنُ الْخَوَاتِيمِ وَيُسْتَسْقَى الْغَمَامُ بِوَجْهِهِ الْكَرِيمِ
وَعَلَى آلِهِ وَصَحْبِهِ فِي كُلِّ لَمْحَةٍ وَنَفَسٍ بِعَدَدِ كُلِّ مَعْلُومٍ لَكَ.

🔤 Okunuş:
Allâhumme salli salâten kâmileten ve sellim selâmen tâmmen alâ Seyyidinâ Muhammedinillezî tenhallü bihil ukadü ve tenfericu bihil-kürebü ve tukdâ bihil-havâicu ve tünâlü bihir-reğâibü ve hüsnül-havâtimi ve yustaskal ğamâmu bivechihil Kerîm ve alâ âlihî ve sahbihi fî külli lemhatin ve nefesin bi adedi külli ma’lûmin lek

ℹ️ Kısa bilgi:
Sıkıntıların açılması, işlerin kolaylaşması ve ferahlık niyetiyle okunur.` },
      
      { id: "free", name: "Serbest Sayaç", free: true, target: null, today: 0, total: 0,
        desc: "Hedefsiz sayaç. İstediğin kadar say." },

      { id: "latif", name: "Ya Latif (c.c.)", target: 100, today: 0, total: 0,
        desc: "Rızık bolluğu, ferahlık, huzur için okunur." },

      { id: "safi", name: "Ya Şâfi (c.c.)", target: 100, today: 0, total: 0,
        desc: "Şifa için okunur." },
    ],
    activeId: "free"
  };

  // -------- Load state (or init) --------
  let state = load();
  if (!state || !Array.isArray(state.dhikrs)) state = structuredClone(DEFAULT_STATE);

  // -------- DOM --------
  const freeSlot = document.getElementById("freeSlot");
  const dhikrList = document.getElementById("dhikrList");
  const menuView = document.getElementById("menuView");
  const counterView = document.getElementById("counterView");

  const ringTap = document.getElementById("ringTap");
  const countEl = document.getElementById("count");
  const activeNameEl = document.getElementById("activeName");
  const activeSubEl = document.getElementById("activeSub");
  const todayLabelEl = document.getElementById("todayLabel");
  const totalLabelEl = document.getElementById("totalLabel");
  const targetTitleEl = document.getElementById("targetTitle");
  const targetLabelEl = document.getElementById("targetLabel");
  const descBoxEl = document.getElementById("descBox");

  const backBtn = document.getElementById("backBtn");
  const undoBtn = document.getElementById("undoBtn");
  const resetBtn = document.getElementById("resetBtn");
  const resetDataBtn = document.getElementById("resetDataBtn");

  // -------- State helpers --------
  function getActive() {
    return state.dhikrs.find(d => d.id === state.activeId) || state.dhikrs[0];
  }

  function switchToMenu() {
    counterView.classList.add("hidden");
    menuView.classList.remove("hidden");
  }

  function switchToCounter(id) {
    state.activeId = id;
    save(state);
    menuView.classList.add("hidden");
    counterView.classList.remove("hidden");
    renderCounter();
  }

  // -------- Render --------
  function renderMenu() {
    freeSlot.innerHTML = "";
    dhikrList.innerHTML = "";

    state.dhikrs.forEach((d) => {
      const card = document.createElement("div");
      card.className = "card";
      const todayPart = d.target ? `${d.today} / ${d.target}` : `${d.today} / ∞`;

      // show only short preview in menu
      const preview = (d.desc || "").split("\n").slice(0, 2).join("\n");

      card.innerHTML = `
        <div class="title">${d.name}</div>
        <div class="meta">Bugün: <b>${todayPart}</b> · Toplam: <b>${d.total}</b></div>
        <div class="descPreview">${preview}</div>
      `;

      card.addEventListener("click", () => switchToCounter(d.id));

      if (d.free) freeSlot.appendChild(card);
      else dhikrList.appendChild(card);
    });
  }

  function renderCounter() {
    const a = getActive();
    activeNameEl.textContent = a.name;

    if (a.target) {
      activeSubEl.textContent = `Hedef: ${a.target}`;
      targetTitleEl.textContent = "Hedef";
      targetLabelEl.textContent = String(a.target);
    } else {
      activeSubEl.textContent = "Serbest sayaç";
      targetTitleEl.textContent = "Mod";
      targetLabelEl.textContent = "∞";
    }

    countEl.textContent = String(a.today);
    todayLabelEl.textContent = String(a.today);
    totalLabelEl.textContent = String(a.total);

    // full text on counter screen
    descBoxEl.textContent = a.desc || "";
  }

  // -------- Actions --------
  function tap() {
    const a = getActive();
    a.today += 1;
    a.total += 1;
    save(state);
    renderCounter();
    renderMenu();
  }

  function undo() {
    const a = getActive();
    a.today = Math.max(0, a.today - 1);
    a.total = Math.max(0, a.total - 1);
    save(state);
    renderCounter();
    renderMenu();
  }

  function resetToday() {
    const a = getActive();
    if (!confirm("Bugünkü sayım sıfırlansın mı?")) return;
    a.today = 0;
    save(state);
    renderCounter();
    renderMenu();
  }

  function resetAllData() {
    if (!confirm("Tüm veriler silinsin mi? (Sayaçlar, toplamlar, hepsi)")) return;
    localStorage.removeItem(KEY);
    state = structuredClone(DEFAULT_STATE);
    save(state);
    renderMenu();
    switchToMenu();
  }

  // -------- Events --------
  ringTap.addEventListener("click", tap);
  ringTap.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      tap();
    }
  });

  undoBtn.addEventListener("click", undo);
  resetBtn.addEventListener("click", resetToday);
  backBtn.addEventListener("click", () => {
    switchToMenu();
    renderMenu();
  });

  resetDataBtn.addEventListener("click", resetAllData);

  // -------- Init --------
  save(state);
  renderMenu();
  switchToMenu();
});
