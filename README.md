# 🌐 JOURNX — Autonomous Multimodal Travel Intelligence Platform

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/laxmiharshithrebally-a11y/journx)
[![Verification Status](https://img.shields.io/badge/Verification_Suite-8%2F8_PASSED-emerald)](test_submission.py)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](Dockerfile)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/laxmiharshithrebally-a11y/journx)

> **NVIDIA × Nebius AI Global Hackathon 2026**  
> **Track:** Best Multimodal Agents & Physical AI Operations  
> **Target LLM:** NVIDIA Llama-3.1-Nemotron-70B-Instruct on Nebius AI Cloud  
> **Logistics Solver:** NVIDIA cuOpt Graph Optimizer & Detour Routing  
> **Live GitHub:** https://github.com/laxmiharshithrebally-a11y/journx

---

## 🧭 Executive Summary

Most existing travel apps are static itineraries or generic chatbot wrappers. You type a prompt, receive a markdown list of bullet points, and once you embark, the application goes silent. When real-world disruptions strike — torrential monsoon rains flooding a mountain pass, a 14-kilometer highway gridlock, or EV charger blackouts — travelers are left stranded without actionable operational alternatives.

**JOURNX transforms travel planning into Autonomous Travel Operations.**

JOURNX allows travelers to describe high-level goals in natural language or structured constraints, and then deterministically evaluates, compares, simulates, and monitors journeys across **Road, Rail, Flight, and Hybrid transport strategies**. Powered by real spatial routing, live atmospheric radar, and the NVIDIA Nemotron-70B reasoning loop, JOURNX continuously monitors the active corridor and autonomously calculates cuOpt detours when hazards are detected.

---

## 🔄 The Autonomous Intelligence Loop

JOURNX adheres to an end-to-end cognitive loop:

```text
       ┌──────────────┐
       │  UNDERSTAND  │  ◄── Natural-language travel goal parsed by Nemotron-70B
       └──────┬───────┘
              ▼
       ┌──────────────┐
       │   RESEARCH   │  ◄── Worldwide coordinates resolved via Nominatim / SQLite cache
       └──────┬───────┘
              ▼
       ┌──────────────┐
       │     PLAN     │  ◄── Real OSRM highway geometry & multimodal connections
       └──────┬───────┘
              ▼
       ┌──────────────┐
       │  CALCULATE   │  ◄── Deterministic cost engine (Fuel, Tolls, Rail, Air, Hotels, CO₂)
       └──────┬───────┘
              ▼
       ┌──────────────┐
       │   COMPARE    │  ◄── Cross-modal matrix: Road vs. Train vs. Flight vs. Hybrid
       └──────┬───────┘
              ▼
       ┌──────────────┐
       │   SIMULATE   │  ◄── Trip Twin: Dynamic budget, traveler & duration perturbations
       └──────┬───────┘
              ▼
       ┌──────────────┐
       │  RECOMMEND   │  ◄── Nemotron-70B synthesis with clear trade-off rationale
       └──────┬───────┘
              ▼
       ┌──────────────┐
       │ USER APPROVAL│  ◄── Traveler selects optimal multimodal strategy
       └──────┬───────┘
              ▼
       ┌──────────────┐
       │   MONITOR    │  ◄── Live Open-Meteo weather radar & pavement grip index (μ)
       └──────┬───────┘
              ▼
       ┌──────────────┐
       │DETECT CHANGE │  ◄── Monsoon flood, landslide, gridlock, or charger outage
       └──────┬───────┘
              ▼
       ┌──────────────┐
       │    REPLAN    │  ◄── 5-step cuOpt bypass dispatch & green detour rerouting
       └──────────────┘
```

---

## ⚡ Core Platform Architecture & Features

### 1. 3D Global Travel Cinematic Opening (`View 1`)
- **Interactive Three.js WebGL Globe:** Dark astronomical aesthetic (`#080B10`) featuring coordinate lattices, 1,400-point geographic landmass simulation, orbital satellite rings, and real-time multimodal trajectory meshes (Air flight arc in amber, Rail arterial route in cyan, Road highway pulse in emerald).
- **Time-Bounded HUD:** 4–8 second autonomous sequence with progressive progress bar, instant **"⚡ 1-Click Demo"** bypass, and camera zoom transition into the Command Center.

### 2. Dedicated Luxury Authentication Portal (`View 2`)
- **Clean Split Layout:** Deep charcoal panel detailing platform capabilities alongside a responsive authentication card.
- **Dual Flow:** Email & Password authentication with full SQLite user table persistence, dynamic registration toggle, and 1-Click Demo Traveler access.

### 3. JOURNX Command Center (`View 3`)

#### 🗺️ Tab 1: Multimodal Journey Planner
- **NVIDIA Nemotron-70B Natural Language Parser:** Extracts origin, destination, days, traveler headcount, target budget, currency, and transportation preferences from freeform natural language.
- **Worldwide Autocomplete Search:** Debounced query handler backed by an embedded SQLite cache (`location_cache`) and OpenStreetMap Nominatim proxy with custom user-agent headers.
- **Quick Corridor Chips:** 1-click presets for popular Indian and global routes (*Hyderabad → Goa, Mumbai → Goa, Delhi → Manali, London → Paris, New York → Washington DC, Tokyo → Kyoto*).
- **Pre-Planning Confirmation Panel:** Verifies extracted constraints before executing the calculation pipeline.
- **7-Stage Planning Stream Animation:** Visualizes each phase of the AI agent pipeline in real-time.
- **Multimodal Comparison Matrix:** Side-by-side strategy comparison across 4 modes:
  - **🚗 Road Trip (Private SUV):** Calibrated fuel consumption, FASTag electronic toll bands, driver fatigue metrics, and high spontaneity.
  - **🚄 Express Rail & Sleeper:** Zero driving fatigue, overnight berth transit, station transfers, and low carbon footprint.
  - **✈️ Commercial Flight:** Rapid cruise velocity, TSA overhead, checked luggage, and airport ground transfers.
  - **🔀 Hybrid Transit:** Long-haul rail/flight with destination private cab/self-drive rental.
- **Nemotron Consensus & Trade-Off Box:** Synthesizes budget fit, travel fatigue, route spontaneity, and carbon impact with data provenance badges (`LIVE`, `ESTIMATED`, `CALCULATED`).

#### 📍 Tab 2: Interactive Route Map & Weather Radar
- **Leaflet.js & OpenStreetMap:** High-definition interactive map rendered with real OSRM road coordinates, departure pin 🚩, arrival pin 🏁, highway fast fuel stations ⛽, and dining oasis lounges ☕.
- **Live Open-Meteo Weather Radar:** Queries real-time meteorological conditions for origin and destination.
- **Road Surface Traction Index:** Calculates dynamic friction coefficients ($1.18\mu$ dry pavement vs $0.74\mu$ wet hazard alert) to inform safe travel speed.

#### 🧬 Tab 3: Trip Twin Simulation Environment
- **Parameter Perturbation Engine:** Interactive sliders for budget caps (₹20,000–₹150,000), traveler count (1–10 people), and trip duration (2–21 days).
- **Live Re-calculation:** Recalculates all multimodal transport costs in real-time without reloading.
- **Conversational What-If Queries:** Natural language scenario testing (e.g., *"What if I reduce the budget to ₹45,000?"*, *"What if we avoid driving due to fatigue?"*, *"What if heavy rain hits the route?"*).

#### 🛡️ Tab 4: Trip Guardian Autonomous Replanning
- **Disruption Scenarios:** Simulates monsoon flash floods, mountain landslides, expressway gridlocks, and EV supercharger blackouts.
- **5-Step Cognitive Replanning Pipeline:**
  1. *Detect:* Identify incident location and severity threshold.
  2. *Understand:* Model safety drop and impassable road segments.
  3. *cuOpt Evaluate:* Compute alternative topological highway graphs.
  4. *Simulate:* Measure safety score ($99.4\%$), time delta ($-4.2$ hrs), and toll variance.
  5. *Replan & Dispatch:* Light up the emerald detour bypass on the Leaflet map and update the trip schedule.

#### 📅 Tab 5: Day-by-Day Itinerary & Expense Tracker
- **Daily Expedition Schedule:** Chronological daily milestones with estimated spend, recommended meal/coffee stops, and lodging tiers.
- **Reconciliation Table:** Real-time expense tracker with status tags.
- **1-Click Exports:** Export PDF Travel Dossier and download structured CSV reports.

#### 🌍 Tab 6 & 👤 Tab 7: Destination Explorer & Traveler Profile
- **Curated Global Destinations:** Heritage sites, coastal highways, and alpine mountain passes.
- **Customizable Vehicle Specifications:** Calibrate engine type (Diesel 4x4, Petrol Sedan, EV), fuel economy ($13.5\text{ km/L}$), home base, and currency preferences.

---

## 🛠️ Technology Stack

| Layer | Component | Description |
|---|---|---|
| **AI Cloud & LLM** | **NVIDIA Nemotron-70B** | `nvidia/llama-3.1-nemotron-70b-instruct` on Nebius AI Cloud for goal parsing, trade-off evaluation, and What-If synthesis. |
| **Routing & detours** | **NVIDIA cuOpt Heuristics & OSRM** | Constrained detour route calculation and real OpenStreetMap driving highway geometry. |
| **Backend Server** | **Python 3 (`server.py`)** | Lightweight REST API serving static assets and deterministic endpoints on port 8080. |
| **Database** | **SQLite 3 (`journx.db`)** | Embedded SQL database for users, journeys, itineraries, expenses, and geocoded location cache. |
| **3D Visualization** | **Three.js WebGL (r128)** | 3D orbital globe, landmass particle lattice, and multimodal transport vector arcs. |
| **Mapping Engine** | **Leaflet.js + OpenStreetMap** | Tile rendering, waypoint overlays, real OSRM polylines, and dynamic detour bypass lines. |
| **Weather Telemetry** | **Open-Meteo REST API** | Live atmospheric data proxy calculating surface friction coefficient ($\mu$). |
| **Design System** | **Vanilla CSS3 (Design Tokens)** | "Premium Midnight Travel" palette: `#080B10` core, `#0F141C` cards, `#F59E0B` amber, `#06B6D4` cyan. |

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
- Python 3.9+ installed.
- Modern web browser (Chrome, Edge, Firefox, Safari) with WebGL support enabled.

### 2. Initialize the Database
```bash
python init_journx_db.py
```
*Creates `journx.db` with all tables (`users`, `profiles`, `journeys`, `journey_options`, `itineraries`, `expenses`, `location_cache`) and seed data.*

### 4. Run Automated Smoke Tests (Instant Verification)
```bash
python test_submission.py
```
*Executes all 8 platform verification tests (Health, Spatial Geocoding, Multimodal Matrix, Open-Meteo Radar, Trip Twin, Trip Guardian, Nemotron Intent Parsing, and Auth) and confirms 100% pass status.*

### 5. Launch the Server
```bash
python server.py
```
*Starts the HTTP and REST API server on `http://localhost:8080`.*

### 6. Or Run with Docker (1-Click Deployment)
```bash
docker compose up --build
```

### 7. Open JOURNX in Browser
Navigate to:
```text
http://localhost:8080
```
- Enjoy the **3D Global Travel Cinematic Opening** with deep space camera glide and decrypting typography.
- Click **"Enter Experience ➔"** or **"⚡ 1-Click Demo"** for instant access as a verified traveler.
- In the Command Center, click **"🧭 2-Min Judge Tour"** in the top navigation bar for a guided walkthrough of all core capabilities.

---

## 📦 Hackathon Submission Artifacts

| Deliverable | File Link | Description |
|---|---|---|
| **🎥 Video Demo Script** | [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md) | Second-by-second 3-minute video recording script with voiceover and on-screen click instructions. |
| **📊 Pitch Deck Outline** | [`PITCH_DECK.md`](PITCH_DECK.md) | 8-slide presentation deck covering Problem, Solution, Cognitive Loop, Architecture, and Business Model. |
| **📝 Devpost Submission Copy** | [`SUBMISSION.md`](SUBMISSION.md) | Complete submission form text (Inspiration, What It Does, How It Was Built, Challenges, What's Next). |
| **🧪 Automated Test Suite** | [`test_submission.py`](test_submission.py) | 8-point automated smoke test validating all REST endpoints and spatial engines. |
| **🐳 Docker Configuration** | [`Dockerfile`](Dockerfile) & [`docker-compose.yml`](docker-compose.yml) | Production-ready containerized deployment specification. |

---

## 🏆 NVIDIA × Nebius AI Hackathon Highlights

- **Multimodal Intelligence:** Beyond single-mode planners, JOURNX evaluates real trade-offs between private vehicle driving, rail transit, commercial flight, and hybrid connections.
- **Deterministic Calculation Engine:** Costs, fuel, tolls, and carbon emissions are calculated using deterministic formulas with clear data provenance labels rather than hallucinated LLM numbers.
- **Real Physical APIs:** Connects to live Open-Meteo atmospheric radar and OpenStreetMap/OSRM routing engines with intelligent fallback mechanisms.
- **Autonomous Operations:** Live 5-step cognitive loop that detects road disruptions and executes cuOpt alternative highway rerouting in real-time.
