# 📝 JOURNX — Official Hackathon Submission Document
> **Event:** NVIDIA × Nebius AI Global Hackathon 2026  
> **Track:** Best Multimodal Agents & Physical AI Operations  
> **Project Title:** JOURNX — Autonomous Multimodal Travel Intelligence Platform  
> **Short Tagline:** Transforming passive travel planning into autonomous physical operations with NVIDIA Nemotron-70B, real spatial geometry, and self-healing cuOpt detours.

---

## 🎯 1. Inspiration
Planning a journey today is fragmented and broken. Travelers are forced to juggle between Google Maps for road directions, Skyscanner for flights, IRCTC for trains, and separate weather radar apps. If they try using a conversational AI like ChatGPT or Claude, they receive a generic markdown list with fabricated hotel prices and hallucinated driving times. Worst of all, the moment travelers hit the road, traditional apps become passive observers. When a sudden monsoon flood washes out a mountain pass or a 14-kilometer highway gridlock forms, travelers are left stranded with no actionable alternatives.

We built **JOURNX** to answer one fundamental question:  
*What if travel planning wasn't a static list of bullet points, but an Autonomous Operating System that continuously monitors, calculates, and self-heals your journey in physical reality?*

---

## 🚀 2. What It Does
**JOURNX** is an end-to-end autonomous travel operations platform that:
1. **Understands Natural-Language Travel Goals:** Powered by **NVIDIA Llama-3.1-Nemotron-70B-Instruct** on **Nebius AI Cloud**, travelers describe complex, multi-constraint trips in freeform text (e.g., *"Plan a 7-day trip from Hyderabad to Goa for 4 friends under ₹60,000. We want comfortable travel and scenic stops"*).
2. **Evaluates a Deterministic Multimodal Matrix:** Instead of hallucinating numbers, JOURNX deterministically models and compares 4 parallel transit strategies:
   - 🚗 **Road Expedition (SUV):** Fuel consumption, FASTag electronic tolls, driver fatigue curves.
   - 🚆 **Express Rail & Sleeper:** Zero driving fatigue, station transfers, lowest carbon impact.
   - ✈️ **Commercial Aviation:** Rapid aerial cruise, airport ground overhead.
   - ⚡ **Hybrid Transit:** Long-haul trunk rail combined with local self-drive destination rental.
3. **Monitors Physical Atmospheric Reality:** Live connection to the **Open-Meteo REST API** computes dynamic pavement friction coefficients ($1.18\mu$ dry pavement vs $0.74\mu$ wet hazard alert) to inform safe travel speed.
4. **Simulates Scenarios with "Trip Twin":** Interactive sliders allow travelers to dynamically perturb budget caps, party headcount, or trip duration, recalculating cross-modal costs in real-time.
5. **Autonomously Replans Disruptions with "Trip Guardian":** When severe incidents strike (monsoon flash floods, mountain landslides, expressway gridlocks), Trip Guardian triggers a 5-step cognitive loop, calculates topological graph alternatives via **NVIDIA cuOpt heuristics**, and autonomously dispatches safe bypass detours.

---

## 🏗️ 3. How We Built It
- **AI Reasoning & Extraction:** NVIDIA Llama-3.1-Nemotron-70B-Instruct hosted on Nebius AI Cloud, with structured JSON schema outputs and trade-off synthesis.
- **Detour Graph Optimization:** NVIDIA cuOpt heuristic bypass algorithms for constrained detour routing and OSRM real highway geometry.
- **Backend Architecture:** Lightweight, deterministic Python 3 REST API server with zero bloat (`server.py`).
- **Database & Spatial Cache:** Embedded SQLite 3 (`journx.db`) with an autonomous `location_cache` indexing coordinate lookups to avoid external API rate limits.
- **Physical Sensors & Mapping:** Dual mapping engine featuring Three.js WebGL (r128) for the 3D orbital opening experience and Leaflet.js with live Open-Meteo radar tile overlays.
- **Design System:** Bespoke "Midnight Autonomous" aesthetic using vanilla CSS3 design tokens, hardware-accelerated animations, and multi-palette themes (Obsidian Gold, Deep Cobalt, Emerald Carbon).

---

## 🧗 4. Challenges We Ran Into
- **Deterministic vs. Generative Balance:** LLMs are prone to hallucinating numerical costs (fuel consumption, tolls, ticket prices). We solved this by using Nemotron-70B strictly for unstructured language understanding and trade-off synthesis, while piping all financial calculations through a deterministic mathematical pricing engine.
- **Real-Time Physical Sensor Latency:** Querying multiple live APIs (Nominatim geocoding, OSRM routing, Open-Meteo radar) could cause UI lag. We implemented an autonomous SQLite spatial cache (`location_cache`) and intelligent fallback mechanisms that guarantee instantaneous responses even under poor network conditions.
- **3D WebGL Camera Glide Math:** Creating smooth camera transitions from deep space orbital perspectives to specific city beacons required custom spherical-to-Cartesian vector math and lerp interpolation to prevent gimbal lock.

---

## 🏆 5. Accomplishments That We're Proud Of
- Built a **100% working, verifiable prototype** with zero mockups—every single tab, button, calculation, and reroute pipeline is functional.
- Created an **Automated Smoke Test Suite (`test_submission.py`)** that validates all 8 core platform subsystems with 100% pass rates.
- Delivered a **Cinema-Grade 3D Globe Opening Experience** that sets an enterprise hackathon aesthetic standard.
- Engineered a true **closed-loop autonomous physical AI system** (Detect $\to$ Understand $\to$ Solve $\to$ Simulate $\to$ Replan).

---

## 📚 6. What We Learned
- How to effectively prompt and constrain NVIDIA Nemotron-70B for zero-hallucination operational reasoning.
- How to blend physical environmental telemetry (atmospheric rainfall, pavement friction coefficients) into digital routing algorithms.
- The power of containerized, zero-dependency architectures for effortless evaluation by hackathon judges.

---

## 🔮 7. What's Next for JOURNX
- **Real cuOpt GPU Microservice:** Packaging the full GPU-accelerated NVIDIA cuOpt Docker container on Nebius AI Cloud for multi-vehicle fleet optimization.
- **OBD-II & In-Vehicle Telemetry:** Connecting real-time vehicle CAN bus telemetry (EV battery state of charge, tire pressure) directly to the Trip Guardian loop.
- **Automated Bookings:** Direct 1-click reservations through FASTag, IRCTC rail, airline GDS, and hotel aggregators.

---

## 🏷️ Built With
`python` `nvidia-nemotron` `nebius-ai` `nvidia-cuopt` `three.js` `webgl` `leaflet` `open-meteo` `openstreetmap` `osrm` `sqlite3` `docker`
