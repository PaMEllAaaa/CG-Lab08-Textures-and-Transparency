#version 450
#extension GL_GOOGLE_include_directive : require

#include <params.glsl>

layout(location = 0) in vec2 inUV;

layout(location = 0) out vec4 outColor;

void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);

  vec4 accum = texelFetch(tex0, p, 0);
  float reveal = texelFetch(tex1, p, 0).r;

  // If nothing transparent was drawn (reveal is 1), leave the scene alone (alpha 0)
  if (reveal >= 1.0) {
    outColor = vec4(0.0);
    return;
  }

  // Output weighted average color (preventing division by zero) and 1 - reveal for alpha
  vec3 average_color = accum.rgb / max(accum.a, 1e-5);
  outColor = vec4(average_color, 1.0 - reveal);
}
