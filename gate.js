/* Who's Buying PDX download gate.
   Graphics and the guide stay visible; downloading asks for an email once per browser.
   Sign-ups go to a Google Sheet through a Google Apps Script web app (GATE_URL).
   Phones get a "Save" step that opens the share sheet (Save Image / Save Video to Photos);
   computers get a normal download. Files are fetched first so they save with the right name and type. */
(function () {
  var GATE_URL = 'https://script.google.com/macros/s/AKfycbwHZdQaE4RJPdgfGQrR3dM8EdYycf2NWjjWpF3paCUf3e3mw1ugWMe-aRnlIYBvQ0yLfw/exec';
  var KEY = 'wbp_signed_up';
  var mem = false;

  // ---------- remember the sign-up (storage, cookie and memory, so private / in-app browsers still only ask once)
  function unlocked() {
    if (mem) return true;
    try { if (localStorage.getItem(KEY) === '1') return (mem = true); } catch (e) {}
    try { if (sessionStorage.getItem(KEY) === '1') return (mem = true); } catch (e) {}
    if (/(?:^|;\s*)wbp_su=1/.test(document.cookie)) return (mem = true);
    return false;
  }
  function remember() {
    mem = true;
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    try { document.cookie = 'wbp_su=1; max-age=31536000; path=/; SameSite=Lax'; } catch (e) {}
  }

  // ---------- helpers
  var UA = navigator.userAgent || '';
  var MOBILE = /iPhone|iPad|iPod|Android/i.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var TYPES = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', mp4: 'video/mp4', pdf: 'application/pdf', zip: 'application/zip' };
  function fileOf(a) { return a.getAttribute('data-gated') || a.getAttribute('href'); }
  function nameOf(url) { return (url.split('?')[0].split('#')[0].split('/').pop()) || 'whosbuyingpdx'; }
  function extOf(url) { return (nameOf(url).split('.').pop() || '').toLowerCase(); }
  function isMedia(url) { return /^(png|jpe?g|gif|mp4)$/.test(extOf(url)); }

  // Counts gate steps in GoatCounter (no personal data).
  var gateOpen = false;
  function gc(p) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: p, title: p, event: true }); } catch (e) {} }

  function send(data) {
    if (!GATE_URL) return;
    var body = new URLSearchParams(data);
    try { if (navigator.sendBeacon && navigator.sendBeacon(GATE_URL, body)) return; } catch (e) {}
    try { fetch(GATE_URL, { method: 'POST', mode: 'no-cors', body: body, keepalive: true }).catch(function () {}); } catch (e) {}
  }

  // ---------- styles + two panels: email form and "ready to save"
  var css = '.wg-back{position:fixed;inset:0;background:rgba(8,10,16,.72);display:none;align-items:center;justify-content:center;z-index:9999;padding:16px}' +
    '.wg-back.on{display:flex}.wg{background:#F4EFE3;color:#1B1D24;max-width:440px;width:100%;padding:24px 22px 20px;border-radius:4px;box-shadow:0 20px 60px rgba(0,0,0,.5);font-family:inherit;max-height:92vh;overflow:auto}' +
    '.wg h2{margin:0 0 6px;font-size:26px;line-height:1.05;font-weight:800;color:#1B1D24}.wg p{margin:0 0 14px;font-size:15px;line-height:1.4;color:#3B404C}' +
    '.wg label{display:block;font-size:13px;font-weight:700;margin:10px 0 4px}.wg input[type=email],.wg input[type=text]{width:100%;box-sizing:border-box;font-size:16px;padding:11px 12px;border:2px solid #1B1D24;background:#fff;color:#1B1D24;border-radius:0}' +
    '.wg .chk{display:flex;gap:8px;align-items:flex-start;font-weight:500;font-size:14px;margin-top:12px}.wg .chk input{margin-top:3px}' +
    '.wg .row{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap}.wg button{font:inherit;font-weight:800;font-size:15px;padding:11px 18px;border:2px solid #1B1D24;cursor:pointer;border-radius:0}' +
    '.wg button[disabled]{opacity:.5;cursor:wait}' +
    '.wg .go{background:#1B1D24;color:#F4EFE3}.wg .no{background:transparent;color:#1B1D24}.wg .fine{font-size:12px;color:#5B6170;margin:12px 0 0}.wg .err{color:#B3122E;font-size:13px;min-height:1em;margin:6px 0 0}' +
    '.wg .hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}' +
    '.wg .pv{display:block;max-width:100%;max-height:38vh;margin:0 auto 12px;border:1px solid #D5CDBB;background:#fff}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var back = document.createElement('div'); back.className = 'wg-back'; back.setAttribute('role', 'dialog'); back.setAttribute('aria-modal', 'true'); back.setAttribute('aria-labelledby', 'wg-h');
  back.innerHTML =
    '<form class="wg wg-form" novalidate>' +
    '<h2 id="wg-h">Get all the facts from this site delivered to your inbox.</h2>' +
    '<p>Enter your email once to download any graphic or the guide. We&rsquo;ll send the voter guide and any updates before Nov 3.</p>' +
    '<label for="wg-em">Email</label><input id="wg-em" type="email" name="email" autocomplete="email" required placeholder="you@example.com">' +
    '<label for="wg-zip">ZIP code <span style="font-weight:400">(optional)</span></label><input id="wg-zip" type="text" name="zip" inputmode="numeric" maxlength="5" autocomplete="postal-code">' +
    '<div class="hp" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>' +
    '<label class="chk"><input type="checkbox" name="updates" value="yes" checked> Email me updates and corrections before Nov 3.</label>' +
    '<div class="err" aria-live="polite"></div>' +
    '<div class="row"><button class="go" type="submit">Continue</button><button class="no" type="button">Cancel</button></div>' +
    '<p class="fine">We use your email only for Who&rsquo;s Buying PDX updates. We never share or sell it. No texts. Reply STOP to any email to unsubscribe.</p>' +
    '</form>' +
    '<div class="wg wg-save" hidden>' +
    '<h2 class="wg-st">Your file is ready.</h2>' +
    '<img class="pv" alt="" hidden>' +
    '<p class="wg-sp"></p>' +
    '<div class="row"><button class="go wg-share" type="button" hidden>Save to Photos</button><button class="go wg-dl" type="button">Download</button><button class="no wg-x" type="button">Done</button></div>' +
    '<p class="fine wg-tip"></p>' +
    '</div>';
  document.body.appendChild(back);
  var form = back.querySelector('.wg-form'), err = back.querySelector('.err');
  var save = back.querySelector('.wg-save'), pv = back.querySelector('.pv'), sp = back.querySelector('.wg-sp'), tip = back.querySelector('.wg-tip');
  var bShare = back.querySelector('.wg-share'), bDl = back.querySelector('.wg-dl');
  var pending = null, lastFocus = null, ready = null; // ready = {url, name, blob, file}

  function show(panel) {
    form.hidden = panel !== 'form'; save.hidden = panel !== 'save';
    if (!back.classList.contains('on')) { lastFocus = document.activeElement; back.classList.add('on'); }
  }
  function close() {
    if (gateOpen) { gc('gate/closed-without-email'); gateOpen = false; }
    back.classList.remove('on'); pending = null;
    if (ready && ready.obj) { try { URL.revokeObjectURL(ready.obj); } catch (e) {} }
    ready = null; pv.hidden = true; pv.removeAttribute('src');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // Fetch the real file so it saves with the right name and type (never as a web page).
  function load(url) {
    var name = nameOf(url), type = TYPES[extOf(url)] || 'application/octet-stream';
    return fetch(url, { cache: 'force-cache' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.blob();
    }).then(function (b) {
      var blob = b.type === type ? b : new Blob([b], { type: type });
      var file = null; try { file = new File([blob], name, { type: type }); } catch (e) {}
      return { url: url, name: name, type: type, blob: blob, file: file };
    });
  }
  function saveBlob(r) {
    var obj = URL.createObjectURL(r.blob); r.obj = obj;
    var x = document.createElement('a'); x.href = obj; x.download = r.name; x.rel = 'noopener';
    back.appendChild(x); x.click(); x.remove(); // inside the modal so the gate's own click handler ignores it
  }
  function directLink(url) {
    var x = document.createElement('a'); x.href = url; x.download = nameOf(url);
    back.appendChild(x); x.click(); x.remove(); // inside the modal so the gate's own click handler ignores it
  }
  function canShareFile(r) {
    try { return MOBILE && r && r.file && navigator.canShare && navigator.canShare({ files: [r.file] }); } catch (e) { return false; }
  }

  // Deliver a file. On phones: a "ready" panel with Save to Photos (share sheet) and Download.
  // On computers: download right away (fetched as a blob, falling back to a direct link).
  function deliver(a, fromForm) {
    var url = fileOf(a);
    try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: 'download/' + nameOf(url), title: 'Download: ' + nameOf(url), event: true }); } catch (e) {}
    if (a.getAttribute('data-view')) {
      if (fromForm) { // popup blockers: show it in the panel with an Open button instead of window.open after async
        show('save'); save.querySelector('.wg-st').textContent = 'Here it is.';
        pv.src = url; pv.hidden = false; sp.textContent = ''; tip.textContent = '';
        bShare.hidden = true; bDl.textContent = 'Open full size'; bDl.disabled = false;
        bDl.onclick = function () { window.open(url, '_blank', 'noopener'); close(); };
        return;
      }
      window.open(url, '_blank', 'noopener'); return;
    }
    if (!MOBILE) {
      // Same-origin link with a download name: starts inside the click, saves with the right name and type.
      if (fromForm) close();
      directLink(url);
      return;
    }
    // Phone flow
    show('save');
    var media = isMedia(url), ext = extOf(url);
    save.querySelector('.wg-st').textContent = 'Your file is ready.';
    sp.textContent = 'Getting ' + nameOf(url) + '…';
    tip.textContent = '';
    pv.hidden = true;
    bShare.hidden = true; bDl.textContent = 'Download'; bDl.disabled = true;
    load(url).then(function (r) {
      ready = r;
      if (/^(png|jpe?g|gif)$/.test(ext)) { pv.src = URL.createObjectURL(r.blob); pv.hidden = false; }
      var sharable = canShareFile(r);
      if (sharable && media) {
        bShare.hidden = false;
        bShare.textContent = ext === 'mp4' ? 'Save video to Photos' : 'Save to Photos';
        sp.textContent = 'Tap ' + (ext === 'mp4' ? '“Save video to Photos”' : '“Save to Photos”') + ', then choose ' + (ext === 'mp4' ? '“Save Video.”' : '“Save Image.”');
        tip.textContent = 'Or press and hold the picture above and choose “Save to Photos.”';
      } else if (sharable) {
        bShare.hidden = false; bShare.textContent = 'Save or share';
        sp.textContent = 'Tap “Save or share” to save it to Files or send it.';
      } else {
        sp.textContent = media ? 'Press and hold the picture to save it to your photos, or tap Download.' : 'Tap Download to save it.';
      }
      bDl.disabled = false;
    }).catch(function () {
      sp.textContent = 'Tap Download to save it.'; bDl.disabled = false; ready = { url: url, failed: true };
    });
    bShare.onclick = function () {
      if (!ready || !ready.file) return;
      navigator.share({ files: [ready.file] }).then(close).catch(function (e) {
        if (e && e.name === 'AbortError') return; // user closed the share sheet
        directLink(url);
      });
    };
    bDl.onclick = function () {
      directLink(url); // real file address inside the tap: correct name and type
      setTimeout(close, 400);
    };
  }

  // ---------- wiring
  back.querySelectorAll('.no').forEach(function (b) { b.addEventListener('click', close); });
  back.addEventListener('click', function (e) { if (e.target === back) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && back.classList.contains('on')) close(); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { err.textContent = 'Please enter a valid email.'; form.email.focus(); return; }
    var a = pending;
    if (gateOpen) { gc('gate/email-entered'); gateOpen = false; }
    send({ email: email, zip: form.zip.value, website: form.website.value, updates: form.updates.checked ? 'yes' : 'no',
           file: a ? fileOf(a) : 'signup', page: location.pathname });
    remember();
    if (a) deliver(a, true); else close();
  });

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-gated], a[download]');
    if (!a || back.contains(a)) return;
    e.preventDefault();
    if (unlocked()) { deliver(a, false); return; }
    pending = a; err.textContent = ''; show('form');
    gateOpen = true; gc('gate/shown');
    setTimeout(function () { form.email.focus(); }, 30);
  }, true);
  document.addEventListener('contextmenu', function (e) { if (e.target.closest && e.target.closest('[data-gated]')) e.preventDefault(); }, true);

  // Inline sign-up forms (e.g. the guide page) post to the same sheet.
  window.wbpSignup = function (email, updates, where) {
    gc('signup/' + (where || 'guide-box'));
    send({ email: email, updates: updates ? 'yes' : 'no', file: 'signup', page: location.pathname });
    remember();
    return Promise.resolve();
  };
})();
