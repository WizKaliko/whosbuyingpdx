/* Who's Buying PDX download gate.
   Graphics and the guide stay visible; downloading asks for an email once per browser.
   Sign-ups go to a Google Sheet through a Google Apps Script web app (GATE_URL). */
(function () {
  var GATE_URL = 'https://script.google.com/macros/s/AKfycbwHZdQaE4RJPdgfGQrR3dM8EdYycf2NWjjWpF3paCUf3e3mw1ugWMe-aRnlIYBvQ0yLfw/exec';
  var KEY = 'wbp_signed_up';
  function unlocked() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function remember() { try { localStorage.setItem(KEY, '1'); } catch (e) {} }

  var css = '.wg-back{position:fixed;inset:0;background:rgba(8,10,16,.72);display:none;align-items:center;justify-content:center;z-index:9999;padding:16px}' +
    '.wg-back.on{display:flex}.wg{background:#F4EFE3;color:#1B1D24;max-width:440px;width:100%;padding:24px 22px 20px;border-radius:4px;box-shadow:0 20px 60px rgba(0,0,0,.5);font-family:inherit}' +
    '.wg h2{margin:0 0 6px;font-size:26px;line-height:1.05;font-weight:800;color:#1B1D24}.wg p{margin:0 0 14px;font-size:15px;line-height:1.4;color:#3B404C}' +
    '.wg label{display:block;font-size:13px;font-weight:700;margin:10px 0 4px}.wg input[type=email],.wg input[type=text]{width:100%;box-sizing:border-box;font-size:16px;padding:11px 12px;border:2px solid #1B1D24;background:#fff;color:#1B1D24;border-radius:0}' +
    '.wg .chk{display:flex;gap:8px;align-items:flex-start;font-weight:500;font-size:14px;margin-top:12px}.wg .chk input{margin-top:3px}' +
    '.wg .row{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap}.wg button{font:inherit;font-weight:800;font-size:15px;padding:11px 18px;border:2px solid #1B1D24;cursor:pointer}' +
    '.wg .go{background:#1B1D24;color:#F4EFE3}.wg .no{background:transparent;color:#1B1D24}.wg .fine{font-size:12px;color:#5B6170;margin:12px 0 0}.wg .err{color:#B3122E;font-size:13px;min-height:1em;margin:6px 0 0}' +
    '.wg .hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var back = document.createElement('div'); back.className = 'wg-back'; back.setAttribute('role', 'dialog'); back.setAttribute('aria-modal', 'true'); back.setAttribute('aria-labelledby', 'wg-h');
  back.innerHTML = '<form class="wg" novalidate>' +
    '<h2 id="wg-h">Get all the facts from this site delivered to your inbox.</h2>' +
    '<p>Enter your email to download. We&rsquo;ll send the voter guide and any updates before Nov 3.</p>' +
    '<label for="wg-em">Email</label><input id="wg-em" type="email" name="email" autocomplete="email" required placeholder="you@example.com">' +
    '<label for="wg-zip">ZIP code <span style="font-weight:400">(optional)</span></label><input id="wg-zip" type="text" name="zip" inputmode="numeric" maxlength="5" autocomplete="postal-code">' +
    '<div class="hp" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>' +
    '<label class="chk"><input type="checkbox" name="updates" value="yes" checked> Email me updates and corrections before Nov 3.</label>' +
    '<div class="err" aria-live="polite"></div>' +
    '<div class="row"><button class="go" type="submit">Download</button><button class="no" type="button">Cancel</button></div>' +
    '<p class="fine">We use your email only for Who&rsquo;s Buying PDX updates. We never share or sell it. No texts. Reply STOP to any email to unsubscribe.</p>' +
    '</form>';
  document.body.appendChild(back);
  var form = back.querySelector('form'), err = back.querySelector('.err'), pending = null, lastFocus = null;

  function open(a) { pending = a; lastFocus = document.activeElement; err.textContent = ''; back.classList.add('on'); setTimeout(function () { form.email.focus(); }, 30); }
  function close() { back.classList.remove('on'); pending = null; if (lastFocus) lastFocus.focus(); }
  function fileOf(a) { return a.getAttribute('data-gated') || a.getAttribute('href'); }
  function download(a) {
    var url = fileOf(a);
    if (a.getAttribute('data-view')) { window.open(url, '_blank', 'noopener'); return; }
    var x = document.createElement('a'); x.href = url; x.setAttribute('download', (url.split('?')[0].split('/').pop()) || '');
    document.body.appendChild(x); x.click(); x.remove();
  }
  function send(data) {
    if (!GATE_URL) return Promise.resolve();
    var body = new URLSearchParams(data);
    return fetch(GATE_URL, { method: 'POST', mode: 'no-cors', body: body }).catch(function () {});
  }

  back.querySelector('.no').addEventListener('click', close);
  back.addEventListener('click', function (e) { if (e.target === back) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && back.classList.contains('on')) close(); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { err.textContent = 'Please enter a valid email.'; form.email.focus(); return; }
    var a = pending;
    send({ email: email, zip: form.zip.value, website: form.website.value, updates: form.updates.checked ? 'yes' : 'no',
           file: a ? fileOf(a) : 'signup', page: location.pathname }).then(function () {
      remember(); close(); if (a) download(a);
    });
  });

  // Gate every download (data-gated buttons carry no file address; plain a[download] as a fallback).
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-gated], a[download]');
    if (!a) return;
    e.preventDefault();
    if (unlocked()) { download(a); return; }
    open(a);
  }, true);
  // No right-click "save link" on gated buttons.
  document.addEventListener('contextmenu', function (e) { if (e.target.closest && e.target.closest('[data-gated]')) e.preventDefault(); }, true);

  // Inline sign-up forms (e.g. the guide page) post to the same sheet.
  window.wbpSignup = function (email, updates) {
    return send({ email: email, updates: updates ? 'yes' : 'no', file: 'signup', page: location.pathname }).then(remember);
  };
})();
