// Light / dark switch. The choice is remembered in this browser; the page works without storage.
const root = document.documentElement, btn = document.getElementById('theme');
const label = () => { btn.textContent = root.dataset.theme === 'light' ? 'Dark mode' : 'Light mode'; };
btn.onclick = () => { root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light'; try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {} label(); };
label();
