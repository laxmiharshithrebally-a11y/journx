// RoadMate X - Dual-Spline 3D Highway & cuOpt Route Geometry
// Renders Primary Highway + Branching Autonomous Detour Bypass

import { CONFIG } from './Config.js';

export class RoutePath {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.primaryCurve = null;
    this.detourCurve = null;

    this.primaryRoadMesh = null;
    this.primaryLeftLine = null;
    this.primaryRightLine = null;

    this.detourRoadMesh = null;
    this.detourLeftLine = null;
    this.detourRightLine = null;

    this.ROAD_WIDTH = 4.4;
    this.ROAD_DIVISIONS = 700;

    this.isDetourActive = false;
    this.detourBranchT = 0.42; // progress at which detour splits
    this.detourReconnectT = 1.0;
  }

  loadRoute(routeConfig) {
    // Clear previous meshes
    while (this.group.children.length > 0) {
      const obj = this.group.children[0];
      this.group.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    }

    this.isDetourActive = false;
    this.currentConfig = routeConfig;

    // 1. Build Primary Spline Curve
    const ptsPrimary = routeConfig.pointsPrimary.map(p => new THREE.Vector3(p.x, p.y, p.z));
    this.primaryCurve = new THREE.CatmullRomCurve3(ptsPrimary, false, 'catmullrom', 0.5);

    // 2. Build Detour Spline Curve
    const ptsDetour = routeConfig.pointsDetour.map(p => new THREE.Vector3(p.x, p.y, p.z));
    this.detourCurve = new THREE.CatmullRomCurve3(ptsDetour, false, 'catmullrom', 0.5);

    // 3. Build Meshes
    this.buildPrimaryRoad();
    this.buildDetourRoad();
    this.buildGantries(ptsPrimary);
  }

  buildPrimaryRoad() {
    const samples = this.primaryCurve.getSpacedPoints(this.ROAD_DIVISIONS);
    const vertices = [];
    const indices = [];

    for (let i = 0; i < samples.length; i++) {
      const pt = samples[i];
      const u = i / (samples.length - 1);
      const tangent = this.primaryCurve.getTangent(u);
      const normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

      const pLeft = new THREE.Vector3().copy(pt).addScaledVector(normal, -this.ROAD_WIDTH / 2);
      const pRight = new THREE.Vector3().copy(pt).addScaledVector(normal, this.ROAD_WIDTH / 2);

      vertices.push(pLeft.x, pLeft.y, pLeft.z);
      vertices.push(pRight.x, pRight.y, pRight.z);

      if (i < samples.length - 1) {
        const r1 = i * 2;
        const r2 = (i + 1) * 2;
        indices.push(r1, r1 + 1, r2, r1 + 1, r2 + 1, r2);
      }
    }

    const roadGeo = new THREE.BufferGeometry();
    roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    roadGeo.setIndex(indices);
    roadGeo.computeVertexNormals();

    const roadMat = new THREE.MeshStandardMaterial({
      color: CONFIG.theme.roadPrimary,
      roughness: 0.38,
      metalness: 0.85
    });

    this.primaryRoadMesh = new THREE.Mesh(roadGeo, roadMat);
    this.group.add(this.primaryRoadMesh);

    // Neon Cyan Glowing Border Lines
    const edgeMat = new THREE.LineBasicMaterial({
      color: CONFIG.theme.roadMarking,
      linewidth: 2
    });

    const leftPts = [], rightPts = [];
    for (let i = 0; i < vertices.length; i += 6) {
      leftPts.push(new THREE.Vector3(vertices[i], vertices[i+1] + 0.06, vertices[i+2]));
      rightPts.push(new THREE.Vector3(vertices[i+3], vertices[i+4] + 0.06, vertices[i+5]));
    }

    this.primaryLeftLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(leftPts), edgeMat);
    this.primaryRightLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(rightPts), edgeMat);
    this.group.add(this.primaryLeftLine);
    this.group.add(this.primaryRightLine);
  }

  buildDetourRoad() {
    const samples = this.detourCurve.getSpacedPoints(this.ROAD_DIVISIONS);
    const vertices = [];
    const indices = [];

    for (let i = 0; i < samples.length; i++) {
      const pt = samples[i];
      const u = i / (samples.length - 1);
      const tangent = this.detourCurve.getTangent(u);
      const normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

      const pLeft = new THREE.Vector3().copy(pt).addScaledVector(normal, -this.ROAD_WIDTH / 2);
      const pRight = new THREE.Vector3().copy(pt).addScaledVector(normal, this.ROAD_WIDTH / 2);

      vertices.push(pLeft.x, pLeft.y, pLeft.z);
      vertices.push(pRight.x, pRight.y, pRight.z);

      if (i < samples.length - 1) {
        const r1 = i * 2;
        const r2 = (i + 1) * 2;
        indices.push(r1, r1 + 1, r2, r1 + 1, r2 + 1, r2);
      }
    }

    const roadGeo = new THREE.BufferGeometry();
    roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    roadGeo.setIndex(indices);
    roadGeo.computeVertexNormals();

    const roadMat = new THREE.MeshStandardMaterial({
      color: CONFIG.theme.roadDetour,
      roughness: 0.35,
      metalness: 0.9,
      transparent: true,
      opacity: 0.88
    });

    this.detourRoadMesh = new THREE.Mesh(roadGeo, roadMat);
    this.group.add(this.detourRoadMesh);

    // Neon Emerald Green Glowing Detour Borders
    const detourEdgeMat = new THREE.LineBasicMaterial({
      color: CONFIG.theme.detourMarking,
      linewidth: 2
    });

    const leftPts = [], rightPts = [];
    for (let i = 0; i < vertices.length; i += 6) {
      leftPts.push(new THREE.Vector3(vertices[i], vertices[i+1] + 0.08, vertices[i+2]));
      rightPts.push(new THREE.Vector3(vertices[i+3], vertices[i+4] + 0.08, vertices[i+5]));
    }

    this.detourLeftLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(leftPts), detourEdgeMat);
    this.detourRightLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(rightPts), detourEdgeMat);
    this.group.add(this.detourLeftLine);
    this.group.add(this.detourRightLine);
  }

  buildGantries(pts) {
    // Holographic overhead signboards along the highway
    const gantryIndices = [2, 5, 8];
    gantryIndices.forEach(idx => {
      if (idx < pts.length) {
        const p = pts[idx];
        const gantryGroup = new THREE.Group();
        gantryGroup.position.set(p.x, p.y + 0.5, p.z);

        // Arch pillars
        const postGeo = new THREE.CylinderGeometry(0.12, 0.12, 5.5);
        const postMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
        const leftPost = new THREE.Mesh(postGeo, postMat);
        leftPost.position.set(-3.2, 2.75, 0);
        const rightPost = new THREE.Mesh(postGeo, postMat);
        rightPost.position.set(3.2, 2.75, 0);

        // Cross beam
        const beamGeo = new THREE.BoxGeometry(6.6, 0.4, 0.3);
        const beam = new THREE.Mesh(beamGeo, postMat);
        beam.position.set(0, 5.2, 0);

        // Holographic sign
        const signGeo = new THREE.PlaneGeometry(5.2, 1.2);
        const signMat = new THREE.MeshBasicMaterial({
          color: idx === 5 ? 0x10b981 : 0x00f0ff,
          transparent: true,
          opacity: 0.75,
          side: THREE.DoubleSide
        });
        const sign = new THREE.Mesh(signGeo, signMat);
        sign.position.set(0, 5.2, 0.2);

        gantryGroup.add(leftPost);
        gantryGroup.add(rightPost);
        gantryGroup.add(beam);
        gantryGroup.add(sign);
        this.group.add(gantryGroup);
      }
    });
  }

  activateDetour() {
    this.isDetourActive = true;
  }

  deactivateDetour() {
    this.isDetourActive = false;
  }

  /**
   * Returns current active spline curve based on progression and detour state
   * @param {number} t - progress 0.0 to 1.0
   */
  getActiveCurve(t) {
    if (this.isDetourActive && t >= this.detourBranchT) {
      return this.detourCurve;
    }
    return this.primaryCurve;
  }

  /**
   * Re-maps global progress `t` to detour curve domain if rerouted
   */
  getCurveProgress(t) {
    if (this.isDetourActive && t >= this.detourBranchT) {
      // Scale t from [detourBranchT, 1.0] -> [0.0, 1.0]
      const remappedT = (t - this.detourBranchT) / (1.0 - this.detourBranchT);
      return Math.max(0.0001, Math.min(0.9999, remappedT));
    }
    return Math.max(0.0001, Math.min(0.9999, t));
  }

  updateReveal(t) {
    const drawMax = Math.floor(Math.min(1.0, t + 0.22) * this.ROAD_DIVISIONS * 6);
    if (this.primaryRoadMesh) {
      this.primaryRoadMesh.geometry.setDrawRange(0, drawMax);
      this.primaryLeftLine.geometry.setDrawRange(0, Math.floor(drawMax / 6));
      this.primaryRightLine.geometry.setDrawRange(0, Math.floor(drawMax / 6));
    }

    if (this.detourRoadMesh) {
      if (this.isDetourActive) {
        this.detourRoadMesh.geometry.setDrawRange(0, drawMax);
        this.detourLeftLine.geometry.setDrawRange(0, Math.floor(drawMax / 6));
        this.detourRightLine.geometry.setDrawRange(0, Math.floor(drawMax / 6));
      } else {
        // Detour hidden or dimmed until replan
        this.detourRoadMesh.geometry.setDrawRange(0, 0);
        this.detourLeftLine.geometry.setDrawRange(0, 0);
        this.detourRightLine.geometry.setDrawRange(0, 0);
      }
    }
  }
}
