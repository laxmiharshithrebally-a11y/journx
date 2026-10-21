// JOURNX — Cinema-Grade 3D Global Travel Intelligence Opening Experience
// Features:
// 1. Deep Space Orbital Vista: Begins high in deep space looking at the curved horizon of Earth
// 2. Clickable 3D City Beacons: Raycast selection on Hyderabad, Goa, Mumbai, Dubai, Tokyo, London
// 3. Smooth Camera/Globe Glide: Rotates Earth seamlessly to center on clicked cities
// 4. Supersonic Orbital Descent Dive: Plunges through atmospheric layers down to the Western Ghats corridor
// 5. Matrix Decryptor Typography: Cyberpunk rune animation for "J O U R N X"
// 6. Theme and Audio Synchronization: Full real-time reactive lighting and sound

export class GlobeIntro {
  constructor(containerId, onFinishCallback) {
    this.container = document.getElementById(containerId);
    this.onFinishCallback = onFinishCallback;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();

    this.isTransitioning = false;
    this.isDestroyed = false;
    
    // Orbital Dive State
    this.diveActive = false;
    this.diveProgress = 0;

    // Groups & Entities
    this.globeGroup = null;
    this.orbitalGroup = null;
    this.cosmicDust = null;
    this.pulseObjects = [];
    this.beaconRings = [];
    this.clickableHubs = [];
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2(-999, -999);

    // City Focus & Rotation Targets
    this.isManualFocused = false;
    this.targetRotation = { x: 0.15, y: -Math.PI / 2 };
    this.currentRotation = { x: 0.15, y: -Math.PI / 2 };

    // Mouse Parallax
    this.targetMouse = { x: 0, y: 0 };
    this.currentMouse = { x: 0, y: 0 };

    this.init();
    this.runCinematicSequence();
    this.bindCityDock();
  }

  getThemeColors() {
    const theme = document.documentElement.getAttribute('data-theme') || 'obsidian-gold';
    if (theme === 'deep-cobalt') {
      return {
        primary: 0x38BDF8,
        secondary: 0x60A5FA,
        glow: 0x0284C7,
        dust1: 0x38BDF8,
        dust2: 0x93C5FD
      };
    } else if (theme === 'emerald-carbon') {
      return {
        primary: 0x10B981,
        secondary: 0x34D399,
        glow: 0x059669,
        dust1: 0x10B981,
        dust2: 0x6EE7B7
      };
    } else {
      // Obsidian Gold (Default)
      return {
        primary: 0xF59E0B,
        secondary: 0x06B6D4,
        glow: 0xD97706,
        dust1: 0xF59E0B,
        dust2: 0x38BDF8
      };
    }
  }

