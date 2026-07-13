// Amplitude Analytics + Session Replay
// Client-side only (static site, no bundler) — loaded via ESM CDN.
// This module runs exactly once, so Amplitude is initialized only once.
import * as amplitude from 'https://cdn.jsdelivr.net/npm/@amplitude/unified/+esm';

amplitude.initAll('6e6ab28d3f8ea33b8ef5b304ab6d9c78', {
  analytics: { autocapture: true },
  sessionReplay: { sampleRate: 1 },
});

// Expose a tracking helper so the classic (non-module) app.js can send
// custom events per the taxonomy in docs/analytics/amplitude-taxonomy.md.
window.HanamTrack = function (name, props) {
  try { amplitude.track(name, props || {}); } catch (e) {}
};
// Set a user property (e.g. preferred_language). Guarded for SDK variations.
window.HanamSetUser = function (key, value) {
  try {
    if (typeof amplitude.Identify === 'function') {
      var id = new amplitude.Identify();
      id.set(key, value);
      amplitude.identify(id);
    }
  } catch (e) {}
};
