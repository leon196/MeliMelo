
uniform sampler2D sprite;
uniform float ratio;

varying vec2 vAnchor;

void main ()
{
	// float shade = sin(vUv.x*3.14159);
	// gl_FragColor = texture2D(sprite, vUv);
	float dist = length(vAnchor);
	float alpha = 1.-smoothstep(.45,.5,dist);
	alpha *= .25 + .75 * ratio;
	// alpha *= 1./dist;
	gl_FragColor = vec4(vec3(1),alpha);
}