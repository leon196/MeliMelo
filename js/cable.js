
function Cable (count) {

	this.lineLength = .2;
	this.lineAngle = .31;
	this.damping = .1;

	this.points = [];
	for (var i = 0; i < count; ++i) {
		this.points.push([i*.2, Math.sin(i*.1),0]);
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

	this.selected = 0;
	this.drag = false;

	this.hitTest = function (clic, mouse) {
		if (this.drag) {
			if (clic) {
				this.move(this.selected, mouse);
			} else {
				this.drag = false;
			}
		} else {
			var hit = false;
			for (var i = 0; i < this.points.length; ++i) {
				var dist = distance(this.points[i][0], this.points[i][1], mouse[0], mouse[1]);
				// console.log(dist);
				if (dist < .1) {
					hit = true;
					if (clic) {
						this.drag = true;
						this.selected = i;
						break;
					}
				}
			}
			if (hit) {
				document.body.style.cursor = "pointer";
			} else {
				document.body.style.cursor = "default";
			}
		}
	}

	this.move = function (index, target) {
		
		// set selected
		this.points[index][0] = target[0];
		this.points[index][1] = target[1];
		var array = this.geometry.attributes.position.array;

		// follow
		for (var i = this.points.length-1; i > index; --i) {
			var dist = distance(this.points[i][0], this.points[i][1], this.points[i-1][0], this.points[i-1][1]);
			var dir = direction(this.points[i][0], this.points[i][1], this.points[i-1][0], this.points[i-1][1]);
			if (dist > this.lineLength) {
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
				this.points[i][0] = this.points[i-1][0]-this.lineLength*dir[0]/dist;
				this.points[i][1] = this.points[i-1][1]-this.lineLength*dir[1]/dist;
			}
		}
		for (var i = 0; i < index; ++i) {
			var dist = distance(this.points[i][0], this.points[i][1], this.points[i+1][0], this.points[i+1][1]);
			var dir = direction(this.points[i][0], this.points[i][1], this.points[i+1][0], this.points[i+1][1]);
			if (dist > this.lineLength) {
				this.points[i][0] = this.points[i+1][0]-this.lineLength*dir[0]/dist;
				this.points[i][1] = this.points[i+1][1]-this.lineLength*dir[1]/dist;
			}
		}

		// update attributes
		for (var i = 0; i < this.points.length; ++i) {
			var next = Math.min(this.points.length-1, i+1);
			var prev = Math.max(0, i-1);
			for (var q = 0; q < 4; ++q) {
				for (var p = 0; p < 3; ++p) {
					this.geometry.attributes.position.array[(i*4+q)*3+p] = this.points[i][p];
					this.geometry.attributes.next.array[(next*4+q)*3+p] = this.points[i][p];
					this.geometry.attributes.prev.array[(prev*4+q)*3+p] = this.points[i][p];
				}
			}
		}
		this.geometry.attributes.position.needsUpdate = true;
		this.geometry.attributes.next.needsUpdate = true;
		this.geometry.attributes.prev.needsUpdate = true;
	}
}