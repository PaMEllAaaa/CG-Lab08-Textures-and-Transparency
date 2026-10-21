#ifndef COLOR_GLSL_INCLUDED
#define COLOR_GLSL_INCLUDED

vec3 srgb_to_linear(vec3 c) {
  vec3 linear_low = c / 12.92;
  vec3 linear_high = pow((c + 0.055) / 1.055, vec3(2.4));
  // Pick low branch where c <= 0.04045, high branch otherwise
  return mix(linear_high, linear_low, lessThanEqual(c, vec3(0.04045)));
}

vec3 linear_to_srgb(vec3 c) {
  vec3 linear_low = c * 12.92;
  vec3 linear_high = 1.055 * pow(c, vec3(1/2.4)) - 0.055;
  return mix(linear_high, linear_low, lessThanEqual(c, vec3(0.0031308)));
}

vec3 albedo_check(vec3 lin) {
  float y = dot(lin, vec3(0.2126,0.7152,0.0722));

  vec3 grey_display = linear_to_srgb(vec3(y));
    
  // If y < 0.04, show blue. If y > 0.9, show red.
  vec3 out_color = mix(grey_display, vec3(0.0, 0.0, 1.0), step(y, 0.04));
  out_color = mix(out_color, vec3(1.0, 0.0, 0.0), step(0.9, y));

  return out_color;
}

#endif
