#version 450
#extension GL_GOOGLE_include_directive : require

#include <params.glsl>
#include <color.glsl>
#include <floor_helpers.glsl>

layout(location = 0) in vec2 inUV;

layout(location = 0) out vec4 outColor;

float lod_of(vec2 uv) {
  vec2 scaled_uv = uv * u.texSize;
  vec2 dx = dFdx(scaled_uv);
  vec2 dy = dFdy(scaled_uv);
  float rho = max(length(dx), length(dy));
  return log2(rho);
}

float aniso_ratio(vec2 uv) {
  vec2 dx = dFdx(uv) * u.texSize;
  vec2 dy = dFdy(uv) * u.texSize;
  float l1 = length(dx);
  float l2 = length(dy);
  float longer = max(l1, l2);
  float shorter = min(l1, l2);
  
  return clamp(longer / shorter, 1.0, 16.0);
}

void main() {
  float lod   = lod_of(inUV);
  float ratio = aniso_ratio(inUV);

  if (u.mode == 3u) {
    outColor = vec4(lod / 16.0, ratio / 16.0, 0.0, 1.0);
    return;
  }

  vec3 col;
  if      (u.mode == 0u) col = linear_to_srgb(floor_sample(inUV));
  else if (u.mode == 1u) col = mip_color(lod);
  else                   col = heat(ratio / 16.0);
  outColor = vec4(col, 1.0);
}
