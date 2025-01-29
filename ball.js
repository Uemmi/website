// Scene + Camera + Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
// Enable shadow maps
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows
renderer.setClearColor("#FFDD57"); // Warm yellow gradient background
document.body.appendChild(renderer.domElement);
camera.position.z = 5;

// Resize canvas on window resize
window.addEventListener("resize", () => {
  let width = window.innerWidth;
  let height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

// Create a gradient texture with text
function createTexturedGradient() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  // Create a radial gradient for a smooth, shaded look
  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  gradient.addColorStop(0, "#FF69B4"); // Hot pink
  gradient.addColorStop(1, "#FFC0CB"); // Light pink

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add "Coming Soon" text
  ctx.font = "50px Arial";
  ctx.fillStyle = "#C4F5FC";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Coming Soon", 256, 256);

  return new THREE.CanvasTexture(canvas);
}

// Create a sphere with the textured gradient
const geometry = new THREE.SphereGeometry(1, 64, 64); // High segment count for smoothness
const material = new THREE.MeshStandardMaterial({
  map: createTexturedGradient(), // Texture with gradient and text
  metalness: 0.2,
  roughness: 0.8
});
const sphere = new THREE.Mesh(geometry, material);
sphere.castShadow = true; // Enable shadow casting
scene.add(sphere);

// Add lighting for 3D effect
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft ambient light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1); // Bright point light for highlights
pointLight.position.set(2, 3, 5); // Position the light for visible shadows
pointLight.castShadow = true; // Enable shadow casting for the light
pointLight.shadow.mapSize.width = 1024; // Increase shadow quality
pointLight.shadow.mapSize.height = 1024;
scene.add(pointLight);

// Add a shadow-only plane
const shadowPlaneGeometry = new THREE.PlaneGeometry(10, 10);
const shadowPlaneMaterial = new THREE.ShadowMaterial({ opacity: 0.5 }); // Shadow-only material
const shadowPlane = new THREE.Mesh(shadowPlaneGeometry, shadowPlaneMaterial);
shadowPlane.rotation.x = -Math.PI / 2; // Lay flat
shadowPlane.position.y = -1; // Position below the sphere
shadowPlane.receiveShadow = true; // Enable shadow receiving
scene.add(shadowPlane);

// Scroll interaction: Rotate sphere based on scroll
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  sphere.rotation.y = scrollY * 0.1; // Rotate around the Y-axis based on scroll
});

// Animation loop for rotation and rendering
function animate() {
  requestAnimationFrame(animate);

  // Rotate sphere continuously for visibility
  sphere.rotation.x += 0.01;
  sphere.rotation.z += 0.01;

  renderer.render(scene, camera);
}
animate();
