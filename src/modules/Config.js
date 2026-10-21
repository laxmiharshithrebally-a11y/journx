// RoadMate X - Global Configuration & Preset Matrix
// Nebius x NVIDIA Global AI Hackathon 2026 Edition

export const CONFIG = {
  version: "2.4.0-NVIDIA-NEBIUS",
  hackathon: {
    name: "Nebius x NVIDIA Global AI Hackathon 2026",
    track: "Best Apps and Agents / Agentic Engineering & Physical AI",
    deadline: "October 30, 2026",
    model: "nvidia/llama-3.1-nemotron-70b-instruct",
    infrastructure: "Nebius Token Factory (api.tokenfactory.nebius.com)",
    accelerator: "NVIDIA H100 SXM5 Tensor Core GPU Swarm",
    cuOptRouting: "GPU-Accelerated Constrained Vehicle Routing (VRP/TSP)"
  },
  theme: {
    bgDark: 0x030712,
    fogDensityNormal: 0.0055,
    fogDensityStorm: 0.022,
    accentCyan: 0x00f0ff,
    accentEmerald: 0x10b981,
    accentAmber: 0xf59e0b,
    accentCrimson: 0xef4444,
    accentViolet: 0x8b5cf6,
    roadPrimary: 0x0a1120,
    roadDetour: 0x061a14,
    roadMarking: 0x00f0ff,
    detourMarking: 0x10b981,
    hazardGlow: 0xff0044
  },
  camera: {
    fov: 54,
    near: 0.1,
    far: 3000,
    modes: {
      CHASE: "chase",
      DRONE: "drone",
      COCKPIT: "cockpit",
      GOD_EYE: "god_eye"
    }
  },

  // Multi-Agent Architecture Definitions
  agents: [
    {
      id: "planner",
      name: "AI Planner Agent",
      icon: "🧠",
      model: "NVIDIA Nemotron-70B",
      role: "Strategic mission orchestrator, itinerary synthesis, constraints management",
      color: "#00f0ff"
    },
    {
      id: "route",
      name: "Route & Navigation Agent",
      icon: "🗺️",
      model: "NVIDIA cuOpt Logistics",
      role: "3D Spline geometry, elevation profiling, turn-by-turn graph optimization",
      color: "#3b82f6"
    },
    {
      id: "weather",
      name: "Atmospheric Weather Agent",
      icon: "🌦️",
      model: "Doppler Radar Neural Net",
      role: "Micro-climate radar scanning, precipitation vectors, surface traction friction",
      color: "#06b6d4"
    },
    {
      id: "budget",
      name: "Dynamic Budget Agent",
      icon: "💰",
      model: "Fiscal Optimization Engine",
      role: "Live multi-currency ledger, toll calculation, fuel/charge arbitrage, emergency buffer",
      color: "#10b981"
    },
    {
      id: "stay",
      name: "Stay & Rest Hub Agent",
      icon: "🏨",
      model: "Hospitality Matching System",
      role: "Verified boutique havens, EV supercharger hubs, emergency layovers",
      color: "#a855f7"
    },
    {
      id: "risk",
      name: "Safety & Hazard Risk Agent",
      icon: "⚠️",
      model: "Nemotron Hazard Classifier",
      role: "Black spot detection, hydroplane probability, geopolitical & terrain safety matrix",
      color: "#f59e0b"
    },
    {
      id: "replanner",
      name: "Dynamic Replanning Agent",
      icon: "⚡",
      model: "cuOpt Reactive Re-route",
      role: "Autonomous incident detection, alternative synthesis, physical car reroute",
      color: "#ef4444"
    }
  ],

  // Global Presets spanning the whole world
  presetRoutes: {
    "hyderabad-goa": {
      id: "hyderabad-goa",
      name: "Hyderabad → Goa (Western Ghats Expedition)",
      origin: "Hyderabad, Telangana",
      destination: "Goa (North & South)",
      country: "India 🇮🇳",
      currency: "₹",
      currencyCode: "INR",
      distance: "670 km",
      duration: "7 Days",
      travelers: 4,
      budgetTotal: 60000,
      budgetBreakdown: {
        fuel: 14500,
        tolls: 2400,
        stays: 26000,
        activities: 12100,
        buffer: 5000
      },
      vehicleType: "Autonomous Cyber-SUV",
      incident: {
        title: "Monsoon Flash Flood & Mudslide at Chorla Ghat",
        type: "flood",
        location: "KM 340 (Chorla Ghat Pass)",
        severity: "CRITICAL HAZARD",
        impact: "Road submerged under 0.8m rapid water. Zero traction. 4h 30m gridlock.",
        alternativeTitle: "NH-748 Anmod Ghat Scenic Highway Bypass",
        alternativeSavings: "Safe elevated highway, saved ₹600 toll, 99.2% traction score.",
        splineTriggerT: 0.42
      },
      itinerary: [
        { day: 1, title: "Hyderabad to Mahbubnagar & Raichur", desc: "Departure via ORR, lunch at Raichur Heritage, evening cruise on Tungabhadra." },
        { day: 2, title: "Hampi UNESCO Boulder Exploration", desc: "Virupaksha Temple sunrise, electric golf-cart tour of Vijayanagara ruins, cliff sunset." },
        { day: 3, title: "Hampi to Dandeli Rainforest", desc: "Kali river white-water rafting, jungle safari camp, eco-lodge check-in." },
        { day: 4, title: "Western Ghats Mountain Crossing", desc: "Ascent through lush tropical fog. [INCIDENT REPLAN ACTIVATED HERE]." },
        { day: 5, title: "Old Goa Heritage & Panjim Latin Quarter", desc: "Basilica of Bom Jesus, Fontainhas heritage walk, Mandovi river catamaran dinner." },
        { day: 6, title: "South Goa Secluded Beaches & Spice Plantations", desc: "Palolem bay kayaking, organic spice farm tour, sunset beach shack dining." },
        { day: 7, title: "Vagator Cliff & Coastal Return Prep", desc: "Chapora Fort overlook, seaside brunch, autonomous diagnostic check for return journey." }
      ],
      pointsPrimary: [
        { x: 0,   y: 1.0,  z: 30 },
        { x: 0,   y: 1.0,  z: -60 },
        { x: 22,  y: 3.5,  z: -160 },
        { x: 38,  y: 6.2,  z: -270 },
        { x: 12,  y: 4.8,  z: -380 },
        { x: -30, y: 3.2,  z: -490 },  // Incident area around z = -490
        { x: -55, y: 2.0,  z: -610 },  // Blocked route continues into flood
        { x: -40, y: 1.5,  z: -730 },
        { x: -10, y: 2.0,  z: -860 },
        { x: 0,   y: 2.5,  z: -1000 }
      ],
      pointsDetour: [
        // Branches off around z = -380 -> -490
        { x: 12,  y: 4.8,  z: -380 },
        { x: 28,  y: 7.2,  z: -460 },
        { x: 42,  y: 9.8,  z: -560 },  // High elevated bypass
        { x: 36,  y: 8.5,  z: -680 },
        { x: 18,  y: 5.4,  z: -800 },
        { x: 0,   y: 2.5,  z: -1000 }  // Reconnects at destination
      ]
    },

    "sf-tahoe": {
      id: "sf-tahoe",
      name: "San Francisco → Lake Tahoe → Yosemite (Sierra Crest)",
      origin: "San Francisco, CA",
      destination: "Lake Tahoe & Yosemite",
      country: "United States 🇺🇸",
      currency: "$",
      currencyCode: "USD",
      distance: "480 miles",
      duration: "5 Days",
      travelers: 2,
      budgetTotal: 2400,
      budgetBreakdown: {
        fuel: 320,
        tolls: 45,
        stays: 1250,
        activities: 585,
        buffer: 200
      },
      vehicleType: "Dual-Motor Cyber-EV",
      incident: {
        title: "Severe Sierra Blizzard & Donner Pass I-80 Closure",
        type: "blizzard",
        location: "Mile 180 (Donner Pass Summit 7,200ft)",
        severity: "CHAIN LAW MANDATORY // ZERO VISIBILITY",
        impact: "I-80 shut down due to jackknifed trucks. 45mph winds, -6°C.",
        alternativeTitle: "Highway 50 South Lake Tahoe Scenic Pass Bypass",
        alternativeSavings: "Plowed dry corridor, 2 Superchargers en-route, saves 3.5 hrs.",
        splineTriggerT: 0.45
      },
      itinerary: [
        { day: 1, title: "Bay Area Departure via Napa Valley", desc: "Crossing Bay Bridge, wine country vineyard lunch, Sacramento historic delta." },
        { day: 2, title: "Sierra Foothills to Tahoe Basin", desc: "Gold Country historic towns, climb to 6,200 ft elevation. [BLIZZARD DETOUR TRIGGERED]." },
        { day: 3, title: "Emerald Bay & Alpine Gondola", desc: "Snowshoeing at Emerald Bay, Heavenly Mountain gondola panoramic vista, lakeside chalet." },
        { day: 4, title: "Tioga Pass & Yosemite High Country", desc: "Mono Lake tufa towers, Tuolumne Meadows granite domes, Tenaya Lake overlook." },
        { day: 5, title: "Yosemite Valley & Tunnel View Return", desc: "El Capitan & Half Dome morning mist, Bridalveil Fall hike, autonomous cruise back to SF." }
      ],
      pointsPrimary: [
        { x: 0,   y: 1.0,  z: 30 },
        { x: -15, y: 2.0,  z: -70 },
        { x: 10,  y: 6.0,  z: -180 },
        { x: 30,  y: 14.0, z: -300 },
        { x: 15,  y: 22.0, z: -420 },
        { x: -25, y: 32.0, z: -540 },  // I-80 Blizzard block
        { x: -45, y: 34.0, z: -670 },
        { x: -30, y: 28.0, z: -800 },
        { x: -5,  y: 22.0, z: -920 },
        { x: 0,   y: 20.0, z: -1000 }
      ],
      pointsDetour: [
        { x: 15,  y: 22.0, z: -420 },
        { x: 35,  y: 24.0, z: -520 },
        { x: 48,  y: 26.0, z: -640 },  // HWY 50 scenic bypass
        { x: 32,  y: 25.0, z: -760 },
        { x: 12,  y: 22.0, z: -880 },
        { x: 0,   y: 20.0, z: -1000 }
      ]
    },

    "munich-amalfi": {
      id: "munich-amalfi",
      name: "Munich → Swiss Alps → Lake Como → Amalfi Coast",
      origin: "Munich, Bavaria",
      destination: "Amalfi Coast, Italy",
      country: "Europe 🇪🇺",
      currency: "€",
      currencyCode: "EUR",
      distance: "1,180 km",
      duration: "8 Days",
      travelers: 2,
      budgetTotal: 4500,
      budgetBreakdown: {
        fuel: 580,
        tolls: 180,
        stays: 2450,
        activities: 940,
        buffer: 350
      },
      vehicleType: "Grand Touring Cyber-Sedan",
      incident: {
        title: "Alpine Rockfall & Heavy Glacier Fog in Gotthard Corridor",
        type: "rockfall",
        location: "KM 410 (Gotthard Pass Approach)",
        severity: "TUNNEL CORRIDOR CLOSED",
        impact: "Rockfall debris blocking south ramp. Expected clearance delay +5h 15m.",
        alternativeTitle: "San Bernardino Pass & Lugano Lake Express Bypass",
        alternativeSavings: "Open scenic highway, 100% road friction, saved €45 vignettes.",
        splineTriggerT: 0.43
      },
      itinerary: [
        { day: 1, title: "Bavarian Autobahn to Garmisch & Innsbruck", desc: "No-speed-limit Autobahn testing, Zugspitze mountain overlook, Tyrolean dinner." },
        { day: 2, title: "Trans-Alpine Crossing into Switzerland", desc: "High alpine switchbacks, Liechtenstein border crossing. [ALPINE ROCKFALL DETOUR]." },
        { day: 3, title: "Lake Como Villas & Bellagio Harbor", desc: "Ferry cruise to Bellagio, historic Villa Carlotta botanical gardens, lakeside terrace." },
        { day: 4, title: "Milan Fashion District to Tuscany", desc: "Duomo plaza espresso stop, high-speed cruise through Tuscan rolling cypress hills." },
        { day: 5, title: "Florence Renaissance & Chianti Valley", desc: "Uffizi Gallery private morning tour, organic vineyard olive oil tasting." },
        { day: 6, title: "Rome Sunset & Appian Way", desc: "Colosseum night lighting drive, espresso at Piazza Navona, transit towards Naples." },
        { day: 7, title: "Amalfi Cliffside Highway & Positano", desc: "Dramatic Mediterranean cliff curves, Positano pastel houses, sunset yacht cruise." },
        { day: 8, title: "Ravello Cliff Gardens & Departure", desc: "Villa Rufolo infinity garden vista, lemon grove gelato, autonomous journey wrap-up." }
      ],
      pointsPrimary: [
        { x: 0,   y: 1.0,  z: 30 },
        { x: 10,  y: 4.0,  z: -80 },
        { x: -12, y: 11.0, z: -190 },
        { x: 24,  y: 18.0, z: -310 },
        { x: 18,  y: 25.0, z: -430 },
        { x: -32, y: 28.0, z: -550 },  // Gotthard rockfall
        { x: -48, y: 22.0, z: -680 },
        { x: -28, y: 14.0, z: -800 },
        { x: -8,  y: 6.0,  z: -910 },
        { x: 0,   y: 2.0,  z: -1000 }
      ],
      pointsDetour: [
        { x: 18,  y: 25.0, z: -430 },
        { x: 38,  y: 26.0, z: -530 },
        { x: 44,  y: 22.0, z: -650 },  // San Bernardino bypass
        { x: 26,  y: 16.0, z: -780 },
        { x: 10,  y: 8.0,  z: -890 },
        { x: 0,   y: 2.0,  z: -1000 }
      ]
    },

    "tokyo-kyoto": {
      id: "tokyo-kyoto",
      name: "Tokyo → Mt. Fuji → Hakone → Kyoto (Tokaido Trail)",
      origin: "Tokyo, Kanto",
      destination: "Kyoto & Osaka",
      country: "Japan 🇯🇵",
      currency: "¥",
      currencyCode: "JPY",
      distance: "510 km",
      duration: "6 Days",
      travelers: 3,
      budgetTotal: 380000,
      budgetBreakdown: {
        fuel: 48000,
        tolls: 28000,
        stays: 210000,
        activities: 74000,
        buffer: 20000
      },
      vehicleType: "Cyber-Kei Aerocruiser",
      incident: {
        title: "Typhoon Coastal Gale & Tomei Expressway Wind Lockdown",
        type: "typhoon",
        location: "KM 230 (Suruga Bay Coastal Viaduct)",
        severity: "CROSSWIND SHUTDOWN > 95 KM/H",
        impact: "Ocean swells overtopping sea-wall. Tomei coastal lanes closed by NEXCO.",
        alternativeTitle: "Chuo Inland Mountain Expressway Protected Bypass",
        alternativeSavings: "Mountain shielded valley, 4 EV ultra-chargers, saved ¥4,200 tolls.",
        splineTriggerT: 0.44
      },
      itinerary: [
        { day: 1, title: "Shibuya Crossing Departure to Hakone", desc: "Tokyo Metropolitan Expressway loop, Ashi Lake pirate ship cruise, onsen ryokan stay." },
        { day: 2, title: "Mt. Fuji 5th Station & Five Lakes", desc: "Chureito Pagoda postcard viewpoint, Kawaguchiko lake drive. [TYPHOON DETOUR TRIGGERED]." },
        { day: 3, title: "Kiso Valley & Ancient Post Towns", desc: "Magome to Tsumago cobblestone trail, Edo-period wooden tea houses, traditional soba dinner." },
        { day: 4, title: "Nagoya Castle & Toyota Commemorative Museum", desc: "Nagoya golden shachihoko fortress, robotics technology showcase, hitsumabushi eel feast." },
        { day: 5, title: "Kyoto Arashiyama & Gion Geisha District", desc: "Sagano bamboo forest morning walk, Golden Pavilion (Kinkaku-ji), lantern-lit evening alley stroll." },
        { day: 6, title: "Fushimi Inari Torii Gates & Osaka Dotonbori", desc: "10,000 Vermilion torii gates mountain hike, Osaka neon street food finale." }
      ],
      pointsPrimary: [
        { x: 0,   y: 1.0,  z: 30 },
        { x: -12, y: 2.0,  z: -80 },
        { x: 18,  y: 5.0,  z: -190 },
        { x: 26,  y: 8.0,  z: -300 },
        { x: 10,  y: 10.0, z: -420 },
        { x: -35, y: 12.0, z: -550 },  // Tomei coastal gale
        { x: -50, y: 9.0,  z: -680 },
        { x: -30, y: 6.0,  z: -800 },
        { x: -10, y: 3.0,  z: -910 },
        { x: 0,   y: 2.0,  z: -1000 }
      ],
      pointsDetour: [
        { x: 10,  y: 10.0, z: -420 },
        { x: 32,  y: 14.0, z: -520 },
        { x: 42,  y: 16.0, z: -650 },  // Chuo mountain bypass
        { x: 28,  y: 12.0, z: -770 },
        { x: 10,  y: 6.0,  z: -890 },
        { x: 0,   y: 2.0,  z: -1000 }
      ]
    }
  }
};
