import {cue} from '../../shared/methods/timing';
export const corsCues = {
  options: cue('cors', 'p03-options'), browser: cue('cors', 'p03-browser'), preflight: cue('cors', 'p03-preflight'),
  curl: cue('cors', 'p03-curl'), missing: cue('cors', 'p03-missing'), policy: cue('cors', 'p03-browser-policy'),
  origin: cue('cors', 'p03-origin'), origins: cue('cors', 'p03-two-origins'), csrf: cue('cors', 'p03-csrf'),
  explain: cue('cors', 'p03-preflight-explain'), methods: cue('cors', 'p03-allowed-methods'),
  allowedOrigin: cue('cors', 'p03-allowed-origins'), middleware: cue('cors', 'p03-middleware'),
  handler: cue('cors', 'p03-handler'), cache: cue('cors', 'p03-cache'), repeat: cue('cors', 'p03-cache-repeat'), expire: cue('cors', 'p03-cache-expire'),
} as const;
export const flightVisibility = (timeMs: number, startMs: number, durationMs: number): boolean => timeMs >= startMs && timeMs < startMs + durationMs;
