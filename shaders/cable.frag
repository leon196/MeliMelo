	
uniform float time;
uniform float ratioA;
uniform float ratioB;
varying vec2 vAnchor;
varying float vPath;

void main ()
{
	// float alpha = sin((vAnchor.x*.5+.5)*3.14159);
	// alpha = 1.;
	float alpha = 1.-abs(vAnchor.x);
	alpha *= abs((vAnchor.y-1.)/.1);
	alpha = step(.2, alpha);
	// if (alpha < .5) { discard; }
	// alpha = smoothstep(.0,.5,alpha);
	// float t = .5+.5*sin(time);
	float a = step(vPath, ratioA);
	float b = step(1.-vPath, ratioB);
	gl_FragColor = vec4(a, b,1,  alpha);
}