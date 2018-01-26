
varying vec2 vAnchor;

void main ()
{
	// float shade = sin((vAnchor.x*.5+.5)*3.14159);
	float shade = 1.;
	gl_FragColor = vec4(shade);
}