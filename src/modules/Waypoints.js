import { CONFIG } from './Config.js';

export class Waypoints {
  constructor(scene, routePath) {
    this.scene = scene;
    this.routePath = routePath;
    this.waypointMeshes = [];
    this.buildWaypoints();
  }

  buildWaypoints() {
    CONFIG.waypoints.forEach((wp) => {
      const group = new THREE.Group();
      const pt = this.routePath.getPoint(wp.progress);

      const diskGeo = new THREE.RingGeometry(0.8, 3.2, 32);
      diskGeo.rotateX(-Math.PI / 2);
      const diskMat = new THREE.MeshBasicMaterial({
        color: wp.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const disk = new THREE.Mesh(diskGeo, diskMat);
      group.add(disk);

      const beamGeo = new THREE.CylinderGeometry(0.12, 1.2, 28, 16, 1, true);
      const beamMat = new THREE.MeshBasicMaterial({
        color: wp.color,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = 14;
      group.add(beam);

      const ringGeo = new THREE.TorusGeometry(2.0, 0.08, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: wp.color, transparent: true, opacity: 0.85 });
      const ring1 = new THREE.Mesh(ringGeo, ringMat);
      ring1.position.y = 4.5;
      group.add(ring1);

      const ring2 = new THREE.Mesh(ringGeo, ringMat);
      ring2.position.y = 4.5;
      ring2.scale.set(0.65, 0.65, 0.65);
      group.add(ring2);

      const pLight = new THREE.PointLight(wp.color, 3.0, 25);
      pLight.position.y = 4.5;
      group.add(pLight);

      group.position.copy(pt);
      this.scene.add(group);

      this.waypointMeshes.push({ group, ring1, ring2, pLight });
    });
  }

  update(elapsed, carPos) {
    this.waypointMeshes.forEach(wp => {
      wp.ring1.rotation.x = elapsed * 1.5;
      wp.ring1.rotation.y = elapsed * 0.8;
      wp.ring2.rotation.y = -elapsed * 1.8;
      wp.ring2.rotation.z = elapsed * 1.2;

      const dist = carPos.distanceTo(wp.group.position);
      const proximity = Math.max(0, 1 - dist / 35);
      wp.pLight.intensity = 2.0 + proximity * 4.0;
    });
  }
}
