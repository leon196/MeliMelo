
attribute vec2 indexMap, anchor;
attribute vec3 next;

uniform vec2 resolution;

varying vec2 vAnchor;

void main ()
{
	vAnchor = anchor;

	vec3 pos = mix(position, next, anchor.y*.5+.5);
	// vec3 pos = position;
	vec3 forward = normalize(next-position);
	vec3 right = vec3(forward.y, -forward.x, 0);
	pos.xyz += right * anchor.x * .1;
	// pos.xy += anchor * .1;
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
	// vec2 pivot = anchor;
	// pivot.x /= resolution.x/resolution.y;
	// gl_Position.xy += pivot * .1;
}