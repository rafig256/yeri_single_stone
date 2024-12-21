import * as THREE from 'three'
import './style.css'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

const gui = new GUI();

const frontImage = new Image()
const frontTexture = new THREE.Texture(frontImage)

frontImage.onload = () => {
    frontTexture.needsUpdate = true
}
frontImage.src = '/textures/stone/RedRockBaseColor.png'
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const boxGeometry = new THREE.BoxGeometry(2, 4, 1,2,2,2); // عرض، ارتفاع، عمق
const boxMaterial = new THREE.MeshStandardMaterial({
    map: frontTexture
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.y = 2; // بالاتر بردن منشور

//ایجاد دیسک
const coinGeometry = new THREE.CylinderGeometry(1, 1, 1, 64); // شعاع بالا، شعاع پایین، ضخامت = 1، تعداد اضلاع = 64
const coinMaterial = new THREE.MeshStandardMaterial({
    map: frontTexture,
    roughness: 0.4,   // کمی زبری برای واقعی‌تر شدن
});
const coin = new THREE.Mesh(coinGeometry, coinMaterial);
coin.position.y = 4; // بالاتر بردن سکه
coin.rotation.z = Math.PI/2
coin.rotation.y = Math.PI/2


// گروه‌بندی منشور و نیم‌کره
const group = new THREE.Group();
group.add(box);
group.add(coin);

// اضافه کردن گروه به صحنه
scene.add(group);

//debug object
gui.add(coin.position, 'y')
    .min(0)
    .max(5)
    .step(0.5)
    .name('box height');
gui.add(coin.material, 'wireframe')
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);


// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    //update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    //update renderer
    renderer.setSize(sizes.width, sizes.height)
})

//coursor
const coursor = {
    x: 0,
    y: 0,
    z: 0
}
window.addEventListener('mousemove', (event) => {
    coursor.x = event.clientX / sizes.width - 0.5
    coursor.y = -(event.clientY / sizes.height - 0.5)
})

//Axcis
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(1,3,7)
scene.add(camera)

//Orbit controllers
const controls = new OrbitControls(camera , canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
//for high quality
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
const clock = new THREE.Clock()
const tick = () => {
    // Update objects
    const elapsedTime =  clock.getElapsedTime()

    //Update Camera
    // camera.position.x = Math.sin(coursor.x*Math.PI*2) * 3 + 1
    // camera.position.z = Math.cos(coursor.x*Math.PI*2) * 3
    // camera.position.y = coursor.y * 5 + 1
    // camera.lookAt(box.position)

    controls.update()

    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()