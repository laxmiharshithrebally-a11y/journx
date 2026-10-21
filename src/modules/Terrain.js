// RoadMate X - Digital Twin Topographic Terrain
// Wireframe contours, elevation undulations, and spatial coordinate grid

import { CONFIG } from './Config.js';

export class Terrain {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.buildTerrain();
    this.scene.add(this.group);
  }

  buildTerrain() {
    // 1. Digital Topographic Wireframe Mesh
    const terrainGeo = new THREE.PlaneGeometry(1200, 1800, 60, 80);
    terrainGeo.rotateX(-Math.PI / 2);

    // Apply procedural elevation contours
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Create mountain ridges flanking the highway corridor
      const distFromCenter = Math.abs(x);
      let elevation = 0;
      if (distFromCenter > 25) {
        elevation = Math.sin(x * 0.015) * Math.cos(z * 0.012) * 28 + (distFromCenter - 25) * 0.14;
      }
      pos.setY(i, elevation - 3.5);
    }
    terrainGeo.computeVertexNormals();

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x03305a,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    });

    this.wireMesh = new THREE.Mesh(terrainGeo, wireMat);
    this.group.add(this.wireMesh);

    // 2. Dark Solid Subsurface Base
    const solidMat = new THREE.MeshStandardMaterial({
      color: 0x020712,
      roughness: 0.95,
      metalness: 0.1
    });
    this.solidMesh = new THREE.Mesh(terrainGeo, solidMat);
    this.solidMesh.position.y = -0.4;
    this.group.add(this.solidMesh);

    // 3. Spatial Horizon Coordinate Grid
    const grid = new THREE.GridHelper(1600, 40, 0x00f0ff, 0x0a2540);
    grid.position.y = -4.0;
    this.group.add(grid);
  }

  update(elapsed) {
    // Subtle wireframe pulse
    if (this.wireMesh) {
      this.wireMesh.material.opacity = 0.25 + Math.sin(elapsed * 0.8) * 0.05;
    }
  }
}
