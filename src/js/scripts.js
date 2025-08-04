import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

import sunTexture from '../img/sun.jpg'
import mercuryTexture from '../img/mercury.jpg'
import venusTexture from '../img/venus.jpg'
import earthTexture from '../img/earth.jpg'
import marsTexture from '../img/mars.jpg'
import jupiterTexture from '../img/jupiter.jpg'
import saturnTexture from '../img/saturn.jpg'
import saturnRingTexture from '../img/saturn ring.png'
import uranusTexture from '../img/uranus.jpg'
import uranusRingTexture from '../img/uranus ring.png'
import neptuneTexture from '../img/neptune.jpg'
import plutoTexture from '../img/pluto.jpg'
import moonTexture from '../img/moon.jpg'

// renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio( window.devicePixelRatio );

document.body.appendChild(renderer.domElement)

// scene
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

const orbit = new OrbitControls(camera, renderer.domElement)

camera.position.set(-90, 140, 140)
orbit.update()

// light
const ambientLight = new THREE.AmbientLight('#444444', 0.3)
scene.add(ambientLight)

// directional light for better global illumination
const directionalLight = new THREE.DirectionalLight('#ffffff', 0.5)
directionalLight.position.set(0, 50, 0)
scene.add(directionalLight)

// loaders
const cubeTextureLoader = new THREE.CubeTextureLoader()
const textureLoader = new THREE.TextureLoader()

// scene background
renderer.setClearColor('#111111')


// sun
const sunGeo = new THREE.SphereGeometry(16, 30, 30)
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture),
    emissive: '#ffffcc',
    emissiveIntensity: 0.1
})
const sun = new THREE.Mesh(sunGeo, sunMat)
scene.add(sun)
//sun's light
const pointLight = new THREE.PointLight('#ffffff', 2, 300)
scene.add(pointLight)

// additional sun glow effect
const sunGlow = new THREE.PointLight('#ffffcc', 1, 150)
sunGlow.position.copy(sun.position)
scene.add(sunGlow)

// Raycaster for click detection
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

// Modal functionality
const modal = document.getElementById('sunModal')
const closeBtn = document.querySelector('.close')

// Hover effect variables
let hoveredObject = null
let originalMaterials = new Map()

// Close modal when clicking X
closeBtn.onclick = function() {
    modal.style.display = "none"
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none"
    }
}

// Handle mouse clicks
window.addEventListener('click', onMouseClick)

// Handle mouse movement for hover effects
window.addEventListener('mousemove', onMouseMove)

