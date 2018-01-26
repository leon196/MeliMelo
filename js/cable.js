
function Cable (count) {

	this.lineLength = .5;
	this.damping = .1;

	this.points = [];
	for (var i = 0; i < count; ++i) {
		this.points.push({x:i*.2, y:Math.sin(i*.1)});
	}
	
	var attributes = {
		position: { array: [], itemSize: 3 },
		next: { array: [], itemSize: 3 },
	}
	for (var i = 0; i < this.points.length-1; ++i) {
		attributes.position.array.push(this.points[i].x, this.points[i].y,0);
		attributes.next.array.push(this.points[i+1].x, this.points[i+1].y,0);
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
		this.points[0].x = target.x;
		this.points[0].y = target.y;
		// for (var i = 0; i < this.points.length-1; ++i) {
		for (var i = this.points.length-1; i > 0; --i) {
			// this.points[i].x = lerp(this.points[i].x, this.points[i-1].x, this.damping);
			// this.points[i].y = lerp(this.points[i].y, this.points[i-1].y, this.damping);
			var dist = distance(this.points[i-1].x, this.points[i-1].y, this.points[i].x, this.points[i].y);
			var dir = direction(this.points[i-1].x, this.points[i-1].y, this.points[i].x, this.points[i].y);
			// if (i == 1) {
			// 	console.log(dist);
			// 	console.log(dir);
			// }
			this.points[i].x = this.lineLength*dir[0]/dist;
			this.points[i].y = this.lineLength*dir[1]/dist;
		}
		var array = this.geometry.attributes.position.array;
		for (var i = 0; i < this.points.length-1; ++i) {
			this.geometry.attributes.position.array[i*3+0] = this.points[i].x;
			this.geometry.attributes.position.array[i*3+1] = this.points[i].y;
			this.geometry.attributes.position.array[i*3+3] = this.points[i].x;
			this.geometry.attributes.position.array[i*3+4] = this.points[i].y;
			this.geometry.attributes.next.array[Math.max(0,i-1)*3+0] = this.points[i].x;
			this.geometry.attributes.next.array[Math.max(0,i-1)*3+1] = this.points[i].y;
			this.geometry.attributes.next.array[Math.max(0,i-1)*3+3] = this.points[i].x;
			this.geometry.attributes.next.array[Math.max(0,i-1)*3+4] = this.points[i].y;
		}
		
		// this.geometry.attributes.position.array[0] = target[0];
		// this.geometry.attributes.position.array[1] = target[1];
		// this.geometry.attributes.position.array[3] = target[0];
		// this.geometry.attributes.position.array[4] = target[1];
		// // this.geometry.attributes.position.array[2] = target[2];
		// for (var i = array.length/3-1; i > 1; i -= 2) {
		// 	// var dist = distance(array[i*3], array[i*3+1], array[(i-1)*3], array[(i-1)*3+1]);
		// 	// var dir = direction(array[i*3], array[i*3+1], array[(i-1)*3], array[(i-1)*3+1]);
		// 	this.geometry.attributes.position.array[i*3] = i;//this.lineLength*dir[0]/dist;
		// 	this.geometry.attributes.position.array[i*3+1] = Math.sin(i*.1);//this.lineLength*dir[1]/dist;
		// }
		this.geometry.attributes.position.needsUpdate = true;
		this.geometry.attributes.next.needsUpdate = true;
	}
}