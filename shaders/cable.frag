
varying vec2 vAnchor;

void main ()
{
	// float shade = sin((vAnchor.x*.5+.5)*3.14159);
	// shade = 1.;
	float shade = 1.-abs(vAnchor.x);
	shade *= abs((vAnchor.y-1.)/.1);
	shade = step(.2, shade);
	if (shade < .5) { discard; }
	// shade = smoothstep(.0,.5,shade);
	gl_FragColor = vec4(shade);
}