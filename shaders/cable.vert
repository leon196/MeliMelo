
#define e .00001

attribute vec2 indexMap, anchor;
attribute vec3 next, prev;
attribute float path;

uniform vec2 resolution;

varying vec2 vAnchor;
varying float vPath;

void main ()
{
	vAnchor = anchor;
	float aspect = resolution.x/resolution.y;
	float y = anchor.y*.5+.5;
	vPath = path-y/10.;
	vec3 pos = mix(position, next, y);
	// float y = anchor.y;
	// vec3 pos = mix(position, next, max(0., anchor.y));
	// pos = mix(pos, prev, max(0., -anchor.y));
	// vec3 pos = position;
	vec3 forward = normalize(next-position);
	vec3 right = vec3(forward.y, -forward.x, 0);
	right.x /= aspect;
	float thin = .02;
	pos += right * anchor.x * thin;
	pos += forward * step(-.99, anchor.y) * thin;
	// pos.xy += anchor * .1;
	pos.z = .3+anchor.y*.1;
	gl_Position = vec4(pos, 1);
	// vec2 pivot = anchor;
	// pivot.x /= resolution.x/resolution.y;
	// gl_Position.xy += pivot * .1;
}