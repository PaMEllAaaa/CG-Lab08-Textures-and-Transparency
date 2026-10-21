#version 450
#extension GL_GOOGLE_include_directive : require

#include <params.glsl>
#include <transparent.glsl>

layout(location = 0) out vec4 outAccum;
layout(location = 1) out vec4 outReveal;

void main() {
  vec4 c = surface();

  float z = inViewDepth;
  float w = clamp(0.03 / (1e-5 + pow(z / 200.0, 4.0)), 1e-2, 3e3);

  // accum: premultiplied color * weight, and alpha * weight
  outAccum = vec4(c.rgb * c.a * w, c.a * w);
  
  // reveal: just the alpha channel
  outReveal = vec4(c.a);
}
