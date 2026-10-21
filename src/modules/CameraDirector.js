// RoadMate X - Cinematic Camera Director & Multi-View Orchestrator
// Smooth lerp interpolation across Chase, Drone, Cockpit, and God-Eye views

import { CONFIG } from './Config.js';

export class CameraDirector {
  constructor(camera) {
    this.camera = camera;
    this.mode = CONFIG.camera.modes.CHASE;
    this.targetPos = new THREE.Vector3();
    this.targetLookAt = new THREE.Vector3();
    this.currentLookAt = new THREE.Vector3(0, 0, -50);
  }

  setMode(mode) {
    this.mode = mode;
  }

  update(vehiclePos, tangent, normal, t) {
    if (!vehiclePos || !tangent) return;

    switch (this.mode) {
      case CONFIG.camera.modes.CHASE:
        // Follow smoothly behind vehicle
        this.targetPos.copy(vehiclePos)
          .addScaledVector(tangent, -9.5)
          .add(new THREE.Vector3(0, 3.8, 0));
        this.targetLookAt.copy(vehiclePos).addScaledVector(tangent, 15.0);
        break;

      case CONFIG.camera.modes.DRONE:
        // Sweeping high-altitude aerial view
        this.targetPos.copy(vehiclePos)
          .addScaledVector(tangent, -18.0)
          .addScaledVector(normal, 22.0)
          .add(new THREE.Vector3(0, 24.0, 0));
        this.targetLookAt.copy(vehiclePos).addScaledVector(tangent, 20.0);
        break;

      case CONFIG.camera.modes.COCKPIT:
        // Driver POV forward through windshield
        this.targetPos.copy(vehiclePos)
          .add(new THREE.Vector3(0, 0.85, 0))
          .addScaledVector(tangent, 0.4);
        this.targetLookAt.copy(vehiclePos).addScaledVector(tangent, 25.0);
        break;

      case CONFIG.camera.modes.GOD_EYE:
        // Macro Satellite Digital Twin overview
        this.targetPos.set(0, 160, -480);
        this.targetLookAt.set(0, 0, -480);
        break;
    }

    // Smooth lerp camera movement
    this.camera.position.lerp(this.targetPos, 0.08);
    this.currentLookAt.lerp(this.targetLookAt, 0.08);
    this.camera.lookAt(this.currentLookAt);
  }
}
