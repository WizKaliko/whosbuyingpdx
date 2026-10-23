/* Who's Buying PDX: "get the guide by email" box at the end of reading pages.
   Posts to the same sign-up sheet as the download gate, and unlocks downloads in this browser.
   Hidden for people who already signed up. Counts views and sign-ups in GoatCounter (no personal data). */
(function () {
  var GATE_URL = 'https://script.google.com/macros/s/AKfycbwHZdQaE4RJPdgfGQrR3dM8EdYycf2NWjjWpF3paCUf3e3mw1ugWMe-aRnlIYBvQ0yLfw/exec';
  var KEY = 'wbp_signed_up';
  var where = (location.pathname.replace(/^\/|\.html$/g, '') || 'home').replace(/\//g, '-');

  function signedUp() {
    try { if (localStorage.getItem(KEY) === '1') return true; } catch (e) {}
    try { if (sessionStorage.getItem(KEY) === '1') return true; } catch (e) {}
    return /(?:^|;\s*)wbp_su=1/.test(document.cookie);
  }
  function remember() {
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    try { document.cookie = 'wbp_su=1; max-age=31536000; path=/; SameSite=Lax'; } catch (e) {}
  }
  function gc(p) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: p, title: p, event: true }); } catch (e) {} }
  function send(data) {
    var body = new URLSearchParams(data);
    try { if (navigator.sendBeacon && navigator.sendBeacon(GATE_URL, body)) return; } catch (e) {}
    try { fetch(GATE_URL, { method: 'POST', mode: 'no-cors', body: body, keepalive: true }).catch(function () {}); } catch (e) {}
  }

  if (signedUp()) return;
  var fs = document.querySelectorAll('footer'), foot = fs[fs.length - 1];
  if (!foot) return;
  var p = foot.parentElement, anchor = (p && p.classList.contains('wrap') && p.children.length === 1) ? p : foot;

  var css = '.wbp-su{border:2px solid var(--ink);background:var(--paper-2);color:var(--ink);padding:20px;margin:40px auto 8px;max-width:1060px;box-sizing:border-box;display:grid;gap:10px}' +
    '.wbp-su-wrap{padding-inline:16px}' +
    '.wbp-su h2{font-family:var(--f-display,inherit);font-size:clamp(22px,3vw,28px);line-height:1.1;margin:0}' +
    '.wbp-su p{margin:0;font-size:15px;color:var(--ink-2)}' +
    '.wbp-su form{display:flex;gap:8px;flex-wrap:wrap}' +
    '.wbp-su input[type=email]{font:16px var(--f-body,inherit);padding:11px 12px;border:2px solid var(--ink);background:var(--paper);color:var(--ink);flex:1 1 220px;min-width:0;border-radius:0}' +
    '.wbp-su button{font:700 15px var(--f-body,inherit);padding:11px 18px;border:2px solid var(--ink);background:var(--ink);color:var(--paper);cursor:pointer;border-radius:0}' +
    '.wbp-su .hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}' +
    '.wbp-su .msg{font-size:14px;min-height:1em}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var wrap = document.createElement('div'); wrap.className = anchor === foot ? '' : 'wbp-su-wrap';
  wrap.innerHTML =
    '<section class="wbp-su" aria-labelledby="wbp-su-h">' +
    '<h2 id="wbp-su-h">Get the voter guide before you fill out your ballot.</h2>' +
    '<p>We&rsquo;ll email the guide and any updates before Nov 3. No texts. Unsubscribe anytime.</p>' +
    '<form novalidate><label class="hp" for="wbp-su-em">Email</label>' +
    '<input id="wbp-su-em" type="email" name="email" placeholder="you@example.com" autocomplete="email" required aria-label="Email">' +
    '<span class="hp" aria-hidden="true"><input type="text" name="website" tabindex="-1" autocomplete="off"></span>' +
    '<button type="submit">Email me the guide</button></form>' +
    '<span class="msg" aria-live="polite"></span>' +
    '</section>';
  anchor.parentNode.insertBefore(wrap, anchor);

  var form = wrap.querySelector('form'), msg = wrap.querySelector('.msg');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      if (es.some(function (x) { return x.isIntersecting; })) { gc('signup-box/seen/' + where); io.disconnect(); }
    }, { threshold: 0.5 });
    io.observe(wrap.firstChild);
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.textContent = 'Please enter a valid email.'; form.email.focus(); return; }
    send({ email: email, zip: '', website: form.website.value, updates: 'yes', file: 'signup', page: location.pathname });
    remember();
    gc('signup-box/signed-up/' + where);
    form.hidden = true;
    msg.textContent = "You're signed up. We'll send the guide before Nov 3, and downloads on this site are unlocked.";
  });
})();
