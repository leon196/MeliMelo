
function Cable (count) {

	this.lineMaxLength = .2;
	this.lineMinLength = .15;
	this.lineAngle = .31;
	this.damping = .1;
	this.hitArea = .1;

	this.points = [];
	var salt = Math.random();
	for (var i = 0; i < count; ++i) {
		var a = i*(.2+.1*salt);
		var r = i*(.1+.1*salt);
		var x = Math.cos(a)*r;
		var y = Math.sin(a)*r;
		this.points.push([x+salt*.1, y-salt*.1,0]);
	}
	
	var attributes = {
		position: { array: [], itemSize: 3 },
		next: { array: [], itemSize: 3 },
		prev: { array: [], itemSize: 3 },
	}
	for (var i = 0; i < this.points.length; ++i) {
		var next = Math.min(this.points.length-1, i+1);
		var prev = Math.max(0, i-1);
		attributes.position.array.push(this.points[i][0], this.points[i][1],0);
		attributes.next.array.push(this.points[next][0], this.points[next][1],0);
		attributes.prev.array.push(this.points[prev][0], this.points[prev][1],0);
	}

	this.geometry = createGeometry(attributes);

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

	this.selected = 0;

	this.hitTest = function (mouse) {
		for (var i = 0; i < this.points.length; ++i) {
			var dist = distance(this.points[i][0], this.points[i][1], mouse[0], mouse[1]);
			if (dist < this.hitArea) {
				this.selected = i;
				return true;
			}
		}
		return false;
	}

	this.move = function (target) {
		
		// set selected
		this.points[this.selected][0] = target[0];
		this.points[this.selected][1] = target[1];
		var array = this.geometry.attributes.position.array;

		// follow
		for (var i = this.points.length-1; i > this.selected; --i) {
			var dist = distance(this.points[i][0], this.points[i][1], this.points[i-1][0], this.points[i-1][1]);
			var dir = direction(this.points[i][0], this.points[i][1], this.points[i-1][0], this.points[i-1][1]);
			if (dist > this.lineMaxLength) {
				// var angle = Math.atan2(this.points[i-1][0] - this.points[i][0], this.points[i-1][1] - this.points[i][1]);
				// if (i+1 < this.points.length-1) {
				// 	var next = Math.atan2(this.points[i+1][0] - this.points[i][0], this.points[i+1][1] - this.points[i][1]);
				// 	var prev = Math.atan2(this.points[i-1][0] - this.points[i][0], this.points[i-1][1] - this.points[i][1]);
				// 	if (Math.abs(next-prev) < this.lineAngle) {
				// 		var a = Math.atan2(dir[1],dir[0]) + this.lineAngle;
				// 		dir[0] = Math.cos(a);
				// 		dir[1] = Math.sin(a);
				// 	}
				// }
				this.points[i][0] = this.points[i-1][0]-this.lineMaxLength*dir[0]/dist;
				this.points[i][1] = this.points[i-1][1]-this.lineMaxLength*dir[1]/dist;
			} else if (dist < this.lineMinLength) {
				this.points[i][0] = this.points[i-1][0]-this.lineMinLength*dir[0]/dist;
				this.points[i][1] = this.points[i-1][1]-this.lineMinLength*dir[1]/dist;
			}
		}
		for (var i = 0; i < this.selected; ++i) {
			var dist = distance(this.points[i][0], this.points[i][1], this.points[i+1][0], this.points[i+1][1]);
			var dir = direction(this.points[i][0], this.points[i][1], this.points[i+1][0], this.points[i+1][1]);
			if (dist > this.lineMaxLength) {
				this.points[i][0] = this.points[i+1][0]-this.lineMaxLength*dir[0]/dist;
				this.points[i][1] = this.points[i+1][1]-this.lineMaxLength*dir[1]/dist;
			} else if (dist < this.lineMinLength) {
				this.points[i][0] = this.points[i+1][0]-this.lineMinLength*dir[0]/dist;
				this.points[i][1] = this.points[i+1][1]-this.lineMinLength*dir[1]/dist;
			}
		}

		// update attributes
		for (var quad = 0; quad < 4; ++quad) {
			for (var pos = 0; pos < 3; ++pos) {
				this.geometry.attributes.next.array[quad*3+pos] = this.points[0][pos];
				this.geometry.attributes.prev.array[quad*3+pos] = this.points[0][pos];
			}
		}
		for (var point = 0; point < this.points.length; ++point) {
			var next = Math.min(this.points.length-1, point+1);
			var prev = Math.max(0, point-1);
			for (var quad = 0; quad < 4; ++quad) {
				for (var pos = 0; pos < 3; ++pos) {
					this.geometry.attributes.position.array[(point*4+quad)*3+pos] = this.points[point][pos];
					this.geometry.attributes.next.array[(next*4+quad)*3+pos] = this.points[point][pos];
					this.geometry.attributes.prev.array[(prev*4+quad)*3+pos] = this.points[point][pos];
				}
			}
		}
		this.geometry.attributes.position.needsUpdate = true;
		this.geometry.attributes.next.needsUpdate = true;
		this.geometry.attributes.prev.needsUpdate = true;
	}
}