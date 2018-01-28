
function generateLevel (scene, round) {

	var cables = [];
	var lineLength = 30 + round;
	var cableCount = 3 + round;
	for (var c = 0; c < cableCount; ++c) {
		var cable = new Cable();
		var salt = Math.random();
		for (var i = 0; i < lineLength; ++i) {
			var a = i*(.3+.1*salt);
			var r = .4+((lineLength-i)/lineLength)*(.005+.01*salt);
			var x = Math.cos(a)*r/(window.innerWidth/window.innerHeight);
			var y = Math.sin(a)*r;
			cable.points.push([x+salt*.1, y-salt*.1,0]);
		}
		cable.setup();
		cables.push(cable);
		scene.add(cable.mesh);
	}

	var outlets = [];
	var outletCount = cableCount+1;
	var dimension = 8;
	var grid = [];
	for (var g = 0; g < dimension*dimension; ++g) {
		grid.push(g);
	}
	grid = shuffle(grid);
	for (var c = 0; c < outletCount; ++c) {
		var outlet = new Outlet();
		var x = ((grid[c]%dimension)/dimension)*2.-1.;
		var y = (Math.floor(grid[c]/dimension)/dimension)*2.-1.;
		outlet.target = [x*.8, y*.8, 0];
		outlets.push(outlet);
		scene.add(outlet);
	}

	return { cables: cables, outlets: outlets };
}