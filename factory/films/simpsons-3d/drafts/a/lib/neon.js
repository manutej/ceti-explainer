/* lib/neon.js · the neon post pass, a filter shader over the finished frame (scene + headline).
   Derived from the NEON look of arsenal/materials/shader/pattern.js: two golden-angle spirals (14 taps each, a tight
   and a wide radius) summed and added back on a dark ground, with a white-hot core. Difference: that module reads a
   channel-coded coverage layer (R/G/B = ink/accent/accent2); this one thresholds the rendered colours, so the lit
   boxes and the headline bloom and the dim boxes do not. Constant loop bounds (GLSL ES 1.00). Used on the reveal only. */
(function () {
  'use strict';
  const FRAG = 'precision highp float; varying vec2 vTexCoord; uniform sampler2D tex0; uniform vec2 uRes; uniform float uGain, uRadius, uThresh, uCore;' +
    'vec3 S(vec2 uv){ return texture2D(tex0, uv).rgb; }' +
    'void main(){ vec2 uv = vTexCoord; vec3 c = S(uv); vec3 tight = vec3(0.), wide = vec3(0.);' +
    ' for (int k = 0; k < 14; k++) { float fk = float(k); float a = fk * 2.39996; float rr = sqrt((fk + .5) / 14.); vec2 d = vec2(cos(a), sin(a)) * rr / uRes;' +
    '  tight += max(S(uv + d * uRadius * .35) - uThresh, 0.); wide += max(S(uv + d * uRadius) - uThresh, 0.); }' +
    ' tight /= 14.; wide /= 14.; vec3 g = tight * .9 + wide * 1.5; vec3 col = c + g * uGain;' +
    ' float m = max(max(c.r, c.g), c.b); col = mix(col, vec3(1.), uCore * smoothstep(.8, 1., m) * .3);' +
    ' gl_FragColor = vec4(col, 1.); }';
  window.FILM_NEON = { FRAG };
})();
