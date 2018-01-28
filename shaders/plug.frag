
uniform sampler2D sprite;
uniform float ratio;

varying vec2 vUv;

void main ()
{
	// float shade = sin(vUv.x*3.14159);
	gl_FragColor = texture2D(sprite, vUv);
	gl_FragColor.a *= .25 + .75 * ratio;
}