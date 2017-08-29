precision highp float;

varying vec3 vPosition;
varying vec3 vPositionW;
varying vec3 vNormalW;

uniform sampler2D stripeTex;
uniform float stripeLength;
uniform float height;
uniform vec3 baseColor;
uniform vec3 borderColor;

uniform vec3 source1;
uniform float sourceDist1;
uniform float noiseAmplitude;
uniform float noiseFrequency;
uniform float fresnelBias;
uniform float fresnelPower;
uniform vec3 cameraPosition;
uniform float fadingDistance;

void main(void) {
  float y = vPosition.y + height;
  float dY = (y - floor(y / stripeLength) * stripeLength);
  vec2 stripeUv = vec2(dY / stripeLength, 0.5);

  vec3 viewDirectionW = normalize(cameraPosition - vPositionW);

  // Fresnel
	float fresnelTerm = (dot(viewDirectionW, vNormalW) + 1.) / 2.;
	//fresnelTerm = clamp(pow((cos(pow(fresnelTerm, fresnelPower) * 3.14) + 1.) / 2., fresnelBias), 0., 1.);
  //fresnelTerm = clamp(
  //  pow(
  //    (cos(pow(fresnelTerm, fresnelBias)*3.1415)+1.)/2.,
  //    fresnelPower
  //  ),
  //  0.,
  //  1.
  //);

  vec3 color = fresnelTerm * baseColor + (1. - fresnelTerm) * borderColor;

  gl_FragColor = texture2D(stripeTex, stripeUv) * vec4(color, (fresnelTerm + 0.5) / 2.);
}
