// themeSwitcher.js – 4-way theme switcher: light, dark, artistic, system
// This project-level file overrides themes/ryder/assets/js/themeSwitcher.js.

export function initDarkMode() {
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const lightModeButton = document.getElementById("lightMode");
  const darkModeButton = document.getElementById("darkMode");
  const artisticModeButton = document.getElementById("artisticMode");
  const systemModeButton = document.getElementById("systemMode");

  // All three core buttons are required; artisticModeButton is optional –
  // the cycle gracefully skips artistic mode when the button is absent.
  if (!lightModeButton || !darkModeButton || !systemModeButton) return;

  let systemModeListenerAdded = false;

  function setTheme(theme) {
    // Clear all theme classes from <html>
    document.documentElement.classList.remove('dark', 'artistic');

    // Hide all switcher buttons, then show only the active-theme indicator
    [lightModeButton, darkModeButton, artisticModeButton, systemModeButton]
      .filter(Boolean)
      .forEach(btn => btn.classList.add('hidden'));

    if (theme === 'light') {
      localStorage.theme = 'light';
      lightModeButton.classList.remove('hidden');
      removeSysModeListener();

    } else if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      darkModeButton.classList.remove('hidden');
      removeSysModeListener();

    } else if (theme === 'artistic') {
      document.documentElement.classList.add('artistic');
      localStorage.theme = 'artistic';
      // Show artistic button if it exists, otherwise fall back to system button
      if (artisticModeButton) {
        artisticModeButton.classList.remove('hidden');
      } else {
        systemModeButton.classList.remove('hidden');
      }
      removeSysModeListener();

    } else {
      // system – follow OS preference
      localStorage.theme = '';
      systemModeButton.classList.remove('hidden');
      applySystemPreference();
      addSysModeListener();
    }
  }

  function applySystemPreference() {
    document.documentElement.classList.remove('dark', 'artistic');
    if (darkModeMediaQuery.matches) {
      document.documentElement.classList.add('dark');
    }
  }

  function addSysModeListener() {
    if (!systemModeListenerAdded) {
      darkModeMediaQuery.addEventListener('change', onSysModeChange);
      systemModeListenerAdded = true;
    }
  }

  function removeSysModeListener() {
    if (systemModeListenerAdded) {
      darkModeMediaQuery.removeEventListener('change', onSysModeChange);
      systemModeListenerAdded = false;
    }
  }

  function onSysModeChange(event) {
    document.documentElement.classList.remove('dark', 'artistic');
    if (event.matches) {
      document.documentElement.classList.add('dark');
    }
  }

  // Click cycle: light → dark → artistic → system → light …
  lightModeButton.addEventListener("click", () => setTheme('dark'));
  darkModeButton.addEventListener("click", () =>
    setTheme(artisticModeButton ? 'artistic' : 'system')
  );
  if (artisticModeButton) {
    artisticModeButton.addEventListener("click", () => setTheme('system'));
  }
  systemModeButton.addEventListener("click", () => setTheme('light'));

  // Restore saved theme on page load
  const saved = localStorage.theme;
  if (saved === 'dark') {
    setTheme('dark');
  } else if (saved === 'light') {
    setTheme('light');
  } else if (saved === 'artistic') {
    setTheme('artistic');
  } else {
    setTheme('system');
  }
}
