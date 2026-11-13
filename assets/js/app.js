/* 余烬法典 — 站点通用逻辑与页面渲染 */
(function () {
  "use strict";

  const W = WORKS;
  const C = CHARACTERS_PART1.concat(CHARACTERS_PART2);
  const E = EQUIPMENT;
  const L = LORE;
  const WM = {};
  W.forEach(function (w) { WM[w.id] = w; });

  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const $ = function (s, r) { return (r || document).querySelector(s); };
  const $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  const esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  const q = function (k) { return new URLSearchParams(location.search).get(k); };

  /* ── 纹章 ───────────────────────────────────────── */
  const SEAL = '<svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" stroke="#c9a227" stroke-width="1">' +
    '<circle cx="20" cy="20" r="18" opacity=".55"/><circle cx="20" cy="20" r="14" opacity=".35"/>' +
    '<path d="M20 3 L34 20 L20 37 L6 20 Z" opacity=".55"/>' +
    '<path d="M20 11 C16 16 17 20 20 24 C23 20 24 16 20 11 Z" fill="#c9a227" stroke="none" opacity=".85"/>' +
    '<path d="M20 24 L20 30 M14 20 L9 20 M26 20 L31 20" opacity=".7"/></svg>';

  function sigil(key) {
    var n = 0;
    for (var i = 0; i < key.length; i++) n = (n * 31 + key.charCodeAt(i)) % 997;
    var a = n % 4, rot = n % 90;
    var inner = [
      '<circle cx="24" cy="24" r="15"/><circle cx="24" cy="24" r="9"/><path d="M24 4 L24 44 M4 24 L44 24"/>',
      '<path d="M24 4 L44 24 L24 44 L4 24 Z"/><path d="M24 11 L37 24 L24 37 L11 24 Z"/><circle cx="24" cy="24" r="3"/>',
      '<path d="M8 40 Q24 2 40 40 M12 40 Q24 10 36 40"/><circle cx="24" cy="24" r="3"/>',
      '<circle cx="24" cy="24" r="16"/><path d="M24 8 L24 40 M8 24 L40 24 M13 13 L35 35 M35 13 L13 35"/>'
    ][a];
    return '<svg class="sigil" viewBox="0 0 48 48" fill="none" stroke="#c9a227" stroke-width=".9" style="transform:rotate(' + rot + 'deg)">' + inner + '</svg>';
  }

  /* ── 头部 / 页脚 ────────────────────────────────── */
  var navItems = [
    ["index.html", "首页"], ["works.html", "作品"], ["characters.html", "人物志"],
    ["equipment.html", "器物志"], ["lore.html", "世界观"], ["about.html", "关于本站"]
  ];
  function headHTML() {
    var links = navItems.map(function (it) {
      var on = (page === it[0]) || (page === "work.html" && it[0] === "works.html");
      return '<a href="' + it[0] + '" class="' + (on ? "on" : "") + '">' + it[1] + '</a>';
    }).join("");
    return '<header class="site-head"><div class="wrap head-in">' +
      '<a class="brand" href="index.html"><span class="seal">' + SEAL + '</span>' +
      '<span class="brand-txt"><strong>余烬法典</strong><small>THE ASHEN CODEX</small></span></a>' +
      '<button class="menu-btn" id="menuBtn" aria-label="菜单">☰</button>' +
      '<nav class="nav" id="nav">' + links + '</nav></div></header>';
  }
  function footHTML() {
    return '<footer class="site-foot"><div class="wrap"><div class="foot-grid">' +
      '<div><h5>ABOUT THE CODEX</h5><p>余烬法典是一部非官方的魂系世界观索引，收录黑暗之魂三部曲、《艾尔登法环》、《只狼》与《血源诅咒》的作品、人物、器物与设定，供同好查阅与考据。</p></div>' +
      '<div><h5>INDEX</h5>' + navItems.slice(1, 5).map(function (it) { return '<a href="' + it[0] + '">' + it[1] + '</a>'; }).join("") + '</div>' +
      '<div><h5>DISCLAIMER</h5><p>站内配图为原创 AI 概念图，非官方原画。游戏名称、角色与设定之权利归各权利人所有。本站为爱好者编纂之非商业资料页。</p><a href="about.html">查看资料来源与编写原则 →</a></div>' +
      '</div><div class="foot-bottom"><span>© 2026 THE ASHEN CODEX · 余烬法典</span><span>「纵使火焰熄灭，故事仍应被记下。」</span></div></div></footer>';
  }
  var headEl = $("#site-head"), footEl = $("#site-foot");
  if (headEl) headEl.innerHTML = headHTML();
  if (footEl) footEl.innerHTML = footHTML();

  var mb = $("#menuBtn");
  if (mb) mb.addEventListener("click", function () { $("#nav").classList.toggle("open"); });

  /* ── 滚动进度 / 出场动画 / 灰烬 ─────────────────── */
  var bar = document.createElement("div");
  bar.id = "progress";
  document.body.appendChild(bar);
  window.addEventListener("scroll", function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
  }, { passive: true });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  function observe() { $$(".reveal").forEach(function (el) { io.observe(el); }); }

  var heroEl = $(".hero");
  if (heroEl && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ash = "";
    for (var i = 0; i < 22; i++) {
      var sz = (1 + Math.random() * 2.4).toFixed(1);
      ash += '<span class="ash" style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (60 + Math.random() * 50).toFixed(1) + '%;width:' + sz + 'px;height:' + sz + 'px;animation-duration:' + (9 + Math.random() * 12).toFixed(1) + 's;animation-delay:-' + (Math.random() * 18).toFixed(1) + 's"></span>';
    }
    heroEl.insertAdjacentHTML("afterbegin", ash);
  }

  /* ── 弹层 ───────────────────────────────────────── */
  var modal = $("#modal");
  function openModal(html) {
    if (!modal) return;
    $("#modalBox").innerHTML = '<button class="modal-close" id="modalClose" aria-label="关闭">×</button>' + html;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    $("#modalClose").addEventListener("click", closeModal);
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
  if (modal) {
    $(".modal-bg", modal).addEventListener("click", closeModal);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  }

  function entityModal(x, kind) {
    var w = WM[x.work];
    var meta = kind === "c"
      ? [["所属作品", w.short], ["身份", x.role], ["阵营 / 出处", x.faction], ["称号", x.title]]
      : [["所属作品", w.short], ["类别", x.type], ["入手 / 出处", x.origin], ["意义", "剧情关键器物"]];
    var tags = kind === "c" ? (x.tags || []) : [x.type, w.short];
    return '<div class="m-kicker">' + (kind === "c" ? "PERSONA" : "RELIC") + ' · ' + esc(w.en) + '</div>' +
      '<h2>' + esc(x.name) + '</h2><div class="m-en">' + esc(x.en) + '</div>' +
      '<div class="m-meta">' + meta.map(function (m) {
        return '<div><b>' + esc(m[0]) + '</b>' + esc(m[1]) + '</div>';
      }).join("") + '</div>' +
      '<div class="m-body">' + esc(x.desc) + '</div>' +
      '<div class="m-tags">' + tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join("") + '</div>' +
      '<div class="m-link"><a href="work.html?id=' + x.work + '">阅读《' + esc(w.short) + '》完整条目 →</a></div>';
  }
  function bindEntities(scope) {
    $$(".entity", scope).forEach(function (el) {
      el.addEventListener("click", function () {
        var id = el.dataset.id, kind = el.dataset.kind;
        var arr = kind === "c" ? C : E;
        var x = arr.filter(function (o) { return o.id === id; })[0];
        if (x) openModal(entityModal(x, kind));
      });
    });
  }
  function cardHTML(x, kind) {
    var w = WM[x.work];
    var label = kind === "c" ? "人物" : "器物";
    return '<article class="entity reveal" data-id="' + esc(x.id) + '" data-kind="' + kind + '" tabindex="0">' +
      sigil(x.id) +
      '<div class="wk">' + esc(w.en.split(":")[0]) + ' · ' + label + '</div>' +
      '<h3>' + esc(x.name) + '</h3><div class="en">' + esc(x.en) + '</div>' +
      (kind === "e" ? '<span class="type-badge">' + esc(x.type) + '</span>' : '<div class="role">' + esc(x.role) + ' · ' + esc(x.title) + '</div>') +
      '<p class="desc">' + esc(x.desc) + '</p><div class="more">展开条目 ✦</div></article>';
  }
  // 键盘可访问
  document.addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("entity")) {
      e.preventDefault(); e.target.click();
    }
  });

  /* ── 首页 ───────────────────────────────────────── */
  function renderHome() {
    var stats = $("#stats");
    if (stats) stats.innerHTML = [
      [W.length, "部作品"], [C.length, "位人物"], [E.length, "件器物"], [L.length, "条设定"]
    ].map(function (s) { return '<div class="stat"><b>' + s[0] + '</b><span>' + s[1] + '</span></div>'; }).join("");

    var grid = $("#workGrid");
    if (grid) grid.innerHTML = W.map(function (w) {
      return '<a class="work-card reveal" href="work.html?id=' + w.id + '">' +
        '<img src="' + w.image + '" alt="' + esc(w.name) + ' 氛围概念图" loading="lazy">' +
        '<div class="card-in"><div class="idx">' + w.index + ' · ' + esc(w.year) + '</div>' +
        '<h3>' + esc(w.name) + '</h3><div class="en">' + esc(w.en) + '</div>' +
        '<div class="meta"><span>' + esc(w.era) + '</span><span>进入条目 →</span></div></div></a>';
    }).join("");

    var tl = $("#homeTimeline");
    if (tl) tl.innerHTML = RELEASE_TIMELINE.map(function (t) {
      return '<div class="tl-item reveal"><a href="work.html?id=' + t.work + '">' +
        '<div class="yr">' + esc(t.year) + '</div><h4>' + esc(t.label) + '</h4>' +
        '<p>' + esc(t.note) + '</p></a></div>';
    }).join("");

    var them = $("#homeThemes");
    if (them) them.innerHTML = ["初始之火", "传火与轮回", "深渊与人性", "血疗与灵视", "黄金律法", "龙胤与不死", "碎片化叙事", "月光大剑"].map(function (t) {
      return '<div>' + t + '</div>';
    }).join("");
  }

  /* ── 作品总览页 ─────────────────────────────────── */
  function renderWorks() {
    var grid = $("#allWorks");
    if (grid) grid.innerHTML = W.map(function (w) {
      return '<a class="work-card reveal" href="work.html?id=' + w.id + '">' +
        '<img src="' + w.image + '" alt="' + esc(w.name) + '" loading="lazy">' +
        '<div class="card-in"><div class="idx">' + w.index + ' · ' + esc(w.year) + '</div>' +
        '<h3>' + esc(w.name) + '</h3><div class="en">' + esc(w.en) + '</div>' +
        '<div class="meta"><span>' + esc(w.dateNote.slice(0, 22)) + '…</span><span>进入条目 →</span></div></div></a>';
    }).join("");
  }

  /* ── 作品详情页 ─────────────────────────────────── */
  function renderWork() {
    var w = WM[q("id")] || W[0];
    document.title = w.name + " · 余烬法典";
    var hero = $("#workHero");
    if (hero) {
      hero.innerHTML = '<img src="' + w.image + '" alt="' + esc(w.name) + ' 氛围概念图">' +
        '<div class="work-hero-in"><div class="idx">' + w.index + ' · ' + esc(w.year) + ' · ' + esc(w.era) + '</div>' +
        '<h1>' + esc(w.name) + '</h1><div class="en">' + esc(w.en) + '</div>' +
        '<div class="tagline">「' + esc(w.tagline) + '」</div></div>';
    }
    var tabs = '<a href="#story" class="on">剧情与设定</a><a href="#facts">基本信息</a><a href="#people">本作人物</a><a href="#relics">本作器物</a><a href="#links">外部资料</a>';
    var tabEl = $("#workTabs");
    if (tabEl) tabEl.innerHTML = tabs;

    var story = $("#story");
    if (story) story.innerHTML = w.story.map(function (s) {
      return '<section class="story-block reveal"><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></section>';
    }).join("");

    var side = $("#facts");
    if (side) side.innerHTML =
      '<div class="side-card"><h4>RECORD · 基本信息</h4><dl>' +
      [["发售", w.dateNote], ["开发", w.dev], ["发行", w.pub], ["导演", w.director], ["平台", w.platform], ["资料片", w.dlc]].map(function (r) {
        return '<dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd>';
      }).join("") + '</dl></div>' +
      '<div class="side-card"><h4>REGIONS · 主要区域</h4><ul>' + w.regions.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join("") + '</ul></div>' +
      '<div class="side-card"><h4>THEMES · 核心母题</h4><ul>' + w.themes.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join("") + '</ul></div>' +
      '<div class="side-card"><h4>ENDINGS · 结局</h4><ul>' + w.endings.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join("") + '</ul></div>' +
      '<div class="side-card"><h4>FACTS · 补充</h4><dl>' + w.facts.map(function (r) {
        return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>';
      }).join("") + '</dl></div>';

    var cc = C.filter(function (x) { return x.work === w.id; });
    var ec = E.filter(function (x) { return x.work === w.id; });
    var people = $("#people");
    if (people) people.innerHTML =
      '<div class="sec-head" style="text-align:left;margin-bottom:28px"><div class="kicker">PERSONAE</div><h2 style="font-size:27px;margin:8px 0 6px">本作人物</h2><p style="margin:0">共 ' + cc.length + ' 位收录人物，点击卡片查看完整条目。</p></div>' +
      '<div class="card-grid" id="peopleGrid">' + cc.map(function (x) { return cardHTML(x, "c"); }).join("") + '</div>' +
      '<div style="margin-top:26px"><a class="btn ghost" href="characters.html?work=' + w.id + '">在人物志中筛选本作 →</a></div>';
    var relics = $("#relics");
    if (relics) relics.innerHTML =
      '<div class="sec-head" style="text-align:left;margin-bottom:28px"><div class="kicker">RELICS</div><h2 style="font-size:27px;margin:8px 0 6px">重要器物</h2><p style="margin:0">共 ' + ec.length + ' 件收录武器、防具与剧情关键道具。</p></div>' +
      '<div class="card-grid" id="relicsGrid">' + ec.map(function (x) { return cardHTML(x, "e"); }).join("") + '</div>' +
      '<div style="margin-top:26px"><a class="btn ghost" href="equipment.html?work=' + w.id + '">在器物志中筛选本作 →</a></div>';
    var links = $("#links");
    if (links) links.innerHTML =
      '<div class="sec-head" style="text-align:left;margin-bottom:24px"><div class="kicker">SOURCES</div><h2 style="font-size:27px;margin:8px 0 0">外部资料与官方美术</h2></div>' +
      '<div class="notice">本站配图为原创氛围概念图，<strong>不是官方原画或设定稿</strong>。如需查阅官方美术、设定集与原始文本，请移步下列官方页面与资料库。</div>' +
      '<div class="link-list" style="margin-top:22px">' + w.links.map(function (l) {
        return '<a href="' + l[1] + '" target="_blank" rel="noopener">' + esc(l[0]) + '<span>↗</span></a>';
      }).join("") + '</div>';

    // 卡片事件 + 锚点高亮
    var scope = document.body;
    bindEntities(scope);
    $$(".work-tabs a").forEach(function (a) {
      a.addEventListener("click", function () {
        $$(".work-tabs a").forEach(function (b) { b.classList.remove("on"); });
        a.classList.add("on");
      });
    });
  }

  /* ── 人物志 / 器物志 ────────────────────────────── */
  function renderIndex(kind) {
    var arr = kind === "c" ? C : E;
    var grid = $("#grid"), chips = $("#chips"), input = $("#searchInput"), count = $("#count");
    var state = { work: q("work") || "all", text: "" };
    if (!grid) return;

    function chipHTML() {
      var list = [{ id: "all", name: "全部" }].concat(W.map(function (w) { return { id: w.id, name: w.short }; }));
      return list.map(function (o) {
        return '<button class="chip' + (state.work === o.id ? " on" : "") + '" data-w="' + o.id + '">' + esc(o.name) + '</button>';
      }).join("");
    }
    function draw() {
      var t = state.text.trim().toLowerCase();
      var list = arr.filter(function (x) {
        if (state.work !== "all" && x.work !== state.work) return false;
        if (!t) return true;
        return (x.name + " " + x.en + " " + (x.title || "") + " " + (x.role || "") + " " + (x.type || "") + " " + (x.faction || "") + " " + (x.origin || "") + " " + x.desc + " " + (x.tags || []).join(" ")).toLowerCase().indexOf(t) >= 0;
      });
      if (count) count.textContent = "共 " + list.length + " 条" + (state.work !== "all" ? " · " + WM[state.work].short : "") + (t ? " · 关键词「" + state.text.trim() + "」" : "");
      grid.innerHTML = list.length ? list.map(function (x) { return cardHTML(x, kind); }).join("")
        : '<div class="empty">没有找到相应的条目。也许它已被火焰烧成了灰。</div>';
      bindEntities(grid);
      $$(".reveal", grid).forEach(function (el) { el.classList.add("in"); });
    }
    if (chips) {
      chips.innerHTML = chipHTML();
      chips.addEventListener("click", function (e) {
        var b = e.target.closest(".chip");
        if (!b) return;
        state.work = b.dataset.w;
        $$(".chip", chips).forEach(function (c) { c.classList.toggle("on", c === b); });
        draw();
      });
    }
    if (input) input.addEventListener("input", function () { state.text = input.value; draw(); });
    draw();
  }

  /* ── 世界观 ─────────────────────────────────────── */
  function renderLore() {
    var box = $("#loreBox");
    if (!box) return;
    var cats = [];
    L.forEach(function (x) { if (cats.indexOf(x.cat) < 0) cats.push(x.cat); });
    box.innerHTML = cats.map(function (cat) {
      var items = L.filter(function (x) { return x.cat === cat; });
      return '<section class="cat-group reveal"><div class="cat-title"><h3>' + esc(cat) + '</h3><i></i><span>' + items.length + ' ENTRIES</span></div>' +
        '<div class="two-cols-lore">' + items.map(function (x) {
          return '<article class="lore-card"><h4>' + esc(x.name) + '</h4><div class="en">' + esc(x.en) + '</div>' +
            '<p>' + esc(x.text) + '</p><div class="works">关联：' + x.works.map(function (w) { return WM[w].short; }).join(" · ") + '</div></article>';
        }).join("") + '</div></section>';
    }).join("");

    var tl = $("#loreTimeline");
    if (tl) tl.innerHTML = RELEASE_TIMELINE.map(function (t) {
      return '<div class="tl-item reveal"><div class="yr">' + esc(t.year) + '</div><h4>' + esc(t.label) + '</h4><p>' + esc(t.note) + '</p></div>';
    }).join("");
  }

  /* ── 关于 / 美术档案 ────────────────────────────── */
  function renderAbout() {
    var g = $("#gallery");
    if (g) g.innerHTML = ART_NOTES.map(function (a) {
      return '<figure class="reveal"><img src="assets/img/' + a.file + '" alt="' + esc(a.title) + '" loading="lazy">' +
        '<figcaption><b>' + esc(a.title) + '</b><small>' + esc(a.work) + '</small><p>' + esc(a.note) + '</p></figcaption></figure>';
    }).join("");
    var s = $("#sources");
    if (s) s.innerHTML = SOURCES.map(function (x) {
      return '<div class="source-row"><b>' + esc(x.name) + '</b><p>' + esc(x.desc) + '</p>' +
        (x.url ? '<a href="' + x.url + '" target="_blank" rel="noopener">访问 ↗</a>' : '') + '</div>';
    }).join("");
    var n = $("#notes");
    if (n) n.innerHTML = NOTES.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("");
  }

  /* ── 启动 ───────────────────────────────────────── */
  var routes = {
    "index.html": renderHome, "": renderHome,
    "works.html": renderWorks, "work.html": renderWork,
    "characters.html": function () { renderIndex("c"); },
    "equipment.html": function () { renderIndex("e"); },
    "lore.html": renderLore, "about.html": renderAbout
  };
  (routes[page] || renderHome)();
  observe();
})();
