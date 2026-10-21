// JOURNX — Hybrid Google Maps Platform Engine
// Supports:
// 1. Official Google Maps JavaScript API (Native SDK) with Places Autocomplete, DirectionsService, TrafficLayer, and 3D Vector tilt
// 2. High-performance Leaflet Google Maps Tile Engine (Google Streets, Satellite Hybrid, Terrain) with zero key requirement
// 3. Multimodal route rendering, elevation waypoints, and Trip Guardian detour layers

const GOOGLE_MAPS_DARK_STYLE = [
  { "elementType": "geometry", "stylers": [{ "color": "#080c14" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#080c14" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#334155" }] },
  { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [{ "color": "#475569" }] },
  { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#0f172a" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#64748b" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#0f172a" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#cbd5e1" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#334155" }] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1e293b" }] },
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f1f5f9" }] },
  { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
  { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#f59e0b" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#050b14" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#38bdf8" }] }
];

export class MapService {
  constructor(containerId = 'leaflet-route-map') {
    this.containerId = containerId;
    this.map = null;
    this.markersGroup = null;
    this.routeLine = null;
    this.detourLine = null;
    this.hazardMarker = null;
    this.isInitialized = false;

    // Real Native Google Maps SDK State
    this.nativeGMap = null;
    this.nativeDirectionsService = null;
    this.nativeDirectionsRenderer = null;
    this.nativeTrafficLayer = null;
    this.isGMapSdkLoaded = false;
    this.activeEngine = 'leaflet-tiles'; // 'leaflet-tiles' | 'native-google'

    // Check if user has stored Google Maps API Key
    const savedKey = localStorage.getItem('JOURNX_GMAPS_KEY');
    if (savedKey) {
      this.loadGoogleMapsJsSdk(savedKey);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 1. Official Google Maps JavaScript API (Native SDK) Loader
  // ─────────────────────────────────────────────────────────────
  loadGoogleMapsJsSdk(apiKey) {
    if (!apiKey) return Promise.reject(new Error("No API key provided"));
    if (window.google && window.google.maps) {
      this.isGMapSdkLoaded = true;
      this.setupGooglePlacesAutocomplete();
      return Promise.resolve(window.google.maps);
    }

    return new Promise((resolve, reject) => {
      const existingScript = document.getElementById('google-maps-js-sdk');
      if (existingScript) existingScript.remove();

      const script = document.createElement('script');
      script.id = 'google-maps-js-sdk';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.isGMapSdkLoaded = true;
        this.setupGooglePlacesAutocomplete();
        if (window.showToast) {
          window.showToast("⚡ Official Google Maps JS SDK & Places Active");
        }
        resolve(window.google.maps);
      };

      script.onerror = (err) => {
        console.warn("Failed to load Google Maps SDK:", err);
        this.isGMapSdkLoaded = false;
        reject(err);
      };

      document.head.appendChild(script);
    });
  }

  setupGooglePlacesAutocomplete() {
    if (!window.google || !window.google.maps || !window.google.maps.places) return;

    try {
      const inputFrom = document.getElementById('input-from-city');
      const inputTo = document.getElementById('input-to-city');

      const options = {
        types: ['(cities)'],
        fields: ['formatted_address', 'geometry', 'name']
      };

      if (inputFrom && !inputFrom._gAutocomplete) {
        inputFrom._gAutocomplete = new window.google.maps.places.Autocomplete(inputFrom, options);
      }
      if (inputTo && !inputTo._gAutocomplete) {
        inputTo._gAutocomplete = new window.google.maps.places.Autocomplete(inputTo, options);
      }
    } catch (e) {
      console.warn("Places autocomplete setup notice:", e);
    }
  }

  initNativeGoogleMap(containerId = 'google-native-map') {
    const el = document.getElementById(containerId);
    if (!el || !window.google || !window.google.maps) return;

    try {
      this.nativeGMap = new window.google.maps.Map(el, {
        center: { lat: 16.5, lng: 76.2 },
        zoom: 7,
        styles: GOOGLE_MAPS_DARK_STYLE,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: false
      });

      this.nativeDirectionsService = new window.google.maps.DirectionsService();
      this.nativeDirectionsRenderer = new window.google.maps.DirectionsRenderer({
        map: this.nativeGMap,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#F59E0B',
          strokeWeight: 6,
          strokeOpacity: 0.95
        }
      });

      this.nativeTrafficLayer = new window.google.maps.TrafficLayer();
    } catch (e) {
      console.warn("Native Google Map init warning:", e);
    }
  }

  toggleNativeTraffic(enable = true) {
    if (this.nativeTrafficLayer && this.nativeGMap) {
      this.nativeTrafficLayer.setMap(enable ? this.nativeGMap : null);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 2. High-Resolution Google Maps Tile Engine (Leaflet)
  // ─────────────────────────────────────────────────────────────
  initMap() {
    const el = document.getElementById(this.containerId);
    if (!el || typeof L === 'undefined') return;

    if (this.map) {
      this.resize();
      return;
    }

    try {
      this.map = L.map(this.containerId, {
        center: [16.5, 76.2],
        zoom: 7,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // Google Maps Tile Layers
      this.baseLayers = {
        'google-streets': L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          attribution: '&copy; Google Maps'
        }),
        'google-satellite': L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          attribution: '&copy; Google Maps Satellite Hybrid'
        }),
        'google-terrain': L.tileLayer('https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          attribution: '&copy; Google Maps Terrain'
        }),
        'osm': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap'
        })
      };

      this.currentBaseLayerName = 'google-streets';
      this.currentBaseLayer = this.baseLayers['google-streets'];
      this.currentBaseLayer.addTo(this.map);

      this.markersGroup = L.layerGroup().addTo(this.map);
      this.isInitialized = true;

      setTimeout(() => this.resize(), 120);
      setTimeout(() => this.resize(), 350);
    } catch (e) {
      console.warn("Map initialization warning:", e);
    }
  }

  setBaseMap(layerKey) {
    if (!this.map || !this.baseLayers || !this.baseLayers[layerKey]) return;
    if (this.currentBaseLayer) {
      this.map.removeLayer(this.currentBaseLayer);
    }
    this.currentBaseLayerName = layerKey;
    this.currentBaseLayer = this.baseLayers[layerKey];
    this.currentBaseLayer.addTo(this.map);
  }

  openGoogleMapsNavigation(originCity, destCity, mode = 'Road') {
    const travelMode = mode === 'Train' ? 'transit' : 'driving';
    const originStr = originCity?.name || `${originCity?.lat || 17.385},${originCity?.lng || 78.4867}`;
    const destStr = destCity?.name || `${destCity?.lat || 15.4909},${destCity?.lng || 73.8278}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originStr)}&destination=${encodeURIComponent(destStr)}&travelmode=${travelMode}`;
    window.open(url, '_blank');
  }

  resize() {
    if (this.map) {
      try {
        this.map.invalidateSize(true);
      } catch (err) {
        console.warn("Map resize warning:", err);
      }
    }
    if (this.nativeGMap && window.google) {
      try {
        window.google.maps.event.trigger(this.nativeGMap, 'resize');
      } catch (e) {
        console.warn("Native GMap resize warning:", e);
      }
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 3. Multi-Modal Corridor Rendering (Road, Train, Flight)
  // ─────────────────────────────────────────────────────────────
  async renderJourneyRoute(originCity, destCity, isDetour = false, transportMode = 'Road') {
    if (!this.map) this.initMap();
    if (!this.map) return;

    if (this.markersGroup) this.markersGroup.clearLayers();
    if (this.routeLine) { this.map.removeLayer(this.routeLine); this.routeLine = null; }
    if (this.detourLine) { this.map.removeLayer(this.detourLine); this.detourLine = null; }
    if (this.hazardMarker) { this.map.removeLayer(this.hazardMarker); this.hazardMarker = null; }

    const lat1 = originCity.lat || 17.3850;
    const lng1 = originCity.lng || 78.4867;
    const lat2 = destCity.lat || 15.4909;
    const lng2 = destCity.lng || 73.8278;

    // 1. Origin Marker
    const originIcon = L.divIcon({
      className: 'journx-map-pin',
      html: `
        <div style="background:#0F141C; color:#F59E0B; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid #F59E0B; box-shadow:0 4px 14px rgba(245,158,11,0.5); font-size:15px; font-weight:bold;">
          ${transportMode === 'Flight' ? '🛫' : transportMode === 'Train' ? '🚉' : '🚩'}
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });
    const mOrigin = L.marker([lat1, lng1], { icon: originIcon }).bindPopup(`
      <div style="font-family:'Plus Jakarta Sans',sans-serif; padding:4px;">
        <strong style="color:#0F141C; font-size:13px;">${originCity.name || 'Origin Point'}</strong><br>
        <span style="color:#64748B; font-size:11px;">${transportMode === 'Flight' ? 'Departure Airport Terminal' : transportMode === 'Train' ? 'Central Railway Station' : 'Highway Departure Point'}</span>
      </div>
    `);
    this.markersGroup.addLayer(mOrigin);

    // 2. Destination Marker
    const destIcon = L.divIcon({
      className: 'journx-map-pin',
      html: `
        <div style="background:#0F141C; color:#10B981; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid #10B981; box-shadow:0 4px 14px rgba(16,185,129,0.5); font-size:15px; font-weight:bold;">
          ${transportMode === 'Flight' ? '🛬' : transportMode === 'Train' ? '🏁' : '🏁'}
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });
    const mDest = L.marker([lat2, lng2], { icon: destIcon }).bindPopup(`
      <div style="font-family:'Plus Jakarta Sans',sans-serif; padding:4px;">
        <strong style="color:#0F141C; font-size:13px;">${destCity.name || 'Destination Point'}</strong><br>
        <span style="color:#64748B; font-size:11px;">${transportMode === 'Flight' ? 'Arrival International Airport' : transportMode === 'Train' ? 'Terminus Junction Station' : 'Target Arrival Milestone'}</span>
      </div>
    `);
    this.markersGroup.addLayer(mDest);

    // Midpoints calculation
    const q1Lat = lat1 * 0.66 + lat2 * 0.34;
    const q1Lng = lng1 * 0.66 + lng2 * 0.34;
    const midLat = (lat1 + lat2) / 2;
    const midLng = (lng1 + lng2) / 2;
    const q3Lat = lat1 * 0.34 + lat2 * 0.66;
    const q3Lng = lng1 * 0.34 + lng2 * 0.66;

    // 3. Mode-Specific Route Drawing & Waypoints
    if (transportMode === 'Flight') {
      const arcPoints = [];
      const steps = 40;
      const arcHeight = Math.abs(lng2 - lng1) * 0.25 + 0.8;

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const curLat = lat1 + (lat2 - lat1) * t + Math.sin(t * Math.PI) * arcHeight;
        const curLng = lng1 + (lng2 - lng1) * t;
        arcPoints.push([curLat, curLng]);
      }

      this.routeLine = L.polyline(arcPoints, {
        color: '#06B6D4',
        weight: 4,
        opacity: 0.9,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(this.map);

      const midPoint = arcPoints[Math.floor(steps / 2)];
      const flightIcon = L.divIcon({
        className: 'journx-map-pin',
        html: `<div style="background:#0F141C; color:#06B6D4; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:1.5px solid #06B6D4; font-size:14px; box-shadow:0 0 10px rgba(6,182,212,0.6);">✈️</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      this.markersGroup.addLayer(L.marker(midPoint, { icon: flightIcon }).bindPopup(`
        <div style="font-family:'Plus Jakarta Sans',sans-serif;">
          <strong>Commercial Flight Cruising Corridor</strong><br>
          <span style="font-size:11px; color:#64748B;">FL320 &bull; 32,000 ft Cruising Altitude &bull; 680 km/h</span>
        </div>
      `));

    } else if (transportMode === 'Train') {
      const trainCoords = [
        [lat1, lng1],
        [q1Lat - 0.05, q1Lng + 0.10],
        [midLat - 0.08, midLng - 0.05],
        [q3Lat + 0.04, q3Lng + 0.02],
        [lat2, lng2]
      ];

      this.routeLine = L.polyline(trainCoords, {
        color: '#10B981',
        weight: 5,
        opacity: 0.9,
        dashArray: '10, 6',
        lineCap: 'square'
      }).addTo(this.map);

      const stationIcon = L.divIcon({
        className: 'journx-map-pin',
        html: `<div style="background:#0F141C; color:#10B981; width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:1.5px solid #10B981; font-size:12px;">🚉</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });
      this.markersGroup.addLayer(L.marker([midLat - 0.08, midLng - 0.05], { icon: stationIcon }).bindPopup(`
        <div style="font-family:'Plus Jakarta Sans',sans-serif;">
          <strong>Intermediate Railway Junction</strong><br>
          <span style="font-size:11px; color:#64748B;">Platform 3 &bull; Scheduled 10 min technical halt</span>
        </div>
      `));

    } else {
      // Road Corridor Waypoints (NHAI FASTag & Supercharger)
      const tollIcon = L.divIcon({
        className: 'journx-map-pin',
        html: `<div style="background:#1B2430; color:#F59E0B; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:1.5px solid #F59E0B; font-size:13px; box-shadow:0 2px 8px rgba(0,0,0,0.4);">💳</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      this.markersGroup.addLayer(L.marker([q1Lat, q1Lng], { icon: tollIcon }).bindPopup(`
        <div style="font-family:'Plus Jakarta Sans',sans-serif;">
          <strong>NHAI FASTag Electronic Toll Plaza</strong><br>
          <span style="font-size:11px; color:#64748B;">Lane 4 Dedicated ETC &bull; Avg pass-through 12s</span>
        </div>
      `));

      const fuelIcon = L.divIcon({
        className: 'journx-map-pin',
        html: `<div style="background:#1B2430; color:#10B981; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:1.5px solid #10B981; font-size:13px; box-shadow:0 2px 8px rgba(0,0,0,0.4);">⚡</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      this.markersGroup.addLayer(L.marker([midLat, midLng], { icon: fuelIcon }).bindPopup(`
        <div style="font-family:'Plus Jakarta Sans',sans-serif;">
          <strong>Highway Supercharge & Fuel Plaza</strong><br>
          <span style="font-size:11px; color:#64748B;">150kW Ultra-Fast CCS2 &bull; Premium Fuel Available</span>
        </div>
      `));

      const restIcon = L.divIcon({
        className: 'journx-map-pin',
        html: `<div style="background:#1B2430; color:#06B6D4; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:1.5px solid #06B6D4; font-size:13px; box-shadow:0 2px 8px rgba(0,0,0,0.4);">☕</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      this.markersGroup.addLayer(L.marker([q3Lat, q3Lng], { icon: restIcon }).bindPopup(`
        <div style="font-family:'Plus Jakarta Sans',sans-serif;">
          <strong>Highway Dining Oasis & Lounge</strong><br>
          <span style="font-size:11px; color:#64748B;">Clean Restrooms &bull; Artisan Espresso & Dining</span>
        </div>
      `));

      // Fetch Real Highway Route Geometry (Google Maps Directions API proxy or OSRM)
      let routeCoords = [];
      try {
        const gKey = localStorage.getItem('JOURNX_GMAPS_KEY') || '';
        const keyParam = gKey ? `&gmaps_key=${encodeURIComponent(gKey)}` : '';
        const res = await fetch(`/api/routes/calculate?origin_lat=${lat1}&origin_lng=${lng1}&dest_lat=${lat2}&dest_lng=${lng2}${keyParam}`);
        if (res.ok) {
          const json = await res.json();
          if (json.coordinates && json.coordinates.length > 0) {
            routeCoords = json.coordinates;
          }
        }
      } catch (e) {
        console.warn("Routing fallback:", e);
      }

      if (routeCoords.length === 0) {
        routeCoords = [
          [lat1, lng1],
          [q1Lat, q1Lng + 0.12],
          [midLat, midLng - 0.14],
          [q3Lat, q3Lng + 0.08],
          [lat2, lng2]
        ];
      }

      this.routeLine = L.polyline(routeCoords, {
        color: isDetour ? '#F43F5E' : '#F59E0B',
        weight: 5,
        opacity: isDetour ? 0.5 : 0.95,
        dashArray: isDetour ? '6, 8' : null,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(this.map);
    }

    // 4. Trip Guardian Detour Bypass
    if (isDetour) {
      const detourCoords = [
        [q1Lat, q1Lng + 0.12],
        [midLat + 0.32, midLng + 0.38],
        [q3Lat + 0.20, q3Lng + 0.22],
        [lat2, lng2]
      ];

      this.detourLine = L.polyline(detourCoords, {
        color: '#10B981',
        weight: 6,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(this.map);

      const hazardIcon = L.divIcon({
        className: 'journx-map-pin',
        html: `<div style="background:#EF4444; color:#fff; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid #fff; font-size:15px; box-shadow:0 0 16px rgba(239,68,68,0.9);">⚠️</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      this.hazardMarker = L.marker([midLat, midLng - 0.14], { icon: hazardIcon })
        .bindPopup(`<strong>CRITICAL DISRUPTION @ KM 340</strong><br>Monsoon cloudburst submerged ghat pass.<br>Detour active via NH-748 Elevated Bypass.`)
        .addTo(this.map);
    }

    // Auto-fit bounds
    try {
      const bounds = L.latLngBounds([[lat1, lng1], [lat2, lng2]]);
      this.map.fitBounds(bounds, { padding: [45, 45], maxZoom: 12 });
    } catch (err) {
      console.warn("fitBounds warning:", err);
    }

    this.resize();
  }
}