  init() {
    if (!this.container) return;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera starting high in Deep Space
    this.camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 1500);
    this.camera.position.set(0, 14, 64);
    this.camera.lookAt(0, 1.5, 0);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. Studio Lighting
    const colors = this.getThemeColors();
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambientLight);

    this.dirLight1 = new THREE.DirectionalLight(colors.primary, 1.7);
    this.dirLight1.position.set(35, 25, 40);
    this.scene.add(this.dirLight1);

    this.dirLight2 = new THREE.DirectionalLight(colors.secondary, 1.2);
    this.dirLight2.position.set(-35, -15, 25);
    this.scene.add(this.dirLight2);

    // 5. Build 3D Entities
    this.buildGlobeNetwork();
    this.buildContinentalGrid();
    this.buildOrbitalTelemetryRings();
    this.buildStarfieldDust();

    // 6. Listeners
    this.boundResize = () => this.onResize();
    this.boundMouseMove = (e) => this.onMouseMove(e);
    this.boundCanvasClick = (e) => this.onCanvasClick(e);
    window.addEventListener('resize', this.boundResize);
    window.addEventListener('mousemove', this.boundMouseMove);
    this.renderer.domElement.addEventListener('click', this.boundCanvasClick);

    // 7. Initial focus on India Corridor (Hyderabad / Goa)
    this.focusOnCityByName("Hyderabad");

    // 8. Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  buildGlobeNetwork() {
    this.globeGroup = new THREE.Group();
    this.globeGroup.position.set(0, 1.5, -6);
    this.scene.add(this.globeGroup);

    const radius = 19.2;
    const colors = this.getThemeColors();

    // Core Sphere
    const coreGeo = new THREE.SphereGeometry(radius * 0.985, 48, 48);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x04070D,
      transparent: true,
      opacity: 0.94
    });
    this.globeGroup.add(new THREE.Mesh(coreGeo, coreMat));

    // Geodesic Wireframe
    const wireGeo = new THREE.SphereGeometry(radius, 36, 36);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x1E293B,
      wireframe: true,
      transparent: true,
      opacity: 0.38
    });
    this.globeGroup.add(new THREE.Mesh(wireGeo, wireMat));

    // Equator Coordinate Ring
    const eqGeo = new THREE.RingGeometry(radius * 1.002 - 0.08, radius * 1.002 + 0.08, 96);
    const eqMat = new THREE.MeshBasicMaterial({
      color: colors.primary,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45
    });
    const eqMesh = new THREE.Mesh(eqGeo, eqMat);
    eqMesh.rotation.x = Math.PI / 2;
    this.globeGroup.add(eqMesh);

    // Global Hub Cities Coordinates
    this.hubs = [
      { name: "Hyderabad", code: "HYD", lat: 17.3850, lng: 78.4867, desc: "Departure Logistics Hub & Tech Capital", isHero: true },
      { name: "Goa", code: "GOI", lat: 15.2993, lng: 74.1240, desc: "Arabian Sea Coastal Destination", isHero: true },
      { name: "Mumbai", code: "BOM", lat: 19.0760, lng: 72.8777, desc: "Financial Capital & Express Rail Trunk" },
      { name: "Bengaluru", code: "BLR", lat: 12.9716, lng: 77.5946, desc: "Aviation Gateway & Silicon Valley" },
      { name: "New Delhi", code: "DEL", lat: 28.6139, lng: 77.2090, desc: "National Capital Multimodal Spine" },
      { name: "Dubai", code: "DXB", lat: 25.2048, lng: 55.2708, desc: "Middle East Global Transit Hub" },
      { name: "Singapore", code: "SIN", lat: 1.3521, lng: 103.8198, desc: "East Asia Maritime & Air Exchange" },
      { name: "London", code: "LHR", lat: 51.5074, lng: -0.1278, desc: "European Transatlantic Terminal" },
      { name: "Tokyo", code: "HND", lat: 35.6762, lng: 139.6503, desc: "Pacific Shinkansen & Rail Metro" }
    ];

    this.clickableHubs = [];

    this.hubs.forEach(hub => {
      const pos = this.latLngToVector3(hub.lat, hub.lng, radius * 1.012);
      hub.vector = pos;

      const markerColor = hub.isHero ? colors.primary : colors.secondary;

      // Visual Node Marker
      const dotGeo = new THREE.SphereGeometry(hub.isHero ? 0.45 : 0.28, 14, 14);
      const dotMat = new THREE.MeshBasicMaterial({ color: markerColor });
      const dotMesh = new THREE.Mesh(dotGeo, dotMat);
      dotMesh.position.copy(pos);
      this.globeGroup.add(dotMesh);
      hub.mesh = dotMesh;

      // Pulsing Radar Beacon Halo
      const beaconGeo = new THREE.RingGeometry(0.35, 0.85, 24);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: markerColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.copy(pos);
      beaconMesh.lookAt(pos.clone().multiplyScalar(2));
      this.globeGroup.add(beaconMesh);

      this.beaconRings.push({
        mesh: beaconMesh,
        scale: 1,
        opacity: 0.7,
        speed: 1.2 + Math.random() * 0.8
      });

      // Invisible Raycast Hit Box (Makes clicking easy and accurate)
      const hitGeo = new THREE.SphereGeometry(1.6, 8, 8);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.copy(pos);
      hitMesh.userData = { city: hub };
      this.globeGroup.add(hitMesh);
      this.clickableHubs.push(hitMesh);
    });

    // Multimodal Corridor Arcs
    const routes = [
      [0, 1], // HYD -> GOA (Main Voyage Focus)
      [0, 2], // HYD -> BOM
      [0, 3], // HYD -> BLR
      [0, 4], // HYD -> DEL
      [0, 5], // HYD -> DXB
      [5, 7], // DXB -> LHR
      [0, 6], // HYD -> SIN
      [6, 8]  // SIN -> HND
    ];

    routes.forEach(([i1, i2], idx) => {
      const p1 = this.hubs[i1].vector;
      const p2 = this.hubs[i2].vector;
      const isHero = (i1 === 0 && i2 === 1);
      this.createFlightArc(p1, p2, radius, isHero, idx);
    });
  }

  buildContinentalGrid() {
    const radius = 19.24;
    const count = 1500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const themeColors = this.getThemeColors();
    const cPrimary = new THREE.Color(themeColors.primary);
    const cSecondary = new THREE.Color(themeColors.secondary);
    const cDim = new THREE.Color(0x384556);

    let idx = 0;
    const clusters = [
      { minLat: 8, maxLat: 35, minLng: 68, maxLng: 90, count: 500 },    // Indian Subcontinent
      { minLat: 36, maxLat: 64, minLng: -10, maxLng: 38, count: 280 },  // Europe
      { minLat: 12, maxLat: 42, minLng: 38, maxLng: 62, count: 220 },   // Middle East
      { minLat: -10, maxLat: 36, minLng: 96, maxLng: 142, count: 250 }, // SE & East Asia
      { minLat: 24, maxLat: 52, minLng: -125, maxLng: -72, count: 250 } // North America
    ];

    clusters.forEach(c => {
      for (let i = 0; i < c.count; i++) {
        const lat = c.minLat + Math.random() * (c.maxLat - c.minLat);
        const lng = c.minLng + Math.random() * (c.maxLng - c.minLng);
        const v = this.latLngToVector3(lat, lng, radius);

        positions[idx * 3 + 0] = v.x;
        positions[idx * 3 + 1] = v.y;
        positions[idx * 3 + 2] = v.z;

        const isIndia = (lat >= 10 && lat <= 24 && lng >= 72 && lng <= 84);
        const col = isIndia ? cPrimary : (Math.random() > 0.6 ? cSecondary : cDim);

        colors[idx * 3 + 0] = col.r;
        colors[idx * 3 + 1] = col.g;
        colors[idx * 3 + 2] = col.b;

        idx++;
        if (idx >= count) break;
      }
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions.slice(0, idx * 3), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors.slice(0, idx * 3), 3));

    const mat = new THREE.PointsMaterial({
      size: 0.40,
      vertexColors: true,
      transparent: true,
      opacity: 0.88
    });

    this.continentDots = new THREE.Points(geo, mat);
    this.globeGroup.add(this.continentDots);
  }

  buildOrbitalTelemetryRings() {
    this.orbitalGroup = new THREE.Group();
    this.globeGroup.add(this.orbitalGroup);

    const radius = 19.2;
    const colors = this.getThemeColors();

    // Orbital Plane 1: Inclined Satellite Constellation (38 deg)
    const ring1Geo = new THREE.RingGeometry(radius * 1.30, radius * 1.308, 96);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: colors.primary,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.30
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI / 3;
    ring1Mesh.rotation.y = Math.PI / 5;
    this.orbitalGroup.add(ring1Mesh);

    // Orbital Plane 2: Polar Weather Telemetry (-45 deg)
    const ring2Geo = new THREE.RingGeometry(radius * 1.45, radius * 1.458, 96);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: colors.secondary,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.22
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.x = -Math.PI / 3.5;
    ring2Mesh.rotation.z = Math.PI / 4;
    this.orbitalGroup.add(ring2Mesh);

    // Traveling GNSS Satellites
    const satGeo = new THREE.SphereGeometry(0.38, 10, 10);
    const satMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.satellite1 = new THREE.Mesh(satGeo, satMat);
    this.satellite2 = new THREE.Mesh(satGeo, satMat);
    this.orbitalGroup.add(this.satellite1);
    this.orbitalGroup.add(this.satellite2);

    this.satRadius1 = radius * 1.304;
    this.satRadius2 = radius * 1.454;
  }

  createFlightArc(p1, p2, globeRadius, isHero = false, idx = 0) {
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    const dist = p1.distanceTo(p2);
    const altitude = globeRadius * 1.01 + dist * (isHero ? 0.35 : 0.24);
    mid.normalize().multiplyScalar(altitude);

    const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
    const points = curve.getPoints(isHero ? 60 : 40);
    const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

    const colors = this.getThemeColors();
    const arcColor = isHero ? colors.primary : (idx % 2 === 0 ? colors.secondary : 0x94A3B8);

    const arcMat = new THREE.LineBasicMaterial({
      color: arcColor,
      transparent: true,
      opacity: isHero ? 0.95 : 0.45,
      linewidth: isHero ? 3.2 : 1.4
    });
    const arcMesh = new THREE.Line(curveGeo, arcMat);
    this.globeGroup.add(arcMesh);

    // Comet Pulse
    const pulseGeo = new THREE.SphereGeometry(isHero ? 0.48 : 0.30, 12, 12);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.98
    });
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    this.globeGroup.add(pulseMesh);

    this.pulseObjects.push({
      mesh: pulseMesh,
      curve: curve,
      speed: (isHero ? 0.28 : 0.18) + Math.random() * 0.12,
      progress: Math.random()
    });
  }

  buildStarfieldDust() {
    const count = 1600;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const themeColors = this.getThemeColors();
    const c1 = new THREE.Color(themeColors.dust1);
    const c2 = new THREE.Color(themeColors.dust2);
    const cSlate = new THREE.Color(0x475569);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = (Math.random() - 0.5) * 190;
      positions[i3 + 1] = (Math.random() - 0.5) * 120;
      positions[i3 + 2] = (Math.random() - 0.5) * 100 - 15;

      const r = Math.random();
      const col = r < 0.2 ? c1 : (r < 0.4 ? c2 : cSlate);
      colors[i3 + 0] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.90,
      vertexColors: true,
      transparent: true,
      opacity: 0.60,
      sizeAttenuation: true
    });

    this.cosmicDust = new THREE.Points(geo, mat);
    this.scene.add(this.cosmicDust);
  }

  latLngToVector3(lat, lng, r) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(r * Math.sin(phi) * Math.cos(theta));
    const z = (r * Math.sin(phi) * Math.sin(theta));
    const y = (r * Math.cos(phi));
    return new THREE.Vector3(x, y, z);
  }

  // ─────────────────────────────────────────────────────────────
  // Interactive 3D City Focus (Raycasting & Camera Glide)
  // ─────────────────────────────────────────────────────────────
  onCanvasClick(e) {
    if (!this.camera || !this.clickableHubs) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.clickableHubs);

    if (intersects.length > 0) {
      const city = intersects[0].object.userData.city;
      if (city) this.focusOnCity(city);
    }
  }

  focusOnCityByName(name) {
    if (!this.hubs) return;
    const city = this.hubs.find(h => h.name.toLowerCase() === name.toLowerCase());
    if (city) this.focusOnCity(city);
  }

  focusOnCity(city) {
    this.isManualFocused = true;

    // Calculate globe target rotation so that (lat, lng) faces the front camera
    const targetY = -(city.lng * Math.PI / 180) - Math.PI / 2;
    const targetX = (city.lat * Math.PI / 180) * 0.40;

    this.targetRotation.x = targetX;
    this.targetRotation.y = targetY;

    // Update Telemetry Log
    const telemetryEl = document.getElementById('intro-telemetry-log');
    if (telemetryEl) {
      telemetryEl.textContent = `TARGET FOCUSED: [ ${city.name.toUpperCase()} (${city.code}) // ${city.lat.toFixed(2)}° N, ${city.lng.toFixed(2)}° E ]`;
    }

    // Play chime sound
    if (window.journxApp && window.journxApp.audioEngine) {
      window.journxApp.audioEngine.triggerBlinkerClick();
    }

    // Update city buttons in dock
    document.querySelectorAll('.intro-city-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.city === city.name);
    });

    if (window.showToast) {
      window.showToast(`🎯 Camera Focused on ${city.name} (${city.code}) — ${city.desc}`);
    }
  }

  bindCityDock() {
    document.querySelectorAll('.intro-city-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cityName = btn.dataset.city;
        this.focusOnCityByName(cityName);
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Cyberpunk Matrix Typography Decryptor & Bootloader
  // ─────────────────────────────────────────────────────────────
  runCinematicSequence() {
    const letters = document.querySelectorAll('.intro-letter');
    const glyphs = '01XZ79#%&$@<>*+';
    const finalWord = ['J', 'O', 'U', 'R', 'N', 'X'];

    letters.forEach((el, idx) => {
      let iteration = 0;
      const target = finalWord[idx];
      const startDelay = 200 + idx * 280;

      setTimeout(() => {
        const interval = setInterval(() => {
          if (iteration >= 7) {
            clearInterval(interval);
            el.textContent = target;
            el.style.opacity = '1';
            el.style.transform = 'translate3d(0, 0, 0) scale(1)';
            el.style.filter = 'blur(0)';
            return;
          }
          el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
          el.style.opacity = '0.9';
          el.style.filter = 'blur(1px)';
          iteration++;
        }, 45);
      }, startDelay);
    });

    // Vehicle Badge Scanner Highlight Cycling
    const badges = [
      document.getElementById('intro-sym-car'),
      document.getElementById('intro-sym-train'),
      document.getElementById('intro-sym-flight'),
      document.getElementById('intro-sym-hybrid')
    ].filter(Boolean);

    let activeBadgeIdx = 0;
    setInterval(() => {
      badges.forEach(b => b.classList.remove('active-scan'));
      if (badges[activeBadgeIdx]) {
        badges[activeBadgeIdx].classList.add('active-scan');
      }
      activeBadgeIdx = (activeBadgeIdx + 1) % badges.length;
    }, 1100);
  }

  updateColors() {
    const colors = this.getThemeColors();
    if (this.dirLight1) this.dirLight1.color.setHex(colors.primary);
    if (this.dirLight2) this.dirLight2.color.setHex(colors.secondary);
  }

  onMouseMove(e) {
    this.targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    this.targetMouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  onResize() {
    if (this.camera && this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Supersonic Deep Space Orbital Descent Dive
  // ─────────────────────────────────────────────────────────────
  triggerSkipOrComplete() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.diveActive = true;

    // Focus on India corridor during dive
    this.focusOnCityByName("Hyderabad");

    if (window.journxApp && window.journxApp.audioEngine) {
      window.journxApp.audioEngine.playAgentChime();
    }

    const introView = document.getElementById('view-intro');
    if (introView) {
      introView.style.transition = 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => {
        introView.style.opacity = '0';
      }, 450);
    }

    setTimeout(() => {
      this.diveActive = false;
      this.isTransitioning = false;
      if (introView) {
        introView.style.opacity = '';
        introView.style.transition = '';
      }
      if (this.onFinishCallback) {
        this.onFinishCallback();
      }
    }, 950);
  }

  animate() {
    if (this.isDestroyed) return;
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    this.currentMouse.x += (this.targetMouse.x - this.currentMouse.x) * 0.05;
    this.currentMouse.y += (this.targetMouse.y - this.currentMouse.y) * 0.05;

    // Supersonic Orbital Dive Acceleration
    if (this.diveActive) {
      this.diveProgress += delta * 2.5;
      // Camera plunges from deep space (z=64) down through atmosphere to z=24
      this.camera.position.z = THREE.MathUtils.lerp(this.camera.position.z, 24, 0.12);
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, 2, 0.12);
      if (this.globeGroup) {
        this.globeGroup.rotation.y += delta * 1.8;
      }
    } else {
      // Smooth Rotation to Focused City or Idle Orbit
      if (this.globeGroup) {
        if (this.isManualFocused) {
          this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.07;
          this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.07;
          this.globeGroup.rotation.x = this.currentRotation.x + this.currentMouse.y * 0.08;
          this.globeGroup.rotation.y = this.currentRotation.y;
          this.globeGroup.rotation.z = this.currentMouse.x * 0.06;
        } else {
          this.globeGroup.rotation.y += 0.0035;
          this.globeGroup.rotation.x = Math.sin(elapsed * 0.15) * 0.08 + this.currentMouse.y * 0.12;
          this.globeGroup.rotation.z = this.currentMouse.x * 0.08;
        }
      }

      // Parallax Floating Perspective
      this.camera.position.x = this.currentMouse.x * 2.8;
      this.camera.position.y = 14 - this.currentMouse.y * 2.0;
      this.camera.lookAt(0, 1.5, 0);
    }

    // Satellites Orbital Revolution
    if (this.satellite1 && this.satellite2) {
      const a1 = elapsed * 0.50;
      this.satellite1.position.set(
        Math.cos(a1) * this.satRadius1,
        Math.sin(a1) * Math.sin(Math.PI / 3) * this.satRadius1,
        Math.sin(a1) * Math.cos(Math.PI / 3) * this.satRadius1
      );

      const a2 = -elapsed * 0.40 + 1.4;
      this.satellite2.position.set(
        Math.cos(a2) * this.satRadius2,
        Math.sin(a2) * Math.sin(-Math.PI / 3.5) * this.satRadius2,
        Math.sin(a2) * Math.cos(-Math.PI / 3.5) * this.satRadius2
      );
    }

    // Pulsing Radar Rings
    this.beaconRings.forEach(b => {
      b.scale += delta * b.speed * 0.8;
      b.opacity -= delta * b.speed * 0.45;
      if (b.opacity <= 0) {
        b.scale = 1;
        b.opacity = 0.7;
      }
      b.mesh.scale.set(b.scale, b.scale, b.scale);
      b.mesh.material.opacity = Math.max(0, b.opacity);
    });

    // Comet Pulses Along Flight Arcs
    const speedMult = this.diveActive ? 4.5 : 1.0;
    this.pulseObjects.forEach(p => {
      p.progress += p.speed * delta * speedMult;
      if (p.progress > 1) p.progress = 0;
      const pt = p.curve.getPoint(p.progress);
      p.mesh.position.copy(pt);
    });

    // Cosmic Dust Drift
    if (this.cosmicDust) {
      this.cosmicDust.rotation.y = elapsed * 0.007;
      if (this.diveActive) {
        this.cosmicDust.position.z += delta * 40;
      }
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    this.isDestroyed = true;
    window.removeEventListener('resize', this.boundResize);
    window.removeEventListener('mousemove', this.boundMouseMove);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.removeEventListener('click', this.boundCanvasClick);
      this.renderer.dispose();
    }
  }
}
