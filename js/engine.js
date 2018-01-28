
var PI2 = Math.PI/2.;

window.onload = function () {

	var frameElapsed = 0;
	var elapsed = 0;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
	camera.position.z = 5;
	var level, cursor, ui;
	var round = 0;
	var transition = false;
	var transitionDelay = 5.;
	var transitionStart = 0.;

	load(setup);

	function setup () {

		document.body.style.cursor = 'none';

		level = generateLevel(scene, round);

	 	cursor = new Cursor();
	 	scene.add(cursor);

	 	ui = new UI();
	 	scene.add(ui);

		document.addEventListener('keydown', Keyboard.onKeyDown);
	  	document.addEventListener('keyup', Keyboard.onKeyUp);
	  	document.addEventListener('mousemove', Mouse.onMove);
	  	document.addEventListener('mousedown', Mouse.onMouseDown);
	  	document.addEventListener('mouseup', Mouse.onMouseUp);

		requestAnimationFrame( update );
	}

	function checkGlobalConnexion(start, outlets){
		var toVisit = [];
		toVisit.push(start);
		var visited = [];
		var connected = [];
		var visiting = null;
		while(toVisit.length > 1){
			console.log("tovisit: "+toVisit);
			visiting = toVisit[toVisit.length-1];
				toVisit.pop();
				console.log("visiting " + visiting);
				if(connected.indexOf(visiting) == -1){
					connected.push(visiting);
					console.log("added connected "+connected);
				}
				visited.push(visiting);
				console.log(outlets[visiting].neighbors);
				for(var i =0; i< outlets[visiting].neighbors.length; i++){
					var neighborNum = outlets[visiting].neighbors[i].num
					console.log("voissin="+ neighborNum);
					if(visited.indexOf(neighborNum) == -1){
						toVisit.push(neighborNum);
						console.log("added "+neighborNum+" to visit");
					}
				}
			}
		return connected
	}

	function checkCollision(cables, selected){
		var seuil = 0.05;
		for( var i = 0; i<cables.length; i++){ // Tous les cables
			if(i != selected){
				for  (var j= 0; j < cables[selected].points.length-1; j++){ // Tous mes points
					for (var k= 0; k < cables[i].points.length; k++){ // Tous les points de c
						var distM = distance(cables[selected].points[j][0], cables[selected].points[j][1], cables[selected].points[j+1][0], cables[selected].points[j+1][1]);
						var centre = [distM*cables[selected].points[j][0], distM*cables[selected].points[j][1]];
						var d = distance(cables[i].points[k][0], cables[i].points[k][1] , centre[0], centre[1]);
						if( d < seuil){
							console.log("colidation");
							// return index cable + coordonnées points à bouger
						}
					}
				}	
			}
		}
	}

	function update (elapsed) {

		elapsed *= .001;
		var delta = Math.max(0, Math.min(1, elapsed - frameElapsed));
		var mousex = (Mouse.x/window.innerWidth)*2.-1.;
		var mousey = (1.-Mouse.y/window.innerHeight)*2.-1.;
		var lastMouseX = (Mouse.lastX/window.innerWidth)*2.-1.;
		var lastMouseY = (1.-Mouse.lastY/window.innerHeight)*2.-1.;
		var mouse = [mousex, mousey, 0];
		cursor.uniforms.mouse.value = mouse;
		cursor.setDefault();
		
		if (transition && transitionStart + transitionDelay < elapsed) {
			transition = false;
			resetLevel(scene, level);
			round += 1;
			level = generateLevel(scene, round);

		}

		if (transition == false) {
			if (Keyboard.Space.down) {
				transition = true;
				transitionStart = elapsed;
				Keyboard.Space.down = false;
			}

			var colliding = [];
			if (cursor.drag) {
				if (Mouse.down) {
					cursor.setGrab();
					level.cables[cursor.selected].move(mouse, delta);
					// level.cables[selected].checkCollision(level.cables);
				
				} else {
					cursor.drag = false;
					// level.cables[cursor.selected].slide([mousex-lastMouseX, mousey-lastMouseY]);
				}
			}

			for (var c = 0; c < level.cables.length; ++c) {

				// hit test
				var pointSelected = level.cables[c].hitTest(mouse);
				if (!cursor.drag && pointSelected != -1) {
					cursor.setHover();
					// grab
					if (Mouse.down) {
						cursor.drag = true;
						cursor.selected = c;
						level.cables[c].selected = pointSelected;
					}
				}
				level.cables[c].update(elapsed, delta);

				var plugs = level.cables[c].plugs;
				for (var p = 0; p < plugs.length; ++p) {
					var outlets = level.outlets;

					var plugged = false;
					var outletTarget = [0,0,0];
					for (var o = 0; o < outlets.length; ++o) {
						
						if (outlets[o].hitTestCircle(plugs[p].target[0], plugs[p].target[1], plugs[p].size)) {
							plugged = true;
							outletTarget = outlets[o].target;
							outlets[o].addNeighBor(plugs[1-p].outlet);
							plugs[p].outlet = o;
							//if(plugs[p].outlet != o){
								console.log("new connexion");
								
								var connexions = checkGlobalConnexion(o, outlets);
								if(connexions.length == outlets.length){
									console.log("ON a gagné !!! ");
								}
								console.log("connexions depuis:" + outlets[o].num + ":" + connexions);
							//}

							//break;
						} else {
							if(plugs[p].outlet == o){
								plugs[p].outlet = null;
								outlets[o].rmNeighBor(plugs[1-p].outlet);
							}
								
							
						}
					
					}

					if (plugged) {
						plugs[p].ratio = Math.min(1, plugs[p].ratio + .01);
						var points = level.cables[c].points;
						var index = p*(points.length-1);
						level.cables[c].moveAt(index, outletTarget, delta);
					} else {
						plugs[p].ratio = Math.max(0, plugs[p].ratio - .01);
					}
				}


				level.cables[c].updatePlugs();
				level.cables[c].updateGeometry();
				level.cables[c].updateUniforms(elapsed);
			}

			for (var o = 0; o < level.outlets.length; ++o) {
				level.outlets[o].updateUniforms(elapsed);
			}
		}
		
		if (transition && transitionStart + transitionDelay > elapsed) {
			var ratio = Math.max(0, Math.min(1, (elapsed-transitionStart)/transitionDelay));
			level.outlets.forEach(function(outlet){
				outlet.updateUniforms(elapsed);
				outlet.uniforms.size.value = outlet.size * (1.-ratio);
			})
			level.cables.forEach(function(cable){
				var point = cable.points[0];
				var pointNext = cable.points[1];
				var speed = .05;
				var dir = direction(pointNext[0],pointNext[1],point[0],point[1]);
				var dist = distance(pointNext[0],pointNext[1],point[0],point[1]);
				// cable.lineMaxLength *= 1.-ratio*.01;
				// cable.lineMinLength *= 1.-ratio*.01;
				cable.moveAt(0, [point[0]+dir[0]/dist*speed, point[1]+dir[1]/dist*speed, 0], delta);
				cable.updatePlugs();
				cable.updateGeometry();
				cable.updateUniforms(elapsed);
			})
		}

		renderer.render( scene, camera );
		frameElapsed = elapsed;
		requestAnimationFrame( update );
	}
}