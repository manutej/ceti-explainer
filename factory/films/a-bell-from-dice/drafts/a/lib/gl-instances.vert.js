  const VERT = `#version 300 es
precision highp float; precision highp int;
in vec3 aPosition; in vec3 aNormal; in vec2 aTexCoord;
uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix;
uniform sampler2D uData; uniform int uTexW; uniform int uMark; uniform int uChunk; uniform int uN; uniform float uStep;
uniform float uK; uniform float uKc; uniform float uWin; uniform float uSize; uniform float uAlpha; uniform float uRamp; uniform float uGrow;
uniform vec3 uPal[6]; uniform vec3 uBg; uniform vec3 uHot; uniform vec3 uDim;
uniform vec4 uBrush; uniform float uBrushOn; uniform float uBrushRole; uniform float uPickOn; uniform float uPickRole;
uniform float uT; uniform vec4 uM1; uniform vec4 uM2; uniform vec3 uS; uniform vec4 uLit; uniform float uLitRole;
out vec3 vN; out vec2 vUV; out vec4 vCol;
vec4 fetch(int j){ return texelFetch(uData, ivec2(j % uTexW, j / uTexW), 0); }
float sm(float x){ x = clamp(x, 0.0, 1.0); return x * x * (3.0 - 2.0 * x); }
void main(){
  float j = floor(aPosition.x / uStep + 0.5); vec3 aPos = vec3(aPosition.x - j * uStep, aPosition.yz);
  int id = gl_InstanceID * uChunk + int(j);
  if (id >= uN) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vCol = vec4(0.0); vN = vec3(0.0); vUV = vec2(0.0); return; }
  vec4 d0 = fetch(4 * id), d1 = fetch(4 * id + 1), d2 = fetch(4 * id + 2), d3 = fetch(4 * id + 3);
  float rank = d1.w;
  if (rank >= uKc) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vCol = vec4(0.0); vN = vec3(0.0); vUV = vec2(0.0); return; }
  float e = sm((uK - rank) / uWin);
  float q = rank / float(uN);
  float e1 = sm((uT - uM1.x - q * uM1.y) / uM1.z), e2 = sm((uT - uM2.x - q * uM2.y) / uM2.z);
  vec3 P = mix(mix(d0.xyz, d2.xyz, e1), d3.xyz, e2);
  P.y -= uM1.w * sin(3.14159265 * e1) + uM2.w * sin(3.14159265 * e2);
  float s = mix(mix(uS.x, uS.y, e1), uS.z, e2) * uSize;
  bool lit = d0.w > uLit.x - 0.5 && d0.w < uLit.y + 0.5;
  vec3 col = lit ? mix(uPal[0], uPal[int(uLitRole + 0.5)], uLit.z) : mix(uPal[0], uDim, uLit.w);
  col = mix(uHot, col, e);
  vUV = aTexCoord; vN = aNormal;
  vec3 qv = P + aPos * s + vec3(0.0, -40.0 * (1.0 - e), 0.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(qv, 1.0);
  vCol = vec4(mix(uBg, col, clamp(uAlpha, 0.0, 1.0)), 1.0);
}`;
