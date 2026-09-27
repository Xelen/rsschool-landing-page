const themeButton = document.querySelector('.theme-toggle');
const page = document.documentElement;

const savedTheme = localStorage.getItem('theme');

const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light';

const initialTheme = savedTheme || systemTheme;

function setTheme(theme) {
  const isDark = theme === 'dark';

  page.dataset.theme = theme;

  themeButton.textContent = isDark ? '☀️' : '🌙';

  themeButton.setAttribute('aria-pressed', isDark);
  themeButton.setAttribute(
    'aria-label',
    isDark ? 'Switch to light theme' : 'Switch to dark theme',
  );
}

setTheme(initialTheme);

themeButton.addEventListener('click', () => {
  const currentTheme = page.dataset.theme;
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  setTheme(newTheme);

  localStorage.setItem('theme', newTheme);
});
