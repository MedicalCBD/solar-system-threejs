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

// Create starfield with square stars
function createStarfield() {
    const starGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5) // Square stars
    const starMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    })
    
    const starGroup = new THREE.Group()
    
    // Create 1000 stars
    for (let i = 0; i < 1000; i++) {
        const star = new THREE.Mesh(starGeometry, starMaterial)
        
        // Random position in a large sphere around the scene
        const radius = 500 + Math.random() * 500 // Between 500 and 1000 units from center
        const theta = Math.random() * Math.PI * 2 // Random angle around Y axis
        const phi = Math.acos(Math.random() * 2 - 1) // Random angle from Y axis
        
        star.position.x = radius * Math.sin(phi) * Math.cos(theta)
        star.position.y = radius * Math.cos(phi)
        star.position.z = radius * Math.sin(phi) * Math.sin(theta)
        
        // Random rotation for variety
        star.rotation.x = Math.random() * Math.PI
        star.rotation.y = Math.random() * Math.PI
        star.rotation.z = Math.random() * Math.PI
        
        // Random scale for different star sizes
        const scale = 0.5 + Math.random() * 1.5
        star.scale.set(scale, scale, scale)
        
        // Random brightness
        star.material.opacity = 0.3 + Math.random() * 0.7
        
        starGroup.add(star)
    }
    
    scene.add(starGroup)
    return starGroup
}

