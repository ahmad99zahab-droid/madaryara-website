(function () {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (toggle) {
      const moon = toggle.querySelector('.icon-moon');
      const sun = toggle.querySelector('.icon-sun');
      if (moon && sun) {
        moon.style.display = theme === 'light' ? '' : 'none';
        sun.style.display = theme === 'light' ? 'none' : '';
      }
    }
  }

  const saved = localStorage.getItem('theme') || 'dark';
  applyTheme(saved);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }
})();
