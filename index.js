// Scene + Camera + Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
// Set renderer background color
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

// Create a gradient texture for the ball
function createGradientTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  // Create a radial gradient for a smooth, shaded look
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, "#FF69B4"); // Hot pink
  gradient.addColorStop(1, "#FFC0CB"); // Light pink

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return new THREE.CanvasTexture(canvas);
}

// Create a sphere with the gradient texture
const geometry = new THREE.SphereGeometry(1, 64, 64); // High segment count for smoothness
const material = new THREE.MeshStandardMaterial({
  map: createGradientTexture(), // Gradient texture
  metalness: 0.2,               // Add subtle metallic shine
  roughness: 0.8                // Control roughness for a matte look
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Add lighting for 3D effect
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft ambient light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1); // Bright point light for highlights
pointLight.position.set(2, 3, 5); // Position the light for visible shadows
scene.add(pointLight);

// Add a helper for debugging light position (optional)
// const lightHelper = new THREE.PointLightHelper(pointLight);
// scene.add(lightHelper);

// Scroll interaction: Rotate sphere based on scroll
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  sphere.rotation.y = scrollY * 0.01; // Rotate around the Y-axis based on scroll
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
