
function Plug () {

	this.target = [0,0];
	this.size = .1;
	this.angle = 0.;

	this.uniforms = {
		time: { value: 0 },
		resolution: { value: [window.innerWidth, window.innerHeight] },
		target: { value: this.target },
		size: { value: this.size },
		angle: { value: this.angle },
	};
	var material = new THREE.ShaderMaterial({
		vertexShader: shaders['plug.vert'],
		fragmentShader: shaders['plug.frag'],
		uniforms: this.uniforms,
		side: THREE.DoubleSide,
	})
	THREE.Mesh.call(this, new THREE.PlaneGeometry(1, 1), material);

	this.updateUniforms = function (elapsed) {
		this.uniforms.time.value = elapsed;
		this.uniforms.target.value = this.target;
		this.uniforms.size.value = this.size;
		this.uniforms.angle.value = this.angle;
	}
}

Plug.prototype = Object.create(THREE.Mesh.prototype)
Plug.prototype.constructor = Plug