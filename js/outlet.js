
function Outlet() {

	this.target = [0,1,0];
	this.color = [1,0,0];
	this.size = .15;

	this.uniforms = {
		time: { value: 0 },
		resolution: { value: [window.innerWidth, window.innerHeight] },
		target: { value: this.target },
		color: { value: this.color },
		size: { value: this.size },
	};
	var material = new THREE.ShaderMaterial({
		vertexShader: shaders['outlet.vert'],
		fragmentShader: shaders['outlet.frag'],
		uniforms: this.uniforms,
		side: THREE.DoubleSide,
	})
	THREE.Mesh.call(this, new THREE.PlaneGeometry(1, 1), material);

	this.hitTest = function (x, y, w, h) {
		return x > this.target[0]-this.size && x < this.target[0]+this.size
				&& y > this.target[1]-this.size && y < this.target[1]+this.size;
	}

	this.updateUniforms = function (elapsed) {
		this.uniforms.time.value = elapsed;
		this.uniforms.size.value = this.size;
		this.uniforms.target.value = this.target;
	}
}

Outlet.prototype = Object.create(THREE.Mesh.prototype)
Outlet.prototype.constructor = Outlet