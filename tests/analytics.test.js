import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// analytics.js is a plain IIFE that registers a DOMContentLoaded listener on
// import. Dispatching DOMContentLoaded inside each test causes the handler to
// (re-)scan the current DOM, attaching click/submit listeners to whatever is
// in document.body at that moment.
import '../static/js/analytics.js';

// Helper: populate the body, fire DOMContentLoaded, and return selected el.
function setup(html) {
  document.body.innerHTML = html;
  document.dispatchEvent(new Event('DOMContentLoaded'));
}

describe('analytics – click tracking', () => {
  let posthog;

  beforeEach(() => {
    posthog = { capture: vi.fn() };
    window.posthog = posthog;
  });

  afterEach(() => {
    delete window.posthog;
    vi.restoreAllMocks();
  });

  it('fires a PostHog event with the correct name on click', () => {
    setup('<button data-track-event="Nav Click">Menu</button>');
    document.querySelector('[data-track-event]').click();
    expect(posthog.capture).toHaveBeenCalledOnce();
    expect(posthog.capture).toHaveBeenCalledWith('Nav Click', {});
  });

  it('passes parsed JSON props to PostHog when data-track-props is valid', () => {
    setup(
      `<a data-track-event="CTA Click" data-track-props='{"location":"footer"}'>Get in touch</a>`,
    );
    document.querySelector('[data-track-event]').click();
    expect(posthog.capture).toHaveBeenCalledWith('CTA Click', { location: 'footer' });
  });

  it('sends empty props when data-track-props contains invalid JSON', () => {
    setup(
      `<button data-track-event="Bad Props" data-track-props='not-json'>Click</button>`,
    );
    document.querySelector('[data-track-event]').click();
    expect(posthog.capture).toHaveBeenCalledWith('Bad Props', {});
  });

  it('does not throw when window.posthog is not defined', () => {
    delete window.posthog;
    setup('<button data-track-event="Silent Click">Click</button>');
    expect(() =>
      document.querySelector('[data-track-event]').click(),
    ).not.toThrow();
  });

  it('tracks multiple elements independently', () => {
    setup(`
      <button data-track-event="First">One</button>
      <button data-track-event="Second" data-track-props='{"n":2}'>Two</button>
    `);
    const [first, second] = document.querySelectorAll('[data-track-event]');
    first.click();
    second.click();
    expect(posthog.capture).toHaveBeenCalledTimes(2);
    expect(posthog.capture).toHaveBeenNthCalledWith(1, 'First', {});
    expect(posthog.capture).toHaveBeenNthCalledWith(2, 'Second', { n: 2 });
  });
});

describe('analytics – form submission tracking', () => {
  let posthog;

  beforeEach(() => {
    posthog = { capture: vi.fn() };
    window.posthog = posthog;
  });

  afterEach(() => {
    delete window.posthog;
    vi.restoreAllMocks();
  });

  it('fires a PostHog event with the form name on submit', () => {
    setup('<form data-track-form="Contact Submit"><button type="submit">Send</button></form>');
    document.querySelector('form').dispatchEvent(new Event('submit'));
    expect(posthog.capture).toHaveBeenCalledOnce();
    expect(posthog.capture).toHaveBeenCalledWith('Contact Submit', {});
  });

  it('does not throw on form submit when window.posthog is not defined', () => {
    delete window.posthog;
    setup('<form data-track-form="No PostHog"><button type="submit">Send</button></form>');
    expect(() =>
      document.querySelector('form').dispatchEvent(new Event('submit')),
    ).not.toThrow();
  });
});

describe('analytics – theme init (localStorage)', () => {
  it('reads the stored theme preference without throwing when localStorage is unavailable', () => {
    // Simulate a locked-down storage (private browsing throws on access).
    const original = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('SecurityError');
      },
      configurable: true,
    });

    // The baseof.html inline script is not importable, but the same try/catch
    // pattern is used — verify the pattern itself is safe.
    const readTheme = () => {
      try {
        return localStorage.getItem('theme');
      } catch (_e) {
        return null;
      }
    };

    expect(readTheme()).toBeNull();

    if (original) {
      Object.defineProperty(window, 'localStorage', original);
    }
  });
});
