#!/usr/bin/env python3
"""
JOURNX — Submission Smoke Test & Verification Suite
Autonomous Multimodal Travel Intelligence Platform
Validates all REST API endpoints, physical intelligence engines, and database connectivity.
"""

import sys
import json
import urllib.request
import urllib.parse
import urllib.error
import time

# Ensure safe UTF-8 terminal printing on all Windows and POSIX shells
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://localhost:8080"

class Colors:
    GREEN = "\033[92m"
    RED = "\033[91m"
    CYAN = "\033[96m"
    YELLOW = "\033[93m"
    BOLD = "\033[1m"
    RESET = "\033[0m"

def log_test(name, passed, detail=""):
    status = f"{Colors.GREEN}[PASS]{Colors.RESET}" if passed else f"{Colors.RED}[FAIL]{Colors.RESET}"
    print(f"  {status} {Colors.BOLD}{name}{Colors.RESET}")
    if detail:
        print(f"         └─ {detail}")

def http_get(endpoint):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(url, headers={"User-Agent": "JournX-SmokeTest/1.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        return resp.getcode(), json.loads(resp.read().decode("utf-8"))

def http_post(endpoint, payload):
    url = f"{BASE_URL}{endpoint}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json", "User-Agent": "JournX-SmokeTest/1.0"}
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        return resp.getcode(), json.loads(resp.read().decode("utf-8"))

def run_tests():
    print(f"\n{Colors.CYAN}{Colors.BOLD}══════════════════════════════════════════════════════════════════{Colors.RESET}")
    print(f"{Colors.CYAN}{Colors.BOLD}   JOURNX — Autonomous Multimodal Intelligence Verification Suite {Colors.RESET}")
    print(f"{Colors.CYAN}{Colors.BOLD}══════════════════════════════════════════════════════════════════{Colors.RESET}\n")

    passed_count = 0
    total_tests = 8

    # 1. Health Check & SQLite Connection
    try:
        code, data = http_get("/api/health")
        passed = (code == 200 and data.get("status") == "healthy")
        log_test("System Health & Database Integrity", passed, f"DB: {data.get('database')}, Cached Nodes: {data.get('cached_locations')}")
        if passed: passed_count += 1
    except Exception as e:
        log_test("System Health & Database Integrity", False, str(e))

    # 2. Location Geocoding & SQLite Cache
    try:
        code, data = http_get("/api/location/search?q=Goa")
        passed = (code == 200 and len(data.get("results", [])) > 0)
        res = data.get("results", [{}])[0]
        log_test("Location Search & Spatial Cache", passed, f"Resolved '{res.get('display_name')}' at ({res.get('lat')}, {res.get('lng')}) via {data.get('source')}")
        if passed: passed_count += 1
    except Exception as e:
        log_test("Location Search & Spatial Cache", False, str(e))

    # 3. Multimodal Journey Calculation Engine
    try:
        payload = {
            "origin": "Hyderabad",
            "destination": "Goa",
            "days": 7,
            "travelers": 4,
            "budget": 60000,
            "currency": "₹"
        }
        code, data = http_post("/api/journey/calculate", payload)
        options = data.get("options", [])
        modes = [opt.get("mode") for opt in options]
        passed = (code == 200 and len(options) == 4 and "ROAD" in modes and "TRAIN" in modes and "FLIGHT" in modes and "HYBRID" in modes)
        rec = data.get("recommendation", {})
        log_test("Multimodal Matrix Calculation", passed, f"Generated 4 strategies: {modes} | Recommended: {rec.get('recommended_mode')} (Cost: ₹{rec.get('total_cost'):,})")
        if passed: passed_count += 1
    except Exception as e:
        log_test("Multimodal Matrix Calculation", False, str(e))

    # 4. Open-Meteo Weather Radar & Pavement Friction Index
    try:
        code, data = http_get("/api/weather?lat=15.2993&lng=74.124")
        passed = (code == 200 and "traction_coefficient" in data)
        log_test("Live Atmospheric Radar & Grip Index", passed, f"Weather: {data.get('temperature')}°C, {data.get('condition')} | Pavement Grip: {data.get('traction_coefficient')}μ ({data.get('surface_advisory')})")
        if passed: passed_count += 1
    except Exception as e:
        log_test("Live Atmospheric Radar & Grip Index", False, str(e))

    # 5. Trip Twin Simulation Engine
    try:
        payload = {
            "origin": "Hyderabad",
            "destination": "Goa",
            "days": 5,
            "travelers": 3,
            "budget": 50000,
            "currency": "₹"
        }
        code, data = http_post("/api/journey/simulate", payload)
        passed = (code == 200 and len(data.get("options", [])) >= 4)
        log_test("Trip Twin Parameter Perturbation", passed, f"Recalculated {len(data.get('options', []))} modes dynamically under modified budget/passenger constraints")
        if passed: passed_count += 1
    except Exception as e:
        log_test("Trip Twin Parameter Perturbation", False, str(e))

    # 6. Trip Guardian Autonomous Replanning & cuOpt Detour
    try:
        payload = {
            "hazard": "monsoon",
            "origin": "Hyderabad",
            "destination": "Goa"
        }
        code, data = http_post("/api/guardian/replan", payload)
        replan = data.get("replan", {})
        passed = (code == 200 and data.get("status") == "ok" and replan.get("detour_active") is True)
        log_test("Trip Guardian 5-Step Reroute Loop", passed, f"Hazard: {replan.get('hazard')} | Safety: {replan.get('safety_score')} | Bypass: {replan.get('alternative_route')} ({replan.get('time_delta')})")
        if passed: passed_count += 1
    except Exception as e:
        log_test("Trip Guardian 5-Step Reroute Loop", False, str(e))

    # 7. Natural Language Goal Parsing (Nemotron Loop)
    try:
        payload = {
            "prompt": "Plan a 5 day road trip for 3 friends from Hyderabad to Goa with a budget of ₹50,000"
        }
        code, data = http_post("/api/ai/understand", payload)
        extracted = data.get("extracted", {})
        parsed_origin = extracted.get("origin")
        parsed_dest = extracted.get("destination")
        passed = (code == 200 and "Hyderabad" in str(parsed_origin) and "Goa" in str(parsed_dest))
        log_test("Natural Language Goal Understanding", passed, f"Extracted: {parsed_origin} -> {parsed_dest}, {extracted.get('days')} days, {extracted.get('travelers')} travelers, Budget: ₹{extracted.get('budget'):,}")
        if passed: passed_count += 1
    except Exception as e:
        log_test("Natural Language Goal Understanding", False, str(e))

    # 8. Traveler Authentication & Session
    try:
        payload = {
            "email": "demo@journx.ai",
            "password": "demo"
        }
        code, data = http_post("/api/auth/login", payload)
        passed = (code == 200 and data.get("status") in ["ok", "success"])
        user = data.get("user", {})
        log_test("Traveler Auth & Session Management", passed, f"Authenticated user '{user.get('name')}' ({user.get('email')}) | Token: {data.get('token')}")
        if passed: passed_count += 1
    except Exception as e:
        log_test("Traveler Auth & Session Management", False, str(e))

    print(f"\n{Colors.CYAN}──────────────────────────────────────────────────────────────────{Colors.RESET}")
    if passed_count == total_tests:
        print(f"{Colors.GREEN}{Colors.BOLD}   ✨ ALL {passed_count}/{total_tests} VERIFICATION CHECKS PASSED — READY FOR SUBMISSION!{Colors.RESET}")
    else:
        print(f"{Colors.YELLOW}{Colors.BOLD}   ⚠️ {passed_count}/{total_tests} CHECKS PASSED. Please check failures above.{Colors.RESET}")
    print(f"{Colors.CYAN}{Colors.BOLD}══════════════════════════════════════════════════════════════════{Colors.RESET}\n")

    return 0 if passed_count == total_tests else 1

if __name__ == "__main__":
    sys.exit(run_tests())
