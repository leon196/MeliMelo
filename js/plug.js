
function Plug () {

	this.uniforms = {
		resolution: { value: [window.innerWidth, window.innerHeight] },
		target: { value: [0,0] },
		angle: { value: 0 },
	};
	var material = new THREE.ShaderMaterial({
		vertexShader: shaders['plug.vert'],
		fragmentShader: shaders['plug.frag'],
		uniforms: this.uniforms,
		side: THREE.DoubleSide,
	})
	THREE.Mesh.call(this, new THREE.PlaneGeometry(1, 1), material);
}

Plug.prototype = Object.create(THREE.Mesh.prototype)
Plug.prototype.constructor = Plug