
function Cable (count) {

	this.lineLength = .5;
	this.damping = .1;

	this.points = [];
	for (var i = 0; i < count; ++i) {
		this.points.push([i*.2, Math.sin(i*.1),0]);
	}
	
	var attributes = {
		position: { array: [], itemSize: 3 },
		next: { array: [], itemSize: 3 },
	}
	for (var i = 0; i < this.points.length-1; ++i) {
		attributes.position.array.push(this.points[i][0], this.points[i][1],0);
		attributes.next.array.push(this.points[i+1][0], this.points[i+1][1],0);
	}

	this.geometry = createGeometry(attributes, [1,1]);

	this.uniforms = {
		time: { value: 0 },
		resolution: { value: [window.innerWidth, window.innerHeight] },
	};

	this.material = new THREE.ShaderMaterial( {
		vertexShader: shaders['cable.vert'],
		fragmentShader: shaders['cable.frag'],
		uniforms: this.uniforms,
		side: THREE.DoubleSide,
	});

	this.mesh = new THREE.Mesh(this.geometry, this.material);

	this.move = function (target) {
		this.points[0][0] = target[0];
		this.points[0][1] = target[1];
		// for (var i = 0; i < this.points.length-1; ++i) {
		for (var i = this.points.length-1; i > 0; --i) {
			this.points[i][0] = lerp(this.points[i][0], this.points[i-1][0], this.damping);
			this.points[i][1] = lerp(this.points[i][1], this.points[i-1][1], this.damping);
			// var dist = distance(this.points[i-1][0], this.points[i-1][1], this.points[i][0], this.points[i][1]);
			// var dir = direction(this.points[i-1][0], this.points[i-1][1], this.points[i][0], this.points[i][1]);
			// this.points[i][0] = this.lineLength*dir[0]/dist;
			// this.points[i][1] = this.lineLength*dir[1]/dist;
		}
		var array = this.geometry.attributes.position.array;
		for (var q = 0; q < 4; ++q) {
			for (var p = 0; p < 3; ++p) {
				this.geometry.attributes.position.array[q*3+p] = this.points[0][p];
			}
		}

		for (var i = 1; i < this.points.length; ++i) {
			for (var q = 0; q < 4; ++q) {
				for (var p = 0; p < 3; ++p) {
					this.geometry.attributes.position.array[(i*4+q)*3+p] = this.points[i][p];
					this.geometry.attributes.next.array[((i-1)*4+q)*3+p] = this.points[i][p];
				}
			}
		}
		this.geometry.attributes.position.needsUpdate = true;
		this.geometry.attributes.next.needsUpdate = true;
	}
}