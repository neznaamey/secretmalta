const PASSWORD_HASH = "15da565d520166ef98d3b09ec0c797eaad12f3e0b50edb8857675cd953f59c79";

const overlay = document.getElementById('overlay');
const site = document.getElementById('site');
const pwInput = document.getElementById('pw');
const okBtn = document.getElementById('ok');
const err = document.getElementById('err');

async function sha256hex(str) {
  const enc = new TextEncoder();
  const data = enc.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function tryUnlock() {
  err.textContent = '';
  const val = pwInput.value.trim();
  if (!val) {
    err.textContent = 'Zadej heslo.';
    return;
  }
  okBtn.disabled = true;
  okBtn.textContent = 'Kontrola...';
  try {
    const hash = await sha256hex(val);
    if (hash === PASSWORD_HASH) {
      overlay.style.display = 'none';
      site.classList.remove('blurred');
    } else {
      err.textContent = 'Neplatné heslo.';
    }
  } catch (e) {
    console.error(e);
    err.textContent = 'Chyba při ověření.';
  } finally {
    okBtn.disabled = false;
    okBtn.textContent = 'Odemknout';
  }
}

okBtn.addEventListener('click', tryUnlock);
pwInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryUnlock(); });

window.addEventListener('load', () => pwInput.focus()); 

document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});