// Function to handle mouse clicks
function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    
    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera)
    
    // Check for clicks on different objects
    const objectsToCheck = [
        { object: sun, title: "Abstract Tweet", tweet: '<blockquote class="twitter-tweet" data-dnt="true" align="center" data-conversation="none"><p lang="en" dir="ltr">Hello to Abstract <a href="https://t.co/R0XAQy31t1">pic.twitter.com/R0XAQy31t1</a></p>&mdash; Abstract (@AbstractChain) <a href="https://twitter.com/AbstractChain/status/1950582215156363265?ref_src=twsrc%5Etfw">July 30, 2025</a></blockquote>' },
        { object: mercury.mesh, title: "Mason Tweet", tweet: '<blockquote class="twitter-tweet" data-dnt="true" align="center"><p lang="en" dir="ltr">Dare to dream <a href="https://t.co/lxmrxuQul0">pic.twitter.com/lxmrxuQul0</a></p>&mdash; Mason (@masoncags) <a href="https://twitter.com/masoncags/status/1922228923481436665?ref_src=twsrc%5Etfw">May 13, 2025</a></blockquote>' },
        { object: venus.mesh, title: "Coffee Tweet", tweet: '<blockquote class="twitter-tweet" data-dnt="true" align="center"><p lang="en" dir="ltr">Can&#39;t get liquidated if you aren&#39;t leveraged.<br><br>Comfy in spot for real. <a href="https://t.co/orr2Qz2Zej">pic.twitter.com/orr2Qz2Zej</a></p>&mdash; coffee (☕️,☕️) (@coffeexcoin) <a href="https://twitter.com/coffeexcoin/status/1952160689298006444?ref_src=twsrc%5Etfw">August 4, 2025</a></blockquote>' },
        { object: jupiter.mesh, title: "Phin Tweet", tweet: '<blockquote class="twitter-tweet" data-dnt="true" align="center"><p lang="en" dir="ltr">I am the marketing wizard now<br><br>🪄 <a href="https://t.co/NCHvn3BRVu">pic.twitter.com/NCHvn3BRVu</a></p>&mdash; Phin (@Phin_totten) <a href="https://twitter.com/Phin_totten/status/1899459600417452405?ref_src=twsrc%5Etfw">March 11, 2025</a></blockquote>' },
        { object: earth.mesh, title: "Hedge Tweet", tweet: '<blockquote class="twitter-tweet" data-dnt="true" align="center"><p lang="en" dir="ltr">Merry Absmas ✳️<br><br>2025 is the year where REAL users, cracked builders and entrepreneurs run shit onchain. <br><br>Abstract&#39;s Panoramic Governance Will Make Crypto Great Again<br><br>The people&#39;s chain is coming,<br>!soon <a href="https://t.co/q9PH1QTbVi">pic.twitter.com/q9PH1QTbVi</a></p>&mdash; Hedge 🐧 (@Hedgeguin) <a href="https://twitter.com/Hedgeguin/status/1871973689174216725?ref_src=twsrc%5Etfw">December 25, 2024</a></blockquote>' },
        { object: mars.mesh, title: "Michael Lee Tweet", tweet: '<blockquote class="twitter-tweet" data-dnt="true" align="center" data-conversation="none"><p lang="en" dir="ltr">Abstract might actually save ETH. <a href="https://t.co/ZXeBAKJd4u">pic.twitter.com/ZXeBAKJd4u</a></p>&mdash; Michael Lee (@CashBowie) <a href="https://twitter.com/CashBowie/status/1880017523472757018?ref_src=twsrc%5Etfw">January 16, 2025</a></blockquote>' },
        { object: saturn.mesh, title: "Cygaar Tweet", tweet: '<blockquote class="twitter-tweet" data-dnt="true" align="center"><p lang="en" dir="ltr">it&#39;s penguin season <a href="https://t.co/Sg04OeQKku">pic.twitter.com/Sg04OeQKku</a></p>&mdash; cygaar (@0xCygaar) <a href="https://twitter.com/0xCygaar/status/1868300863401517395?ref_src=twsrc%5Etfw">December 15, 2024</a></blockquote>' },
        { object: uranus.mesh, title: "Adrian Tweet", tweet: '<blockquote class="twitter-tweet" data-dnt="true" align="center"><p lang="en" dir="ltr">HAPPY ABSTRACT AUGUST TO THOSE WHO CELEBRATE <a href="https://t.co/tzVFNGpavQ">https://t.co/tzVFNGpavQ</a></p>&mdash; Adrian (@adrianslai) <a href="https://twitter.com/adrianslai/status/1951318819336487024?ref_src=twsrc%5Etfw">August 1, 2025</a></blockquote>' },
        { object: moon.mesh, title: "Jarrod Watts Tweet", tweet: '<blockquote class="twitter-tweet" data-dnt="true" align="center"><p lang="en" dir="ltr">You know I had to do it to em <a href="https://t.co/hPMaDfhC4M">pic.twitter.com/hPMaDfhC4M</a></p>&mdash; Jarrod Watts (@jarrodWattsDev) <a href="https://twitter.com/jarrodWattsDev/status/1864812201409962373?ref_src=twsrc%5Etfw">December 5, 2024</a></blockquote>' },
        { object: neptune.mesh, title: "Abril Tweet", tweet: '<blockquote class="twitter-tweet" data-dnt="true" align="center"><p lang="en" dir="ltr">abstract stream??? <a href="https://t.co/Le3gIjmrHE">pic.twitter.com/Le3gIjmrHE</a></p>&mdash; Abril (@abruzuc) <a href="https://twitter.com/abruzuc/status/1884696608647909791?ref_src=twsrc%5Etfw">January 29, 2025</a></blockquote>' },
        { object: pluto.mesh, title: "LucaNetz Tweet", tweet: '<blockquote class="twitter-tweet" data-dnt="true" align="center"><p lang="en" dir="ltr"><a href="https://twitter.com/search?q=%24PENGU&amp;src=ctag&amp;ref_src=twsrc%5Etfw">$PENGU</a> &amp; Pudgy Penguin NFT ETF.<br><br>First of its kind.<br><br>History 🫡 <a href="https://t.co/pFoD8LsnJI">pic.twitter.com/pFoD8LsnJI</a></p>&mdash; Luca Netz 🐧✳️ (@LucaNetz) <a href="https://twitter.com/LucaNetz/status/1902744528328527925?ref_src=twsrc%5Etfw">March 20, 2025</a></blockquote>' }
    ]
    
    for (let item of objectsToCheck) {
        const intersects = raycaster.intersectObject(item.object)
        if (intersects.length > 0) {
            showTweetModal(item.title, item.tweet)
            break
        }
    }
}

// Function to show tweet modal
function showTweetModal(title, tweet) {
    const modalTitle = document.getElementById('modalTitle')
    const tweetContent = document.getElementById('tweetContent')
    const loader = document.getElementById('loader')
    
    modalTitle.textContent = title
    tweetContent.innerHTML = tweet
    
    // Show loader and hide tweet content initially
    loader.style.display = "flex"
    tweetContent.style.display = "none"
    
    modal.style.display = "block"
    loadTwitterWidget()
}

// Function to load Twitter widget
function loadTwitterWidget() {
    // Remove existing script if any
    const existingScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')
    if (existingScript) {
        existingScript.remove()
    }
    
    // Create and append Twitter widget script
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    script.charset = 'utf-8'
    
    // Add event listener to detect when Twitter widget is loaded
    script.onload = function() {
        // Wait a bit for Twitter to render the widget
        setTimeout(() => {
            const loader = document.getElementById('loader')
            const tweetContent = document.getElementById('tweetContent')
            
            if (loader && tweetContent) {
                loader.style.display = "none"
                tweetContent.style.display = "block"
            }
        }, 2500) // Wait 2.5 seconds for Twitter to render
    }
    
    document.head.appendChild(script)
}

