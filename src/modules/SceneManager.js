import { CONFIG } from './Config.js';

export class SceneManager {
  constructor(container) {
    this.container = container || document.body;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(CONFIG.theme.bgDark);
    this.scene.fog = new THREE.FogExp2(CONFIG.theme.bgDark, CONFIG.theme.fogDensity);

    const w = this.container.clientWidth || 1200;
    const h = this.container.clientHeight || 580;

    this.camera = new THREE.PerspectiveCamera(
      CONFIG.camera.fov,
      w / h,
      CONFIG.camera.near,
      CONFIG.camera.far
    );

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    this.initLights();
    this.initResizeListener();
  }

  initLights() {
    this.ambientLight = new THREE.AmbientLight(0x0b1528, 1.4);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0x38bdf8, 1.6);
    this.dirLight.position.set(60, 120, 50);
    this.scene.add(this.dirLight);

    this.rimLight = new THREE.DirectionalLight(0x6366f1, 1.0);
    this.rimLight.position.set(-60, 80, -100);
    this.scene.add(this.rimLight);
  }

  initResizeListener() {
    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  resize() {
    if (!this.container || !this.renderer) return;
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || 580;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
