import { CONFIG } from './Config.js';

export class ScrollEngine {
  constructor(routePath) {
    this.routePath = routePath;
    this.progress = 0;
    this.smoothProgress = 0;
    this.speed = 0;
    this.lastProgress = 0;
    this.cameraPreset = 0;

    this.targetPos = new THREE.Vector3();
    this.targetLookAt = new THREE.Vector3();
    this.currentLookAt = new THREE.Vector3(0, 1, -10);

    this.initScrollTrigger();
  }

  initScrollTrigger() {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: "#scroll-track",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.0,
      onUpdate: (self) => {
        this.progress = self.progress;
      }
    });
  }

  togglePerspective() {
    this.cameraPreset = this.cameraPreset === 0 ? 1 : 0;
    return this.cameraPreset;
  }

  update(delta) {
    // Damping
    this.smoothProgress += (this.progress - this.smoothProgress) * 0.085;
    const t = Math.max(0.0001, Math.min(0.9999, this.smoothProgress));

    const progressDelta = Math.abs(t - this.lastProgress);
    this.lastProgress = t;
    this.speed = progressDelta / delta;

    return t;
  }

  computeCamera(camera, t) {
    const carPos = this.routePath.getPoint(t);
    const tangent = this.routePath.getTangent(t);
    const normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

    if (this.cameraPreset === 1) {
      this.targetPos.copy(carPos).add(new THREE.Vector3(0, 32, -4));
      this.targetLookAt.copy(carPos);
    } else {
      if (t < 0.16) {
        // Stage 0: Hero
        this.targetPos.copy(carPos).addScaledVector(tangent, -9.0).add(new THREE.Vector3(0, 3.4, 0)).addScaledVector(normal, 0.8);
        this.targetLookAt.copy(carPos).addScaledVector(tangent, 14.0).add(new THREE.Vector3(0, 1.2, 0));
      } else if (t >= 0.16 && t < 0.42) {
        // Stage 1: Route Planning
        const localFactor = (t - 0.16) / (0.42 - 0.16);
        this.targetPos.copy(carPos).addScaledVector(tangent, -5.5 + localFactor * 2.0).addScaledVector(normal, 6.2).add(new THREE.Vector3(0, 2.4, 0));
        this.targetLookAt.copy(carPos).addScaledVector(tangent, 8.0);
      } else if (t >= 0.42 && t < 0.70) {
        // Stage 2: Weather
        this.targetPos.copy(carPos).addScaledVector(tangent, -8.0).addScaledVector(normal, -8.5).add(new THREE.Vector3(0, 7.8, 0));
        this.targetLookAt.copy(carPos).addScaledVector(tangent, 12.0);
      } else if (t >= 0.70 && t < 0.88) {
        // Stage 3: Analytics
        this.targetPos.copy(carPos).addScaledVector(tangent, -4.8).add(new THREE.Vector3(0, 1.8, 0));
        this.targetLookAt.copy(carPos).addScaledVector(tangent, 18.0).add(new THREE.Vector3(0, 0.8, 0));
      } else {
        // Stage 4: Pullback
        const pullT = (t - 0.88) / 0.12;
        const targetHighPos = new THREE.Vector3(30, 95, -480);
        const nearPos = new THREE.Vector3().copy(carPos).add(new THREE.Vector3(0, 6, 12));
        this.targetPos.lerpVectors(nearPos, targetHighPos, pullT);
        this.targetLookAt.lerpVectors(carPos, new THREE.Vector3(0, 10, -500), pullT);
      }
    }

    camera.position.lerp(this.targetPos, CONFIG.camera.lerpFactor);
    this.currentLookAt.lerp(this.targetLookAt, CONFIG.camera.lerpFactor);
    camera.lookAt(this.currentLookAt);
  }
}
