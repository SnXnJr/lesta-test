import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { gsap } from "gsap";
import {getData} from './API'

import turret from '../images/textures/turret.png';
import armor from '../images/textures/armor.png';
import tracks from '../images/textures/tracks.png';

let scene, renderer, camera, model, controls;
let raycaster, mouse, turretPlane, armorPlane, tracksPlane;

let mouseX = 0, mouseY = 0;

let focus = false;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

const tankURL = new URL('../model/tank.glb', import.meta.url)

init();

function init(){

    const app = document.getElementById( 'app' );

    scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x4B4B4B );
        scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2()

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
        

    renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.outputEncoding = THREE.sRGBEncoding;
        app.appendChild(renderer.domElement)

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 20 );
        camera.position.set( 0, 1, 8 );

    const textureLoader = new THREE.TextureLoader();

    const turretGeometry = new THREE.PlaneGeometry(0.5,0.5);
    const turretMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        map: textureLoader.load(turret)
    });
    turretPlane = new THREE.Mesh(turretGeometry, turretMaterial);
        turretPlane.name = 'turret';
        turretPlane.position.set(0,1.5,1.5);
        scene.add(turretPlane)

    const armorGeometry = new THREE.PlaneGeometry(0.5,0.5);
    const armorMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        map: textureLoader.load(armor)
    });
    armorPlane = new THREE.Mesh(armorGeometry, armorMaterial);
        armorPlane.name = 'armor';
        armorPlane.position.set(-1.4,0.3,2.5);
        scene.add(armorPlane)

    const tracksGeometry = new THREE.PlaneGeometry(0.5,0.5);
    const tracksMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        map: textureLoader.load(tracks)
    });
    tracksPlane = new THREE.Mesh(tracksGeometry, tracksMaterial);
        tracksPlane.name = 'tracks';
        tracksPlane.position.set(1.4,-0.3,2);
        scene.add(tracksPlane)

    controls = new OrbitControls( camera, renderer.domElement );
        controls.enableZoom = false;
        controls.enableRotate = false;
        controls.enablePan = false;
        controls.target.set( 0.5, 0, 0 );
        controls.maxDistance = 8;
        controls.update();

    window.addEventListener( 'resize', onWindowResize );

    renderer.domElement.addEventListener( 'pointermove', onPointerMove );
    renderer.domElement.addEventListener('click', onClick, false);

}


function onClick(e) {

  e.preventDefault();

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    switch (intersects[0]?.object?.name) {
        case 'turret':    
            getData('turret');        
            cameraMove(0.009016628934921101, 1.9947699849610008, 4.449655364921369, 1, 'power3.inOut' , true)
            break;
        case 'armor':
            getData('armor');
            cameraMove(-1.4352435511428288, 0.3870118192955556, 4.6442350564652415, 1, 'power3.inOut', true)
            break;
        case 'tracks':
            getData('tracks');
            cameraMove(2.6090124846041998, -0.19104929753311628, 3.823187137442257, 1, 'power3.inOut', true)
            break;
        default:
            getData('total');
            cameraMove();
            break;
    }
  } else {
    getData('total');
    cameraMove();
  }

}

function cameraMove(x = 0, y = 1, z = 8, duration = 1, ease = 'power3.inOut', val = false){
    if (val) focus = val
    gsap.to(camera.position,
        {
            x: x,
            y: y,
            z: z,
            duration: duration,
            ease: ease,
            onComplete: () => {
                if (!val) focus = val
            }
        })
}

function onPointerMove( event ) {

    if ( event.isPrimary === false ) return;

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    turretPlane.lookAt(camera.position)
    armorPlane.lookAt(camera.position)
    tracksPlane.lookAt(camera.position)
    
    if (!focus) {
        camera.position.x += ( mouseX - camera.position.x ) * 0.0005;
        camera.position.y += ( - mouseY - camera.position.y ) * 0.0005;
        camera.position.z = 8;
        camera.lookAt( scene.position );
    }

    controls.update();
    renderer.render( scene, camera );
}