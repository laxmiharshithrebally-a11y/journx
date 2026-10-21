// RoadMate Pro — Next-Gen 3D Cinematic Scroll Drive Experience
// Features dynamic winding mountain highway, sports coupe, volumetric headlights, scroll-driven camera journey

export class IntroAnimation {
  constructor(containerId, onFinishCallback) {
    this.container = document.getElementById(containerId);
    this.onFinishCallback = onFinishCallback;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.carGroup = null;
    this.wheels = [];
    this.streetlights = [];
    this.roadStripeSegments = [];
    this.stars = null;
    this.clock = new THREE.Clock();

    // Scroll & Motion State
    this.scrollProgress = 0.0;
    this.smoothScroll = 0.0;
    this.speed = 1.0;
    this.isTransitioning = false;

    // Mouse Parallax
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    this.init();
  }

  init() {
    if (!this.container) return;

    // Scene & Twilight Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0e1a);
    this.scene.fog = new THREE.FogExp2(0x0a0e1a, 0.0065);

    // Camera
    this.camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.set(0, 3.2, 8.5);

    // WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0x272b45, 1.6);
    this.scene.add(ambient);

    const moonLight = new THREE.DirectionalLight(0x818cf8, 2.0);
    moonLight.position.set(30, 80, 50);
    this.scene.add(moonLight);

    const cyanRim = new THREE.PointLight(0x38bdf8, 2.5, 60);
    cyanRim.position.set(-15, 12, -20);
    this.scene.add(cyanRim);

    // Build World Elements
    this.buildStarfield();
    this.buildScenicHighway();
    this.buildRoadsideLights();
    this.buildMountainVistas();
    this.buildCyberVehicle();

    // Event Listeners
    this.bindScrollAndMouse();

    // Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  buildStarfield() {
    const starCount = 2200;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 1800;
      positions[i * 3 + 1] = Math.random() * 700 + 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1800 - 250;

      // Soft blue / purple / white stars
      const tint = Math.random();
      if (tint > 0.6) {
        colors[i * 3 + 0] = 0.78; colors[i * 3 + 1] = 0.85; colors[i * 3 + 2] = 1.0;
      } else if (tint > 0.3) {
        colors[i * 3 + 0] = 0.65; colors[i * 3 + 1] = 0.65; colors[i * 3 + 2] = 0.95;
      } else {
        colors[i * 3 + 0] = 1.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0;
      }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    this.stars = new THREE.Points(starGeo, starMat);
    this.scene.add(this.stars);
  }

