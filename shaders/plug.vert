
uniform vec3 target;
uniform vec2 resolution;
uniform float angle;

varying vec2 vUv;

mat2 rot (float a) { float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }

void main ()
{
	vUv = uv;
	float aspect = resolution.x/resolution.y;
	vec3 pos = position*.2;
	pos.xy *= rot(angle);
	pos.x /= aspect;
	pos = target-pos;
	// pos *= .1;
	gl_Position = vec4(pos, 1);
}