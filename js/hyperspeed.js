/**
 * AWS Student Builder Group - RGUKT Ongole
 * Hyperspeed Three.js WebGL Particle Starfield Background
 * Faithful integration of React1Background.html reference implementation.
 * Self-hosted Three.js (vendor/three/three.module.js) with 0 external dependencies.
 * Non-blocking (pointer-events: none), performant, and responsive.
 */

import * as THREE from '../vendor/three/three.module.js';

(function initHyperspeedBackground() {
  const container = document.getElementById('hyperspeed-canvas-container');
  if (!container) return;

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Configuration from reference React1Background.html
  const isMobile = window.innerWidth < 768;
  const CONF = {
    starCount: isMobile ? 3500 : 6000,
    color: 0xffffff, // Crisp starlight warp streaks matching React1Background.html
    speed: prefersReducedMotion ? 0.02 : 0.2, // Reference speed
    size: 0.5,
    fov: 60
  };

  // Setup Scene & Fog
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.002);

  // Setup Perspective Camera
  const camera = new THREE.PerspectiveCamera(
    CONF.fov,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 100;

  // WebGL Renderer
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
  } catch (err) {
    console.warn('WebGL initialization fallback:', err);
    return;
  }

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Canvas styling to sit securely behind all page UI
  const canvas = renderer.domElement;
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  canvas.setAttribute('aria-hidden', 'true');

  // Clear existing children if any
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  container.appendChild(canvas);

  // Create Stars (Hyperspeed Effect Geometry)
  const starGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(CONF.starCount * 3);
  const velocities = new Float32Array(CONF.starCount);

  for (let i = 0; i < CONF.starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 400;     // X
    positions[i * 3 + 1] = (Math.random() - 0.5) * 400; // Y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 400; // Z
    velocities[i] = Math.random() * 0.5 + 0.5;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));

  // Custom Shader Material for continuous streaks
  const starMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(CONF.color) },
      time: { value: 0 },
      speed: { value: CONF.speed }
    },
    vertexShader: `
      uniform float time;
      uniform float speed;
      attribute float velocity;
      varying float vOpacity;
      
      void main() {
        vec3 pos = position;
        
        // Animate Z position: move star towards camera based on time
        float zOffset = mod(pos.z + (time * speed * 100.0 * velocity), 400.0);
        pos.z = zOffset - 200.0;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        
        // Size attenuation: stars closer to camera appear larger
        gl_PointSize = (200.0 / -mvPosition.z);
        
        // Opacity fade based on depth
        float depth = -mvPosition.z;
        vOpacity = smoothstep(0.0, 100.0, depth) * (1.0 - smoothstep(150.0, 200.0, depth));
        
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      varying float vOpacity;
      
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        if (length(coord) > 0.5) discard;
        gl_FragColor = vec4(color, vOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const starField = new THREE.Points(starGeo, starMaterial);
  scene.add(starField);

  // Animation Loop with power-saving visibility detection
  const clock = new THREE.Clock();
  let animationFrameId;
  let isTabActive = true;

  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
    if (isTabActive && !animationFrameId) {
      clock.start();
      animate();
    }
  });

  function animate() {
    if (!isTabActive) {
      animationFrameId = null;
      return;
    }
    animationFrameId = requestAnimationFrame(animate);

    starMaterial.uniforms.time.value = clock.getElapsedTime();

    if (!prefersReducedMotion) {
      starField.rotation.z += 0.001;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Responsive Viewport Resize Handling
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 100);
  });
})();
