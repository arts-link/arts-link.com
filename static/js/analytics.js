(function () {
  'use strict';

  // ─── Analytics Adapter ──────────────────────────────────────────────────────
  // Generic event-tracking layer. To swap analytics platforms, update only the
  // `sendEvent` function below — no other files need to change.

  function sendEvent(name, props) {
    // PostHog Analytics — replace this block to use a different platform.
    if (window.posthog && typeof window.posthog.capture === 'function') {
      window.posthog.capture(name, props || {});
    }
  }

  // ─── Click tracking ─────────────────────────────────────────────────────────
  // Any element with data-track-event="Event Name" fires a custom event on click.
  // Optional: data-track-props='{"key":"value"}' passes extra properties.

  // ─── Form submission tracking ────────────────────────────────────────────────
  // Any form with data-track-form="Event Name" fires a custom event on submit.

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-track-event]').forEach(function (el) {
      el.addEventListener('click', function () {
        var name = el.getAttribute('data-track-event');
        var propsAttr = el.getAttribute('data-track-props');
        var props;
        if (propsAttr) {
          try {
            props = JSON.parse(propsAttr);
          } catch (e) {
            props = undefined;
          }
        }
        sendEvent(name, props);
      });
    });

    document.querySelectorAll('[data-track-form]').forEach(function (form) {
      form.addEventListener('submit', function () {
        var name = form.getAttribute('data-track-form');
        sendEvent(name);
      });
    });
  });
})();
