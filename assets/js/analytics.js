// Amplitude Analytics + Session Replay
// Client-side only (static site, no bundler) — loaded via ESM CDN.
// This module runs exactly once, so Amplitude is initialized only once.
import * as amplitude from 'https://cdn.jsdelivr.net/npm/@amplitude/unified/+esm';

// Local dev hits the same production project, so every test page-load used to
// land in the real numbers as a visitor (session replay included). Only the
// deployed site reports.
const HOST = location.hostname;
const IS_LOCAL = HOST === 'localhost' || HOST === '127.0.0.1' || HOST === '' || HOST.endsWith('.local');

if (!IS_LOCAL) {
  amplitude.initAll('6e6ab28d3f8ea33b8ef5b304ab6d9c78', {
    analytics: { autocapture: true },
    sessionReplay: { sampleRate: 1 },
  });
}

// Expose a tracking helper so the classic (non-module) app.js can send
// custom events per the taxonomy in docs/analytics/amplitude-taxonomy.md.
window.HanamTrack = function (name, props) {
  if (IS_LOCAL) { console.debug('[analytics:off]', name, props || {}); return; }
  try { amplitude.track(name, props || {}); } catch (e) {}
};
// Set a user property (e.g. preferred_language). Guarded for SDK variations.
window.HanamSetUser = function (key, value) {
  if (IS_LOCAL) return;
  try {
    if (typeof amplitude.Identify === 'function') {
      var id = new amplitude.Identify();
      id.set(key, value);
      amplitude.identify(id);
    }
  } catch (e) {}
};