// Create the starfield
const starfield = createStarfield()


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
        { object: sun, title: "Binance Tweet", tweet: '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The face of unconditional love. <a href="https://t.co/wDyqPVktB5">pic.twitter.com/wDyqPVktB5</a></p>&mdash; Binance (@binance) <a href="https://twitter.com/binance/status/1974837032355520881?ref_src=twsrc%5Etfw">October 5, 2025</a></blockquote>' },
        { object: mercury.mesh, title: "CZ Binance Tweet", tweet: '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Who said crypto is stressful? <a href="https://t.co/gFPcX2lOxN">pic.twitter.com/gFPcX2lOxN</a></p>&mdash; CZ 🔶 BNB (@cz_binance) <a href="https://twitter.com/cz_binance/status/1852008179925762497?ref_src=twsrc%5Etfw">October 31, 2024</a></blockquote>' },
        { object: venus.mesh, title: "Hey iBinance Tweet", tweet: '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">This is a <a href="https://twitter.com/hashtag/CyberWishing?src=hash&amp;ref_src=twsrc%5Etfw">#CyberWishing</a> <br>1. Please leave your wish and the reason in the comments; <br>2. You will receive 1 BNB ($585) in your Binance account; <br>3. Only one entry per person per day.<br>4. Leave the first three digits of your Binance UID to confirm you\'re a Binance user; <br>5. Your… <a href="https://t.co/FOYOhUFBb1">pic.twitter.com/FOYOhUFBb1</a></p>&mdash; Yi He (@heyibinance) <a href="https://twitter.com/heyibinance/status/1911845602281095388?ref_src=twsrc%5Etfw">April 14, 2025</a></blockquote>' },
        { object: earth.mesh, title: "YZI Labs Tweet", tweet: '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">✨ A memorable evening as we hosted leaders from TradFi, Web3, and the visionaries driving the BNB ecosystem forward.<br><br>With trust at the center, lasting connections are built.<br><br>Thank you to everyone who joined us for this special dinner! 🥂 <a href="https://t.co/0pbSuDuqbz">pic.twitter.com/0pbSuDuqbz</a></p>&mdash; YZi Labs (@yzilabs) <a href="https://twitter.com/yzilabs/status/1974141032779690348?ref_src=twsrc%5Etfw">October 3, 2025</a></blockquote>' },
        { object: mars.mesh, title: "ZachXBT Tweet", tweet: '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">NEW LEAK: Price sheet of 200+ crypto influencers and their wallet addresses from a project they were recently contacted by to promote. <br><br>From 160+ accounts who accepted the deal I only saw &lt;5 accounts actually disclose the promotional posts as an advertisement. <a href="https://t.co/Kph9dUvDxB">pic.twitter.com/Kph9dUvDxB</a></p>&mdash; ZachXBT (@zachxbt) <a href="https://twitter.com/zachxbt/status/1962485396597776468?ref_src=twsrc%5Etfw">September 1, 2025</a></blockquote>' },
        { object: jupiter.mesh, title: "BinanceEvavvvva Tweet", tweet: '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I AM NOT ROBOT🥹 <a href="https://t.co/C982yK32XR">pic.twitter.com/C982yK32XR</a></p>&mdash; Eva🔶BNB (@BinanceEvavvvva) <a href="https://twitter.com/BinanceEvavvvva/status/1556418305493278727?ref_src=twsrc%5Etfw">August 7, 2022</a></blockquote>' },
        { object: saturn.mesh, title: "Giggle Academy Tweet", tweet: '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">🚀 Quick challenge time! ⏱️<br>🧲 Fridge Letter Fun 🐰Drag the correct letter to the fridge to match the picture\'s sound.<br>👉 Find more fun learning games in the Giggle Academy app! 📲<a href="https://t.co/YNx0badeTl">https://t.co/YNx0badeTl</a> <a href="https://t.co/icPHzBbIxp">pic.twitter.com/icPHzBbIxp</a></p>&mdash; Giggle Academy (@GiggleAcademy) <a href="https://twitter.com/GiggleAcademy/status/1972569294581256376?ref_src=twsrc%5Etfw">September 29, 2025</a></blockquote>' },
        { object: uranus.mesh, title: "BNB Chain Tweet", tweet: '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Build N Build <a href="https://t.co/hBs2YYy8xX">pic.twitter.com/hBs2YYy8xX</a></p>&mdash; BNB Chain (@BNBCHAIN) <a href="https://twitter.com/BNBCHAIN/status/1974670921601327513?ref_src=twsrc%5Etfw">October 5, 2025</a></blockquote>' },
        { object: neptune.mesh, title: "Aster DEX Tweet", tweet: '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Aster coded <a href="https://t.co/kPNlExGln6">https://t.co/kPNlExGln6</a></p>&mdash; Aster (@Aster_DEX) <a href="https://twitter.com/Aster_DEX/status/1971715276438995137?ref_src=twsrc%5Etfw">September 26, 2025</a></blockquote>' },
        { object: pluto.mesh, title: "Palucto Tweet", tweet: '<blockquote class="twitter-tweet"><p lang="fr" dir="ltr"><a href="https://twitter.com/search?q=%24Palu&amp;src=ctag&amp;ref_src=twsrc%5Etfw">$Palu</a> the Binance Mascot <br><br>0x02e75d28a8aa2a0033b8cf866fcf0bb0e1ee4444 <a href="https://t.co/qyYLtWbsgB">https://t.co/qyYLtWbsgB</a></p>&mdash; Palu on BNB (@palucto) <a href="https://twitter.com/palucto/status/1974433070758695134?ref_src=twsrc%5Etfw">October 4, 2025</a></blockquote>' },
        { object: moon.mesh, title: "Four.Meme Tweet", tweet: '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">🔥 BNB Chain is on fire!<br>Top 3 dApps in the past 24H:<br>🥇 PancakeSwap <a href="https://twitter.com/PancakeSwap?ref_src=twsrc%5Etfw">@PancakeSwap</a> <br>🥈 Aster <a href="https://twitter.com/Aster_DEX?ref_src=twsrc%5Etfw">@Aster_DEX</a> <br>🥉 <a href="https://t.co/IRnIR1BwDd">https://t.co/IRnIR1BwDd</a> 🚀<br><br>From memes to momentum — <a href="https://t.co/IRnIR1BwDd">https://t.co/IRnIR1BwDd</a> is now one of the core drivers of BNB Chain activity. The rise is real, and we\'re just getting… <a href="https://t.co/QocWNR4HYR">pic.twitter.com/QocWNR4HYR</a></p>&mdash; Four.Meme (@four_meme_) <a href="https://twitter.com/four_meme_/status/1973978373870530851?ref_src=twsrc%5Etfw">October 3, 2025</a></blockquote>' }
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

    // Starfield rotation for universe movement effect
    starfield.rotateY(0.0001)

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})