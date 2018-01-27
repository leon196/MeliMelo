
uniform sampler2D sprite;

varying vec2 vUv;

void main ()
{
	// float shade = sin(vUv.x*3.14159);
	gl_FragColor = texture2D(sprite, vUv);
}