// themeSwitcher.js — 4-way theme cycle: light → dark → artistic → system
export function initDarkMode() {
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const lightModeButton = document.getElementById("lightMode");
  const darkModeButton = document.getElementById("darkMode");
  const artisticModeButton = document.getElementById("artisticMode");
  const systemModeButton = document.getElementById("systemMode");

  let systemModeListenerAdded = false;

  function toggleTheme(theme) {
    // Clear all theme classes first
    document.documentElement.classList.remove('dark', 'artistic');

    // Hide all buttons, then reveal the active one
    [lightModeButton, darkModeButton, artisticModeButton, systemModeButton].forEach(btn => {
      if (btn) btn.classList.add('hidden');
    });

    if (theme === 'light') {
      localStorage.theme = 'light';
      if (lightModeButton) lightModeButton.classList.remove('hidden');
    } else if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      if (darkModeButton) darkModeButton.classList.remove('hidden');
    } else if (theme === 'artistic') {
      document.documentElement.classList.add('artistic');
      localStorage.theme = 'artistic';
      if (artisticModeButton) artisticModeButton.classList.remove('hidden');
    } else {
      // system
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      }
      localStorage.removeItem('theme');
      if (systemModeButton) systemModeButton.classList.remove('hidden');
    }

    // Manage system-mode change listener
    if (theme === 'light' || theme === 'dark' || theme === 'artistic') {
      if (systemModeListenerAdded) {
        darkModeMediaQuery.removeEventListener('change', detectOSThemeChange);
        systemModeListenerAdded = false;
      }
    } else {
      if (!systemModeListenerAdded) {
        darkModeMediaQuery.addEventListener('change', detectOSThemeChange);
        systemModeListenerAdded = true;
      }
    }
  }

  function detectOSThemeChange(event) {
    if (event.matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Cycle: light → dark → artistic → system → light
  if (lightModeButton) lightModeButton.addEventListener("click", () => toggleTheme('dark'));
  if (darkModeButton) darkModeButton.addEventListener("click", () => toggleTheme('artistic'));
  if (artisticModeButton) artisticModeButton.addEventListener("click", () => toggleTheme('system'));
  if (systemModeButton) systemModeButton.addEventListener("click", () => toggleTheme('light'));

  // Restore theme from localStorage on page load
  if (localStorage.theme === 'dark') {
    toggleTheme('dark');
  } else if (localStorage.theme === 'light') {
    toggleTheme('light');
  } else if (localStorage.theme === 'artistic') {
    toggleTheme('artistic');
  } else {
    toggleTheme('system');
  }
}
