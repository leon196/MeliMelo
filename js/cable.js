
function Cable (count) {

	this.lineMaxLength = .2;
	this.lineMinLength = .15;
	this.lineAngle = .31;
	this.damping = .5;
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

	this.plugs = [new Plug(), new Plug()];
	this.mesh.add(this.plugs[0], this.plugs[1]);

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

	this.follow = function(pt, dir){
		var distl = distance(this.points[pt][0], this.points[pt][1], this.points[pt+dir][0], this.points[pt+dir][1]);
		var dirl = direction(this.points[pt][0], this.points[pt][1], this.points[pt+dir][0], this.points[pt+dir][1]);
		if (distl > this.lineMaxLength || distl < this.lineMinLength) {
			
			var dist = Math.min(this.lineMaxLength , Math.max(this.lineMinLength, distl));
			this.points[pt][0] = this.points[pt+dir][0]-dist*dirl[0]/distl;
			this.points[pt][1] = this.points[pt+dir][1]-dist*dirl[1]/distl;
		}
	}
	this.move = function (target) {
		
		// set selected
		var delta = [this.points[this.selected][0]-target[0], this.points[this.selected][1]-target[1]];
		this.points[this.selected][0] = lerp(this.points[this.selected][0], target[0], this.damping);
		this.points[this.selected][1] = lerp(this.points[this.selected][1], target[1], this.damping);
		var array = this.geometry.attributes.position.array;

		var last;
		// follow
		for (var i = 0; i < Math.max(this.selected, this.points.length-this.selected); i++) {
			var leftd = this.selected - i-1;
			var rightd = this.selected + i+1;
			if(leftd>=0){
				this.follow(leftd,1);
			}
			if(rightd<this.points.length){
				this.follow(rightd,-1);
			}
		}
		

		// update attributes
		var last = this.points.length-1;
		for (var quad = 0; quad < 4; ++quad) {
			// var dirPrev = direction(this.points[0][0], this.points[0][1], this.points[1][0], this.points[1][1]);
			// var dirNext = direction(this.points[last][0], this.points[last][1], this.points[last-1][0], this.points[last-1][1]);
			for (var pos = 0; pos < 2; ++pos) {
				// this.geometry.attributes.prev.array[quad*3+pos] = this.points[0][pos]+dirPrev[pos];
				this.geometry.attributes.next.array[quad*3+pos] = this.points[0][pos];
			}
		}
		this.plugs[0].target = [this.points[0][0], this.points[0][1], 0];
		this.plugs[0].angle = Math.atan2(this.points[1][1] - this.points[0][1], this.points[1][0] - this.points[0][0]);
		this.plugs[0].updateUniforms();
		this.plugs[1].target = [this.points[last][0], this.points[last][1], 0];
		this.plugs[1].angle = Math.atan2(this.points[last-1][1] - this.points[last][1], this.points[last-1][0] - this.points[last][0]);
		this.plugs[1].updateUniforms();

		for (var point = 0; point < this.points.length; ++point) {
			var next = Math.min(this.points.length-1, point+1);
			var prev = Math.max(0, point-1);
			for (var quad = 0; quad < 4; ++quad) {
				for (var pos = 0; pos < 2; ++pos) {
					this.geometry.attributes.position.array[(point*4+quad)*3+pos] = this.points[point][pos];
					this.geometry.attributes.next.array[(next*4+quad)*3+pos] = this.points[point][pos];
					this.geometry.attributes.prev.array[(prev*4+quad)*3+pos] = this.points[point][pos];
				}
			}
		}
		for (var quad = 0; quad < 4; ++quad) {
			var dirPrev = direction(this.points[0][0], this.points[0][1], this.points[1][0], this.points[1][1]);
			var dirNext = direction(this.points[last][0], this.points[last][1], this.points[last-1][0], this.points[last-1][1]);
			for (var pos = 0; pos < 2; ++pos) {
				// this.geometry.attributes.prev.array[quad*3+pos] = this.points[0][pos]+dirPrev[pos];
				this.geometry.attributes.next.array[(last*4+quad)*3+pos] = this.points[last][pos]+dirNext[pos];
			}
		}
		this.geometry.attributes.position.needsUpdate = true;
		this.geometry.attributes.next.needsUpdate = true;
		this.geometry.attributes.prev.needsUpdate = true;
	}
}