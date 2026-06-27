// Simple client-side password gate.
// NOTE: This is NOT secure for real security purposes (all code is visible to users).

(function () {
  const STORAGE_KEY = 'elitevote_unlocked_v1';

  // TODO: Change this secret phase to the one you want.
  // Example: window.__ELITEVOTE_SECRET_PHASE__ = 'my secret phase';
  const SECRET_PHASE = (typeof window !== 'undefined' && window.__ELITEVOTE_SECRET_PHASE__)
    ? String(window.__ELITEVOTE_SECRET_PHASE__)
    : 'change-me-secret-phase';

  function normalize(s) {
    return String(s ?? '').trim();
  }

  function isUnlocked() {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  }

  function setUnlocked(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value ? 'true' : 'false');
    } catch {
      // ignore
    }
  }

  function getSitename() {
    // Fallback to title if SITENAME not provided.
    const meta = document.querySelector('meta[name="sitename"]')?.getAttribute('content');
    return meta || document.title || 'EliteVote';
  }

  function showGate(options) {
    const gateId = options?.gateId || 'auth-gate-overlay';
    const mount = document.getElementById(gateId);
    if (mount) {
      mount.classList.remove('hidden');
      return;
    }

    const overlay = document.createElement('div');
    overlay.id = gateId;
    overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4';
    overlay.innerHTML = `
      <div class="w-full max-w-md bg-white dark:bg-black rounded-3xl shadow-lg border border-white/10 px-6 py-8">
        <div class="text-center">
          <div class="mx-auto w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-4">
            <i data-lucide="lock" class="w-6 h-6 text-blue-600"></i>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Authentication Required</h2>
          <p id="auth-gate-text" class="text-slate-600 dark:text-zinc-300 mb-6 text-sm">
            HELLO WELCOME ${escapeHtml(getSitename())} KINDLY ENTER SECRET PHASE TO PROCEED
          </p>
        </div>

        <div class="space-y-3">
          <input id="auth-gate-input" type="password" autocomplete="off" inputmode="text" placeholder="Enter secret phase"
            class="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-base outline-none focus:ring-2 focus:ring-blue-500" />

          <div id="auth-gate-error" class="hidden text-red-600 text-sm text-center">Incorrect secret phase. Please try again.</div>

          <button id="auth-gate-submit"
            class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition flex items-center justify-center gap-2">
            <span>Proceed</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>


        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    const input = overlay.querySelector('#auth-gate-input');
    const errorBox = overlay.querySelector('#auth-gate-error');
    const submitBtn = overlay.querySelector('#auth-gate-submit');


    function unlockFromInput() {
      const entered = normalize(input.value);
      const expected = normalize(SECRET_PHASE);

      if (!entered || entered.length < 1) {
        errorBox.classList.remove('hidden');
        return;
      }

      if (entered === expected) {
        setUnlocked(true);
        overlay.remove();
        unlockContent();
      } else {
        errorBox.classList.remove('hidden');
      }
    }

    submitBtn.addEventListener('click', () => unlockFromInput());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') unlockFromInput();
    });



    // Focus for UX
    setTimeout(() => input.focus(), 0);
  }

  function hideProtectedContent() {
    // Hide everything except the gate overlay.
    // We also respect [data-public] nodes if they exist.
    document.querySelectorAll('[data-public="true"]').forEach((el) => {
      el.classList.remove('hidden');
    });

    // Hide main page
    document.body.classList.add('auth-gate-body-hidden');

    // Add a lightweight overlay dimmer is not enough; we block interactions.
    // We'll just cover the page with the gate overlay. Additionally, hide non-public content.
    document.querySelectorAll('body > *:not(#' + cssEscapeId('auth-gate-overlay') + ')').forEach((node) => {
      if (node && node.id !== 'auth-gate-overlay') {
        node.setAttribute('data-auth-gate-hidden', 'true');
        node.style.visibility = 'hidden';
      }
    });
  }

  function unlockContent() {
    document.querySelectorAll('[data-auth-gate-hidden="true"]').forEach((node) => {
      node.style.visibility = '';
      node.removeAttribute('data-auth-gate-hidden');
    });
    document.body.classList.remove('auth-gate-body-hidden');
  }

  function cssEscapeId(id) {
    // minimal escape for use in selector string
    return String(id).replace(/[^a-zA-Z0-9_-]/g, '_');
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '<')
      .replaceAll('>', '>')
      .replaceAll('"', '"')
      .replaceAll("'", '&#039;');
  }

  window.EliteVoteAuthGate = {
    isUnlocked,
    setUnlocked,
    showGate,
  };

  // Auto-init
  function init() {
    // If already unlocked, do nothing.
    if (isUnlocked()) return;

    // Show the gate first so it can never be hidden by the content-hiding logic.
    showGate({ gateId: 'auth-gate-overlay' });
    hideProtectedContent();
  }


  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

