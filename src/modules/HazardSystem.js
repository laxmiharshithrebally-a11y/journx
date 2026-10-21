// RoadMate X - 3D Holographic Hazard & Incident System
// Visualizes physical roadblocks, flooding markers, and hazard laser perimeters

import { CONFIG } from './Config.js';

export class HazardSystem {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.isActive = false;
    this.hazardPosition = new THREE.Vector3(-30, 3.2, -490);
    this.cones = [];
    this.buildHazardMesh();
    this.scene.add(this.group);
    this.group.visible = false;
  }

  buildHazardMesh() {
    // 1. Holographic Laser Warning Barrier
    const barrierGeo = new THREE.PlaneGeometry(16, 4.5);
    const barrierMat = new THREE.MeshBasicMaterial({
      color: 0xff0044,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    this.laserBarrier = new THREE.Mesh(barrierGeo, barrierMat);
    this.laserBarrier.position.y = 2.4;
    this.group.add(this.laserBarrier);

    // 2. Floating Warning Diamond Sign
    const signGeo = new THREE.OctahedronGeometry(1.6, 0);
    const signMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      wireframe: true
    });
    this.signMesh = new THREE.Mesh(signGeo, signMat);
    this.signMesh.position.y = 6.2;
    this.group.add(this.signMesh);

    // Internal solid core
    const coreGeo = new THREE.OctahedronGeometry(0.8, 0);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xff0044 });
    this.signCore = new THREE.Mesh(coreGeo, coreMat);
    this.signCore.position.y = 6.2;
    this.group.add(this.signCore);

    // 3. Pulsating Hazard Glow Light
    this.hazardLight = new THREE.PointLight(0xff0044, 4, 35);
    this.hazardLight.position.set(0, 3.5, 0);
    this.group.add(this.hazardLight);

    // 4. Physical Road Cones
    const coneGeo = new THREE.ConeGeometry(0.4, 1.2, 12);
    const coneMat = new THREE.MeshStandardMaterial({
      color: 0xff4500,
      roughness: 0.3,
      metalness: 0.2
    });

    const coneOffsets = [-4.5, -2.2, 0, 2.2, 4.5];
    coneOffsets.forEach(offsetX => {
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(offsetX, 0.6, 0);

      // White reflective band
      const ringGeo = new THREE.CylinderGeometry(0.24, 0.29, 0.25, 12);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 0.15;
      cone.add(ring);

      this.cones.push(cone);
      this.group.add(cone);
    });
  }

  setHazardLocation(position) {
    this.hazardPosition.copy(position);
    this.group.position.copy(position);
  }

  showHazard() {
    this.isActive = true;
    this.group.visible = true;
  }

  hideHazard() {
    this.isActive = false;
    this.group.visible = false;
  }

  update(elapsed) {
    if (!this.isActive) return;

    // Rotate holographic diamond
    this.signMesh.rotation.y = elapsed * 1.8;
    this.signMesh.rotation.x = Math.sin(elapsed * 2) * 0.2;
    this.signCore.rotation.y = -elapsed * 2.2;

    // Laser barrier breathing pulse
    const pulse = Math.sin(elapsed * 6) * 0.25 + 0.65;
    this.laserBarrier.material.opacity = pulse;
    this.hazardLight.intensity = Math.sin(elapsed * 8) * 2 + 3.5;
  }
}
