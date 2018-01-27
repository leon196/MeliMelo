
var PI2 = Math.PI/2.;

window.onload = function () {

	var frameElapsed = 0;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
	var cables;
	var elapsed = 0;

	load(setup);

	function setup () {

		cables = [];
		cables.push(new Cable(10));
		for (var i = 0; i < cables.length; ++i) {
			scene.add(cables[i].mesh);
		}

		camera.position.z = 5;

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

		elapsed += delta;

		for (var i = 0; i < cables.length; ++i) {
			cables[i].hitTest(Mouse.down, [mousex, mousey, 0]);
		}

		renderer.render( scene, camera );
		frameElapsed = elapsed;

		requestAnimationFrame( update );
	}

}