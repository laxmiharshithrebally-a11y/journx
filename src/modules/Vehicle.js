// RoadMate X - 3D Cyber-Cruiser Vehicle & Physical AI Digital Twin
// Animated headlights, wheel rotation, brake flare, suspension banking, and amber turn signals

import { CONFIG } from './Config.js';

export class Vehicle {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.wheels = [];
    this.frontWheels = [];
    this.turnBlinkerAmber = null;
    this.isBlinkingRight = false;
    this.isBlinkingLeft = false;
    this.blinkerTimer = 0;
    this.currentPosition = new THREE.Vector3();
    this.currentSpeed = 0;
    this.isBraking = false;

    this.buildModel();
    this.scene.add(this.group);
  }

  buildModel() {
    // 1. Aerodynamic Cyber Chassis
    const chassisGeo = new THREE.BoxGeometry(1.68, 0.44, 3.5);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x080e1a,
      metalness: 0.94,
      roughness: 0.16
    });
    this.chassis = new THREE.Mesh(chassisGeo, bodyMat);
    this.chassis.position.y = 0.45;
    this.group.add(this.chassis);

    // 2. Tinted Aerodynamic Cockpit Glass Canopy
    const cabinGeo = new THREE.BoxGeometry(1.24, 0.38, 1.85);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: CONFIG.theme.accentCyan,
      metalness: 0.4,
      roughness: 0.08,
      transparent: true,
      opacity: 0.72,
      reflectivity: 0.95
    });
    const cabin = new THREE.Mesh(cabinGeo, glassMat);
    cabin.position.set(0, 0.76, -0.15);
    this.group.add(cabin);

    // 3. Projector Twin LED Headlights
    const headlightGeo = new THREE.BoxGeometry(0.48, 0.09, 0.09);
    const headlightMat = new THREE.MeshBasicMaterial({ color: CONFIG.theme.accentCyan });

    const hlLeft = new THREE.Mesh(headlightGeo, headlightMat);
    hlLeft.position.set(-0.54, 0.46, -1.74);
    this.group.add(hlLeft);

    const hlRight = new THREE.Mesh(headlightGeo, headlightMat);
    hlRight.position.set(0.54, 0.46, -1.74);
    this.group.add(hlRight);

    // Volumetric Headlight Beams
    const beamGeo = new THREE.ConeGeometry(2.2, 16, 16);
    beamGeo.rotateX(Math.PI / 2);
    beamGeo.translate(0, 0, -8);
    const beamMat = new THREE.MeshBasicMaterial({
      color: CONFIG.theme.accentCyan,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending
    });

    const beamLeft = new THREE.Mesh(beamGeo, beamMat);
    beamLeft.position.set(-0.54, 0.44, -1.74);
    this.group.add(beamLeft);

    const beamRight = new THREE.Mesh(beamGeo, beamMat);
    beamRight.position.set(0.54, 0.44, -1.74);
    this.group.add(beamRight);

    // 4. Rear Neon Taillight Bar with Brake Glow
    const taillightGeo = new THREE.BoxGeometry(1.5, 0.09, 0.09);
    this.taillightMat = new THREE.MeshBasicMaterial({ color: 0xff0044 });
    this.taillight = new THREE.Mesh(taillightGeo, this.taillightMat);
    this.taillight.position.set(0, 0.52, 1.74);
    this.group.add(this.taillight);

    // 5. Active Amber Turn Signal Indicators (Right & Left)
    const blinkerGeo = new THREE.BoxGeometry(0.24, 0.08, 0.08);
    this.blinkerMatRight = new THREE.MeshBasicMaterial({ color: 0x332200, transparent: true, opacity: 0.4 });
    this.blinkerMatLeft = new THREE.MeshBasicMaterial({ color: 0x332200, transparent: true, opacity: 0.4 });

    // Front Right & Rear Right Blinkers
    this.blinkerFR = new THREE.Mesh(blinkerGeo, this.blinkerMatRight);
    this.blinkerFR.position.set(0.78, 0.46, -1.72);
    this.group.add(this.blinkerFR);

    this.blinkerRR = new THREE.Mesh(blinkerGeo, this.blinkerMatRight);
    this.blinkerRR.position.set(0.78, 0.52, 1.72);
    this.group.add(this.blinkerRR);

    // Front Left & Rear Left Blinkers
    this.blinkerFL = new THREE.Mesh(blinkerGeo, this.blinkerMatLeft);
    this.blinkerFL.position.set(-0.78, 0.46, -1.72);
    this.group.add(this.blinkerFL);

    this.blinkerRL = new THREE.Mesh(blinkerGeo, this.blinkerMatLeft);
    this.blinkerRL.position.set(-0.78, 0.52, 1.72);
    this.group.add(this.blinkerRL);

    // 6. Cyber Neon Underglow
    this.underglow = new THREE.PointLight(CONFIG.theme.accentCyan, 2.8, 7.0);
    this.underglow.position.set(0, 0.16, 0);
    this.group.add(this.underglow);

    // 7. Four Styled Alloy Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 16);
    wheelGeo.rotateZ(Math.PI / 2);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x060911, roughness: 0.7, metalness: 0.3 });
    const rimMat = new THREE.MeshBasicMaterial({ color: CONFIG.theme.accentCyan });

    const wheelOffsets = [
      { x: -0.9, y: 0.38, z: -1.05, isFront: true },
      { x: 0.9,  y: 0.38, z: -1.05, isFront: true },
      { x: -0.9, y: 0.38, z: 1.05,  isFront: false },
      { x: 0.9,  y: 0.38, z: 1.05,  isFront: false }
    ];

    wheelOffsets.forEach(pos => {
      const wheelHub = new THREE.Group();
      wheelHub.position.set(pos.x, pos.y, pos.z);

      const tire = new THREE.Mesh(wheelGeo, tireMat);
      wheelHub.add(tire);

      const rimGeo = new THREE.TorusGeometry(0.28, 0.032, 8, 16);
      rimGeo.rotateY(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      wheelHub.add(rim);

      this.wheels.push(wheelHub);
      if (pos.isFront) this.frontWheels.push(wheelHub);
      this.group.add(wheelHub);
    });
  }

  setBlinker(direction) {
    if (direction === 'right') {
      this.isBlinkingRight = true;
      this.isBlinkingLeft = false;
    } else if (direction === 'left') {
      this.isBlinkingLeft = true;
      this.isBlinkingRight = false;
    } else {
      this.isBlinkingRight = false;
      this.isBlinkingLeft = false;
      this.blinkerMatRight.color.setHex(0x332200);
      this.blinkerMatRight.opacity = 0.4;
      this.blinkerMatLeft.color.setHex(0x332200);
      this.blinkerMatLeft.opacity = 0.4;
    }
  }

  setBraking(isBraking) {
    this.isBraking = isBraking;
    if (isBraking) {
      this.taillightMat.color.setHex(0xff0022);
      this.taillight.scale.set(1.1, 1.4, 1.1);
    } else {
      this.taillightMat.color.setHex(0xcc0033);
      this.taillight.scale.set(1.0, 1.0, 1.0);
    }
  }

  update(routePath, t, elapsed, speedDelta) {
    this.currentSpeed = speedDelta;
    const curve = routePath.getActiveCurve(t);
    const curveT = routePath.getCurveProgress(t);

    if (!curve) return;

    const carPos = curve.getPoint(curveT);
    const lookAheadT = Math.min(0.9999, curveT + 0.012);
    const lookPos = curve.getPoint(lookAheadT);
    const tangent = curve.getTangent(curveT);

    this.group.position.copy(carPos);
    this.currentPosition.copy(carPos);
    this.group.lookAt(lookPos);

    // Roll banking into turns based on curvature
    const curvature = Math.sin(t * 18.0) * 0.06;
    this.chassis.rotation.z = -curvature;

    // Spin wheels according to speed
    this.wheels.forEach(w => {
      w.rotation.x += speedDelta * 45;
    });

    // Steer front wheels
    this.frontWheels.forEach(w => {
      w.rotation.y = curvature * 1.8;
    });

    // Amber Turn Signals blinking cycle
    if (this.isBlinkingRight || this.isBlinkingLeft) {
      const isLit = Math.floor(elapsed * 4.5) % 2 === 0;
      if (this.isBlinkingRight) {
        this.blinkerMatRight.color.setHex(isLit ? 0xffaa00 : 0x332200);
        this.blinkerMatRight.opacity = isLit ? 1.0 : 0.4;
      }
      if (this.isBlinkingLeft) {
        this.blinkerMatLeft.color.setHex(isLit ? 0xffaa00 : 0x332200);
        this.blinkerMatLeft.opacity = isLit ? 1.0 : 0.4;
      }
    }
  }

  getPosition() {
    return this.currentPosition;
  }
}
