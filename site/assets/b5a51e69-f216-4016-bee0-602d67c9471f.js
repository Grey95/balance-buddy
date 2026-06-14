/* ============================================================
   BALANCE BUDDY — site interactions
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- nav + scroll progress + back-to-top ---------- */
  var nav = document.getElementById('nav');
  var progress = document.getElementById('progress');
  var totop = document.getElementById('totop');
  function onScroll() {
    var st = window.scrollY || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (st / h) * 100 : 0) + '%';
    if (nav) nav.classList.toggle('scrolled', st > 24);
    if (totop) totop.classList.toggle('show', st > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- hero kinetic reveal ---------- */
  var hero = document.querySelector('.hero');
  if (hero && !reduce) {
    hero.classList.add('anim');
    setTimeout(function () { hero.classList.add('lit'); }, 90);
  }

  /* ---------- reveal: load + scroll position + IO + safety net ---------- */
  var reveals = document.querySelectorAll('.reveal');
  function showEl(el) { el.classList.add('in'); }
  function revealInView() {
    reveals.forEach(function (el) {
      if (el.classList.contains('in')) return;
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.94 && r.bottom > 0) showEl(el);
    });
  }
  if (reduce) {
    reveals.forEach(showEl);
  } else {
    if ('IntersectionObserver' in window) {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { showEl(e.target); ro.unobserve(e.target); }
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
      reveals.forEach(function (el) { ro.observe(el); });
    }
    window.addEventListener('load', revealInView);
    window.addEventListener('scroll', revealInView, { passive: true });
    revealInView();
    setTimeout(revealInView, 180);
    setTimeout(revealInView, 600);
  }

  /* ---------- count-up stats ---------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var hasU = el.querySelector('.u');
    var valSpan = el.querySelector('.cv');
    var dur = 1400, start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var v = Math.round(target * eased);
      if (valSpan) { valSpan.textContent = v; }
      else if (hasU) { el.childNodes[0].nodeValue = v; }
      else { el.firstChild ? (el.childNodes[0].nodeValue = v + suffix) : (el.textContent = v + suffix); }
      if (p < 1) requestAnimationFrame(frame);
      else {
        if (valSpan) valSpan.textContent = target;
        else if (!hasU) el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(frame);
  }
  var nums = document.querySelectorAll('.num[data-count]');
  if ('IntersectionObserver' in window && !reduce) {
    var no = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); no.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { no.observe(el); });
    // also fire for any already in view at load (frozen-IO fallback)
    window.addEventListener('load', function () {
      nums.forEach(function (el) {
        if (el.dataset.counted) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) { el.dataset.counted = '1'; countUp(el); no.unobserve(el); }
      });
    });
  }

  /* ---------- roadmap spine draw + node activation ---------- */
  var timeline = document.getElementById('timeline');
  var spineFill = document.getElementById('spineFill');
  var nodes = Array.prototype.slice.call(document.querySelectorAll('.tnode'));
  function spine() {
    if (!timeline || !spineFill) return;
    var rect = timeline.getBoundingClientRect();
    var vh = window.innerHeight;
    var anchor = vh * 0.52;
    var prog = (anchor - rect.top) / rect.height;
    prog = Math.max(0, Math.min(1, prog));
    spineFill.style.height = (prog * 100) + '%';
    var fillY = rect.top + rect.height * prog;
    nodes.forEach(function (n) {
      var dot = n.querySelector('.dot');
      var dr = dot.getBoundingClientRect();
      n.classList.toggle('active', dr.top + dr.height / 2 <= fillY + 4);
    });
  }
  if (!reduce) {
    window.addEventListener('scroll', spine, { passive: true });
    window.addEventListener('resize', spine);
    spine();
  } else {
    if (spineFill) spineFill.style.height = '100%';
    nodes.forEach(function (n) { n.classList.add('active'); });
  }

  /* ---------- outcome cards 3D tilt ---------- */
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.ocard').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(800px) rotateX(' + (-py * 5).toFixed(2) + 'deg) rotateY(' + (px * 6).toFixed(2) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* ---------- duplicate ticker for seamless loop ---------- */
  var ticker = document.getElementById('ticker');
  if (ticker) { ticker.innerHTML += ticker.innerHTML; }

  /* ---------- hero automation ledger ---------- */
  var ledgerRows = document.getElementById('ledgerRows');
  var hoursEl = document.getElementById('hoursSaved');
  var TASKS = [
    { t: 'GST reconciliation', s: '318 invoice entries', r: 'Reconciled', h: 6 },
    { t: 'Audit sampling', s: 'FY24 general ledger', r: 'Sampled', h: 4 },
    { t: 'Annual report analysis', s: '142-page filing', r: 'Summarised', h: 5 },
    { t: 'MIS dashboard', s: 'Q3 management report', r: 'Generated', h: 7 },
    { t: 'Tax research', s: 'Section 80 queries', r: 'Answered + sourced', h: 3 },
    { t: 'Compliance check', s: 'TDS return draft', r: 'Validated', h: 4 },
    { t: 'Invoice extraction', s: '90 vendor PDFs', r: 'Extracted', h: 5 },
    { t: 'Variance commentary', s: 'budget vs. actuals', r: 'Drafted', h: 4 }
  ];
  var MAX_ROWS = 4;
  var idx = 0, hours = 0;

  function buildRow(task, n) {
    var row = document.createElement('div');
    row.className = 'lrow';
    row.innerHTML =
      '<span class="ix">' + String(n).padStart(2, '0') + '</span>' +
      '<div class="task"><div class="tt">' + task.t + '</div><div class="ts">' + task.s + '</div></div>' +
      '<span class="state"><span class="spin"></span>Processing</span>';
    return row;
  }
  function settleRow(row, task) {
    var st = row.querySelector('.state');
    st.innerHTML = '<span class="check">✓</span>' + task.r;
    row.classList.add('done');
  }
  function pushTask() {
    if (!ledgerRows) return;
    var task = TASKS[idx % TASKS.length];
    idx++;
    var row = buildRow(task, idx);
    ledgerRows.appendChild(row);
    requestAnimationFrame(function () { row.classList.add('show'); });
    setTimeout(function () { settleRow(row, task); animateHours(task.h); }, 1100);
    // trim
    while (ledgerRows.children.length > MAX_ROWS) {
      ledgerRows.removeChild(ledgerRows.firstChild);
    }
  }
  function animateHours(add) {
    var from = hours, to = hours + add; hours = to;
    var start = null, dur = 700;
    function fr(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var v = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (hoursEl) hoursEl.textContent = String(v).padStart(2, '0');
      if (p < 1) requestAnimationFrame(fr);
    }
    requestAnimationFrame(fr);
  }
  if (ledgerRows && !reduce) {
    // seed a couple instantly settled, then loop
    pushTask();
    setTimeout(pushTask, 700);
    setInterval(pushTask, 2300);
  } else if (ledgerRows) {
    TASKS.slice(0, MAX_ROWS).forEach(function (task, i) {
      var row = buildRow(task, i + 1);
      ledgerRows.appendChild(row);
      row.classList.add('show');
      settleRow(row, task);
      hours += task.h;
    });
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faqi .q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faqi.open').forEach(function (o) { if (o !== item) o.classList.remove('open'); });
      item.classList.toggle('open', !isOpen);
    });
  });

  /* ---------- safety net: nothing stays invisible ---------- */
  setTimeout(function () {
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) { el.style.transition = 'none'; el.classList.add('in'); });
  }, 2400);
})();
