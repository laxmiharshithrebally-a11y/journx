// JOURNX — Master Application Controller
// Autonomous Multimodal Travel Intelligence Platform
// Built for NVIDIA × Nebius AI Hackathon 2026

import { GlobeIntro } from './modules/GlobeIntro.js?v=12.0';
import { MapService } from './modules/MapService.js?v=12.0';
import { WeatherService } from './modules/WeatherService.js?v=12.0';
import { NemotronAgent } from './modules/NemotronAgent.js?v=12.0';
import { TripTwin } from './modules/TripTwin.js?v=12.0';
import { TripGuardian } from './modules/TripGuardian.js?v=12.0';
import { AudioEngine } from './modules/AudioEngine.js?v=12.0';
import { UIManager } from './modules/UIManager.js?v=12.0';

class JournXApp {
  constructor() {
    // Current active journey state
    this.currentJourney = {
      origin: 'Hyderabad',
      destination: 'Goa',
      origin_coords: [17.385, 78.4867],
      dest_coords: [15.2993, 74.124],
      days: 7,
      travelers: 4,
      budget: 60000,
      currency: '₹',
      distance_km: 660
    };
    this.currentOptions = null;

    // 1. Core Services & Audio Engine
    this.audioEngine = new AudioEngine();
    this.weatherService = new WeatherService();
    this.mapService = new MapService('leaflet-route-map');
    this.nemotronAgent = new NemotronAgent();

    // 2. Intelligence Engines
    this.tripGuardian = new TripGuardian(this);
    this.tripTwin = new TripTwin(this);

    // 3. 3D Globe Cinematic Opening Experience
    this.globeIntro = new GlobeIntro('globe-canvas-container', () => {
      if (this.uiManager) {
        this.uiManager.switchView('view-auth');
      }
    });

    // 4. Master UI & Navigation Orchestrator
    this.uiManager = new UIManager(this);

    console.log("🌐 JOURNX Autonomous Multimodal Travel Intelligence Platform initialized.");
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.journxApp = new JournXApp();
  // Preserve window.roadMateApp as backward compatibility alias
  window.roadMateApp = window.journxApp;
});
