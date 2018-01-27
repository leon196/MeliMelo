
var PI2 = Math.PI/2.;

window.onload = function () {

	var frameElapsed = 0;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
	camera.position.z = 5;
	var cables, outlets;
	var elapsed = 0;
	var drag = false;
	var selected = 0;

	var cursor;

	load(setup);

	function setup () {

		document.body.style.cursor = 'none';

		cables = [];
		cables.push(new Cable(10));
		cables.push(new Cable(10));
		cables.push(new Cable(10));
		for (var i = 0; i < cables.length; ++i) {
			scene.add(cables[i].mesh);
			cables[i].move([0,0]);
		}

		outlets = [];
		outlets.push(new Outlet());
		for (var i = 0; i < outlets.length; ++i) {
			scene.add(outlets[i]);
		}

	 	cursor = new Cursor();
	 	scene.add(cursor);

		document.addEventListener('keydown', Keyboard.onKeyDown);
  	document.addEventListener('keyup', Keyboard.onKeyUp);
  	document.addEventListener('mousemove', Mouse.onMove);
  	document.addEventListener('mousedown', Mouse.onMouseDown);
  	document.addEventListener('mouseup', Mouse.onMouseUp);

		requestAnimationFrame( update );
	}

	function update (elapsed) {

		elapsed *= .001;
		var delta = Math.max(0, Math.min(1, elapsed - frameElapsed));

		// var mousex = ((Mouse.x/window.innerWidth)*2.-1.)*5;
		// var mousey = ((1.-Mouse.y/window.innerHeight)*2.-1.)*5;
		var mousex = (Mouse.x/window.innerWidth)*2.-1.;
		var mousey = (1.-Mouse.y/window.innerHeight)*2.-1.;
		var mouse = [mousex, mousey, 0];

		cursor.uniforms.mouse.value = mouse;

		cursor.setDefault();

		for (var i = 0; i < cables.length; ++i) {
			cables[i].updateUniforms(elapsed);
			if (!drag && cables[i].hitTest(mouse)) {
				cursor.setHover();
				if (Mouse.down) {
					drag = true;
					selected = i;
				}
			}
		}

		if (drag) {
			if (Mouse.down) {
				cursor.setGrab();
				cables[selected].move(mouse);
				for (var o = 0; o < outlets.length; ++o) {
					outlets[o].updateUniforms(elapsed);
					var plugA = cables[selected].plugs[0];
					var plugB = cables[selected].plugs[1];
					if (outlets[o].hitTest(plugA.target[0], plugA.target[1], plugA.size, plugA.size)) {
						plugA.ratio = Math.min(1, plugA.ratio + .01);
					} else {
						plugA.ratio = Math.max(0, plugA.ratio - .01);
					}
				}
			} else {
				drag = false;
			}
		}

		renderer.render( scene, camera );
		frameElapsed = elapsed;

		requestAnimationFrame( update );
	}

}