// Function to handle mouse movement for hover effects
function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    
    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera)
    
    // Get all clickable objects
    const clickableObjects = [
        sun, 
        mercury.mesh, 
        venus.mesh, 
        earth.mesh, 
        moon.mesh,
        mars.mesh, 
        jupiter.mesh, 
        saturn.mesh, 
        uranus.mesh, 
        neptune.mesh, 
        pluto.mesh
    ]
    const intersects = raycaster.intersectObjects(clickableObjects)
    
    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object
        
        if (hoveredObject !== intersectedObject) {
            // Remove hover effect from previous object
            if (hoveredObject) {
                removeHoverEffect(hoveredObject)
            }
            
            // Add hover effect to new object
            addHoverEffect(intersectedObject)
            hoveredObject = intersectedObject
        }
    } else {
        // Remove hover effect if mouse is not over any object
        if (hoveredObject) {
            removeHoverEffect(hoveredObject)
            hoveredObject = null
        }
    }
}

// Function to add hover effect
function addHoverEffect(object) {
    if (!originalMaterials.has(object)) {
        originalMaterials.set(object, object.material.clone())
    }
    
    // Create a glowing material
    const glowMaterial = object.material.clone()
    
    // Handle different material types
    if (glowMaterial.emissive) {
        // For materials with emissive property (like MeshStandardMaterial)
        glowMaterial.emissive.setHex(0x00ff00) // Green glow
        glowMaterial.emissiveIntensity = 0.5
    } else if (glowMaterial.color) {
        // For MeshBasicMaterial, we can only change the color
        const originalColor = glowMaterial.color.getHex()
        glowMaterial.color.setHex(0x00ff00) // Make it green
    }
    
    object.material = glowMaterial
    
    // Change cursor to pointer
    document.body.style.cursor = 'pointer'
}

// Function to remove hover effect
function removeHoverEffect(object) {
    const originalMaterial = originalMaterials.get(object)
    if (originalMaterial) {
        object.material = originalMaterial
    }
    
    // Reset cursor to default
    document.body.style.cursor = 'default'
}

// func that creates planets
const createPlanet = (size, texture, position, ring) => {
    const geo = new THREE.SphereGeometry(size, 30, 30)
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture),
        emissive: '#ffffcc',
        emissiveIntensity: 0.15
    })
    const mesh = new THREE.Mesh(geo, mat)
    const obj = new THREE.Object3D()
    obj.add(mesh)
    if(ring) {
        const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32)
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        })
        const ringMesh = new THREE.Mesh(ringGeo, ringMat)
        obj.add(ringMesh)
        ringMesh.position.x = position
        ringMesh.rotation.x = -0.5 * Math.PI
    }
    scene.add(obj)
    mesh.position.x  = position
    return {mesh, obj}
}

// planets
const mercury = createPlanet(3.2, mercuryTexture, 28)
const venus = createPlanet(5.8, venusTexture, 44)
const earth = createPlanet(6, earthTexture, 62)
const mars = createPlanet(6, marsTexture, 78)
const jupiter = createPlanet(12, jupiterTexture, 100)
const saturn = createPlanet(10, saturnTexture, 132, {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTexture
})
const uranus = createPlanet(7, uranusTexture, 176, {
    innerRadius: 7,
    outerRadius: 12,
    texture: uranusRingTexture
})
const neptune = createPlanet(7, neptuneTexture, 200)
const pluto = createPlanet(2.8, plutoTexture, 216)

// Give Pluto extra brightness like the sun
pluto.mesh.material.emissive.setHex(0xffffcc)
pluto.mesh.material.emissiveIntensity = 0.8

// Moon (Earth's satellite)
const moon = createPlanet(2, moonTexture, 68) // Using moon texture, positioned near Earth



// animate loop
function animate () {

    //self-rotation
    sun.rotateY(0.002)

    mercury.mesh.rotateY(0.002)
    venus.mesh.rotateY(0.001)
    earth.mesh.rotateY(0.01)
    moon.mesh.rotateY(0.008)
    mars.mesh.rotateY(0.009)
    jupiter.mesh.rotateY(0.002)
    saturn.mesh.rotateY(0.019)
    uranus.mesh.rotateY(0.015)
    neptune.mesh.rotateY(0.016)
    pluto.mesh.rotateY(0.004)

    //orbital-rotation
    mercury.obj.rotateY(0.002)
    venus.obj.rotateY(0.0075)
    earth.obj.rotateY(0.005)
    mars.obj.rotateY(0.004)
    jupiter.obj.rotateY(0.001)
    saturn.obj.rotateY(0.00045)
    uranus.obj.rotateY(0.0002)
    neptune.obj.rotateY(0.00005)
    pluto.obj.rotateY(0.000035)

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})