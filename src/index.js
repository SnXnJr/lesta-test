import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

let scene, renderer, camera, model, controls;
const tankURL = new URL('assets/model/tank.glb', import.meta.url)
const mouse = {
    x: -1,
    y: -1
};

init();

function init(){

    const app = document.getElementById( 'app' );

    scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xa0a0a0 );
        scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        hemiLight.position.set( 0, 20, 0 );
        scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( 3, 10, 10 );
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 2;
        dirLight.shadow.camera.bottom = - 2;
        dirLight.shadow.camera.left = - 2;
        dirLight.shadow.camera.right = 2;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 40;
        scene.add( dirLight );
    
    const loader = new GLTFLoader();
        loader.load( tankURL.href, function ( gltf ) {
            model = gltf.scene;
            scene.add( model );

            animate();
        });

    window.addEventListener( 'mousemove', function(e){
        e.preventDefault();

        mouse.x = (e.clientX / window.innerWidth) * 6;
        mouse.y = -(e.clientY / window.innerHeight) * -10;

        // console.log(mouse.x);

        camera.position.x = mouse.x;
        // camera.position.y = mouse.y; 
    } );

    renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.outputEncoding = THREE.sRGBEncoding;
        app.appendChild(renderer.domElement)

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
        camera.position.set( 5, 2, 8 );

    controls = new OrbitControls( camera, renderer.domElement );
        controls.enableZoom = false;
        controls.enableRotate = false;
        controls.enablePan = false;
        controls.target.set( -1, -1, 0 );
        controls.update();

    window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    controls.update();

    renderer.render( scene, camera );
}