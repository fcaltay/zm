document.addEventListener("DOMContentLoaded", () => {

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

  const DEFAULT_STATE = {
    dhikrs: [

      {
        id: "tefriciye",
        name: "Salât-ı Tefriciye (Nâriye)",
        target: 11,
        today: 0,
        total: 0,
        desc: `
🔤 Okunuş:
Allâhumme salli salâten kâmileten ve sellim selâmen tâmmen alâ Seyyidinâ Muhammedinillezî tenhallü bihil ukadü ve tenfericu bihil kürebü ve tukdâ bihil havâicu ve tünâlü bihir reğâibü ve hüsnül havâtimi ve yustaskal ğamâmu bi vechihil kerîm ve alâ âlihî ve sahbihî fî külli lemhatin ve nefesin bi adedi külli ma’lûmin lek.
`
      },

      {
        id: "free",
        name: "Serbest Sayaç",
        free: true,
        target: null,
        today: 0,
        total: 0,
        desc: "Hedefsiz sayaç. İstediğin kadar say."
      },

      {
        id: "ayetel_kursi",
        name: "Ayetel Kürsi",
        target: 3,
        today: 0,
        total: 0,
        desc: `
🔤 Okunuş:

Bismillâhirrahmânirrahîm.

Allâhu lâ ilâhe illâ huvel hayyul kayyûm.
Lâ te’huzühû sinetün velâ nevm.
Lehû mâ fis semâvâti ve mâ fil ard.
Men zellezî yeşfeu indehû illâ bi iznih.
Ya’lemu mâ beyne eydîhim ve mâ halfehum.
Ve lâ yuhîtûne bi şey’in min ilmihî illâ bi mâ şâe.
Vesia kürsiyyühüs semâvâti vel ard.
Ve lâ yeûdühû hıfzuhumâ.
Ve huvel aliyyül azîm.
`
      },

      {
        id: "fetih",
        name: "Fetih Suresi",
        target: 1,
        today: 0,
        total: 0,
        desc: `
🔤 Okunuş:

Bismillâhirrahmanirrahim.

1. İnnâ fetahnâ leke fethan mubînâ(mubînen).

2. Li yagfira lekallâhu mâ tekaddeme min zenbike ve mâ teahhara ve yutimme ni’metehu aleyke ve yehdiyeke sırâtan mustekîmâ(mustekîmen).

3. Ve yansurakallâhu nasran azîzâ(azîzen).

4. Huvellezî enzeles sekînete fî kulûbil mu’minîne li yezdâdû îmânen mea îmânihim, ve lillâhi cunûdus semâvâti vel ard(ardı), ve kânallâhu alîmen hakîmâ(hakîmen).

5. Li yudhilel mu’minîne vel mu’minâti cennâtin tecrî min tahtihâl enhâru hâlidîne fîhâ ve yukeffira anhum seyyiâtihim, ve kâne zâlike indallâhi fevzen azîmâ(azîmen).

6. Ve yuazzibel munâfikîne vel munâfikâti vel muşrikîne vel muşrikâtiz zânnîne billâhi zannes sev’i aleyhim dâiratus sev’i, ve gadiballâhu aleyhim ve leanehum ve eadde lehum cehennem(cehenneme), ve sâet masîrâ(masîren).

7. Ve lillâhi cunûdus semâvâti vel ard(ardı), ve kânallâhu azîzen hakîmâ(hakîmen).

8. İnnâ erselnâke şâhiden ve mubeşşiran ve nezîrâ(nezîren).

9. Li tu’minû billâhi ve resûlihî ve tuazzirûhu ve tuvakkırûhu, ve tusebbihûhu bukraten ve asîlâ(asîlen).

10. İnnellezîne yubâyiûneke innemâ yubâyiûnallâh(yubâyiûnallâhe), yedullâhi fevka eydîhim, fe men nekese fe innemâ yenkusu alâ nefsihî, ve men evfâ bi mâ âhede aleyhullâhe fe se yu’tîhi ecran azîmâ(azîmen).

11. Se yekûlu lekel muhallefûne minel a’râbi şegaletnâ emvâlunâ ve ehlûnâ festagfir lenâ, yekûlûne bi elsinetihim mâ leyse fî kulûbihim, kul fe men yemliku lekum minallâhi şey’en in erâde bikum darran ev erâde bikum nef’â(nef’en), bel kânallâhu bi mâ ta’melûne habîrâ(habîran).

12. Bel zanentum en len yenkaliber resûlu vel mu’minûne ilâ ehlîhim ebeden ve zuyyine zâlike fî kulûbikum ve zanentum zannes sev’i ve kuntum kavmen bûrâ(bûran).

13. Ve men lem yu’min billâhi ve resûlihî fe innâ a’tednâ lil kâfirîne saîrâ(saîran).

14. Ve lillâhi mulkus semâvâti vel ard(ardı), yagfiru li men yeşâu ve yuazzibu men yeşâu, ve kânallahu gafûran rahîmâ(rahîmen).

15. Se yekûlul muhallefûne izântalaktum ilâ megânime li te’huzûhâ zerûnâ nettebi’kum, yurîdûne en yubeddilû kelâmallâh(kelâmallâhi), kul len tettebiûnâ kezâlikum kâlallâhu min kablu, fe se yekûlûne bel tahsudûnenâ, bel kânû lâ yefkahûne illâ kalîlâ(kalîlen).

16. Kul lil muhallefîne minel a’râbi se tud’avne ilâ kavmin ulî be’sin şedîdin tukâtilûnehum ev yuslimûn(yuslimûne), fe in tutîû yu’tikumullâhu ecran hasenâ(hasenen), ve in tetevellev kemâ tevelleytum min kablu yuazzibkum azâben elîmâ(elîmen).

17. Leyse alâl a’mâ haracun ve lâ alâl a’raci haracun ve lâ alâl marîdı haracun, ve men yutııllahe ve resûlehu yudhılhu cennâtin tecrî min tahtihâl enhâru, ve men yetevelle yuazzibhu azâben elîmâ(elîmen).

18. Lekad radiyallâhu anil mu’minîne iz yubâyiûneke tahteş şecerati fe alime mâ fî kulûbihim fe enzeles sekînete aleyhim ve esâbehum fethan karîbâ(karîben).

19. Ve megânime kesîraten ye’huzûnehâ, ve kânallâhu azîzen hakîmâ(hakîmen).

20. Vaadekumullâhu megânime kesîraten te’huzûnehâ fe accele lekum hâzihî ve keffe eydiyen nâsi ankum, ve li tekûne âyeten lil mu’minîne ve yehdiyekum sırâtan mustakîmâ(mustakîmen).

21. Ve uhrâ lem takdirû aleyhâ kad ehâtallâhu bihâ, ve kânallâhu alâ kulli şey’in kadîrâ(kadîran).

22. Ve lev kâtelekumullezîne keferû le vellevûl edbâra summe lâ yecidûne velîyyen ve lâ nasîrâ( nasîran).

23. Sunnetallâhilletî kad halet min kablu, ve len tecide li sunnetillâhi tebdîlâ(tebdîlen).

24. Ve huvellezî keffe eydiyehum ankum ve eydiyekum anhum bi batni mekkete min ba’di en azferakum aleyhim ve kânallâhu bi mâ ta’melûne basîrâ(basîran).

25. Humullezîne keferû ve saddûkum anil mescidil harâmi vel hedye ma’kûfen en yebluga mahıllehu, ve lev lâ ricâlun mu’minûne ve nisâun mu’minâtun lem ta’lemûhum en tetaûhum fe tusîbekum minhum maarratun bi gayri ilmin, li yudhılallâhu fî rahmetihî men yeşâu, lev tezeyyelû le azzebnâllezîne keferû minhum azâben elîmâ(elîmen).

26. İz cealellezîne keferû fî kulûbihimul hamiyyete hamiyyetel câhiliyyeti fe enzelallâhu sekînetehu alâ resûlihî ve alel mu’minîne ve elzemehum kelimetet takvâ ve kânû e hakka bihâ ve ehlehâ ve kânallâhu bi kulli şey’in alîmâ(alîmen).

27. Lekad sadakallâhu resûlehur ru’yâ bil hakkı, le tedhulunnel mescidel harâme inşâallâhu âminîne muhallikîne ruûsekum ve mukassırîne lâ tehâfûn(tehâfûne), fe alime mâ lem ta’lemû fe ceale min dûni zâlike fethan karîbâ(karîben).

28. Huvellezî ersele resûlehu bil hudâ ve dînil hakkı li yuzhirahu alâd dîni kullihî, ve kefâ billâhi şehîdâ(şehîden).

29. Muhammedun resûlullâh(resûlullâhi), vellezîne meahû eşiddâu alâl kuffâri ruhamâu beynehum terâhum rukkean succeden yebtegûne fadlen minallâhi ve rıdvânen sîmâhum fî vucûhihim min eseris sucûd(sucûdi), zâlike meseluhum fît tevrât(tevrâti), ve meseluhum fîl incîl(incîli), ke zer’in ahrace şat’ehu fe âzerehu festagleza festevâ alâ sûkıhî yu’cibuz zurrâa, li yagîza bihimul kuffâr(kuffâra), vaadallâhullezîne âmenû ve amilûs sâlihâti minhum magfiraten ve ecren azîmâ(azîmen).
`
      },

      {
        id: "nazar_duasi",
        name: "Nazar Duası",
        target: 7,
        today: 0,
        total: 0,
        desc: `
🔤 Okunuş:

Eûzü bi kelimâtillâhi’t-tâmmeti min kulli şeytânin ve hâmmeh
ve min kulli aynin lâmmeh.
`
      },

      {
        id: "ihlas_felak_nas",
        name: "İhlas + Felak + Nas",
        target: 3,
        today: 0,
        total: 0,
        desc: `
🔤 Okunuş:

Bismillâhirrahmânirrahîm.

Kul hüvallâhu ehad.
Allâhü's-samed.
Lem yelid ve lem yûled.
Ve lem yekun lehû kufuven ehad.

Bismillâhirrahmânirrahîm.

Kul eûzü bi rabbil felak.
Min şerri mâ halak.
Ve min şerri ğâsikın izâ vekab.
Ve min şerri’n-neffâsâti fil ukad.
Ve min şerri hâsidin izâ hased.

Bismillâhirrahmânirrahîm.

Kul eûzü bi rabbin nâs.
Melikin nâs.
İlâhin nâs.
Min şerril vesvâsil hannâs.
Ellezî yuvesvisu fî sudûrin nâs.
Minel cinneti ven nâs.
`
      }

    ],
    activeId: "free"
  };

  let state = load();
  if (!state || !Array.isArray(state.dhikrs)) {
    state = structuredClone(DEFAULT_STATE);
  }

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

  function renderMenu() {
    freeSlot.innerHTML = "";
    dhikrList.innerHTML = "";

    state.dhikrs.forEach((d) => {
      const card = document.createElement("div");
      card.className = "card";

      const todayPart = d.target
        ? `${d.today} / ${d.target}`
        : `${d.today} / ∞`;

      const preview = (d.desc || "")
        .split("\n")
        .slice(0, 2)
        .join("\n");

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
      targetLabelEl.textContent = a.target;
    } else {
      activeSubEl.textContent = "Serbest sayaç";
      targetTitleEl.textContent = "Mod";
      targetLabelEl.textContent = "∞";
    }

    countEl.textContent = a.today;
    todayLabelEl.textContent = a.today;
    totalLabelEl.textContent = a.total;

    descBoxEl.textContent = a.desc || "";
  }

  function tap() {
    const a = getActive();
    a.today++;
    a.total++;
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
    if (!confirm("Tüm veriler silinsin mi?")) return;
    localStorage.removeItem(KEY);
    state = structuredClone(DEFAULT_STATE);
    save(state);
    renderMenu();
    switchToMenu();
  }

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

  save(state);
  renderMenu();
  switchToMenu();

});
