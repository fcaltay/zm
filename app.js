document.addEventListener("DOMContentLoaded", () => {
  // Simple in-memory list (no localStorage yet)
  const dhikrs = [
    { id: "free", name: "Serbest Sayaç", free: true, today: 0, total: 0, desc: "Hedefsiz sayaç. İstediğin kadar say." },
    { id: "latif", name: "Ya Latif (c.c.)", target: 100, today: 0, total: 0, desc: "Rızık bolluğu, ferahlık, huzur için okunur." },
    { id: "safi", name: "Ya Şâfi (c.c.)", target: 100, today: 0, total: 0, desc: "Şifa için okunur." },
    { id: "tefriciye", name: "Salât-ı Tefriciye (Nâriye)", target: 11, today: 0, total: 0, desc: "Sıkıntıların açılması ve ferahlık için okunur." }
  ];

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

  let active = dhikrs[0];

  function switchToMenu() {
    counterView.classList.add("hidden");
    menuView.classList.remove("hidden");
  }

  function switchToCounter() {
    menuView.classList.add("hidden");
    counterView.classList.remove("hidden");
    renderCounter();
  }

  function renderMenu() {
    freeSlot.innerHTML = "";
    dhikrList.innerHTML = "";

    dhikrs.forEach((d) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="title">${d.name}</div>
        <div class="meta">Bugün: <b>${d.today}</b>${d.target ? " / " + d.target : " / ∞"} · Toplam: <b>${d.total}</b></div>
        <div class="descPreview">${d.desc}</div>
      `;

      card.addEventListener("click", () => {
        active = d;
        switchToCounter();
      });

      if (d.free) freeSlot.appendChild(card);
      else dhikrList.appendChild(card);
    });
  }

  function renderCounter() {
    activeNameEl.textContent = active.name;
    activeSubEl.textContent = active.target ? `Hedef: ${active.target}` : "Serbest sayaç";

    countEl.textContent = String(active.today);
    todayLabelEl.textContent = String(active.today);
    totalLabelEl.textContent = String(active.total);

    if (active.target) {
      targetTitleEl.textContent = "Hedef";
      targetLabelEl.textContent = String(active.target);
    } else {
      targetTitleEl.textContent = "Mod";
      targetLabelEl.textContent = "∞";
    }

    descBoxEl.textContent = active.desc;
  }

  function tap() {
    active.today += 1;
    active.total += 1;
    renderCounter();
    renderMenu();
  }

  function undo() {
    active.today = Math.max(0, active.today - 1);
    active.total = Math.max(0, active.total - 1);
    renderCounter();
    renderMenu();
  }

  function resetToday() {
    active.today = 0;
    renderCounter();
    renderMenu();
  }

  // Events
  ringTap.addEventListener("click", tap);
  undoBtn.addEventListener("click", undo);
  resetBtn.addEventListener("click", resetToday);
  backBtn.addEventListener("click", switchToMenu);

  // Initial render
  renderMenu();
  switchToMenu();
});
