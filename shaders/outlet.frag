
uniform sampler2D sprite;
uniform vec3 color;

varying vec2 vUv;

void main () {
	gl_FragColor = texture2D(sprite, vUv);
}