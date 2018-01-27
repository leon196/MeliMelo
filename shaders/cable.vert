
#define e .00001

attribute vec2 indexMap, anchor;
attribute vec3 next, prev;

uniform vec2 resolution;

varying vec2 vAnchor;

void main ()
{
	vAnchor = anchor;
	float aspect = resolution.x/resolution.y;
	vec3 pos = mix(position, next, anchor.y*.5+.5);
	// vec3 pos = position;
	vec3 forward = normalize(next-position);
	vec3 right = vec3(forward.y, -forward.x, 0) / aspect;
	pos.xyz += right * anchor.x * .03;
	// pos.xy += anchor * .1;
	gl_Position = vec4(pos, 1);
	// vec2 pivot = anchor;
	// pivot.x /= resolution.x/resolution.y;
	// gl_Position.xy += pivot * .1;
}