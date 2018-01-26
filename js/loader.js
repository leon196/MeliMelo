
let textures = {};
let textureLoader = new THREE.TextureLoader();
let textureLoaded = 0;
let textureUrls = [
];
let textureCount = textureUrls.length;

let shaders = {};
let shaderLoader = new THREE.FileLoader();
let shaderLoaded = 0;
let shaderUrls = [
	{ name:'cable.frag', url:'shaders/cable.frag' },
	{ name:'cable.vert', url:'shaders/cable.vert' },
];
let shaderCount = shaderUrls.length;

var callbackOnLoad = null;

function loadedTexture (key, data) {
	textures[key] = data;
	if (Object.keys(textures).length == textureCount && Object.keys(shaders).length == shaderCount) {
		if (callbackOnLoad != null) {
			callbackOnLoad();
		}
	}
}

function loadedShader (key, data) {
	shaders[key] = data;
	if (Object.keys(textures).length == textureCount && Object.keys(shaders).length == shaderCount) {
		if (callbackOnLoad != null) {
			callbackOnLoad();
		}
	}
}

function load (callback) {
	callbackOnLoad = callback;
	textureUrls.forEach(item => { textureLoader.load(item.url, data => loadedTexture(item.name, data)); });
	shaderUrls.forEach(item => { shaderLoader.load(item.url, data => loadedShader(item.name, data)); });
}