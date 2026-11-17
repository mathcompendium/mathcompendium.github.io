/* Math Compendium site. Copied into the site by the Hub's tools/site.py from tools/site/site.js: edit it there. */

(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Watched examples, saved in this browser only. A video page adds itself when it is opened;
     the number circles here let a visitor mark or unmark one by hand. */
  var KEY = 'mc-watched', seen = {};
  function load() { try { seen = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { seen = {}; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(seen)); } catch (e) {} }
  var rows = $$('.ex.posted'), card = $('#resume'), link = card && $('.resume-link', card);

  function paint() {
    rows.forEach(function (r) {
      var on = !!seen[r.id], b = $('.num', r);
      r.classList.toggle('watched', on);
      b.setAttribute('aria-pressed', on);
      b.textContent = on ? '\u2713' : r.getAttribute('data-n');
      b.setAttribute('aria-label', (on ? 'Unmark' : 'Mark') + ' Example ' + r.getAttribute('data-n') + ' as watched');
      $('.watch span', r).textContent = on ? 'Watch again' : 'Watch';
    });
    $$('.section').forEach(function (s) {
      var rs = $$('.ex.posted', s), c = $('.sec-count', s);
      if (!rs.length) { c.hidden = true; return; }
      var d = rs.filter(function (r) { return seen[r.id]; }).length, all = d === rs.length;
      $('.cnt', c).textContent = all ? '\u2713 All ' + d + ' watched' : d + ' of ' + rs.length + ' watched';
      $('.bar span', c).style.width = (100 * d / rs.length) + '%';
      c.classList.toggle('all', all);
    });
    if (!card) return;
    var done = rows.filter(function (r) { return seen[r.id]; }).length;
    var next = rows.filter(function (r) { return !seen[r.id]; })[0];
    card.classList.toggle('complete', !next);
    if (next) {
      $('.k', card).textContent = done ? 'Up next' : 'Start here';
      link.setAttribute('href', $('.ex-title', next).getAttribute('href'));
      $('img', link).src = $('.thumb img', next).src;
      var from = $('.thumb .dur', next), to = $('.dur', link);
      if (to) { to.textContent = from ? from.textContent : ''; to.hidden = !from; }
      $('.where', link).textContent = 'Section ' + next.getAttribute('data-sec') + ' \u00b7 Example ' + next.getAttribute('data-n');
      $('.t', link).textContent = $('.ex-title', next).textContent;
    } else {
      $('.k', card).textContent = '\u2713 All caught up';
      var href = card.getAttribute('data-done-href');
      if (href) {
        link.setAttribute('href', href);
        $('.where', link).textContent = 'Next step';
        $('.t', link).textContent = card.getAttribute('data-done-text');
      } else {
        link.removeAttribute('href');
        $('.where', link).textContent = '';
        $('.t', link).textContent = 'You have watched every example posted so far.';
      }
    }
    $('.resume-meta', card).textContent = done + ' of ' + rows.length + ' examples watched';
  }
  rows.forEach(function (r) {
    $('.num', r).addEventListener('click', function () { seen[r.id] = !seen[r.id]; save(); paint(); });
  });
  var reset = $('#resetSeen');
  if (reset) reset.addEventListener('click', function () { seen = {}; save(); paint(); });
  /* Coming back from a video page (also with the Back button) picks up the new checkmark. */
  window.addEventListener('pageshow', function () { load(); paint(); });
  load(); paint();

  /* Search */
  var box = $('.search'), all = $$('.ex'), empty = $('.empty');
  if (box) box.addEventListener('input', function () {
    var q = box.value.trim().toLowerCase(), any = false;
    all.forEach(function (r) {
      var hit = !q || r.getAttribute('data-search').indexOf(q) !== -1;
      r.hidden = !hit;
      if (hit) any = true;
    });
    $$('.group').forEach(function (g) { g.hidden = !$$('.ex', g).some(function (r) { return !r.hidden; }); });
    $$('.section').forEach(function (s) {
      var vis = $$('.ex', s).some(function (r) { return !r.hidden; });
      s.hidden = !vis;
      if (q && vis) s.open = true;
    });
    $$('.chapter').forEach(function (c) { c.hidden = !$$('.section', c).some(function (s) { return !s.hidden; }); });
    empty.style.display = any ? 'none' : 'block';
  });
})();

(function () {
  var b = document.getElementById('themeBtn'), root = document.documentElement;
  if (!b) return;
  function light() { return root.getAttribute('data-theme') === 'light'; }
  function label() { b.textContent = light() ? 'Dark mode' : 'Light mode'; }
  b.addEventListener('click', function () {
    var next = light() ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('mc-theme', next); } catch (e) {}
    label();
  });
  label();
})();

