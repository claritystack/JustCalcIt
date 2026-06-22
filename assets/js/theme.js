const html = document.documentElement;
const toggle = document.getElementById('themeToggle');
const label = document.getElementById('themeLabel');

// Load saved preference
const saved = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', saved);
label.textContent = saved === 'dark' ? '🌙' : '☀️';

toggle.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  label.textContent = next === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('theme', next);
});

// Mobile hamburger menu
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mainNav = document.getElementById('mainNav');

if (hamburgerBtn && mainNav) {
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    hamburgerBtn.classList.toggle('is-open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      mainNav.classList.remove('is-open');
      hamburgerBtn.classList.remove('is-open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  });
}
