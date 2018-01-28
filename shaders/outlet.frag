
uniform sampler2D sprite;
uniform vec3 color;

varying vec2 vUv;

void main () {
	// float circle = texture2D(sprite, vUv).r;
	vec2 uv = vUv;
	uv -= .5;
	// uv *= 1.1;
	// uv += .5;
	float circle = .01/abs(length(uv)-.2);
	// circle *= 1.-texture2D(sprite, uv).r;
	gl_FragColor = vec4(circle);
}