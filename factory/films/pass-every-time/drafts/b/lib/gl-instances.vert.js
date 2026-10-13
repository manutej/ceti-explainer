  const VERT = `#version 300 es
precision highp float; precision highp int;
in vec3 aPosition; in vec3 aNormal; in vec2 aTexCoord;
uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix;
uniform sampler2D uData; uniform int uTexW; uniform int uMark; uniform int uChunk; uniform int uN; uniform float uStep;
uniform float uK; uniform float uKc; uniform float uWin; uniform float uSize; uniform float uAlpha; uniform float uRamp; uniform float uGrow;
uniform vec3 uPal[6]; uniform vec3 uBg; uniform vec3 uHot; uniform vec3 uDim;
uniform vec4 uBrush; uniform float uBrushOn; uniform float uBrushRole; uniform float uPickOn; uniform float uPickRole;
uniform float uT; uniform vec4 uW1; uniform vec4 uW2; uniform vec4 uW3; uniform vec4 uD1; uniform vec4 uD2;
uniform vec3 uGhost; uniform float uCut; uniform float uFlash;
out vec3 vN; out vec2 vUV; out vec4 vCol;
vec4 fetch(int j){ return texelFetch(uData, ivec2(j % uTexW, j / uTexW), 0); }
float sm(float x){ x = clamp(x, 0.0, 1.0); return x * x * (3.0 - 2.0 * x); }
void main(){
  float j = floor(aPosition.x / uStep + 0.5); vec3 aPos = vec3(aPosition.x - j * uStep, aPosition.yz);
  int id = gl_InstanceID * uChunk + int(j);
  if (id >= uN) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vCol = vec4(0.0); vN = vec3(0.0); vUV = vec2(0.0); return; }
  /* six texels per mark. d0 = home A (xyz, base of the cube) + time it lights; d1 = home B + passed (0/1, or minute colour);
     d2 = home C + group (passes of the task, or 1 = would not merge); d3 = appear time, appear length, hide time, class
     (0 try, 1 PR, 2 minute); d4 = stagger rank for the first and second move, second life start and length; d5 = plate-to-cube time and length */
  vec4 d0 = fetch(6 * id), d1 = fetch(6 * id + 1), d2 = fetch(6 * id + 2), d3 = fetch(6 * id + 3), d4 = fetch(6 * id + 4), d5 = fetch(6 * id + 5);
  float life1 = sm((uT - d3.x) / d3.y) * (uT < d3.z ? 1.0 : 0.0);
  float life2 = sm((uT - d4.z) / d4.w);
  float sc = max(life1, life2);
  if (sc <= 0.002) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vCol = vec4(0.0); vN = vec3(0.0); vUV = vec2(0.0); return; }
  float cls = d3.w, q = d4.x, qs = d4.y;
  float e1 = sm((uT - uW1.x - q * uW1.y) / uW1.z), e2 = sm((uT - uW2.x - qs * uW2.y) / uW2.z), e3 = sm((uT - uW3.x - q * uW3.y) / uW3.z);
  vec3 P; float lift = 0.0, w, h; vec3 col;
  if (cls < 0.5) {                                              // a try: plan tile -> column of four -> sorted column
    P = mix(mix(d0.xyz, d1.xyz, e1), d2.xyz, e2);
    lift = uW1.w * sin(3.14159265 * e1) + uW2.w * sin(3.14159265 * e2);
    float e0 = sm((uT - d5.x) / d5.y);
    w = mix(mix(uD1.x, uD1.y, e0), uD1.z, e1);
    h = mix(mix(uD1.w, uD1.y, e0), uD2.x, e1);
    float pass = d1.w > 0.5 ? 1.0 : 0.0;
    float lit = pass * sm((uT - d0.w) / 0.3);
    float flash = pass * step(d0.w, uT) * (1.0 - sm((uT - d0.w) / uFlash));
    col = mix(uGhost, uPal[1], lit);
    col = mix(col, uHot, 0.7 * flash);
    col = mix(col, uDim, uCut * step(d2.w + 0.5, 3.5));   // columns that did not pass every try
  } else if (cls < 1.5) {                                       // a PR: the sheet, then merge / not merge
    P = mix(d0.xyz, d1.xyz, e3); lift = uW3.w * sin(3.14159265 * e3);
    w = uD1.z; h = uD2.y;
    col = mix(uPal[1], uGhost, e3 * d2.w);
  } else {                                                      // a minute
    P = d0.xyz; w = uD1.z; h = uD2.z;
    col = d1.w > 0.5 ? uPal[1] : uPal[2];
  }
  col = mix(uHot, col, sc);
  w *= sc; h *= sc;
  vUV = aTexCoord; vN = aNormal;
  vec3 qv = vec3(P.x, P.y - lift - 0.5 * h, P.z) + aPos * vec3(w, h, w);
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(qv, 1.0);
  vCol = vec4(mix(uBg, col, clamp(uAlpha, 0.0, 1.0)), 1.0);
}`;
