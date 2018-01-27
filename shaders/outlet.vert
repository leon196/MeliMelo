
uniform float size;
uniform vec2 resolution;
uniform vec3 target;

void main () {

	float aspect = resolution.x/resolution.y;
	vec3 pos = position*size*2.;
	pos.x /= aspect;
	pos = target-pos;
	pos.z = .2;
	gl_Position = vec4(pos, 1);

}