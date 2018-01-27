
var PI2 = Math.PI/2.;

window.onload = function () {

	var frameElapsed = 0;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
	camera.position.z = 5;
	var cables;
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

		var delta = Math.max(0, Math.min(1, elapsed - frameElapsed));

		// var mousex = ((Mouse.x/window.innerWidth)*2.-1.)*5;
		// var mousey = ((1.-Mouse.y/window.innerHeight)*2.-1.)*5;
		var mousex = (Mouse.x/window.innerWidth)*2.-1.;
		var mousey = (1.-Mouse.y/window.innerHeight)*2.-1.;
		var mouse = [mousex, mousey, 0];

		cursor.uniforms.mouse.value = mouse;

		elapsed += delta;
		cursor.setDefault();

		if (drag) {
			if (Mouse.down) {
				cursor.setGrab();
				cables[selected].move(mouse);
			} else {
				drag = false;
			}
		} else {
			for (var i = 0; i < cables.length; ++i) {
				if (cables[i].hitTest(mouse)) {
					cursor.setHover();
					if (Mouse.down) {
						drag = true;
						selected = i;
					}
					break;
				}
			}
		}

		renderer.render( scene, camera );
		frameElapsed = elapsed;

		requestAnimationFrame( update );
	}

}