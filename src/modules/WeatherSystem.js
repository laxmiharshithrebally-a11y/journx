// RoadMate X - Volumetric 3D Weather & Atmospheric System
// Real-time rain simulation, thunder lightning, and dynamic fog

import { CONFIG } from './Config.js';

export class WeatherSystem {
  constructor(scene, sceneManager, audioEngine) {
    this.scene = scene;
    this.sceneManager = sceneManager;
    this.audioEngine = audioEngine;
    this.intensity = 0.0; // 0 (clear) to 1 (monsoon / blizzard)
    this.targetIntensity = 0.0;
    this.rainCount = 3500;
    this.rainGeo = null;
    this.rainMesh = null;
    this.lightningLight = null;
    this.lastLightningTime = 0;

    this.initRain();
    this.initLightning();
  }

  initRain() {
    const positions = new Float32Array(this.rainCount * 6); // 2 vertices per streak line
    this.rainVelocities = new Float32Array(this.rainCount);

    for (let i = 0; i < this.rainCount; i++) {
      const x = (Math.random() - 0.5) * 500;
      const y = Math.random() * 180 + 5;
      const z = (Math.random() - 0.5) * 1200 - 400;
      const len = Math.random() * 4.5 + 2.5;

      positions[i * 6 + 0] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;

      positions[i * 6 + 3] = x + 0.3; // slight wind slant
      positions[i * 6 + 4] = y - len;
      positions[i * 6 + 5] = z - 0.8;

      this.rainVelocities[i] = Math.random() * 65 + 85; // fast vertical fall
    }

    this.rainGeo = new THREE.BufferGeometry();
    this.rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    this.rainMat = new THREE.LineBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      linewidth: 1
    });

    this.rainMesh = new THREE.LineSegments(this.rainGeo, this.rainMat);
    this.scene.add(this.rainMesh);
  }

  initLightning() {
    this.lightningLight = new THREE.PointLight(0xdbeafe, 0, 1500, 1.2);
    this.lightningLight.position.set(0, 180, -450);
    this.scene.add(this.lightningLight);
  }

  setWeatherState(stateName) {
    if (stateName === 'storm' || stateName === 'flood' || stateName === 'blizzard' || stateName === 'typhoon') {
      this.targetIntensity = 1.0;
    } else {
      this.targetIntensity = 0.0;
    }
  }

  triggerLightningStrike() {
    if (this.intensity < 0.3) return;
    this.lightningLight.intensity = Math.random() * 8 + 6;
    if (this.audioEngine) {
      this.audioEngine.playThunder();
    }

    // Rapid double flash
    setTimeout(() => {
      this.lightningLight.intensity = 0;
      setTimeout(() => {
        this.lightningLight.intensity = Math.random() * 5 + 3;
        setTimeout(() => {
          this.lightningLight.intensity = 0;
        }, 60);
      }, 70);
    }, 80);
  }

  update(delta, vehiclePosition) {
    // Smoothly transition intensity
    this.intensity += (this.targetIntensity - this.intensity) * (delta * 2.5);
    this.rainMat.opacity = this.intensity * 0.72;

    if (this.audioEngine) {
      this.audioEngine.setRainIntensity(this.intensity);
    }

    // Dynamically modulate fog density
    if (this.scene.fog) {
      const targetFog = THREE.MathUtils.lerp(
        CONFIG.theme.fogDensityNormal,
        CONFIG.theme.fogDensityStorm,
        this.intensity
      );
      this.scene.fog.density += (targetFog - this.scene.fog.density) * 0.05;
    }

    // Animate Rain Particles around vehicle
    if (this.intensity > 0.02 && vehiclePosition) {
      const pos = this.rainGeo.attributes.position.array;
      const centerX = vehiclePosition.x;
      const centerZ = vehiclePosition.z;

      for (let i = 0; i < this.rainCount; i++) {
        const speed = this.rainVelocities[i] * delta * 2.2;
        pos[i * 6 + 1] -= speed;
        pos[i * 6 + 4] -= speed;

        // Reset if below ground
        if (pos[i * 6 + 4] < -2) {
          const rx = centerX + (Math.random() - 0.5) * 320;
          const rz = centerZ + (Math.random() - 0.5) * 600;
          const ry = Math.random() * 120 + 70;
          const len = Math.random() * 4.5 + 2.5;

          pos[i * 6 + 0] = rx;
          pos[i * 6 + 1] = ry;
          pos[i * 6 + 2] = rz;

          pos[i * 6 + 3] = rx + 0.3;
          pos[i * 6 + 4] = ry - len;
          pos[i * 6 + 5] = rz - 0.8;
        }
      }
      this.rainGeo.attributes.position.needsUpdate = true;

      // Occasional lightning strike during heavy storm
      const now = performance.now();
      if (this.intensity > 0.6 && now - this.lastLightningTime > (Math.random() * 6000 + 5000)) {
        this.lastLightningTime = now;
        this.triggerLightningStrike();
      }
    }
  }
}