  buildScenicHighway() {
    // 1. Asphalt Road Surface
    const roadGeo = new THREE.PlaneGeometry(16, 900, 1, 80);
    roadGeo.rotateX(-Math.PI / 2);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x080c16,
      roughness: 0.35,
      metalness: 0.82
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.position.set(0, 0, -360);
    this.scene.add(road);

    // 2. Neon Shoulders / Rails (Indigo Glow)
    const railMat = new THREE.LineBasicMaterial({ color: 0x6366f1, linewidth: 2 });
    const leftRailPts = [new THREE.Vector3(-7.5, 0.1, 90), new THREE.Vector3(-7.5, 0.1, -810)];
    const rightRailPts = [new THREE.Vector3(7.5, 0.1, 90), new THREE.Vector3(7.5, 0.1, -810)];

    this.scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(leftRailPts), railMat));
    this.scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rightRailPts), railMat));

    // 3. Dashed Center Highway Stripes
    const stripeGeo = new THREE.PlaneGeometry(0.32, 6.5);
    stripeGeo.rotateX(-Math.PI / 2);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    for (let z = 90; z > -810; z -= 14) {
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.set(0, 0.08, z);
      this.roadStripeSegments.push(stripe);
      this.scene.add(stripe);
    }
  }

  buildRoadsideLights() {
    // Passing Highway Light Posts
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.1, 7.5, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });

    const armGeo = new THREE.BoxGeometry(2.4, 0.1, 0.1);
    const lampMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const lampGeo = new THREE.SphereGeometry(0.24, 8, 8);

    for (let z = 60; z > -750; z -= 45) {
      // Left side post
      const postL = new THREE.Group();
      postL.position.set(-9.2, 3.75, z);

      const poleL = new THREE.Mesh(poleGeo, poleMat);
      postL.add(poleL);

      const armL = new THREE.Mesh(armGeo, poleMat);
      armL.position.set(1.0, 3.65, 0);
      postL.add(armL);

      const lampL = new THREE.Mesh(lampGeo, lampMat);
      lampL.position.set(2.1, 3.5, 0);
      postL.add(lampL);

      this.scene.add(postL);
      this.streetlights.push(postL);

      // Right side post
      const postR = new THREE.Group();
      postR.position.set(9.2, 3.75, z + 22.5);

      const poleR = new THREE.Mesh(poleGeo, poleMat);
      postR.add(poleR);

      const armR = new THREE.Mesh(armGeo, poleMat);
      armR.position.set(-1.0, 3.65, 0);
      postR.add(armR);

      const lampR = new THREE.Mesh(lampGeo, lampMat);
      lampR.position.set(-2.1, 3.5, 0);
      postR.add(lampR);

      this.scene.add(postR);
      this.streetlights.push(postR);
    }
  }

  buildMountainVistas() {
    // Distant mountain silhouettes
    const mountainGeo = new THREE.ConeGeometry(90, 80, 5);
    const mountainMat = new THREE.MeshStandardMaterial({
      color: 0x090f1d,
      roughness: 0.95,
      metalness: 0.1
    });

    const mountainPositions = [
      { x: -160, y: 35, z: -250 },
      { x: -220, y: 45, z: -450 },
      { x: 180,  y: 40, z: -320 },
      { x: 230,  y: 50, z: -550 },
      { x: -140, y: 38, z: -680 },
      { x: 190,  y: 42, z: -720 }
    ];

    mountainPositions.forEach(pos => {
      const m = new THREE.Mesh(mountainGeo, mountainMat);
      m.position.set(pos.x, pos.y, pos.z);
      this.scene.add(m);
    });
  }

  buildCyberVehicle() {
    this.carGroup = new THREE.Group();
    this.carGroup.position.set(0, 0, 0);

    // 1. Lower Aerodynamic Body
    const bodyGeo = new THREE.BoxGeometry(1.9, 0.45, 4.0);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.95,
      roughness: 0.15
    });
    const chassis = new THREE.Mesh(bodyGeo, bodyMat);
    chassis.position.y = 0.52;
    this.carGroup.add(chassis);

    // 2. Cockpit Glass Canopy
    const glassGeo = new THREE.BoxGeometry(1.4, 0.44, 2.1);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      metalness: 0.1,
      roughness: 0.05,
      transparent: true,
      opacity: 0.72,
      reflectivity: 0.9
    });
    const cabin = new THREE.Mesh(glassGeo, glassMat);
    cabin.position.set(0, 0.88, -0.2);
    this.carGroup.add(cabin);

    // 3. Rear Spoiler
    const wingGeo = new THREE.BoxGeometry(2.0, 0.08, 0.48);
    const wing = new THREE.Mesh(wingGeo, bodyMat);
    wing.position.set(0, 1.05, 1.85);
    this.carGroup.add(wing);

    // 4. Twin Projector Headlights
    const hlMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const hlGeo = new THREE.BoxGeometry(0.5, 0.12, 0.12);

    const hlL = new THREE.Mesh(hlGeo, hlMat);
    hlL.position.set(-0.62, 0.52, -2.01);
    this.carGroup.add(hlL);

    const hlR = new THREE.Mesh(hlGeo, hlMat);
    hlR.position.set(0.62, 0.52, -2.01);
    this.carGroup.add(hlR);

    // 5. Headlight Light Cones (Forward Illumination)
    const beamGeo = new THREE.ConeGeometry(2.6, 22, 16);
    beamGeo.rotateX(Math.PI / 2);
    beamGeo.translate(0, 0, -11);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending
    });

    const beamL = new THREE.Mesh(beamGeo, beamMat);
    beamL.position.set(-0.62, 0.5, -2.0);
    this.carGroup.add(beamL);

    const beamR = new THREE.Mesh(beamGeo, beamMat);
    beamR.position.set(0.62, 0.5, -2.0);
    this.carGroup.add(beamR);

    // 6. Rear LED Taillight Strip (Crimson)
    const tlGeo = new THREE.BoxGeometry(1.7, 0.09, 0.08);
    const tlMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    const tl = new THREE.Mesh(tlGeo, tlMat);
    tl.position.set(0, 0.62, 2.01);
    this.carGroup.add(tl);

    // 7. Violet/Cyan Underglow
    this.underglow = new THREE.PointLight(0x6366f1, 3.5, 9);
    this.underglow.position.set(0, 0.18, 0);
    this.carGroup.add(this.underglow);

    // 8. 4 Alloy Wheels with Rotating Rims
    const tireGeo = new THREE.CylinderGeometry(0.40, 0.40, 0.28, 16);
    tireGeo.rotateZ(Math.PI / 2);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x050811, roughness: 0.8, metalness: 0.2 });
    const rimMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    const wheelPositions = [
      { x: -0.98, y: 0.40, z: -1.2 },
      { x: 0.98,  y: 0.40, z: -1.2 },
      { x: -0.98, y: 0.40, z: 1.2 },
      { x: 0.98,  y: 0.40, z: 1.2 }
    ];

    wheelPositions.forEach(pos => {
      const hub = new THREE.Group();
      hub.position.set(pos.x, pos.y, pos.z);

      const tire = new THREE.Mesh(tireGeo, tireMat);
      hub.add(tire);

      const rimGeo = new THREE.TorusGeometry(0.28, 0.035, 8, 16);
      rimGeo.rotateY(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      hub.add(rim);

      this.wheels.push(hub);
      this.carGroup.add(hub);
    });

    this.scene.add(this.carGroup);
  }

  bindScrollAndMouse() {
    // Mouse Parallax
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Mouse Wheel / Trackpad Scroll to drive
    window.addEventListener('wheel', (e) => {
      // Only process scroll when on intro screen
      const introScreen = document.getElementById('screen-intro');
      if (!introScreen || !introScreen.classList.contains('active-screen')) return;

      const delta = e.deltaY * 0.00085;
      this.scrollProgress = Math.max(0.0, Math.min(1.0, this.scrollProgress + delta));
      this.updateHudMilestone(this.scrollProgress);

      if (this.scrollProgress >= 0.98 && !this.isTransitioning) {
        this.triggerEnterTransition();
      }
    }, { passive: true });

    // Touch Swipe Support for mobile
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      const introScreen = document.getElementById('screen-intro');
      if (!introScreen || !introScreen.classList.contains('active-screen')) return;

      if (e.touches.length > 0) {
        const touchCurrentY = e.touches[0].clientY;
        const diff = (touchStartY - touchCurrentY) * 0.002;
        this.scrollProgress = Math.max(0.0, Math.min(1.0, this.scrollProgress + diff));
        this.updateHudMilestone(this.scrollProgress);

        if (this.scrollProgress >= 0.98 && !this.isTransitioning) {
          this.triggerEnterTransition();
        }
      }
    }, { passive: true });

    // Resize
    window.addEventListener('resize', () => {
      if (this.camera && this.renderer) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    });
  }

  updateHudMilestone(progress) {
    const fillBar = document.getElementById('intro-scroll-progress-bar');
    const badgeText = document.getElementById('intro-hud-step-text');
    const pctLabel = document.getElementById('intro-hud-percent-label');

    const pct = Math.round(progress * 100);
    if (fillBar) fillBar.style.width = `${pct}%`;
    if (pctLabel) pctLabel.textContent = `${pct}% Complete`;

    if (badgeText) {
      if (pct < 25) {
        badgeText.textContent = "Ignition // Standby for Autonomous Trip Operations";
      } else if (pct < 55) {
        badgeText.textContent = "Intelligence // 168+ Worldwide Corridors, Tolls & Stays";
      } else if (pct < 85) {
        badgeText.textContent = "Adaptability // Real-Time Weather Radar & cuOpt Replanning";
      } else {
        badgeText.textContent = "Corridor Ready // Transitioning to Travel Portal...";
      }
    }
  }

  triggerEnterTransition() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // Cinematic warp acceleration
    const startTime = performance.now();
    const warpAnimate = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      this.speed += elapsed * 3.5;
      this.camera.position.z -= elapsed * 2.8;
      this.camera.position.y += elapsed * 0.25;

      if (elapsed < 0.85) {
        requestAnimationFrame(warpAnimate);
      } else {
        if (this.onFinishCallback) {
          this.onFinishCallback();
        }
      }
    };
    warpAnimate();
  }

  animate() {
    requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // Smooth Scroll Damping
    this.smoothScroll += (this.scrollProgress - this.smoothScroll) * 0.08;

    // Mouse Parallax Interpolation
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // Dynamic Camera Path based on scroll
    if (!this.isTransitioning) {
      const s = this.smoothScroll;
      // Camera transitions from rear chase to elevated dynamic profile
      const camY = 3.2 + s * 1.8 + this.mouseY * 0.6;
      const camZ = 8.5 - s * 3.2;
      const camX = this.mouseX * 2.4 + Math.sin(s * Math.PI) * 2.0;

      this.camera.position.set(camX, camY, camZ);
      this.camera.lookAt(0, 0.9, -15 - s * 10);

      // Car gentle bounce & banking
      this.carGroup.rotation.z = -this.mouseX * 0.04 - Math.sin(s * Math.PI) * 0.03;
      this.carGroup.rotation.y = -this.mouseX * 0.03;
      this.carGroup.position.y = Math.sin(elapsed * 12) * 0.015;
    }

    // Spin wheels
    const effectiveSpeed = (this.speed + this.smoothScroll * 1.5);
    this.wheels.forEach(w => {
      w.rotation.x += delta * 28 * effectiveSpeed;
    });

    // Move Highway Stripes past car
    const stripeDelta = 75 * delta * effectiveSpeed;
    this.roadStripeSegments.forEach(stripe => {
      stripe.position.z += stripeDelta;
      if (stripe.position.z > 90) {
        stripe.position.z = -810 + (stripe.position.z - 90);
      }
    });

    // Move Roadside Light Posts past car
    this.streetlights.forEach(post => {
      post.position.z += stripeDelta;
      if (post.position.z > 90) {
        post.position.z = -810 + (post.position.z - 90);
      }
    });

    // Twinkling stars rotation
    if (this.stars) {
      this.stars.rotation.y = elapsed * 0.004;
    }

    // Underglow breath pulse
    if (this.underglow) {
      this.underglow.intensity = 3.2 + Math.sin(elapsed * 4.5) * 0.9;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
