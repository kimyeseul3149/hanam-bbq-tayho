// Amplitude Analytics + Session Replay
// Client-side only (static site, no bundler) — loaded via ESM CDN.
// This module runs exactly once, so Amplitude is initialized only once.
import * as amplitude from 'https://cdn.jsdelivr.net/npm/@amplitude/unified/+esm';

amplitude.initAll('6e6ab28d3f8ea33b8ef5b304ab6d9c78', {
  analytics: { autocapture: true },
  sessionReplay: { sampleRate: 1 },
});
