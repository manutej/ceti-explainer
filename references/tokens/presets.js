// Studio palette presets — role-weighted, OKLCH CSS strings (paste into Studio.palette({...})).
// Values converted from the verbatim brand tokens in references/integration.md (sources: ceti-explainer
// shell.template.html, ceti-tokens.css, silver-hero colors_and_type.css, milton tokens.css). Weights are
// defaults for generative use (dominant/supporting/accent), not brand law.
window.STUDIO_PRESETS = {
  'ceti-dark': { source: 'CETI explainer --ex-* roles', ground: '#0E1014', roles: [
    { name: 'ink',     color: '#F5EFE3', weight: 6 },   // --ex-ink
    { name: 'dim',     color: '#A39A89', weight: 3 },   // --ex-dim
    { name: 'copper',  color: '#CE9A6A', weight: 1.5 }, // --ex-accent
    { name: 'sage',    color: '#8FA985', weight: 1 },   // --ex-accent2
    { name: 'support', color: '#6E8CA8', weight: 0.6 }, // --ex-support
  ] },
  'ceti-paper': { source: 'CETI marketing --mk-* (light)', ground: '#F5EFE3', roles: [
    { name: 'deep-sea',  color: '#1A1F2E', weight: 6 },
    { name: 'copper',    color: '#A67756', weight: 2 },
    { name: 'sage',      color: '#7A9171', weight: 1.5 },
    { name: 'rust',      color: '#8C4A2E', weight: 0.8 },
    { name: 'slate',     color: '#324555', weight: 1 },
  ] },
  'ceti-silver': { source: 'CETI Silver — one gold light', ground: '#1C1720', roles: [
    { name: 'ink',  color: '#F2EBE0', weight: 6 },
    { name: 'gold', color: '#d4a84b', weight: 1 },      // the single light source
    { name: 'dim',  color: '#6b6170', weight: 3 },
  ] },
  'glaser-paper': { source: 'milton CETI × Glaser preset', ground: '#FAF7F2', roles: [
    { name: 'ink',       color: '#1A1916', weight: 6 },
    { name: 'vermilion', color: '#D1422A', weight: 1 },
    { name: 'cobalt',    color: '#2D5BA9', weight: 1 },
    { name: 'sunflower', color: '#E8B53C', weight: 0.7 },
    { name: 'forest',    color: '#3B6E47', weight: 0.7 },
  ] },
};
