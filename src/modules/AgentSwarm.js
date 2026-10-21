// RoadMate X - Multi-Agent Swarm Orchestrator
// Coordinates the 7 specialized agents and manages the cognitive replanning lifecycle

import { CONFIG } from './Config.js';
import { cuOptRouter } from './cuOptRouter.js';

export class AgentSwarm {
  constructor(nebiusService, audioEngine) {
    this.nebius = nebiusService;
    this.audioEngine = audioEngine;
    this.cuOpt = new cuOptRouter();
    this.agents = CONFIG.agents;
    this.activeAgentId = 'planner';
    this.agentStates = {};
    this.logs = [];

    this.initStates();
  }

  initStates() {
    this.agents.forEach(a => {
      this.agentStates[a.id] = {
        status: 'IDLE',
        thought: '',
        active: false
      };
    });
  }

  setAgentActive(agentId, statusText, thoughtText) {
    this.activeAgentId = agentId;
    this.agents.forEach(a => {
      if (a.id === agentId) {
        this.agentStates[a.id].active = true;
        this.agentStates[a.id].status = statusText;
        if (thoughtText) this.agentStates[a.id].thought = thoughtText;
      } else {
        this.agentStates[a.id].active = false;
      }
    });

    if (this.audioEngine) {
      this.audioEngine.playAgentChime();
    }
  }

  /**
   * Runs the 5-step cognitive replanning pipeline when an incident occurs
   * @param {Object} currentRoute
   * @param {Function} onStepUpdate - Callback for UI updates during steps
   * @param {Function} onExecuteReplan - Callback when car should switch route
   */
  async executeAutonomousReplan(currentRoute, onStepUpdate, onExecuteReplan) {
    const incident = currentRoute.incident;
    if (this.audioEngine) {
      this.audioEngine.playHazardAlert();
    }

    // STEP 1: DETECT
    this.setAgentActive('risk', '⚠️ HAZARD DETECTED', `Doppler scan detected ${incident.title} at ${incident.location}.`);
    if (onStepUpdate) {
      onStepUpdate({
        step: 1,
        title: "DETECT",
        agent: "risk",
        desc: `Hazard alert: ${incident.title}. Sensor confidence: 99.4%. Hydroplane hazard high.`
      });
    }
    await new Promise(r => setTimeout(r, 1400));

    // STEP 2: UNDERSTAND
    this.setAgentActive('planner', '🧠 REASONING IMPACT', `Compromised corridor threatens ${currentRoute.travelers} passengers. Delay: +4h 30m.`);
    if (onStepUpdate) {
      onStepUpdate({
        step: 2,
        title: "UNDERSTAND",
        agent: "planner",
        desc: `Impact Assessment: ${incident.impact} Mission schedule broken if route maintained.`
      });
    }
    await new Promise(r => setTimeout(r, 1500));

    // STEP 3: EVALUATE ALTERNATIVES (cuOpt)
    this.setAgentActive('route', '🗺️ cuOpt PATH EVALUATION', `Solving K-shortest alternative paths with dynamic obstacle avoidance.`);
    const cuOptResult = this.cuOpt.solveDetourOptimization(currentRoute, incident);
    if (onStepUpdate) {
      onStepUpdate({
        step: 3,
        title: "EVALUATE ALTERNATIVES",
        agent: "route",
        cuOptResult,
        desc: `cuOpt evaluated 14 alternative vertices. Identified elevated corridor: ${incident.alternativeTitle}.`
      });
    }
    await new Promise(r => setTimeout(r, 1600));

    // STEP 4: SIMULATE CONSEQUENCES
    this.setAgentActive('weather', '🌦️ SIMULATING WEATHER & BUDGET', `Traction test: 1.12μ on bypass. Toll savings: ${currentRoute.currency}${cuOptResult.optimizedDetour.tollSavings}.`);
    if (onStepUpdate) {
      onStepUpdate({
        step: 4,
        title: "SIMULATE CONSEQUENCES",
        agent: "weather",
        desc: `Weather simulation: Rain drops from 120mm/hr to 4mm/hr. Friction restored to dry standard.`
      });
    }
    await new Promise(r => setTimeout(r, 1400));

    // STEP 5: RECOMMEND & REPLAN
    this.setAgentActive('replanner', '⚡ REPLAN APPROVED // EXECUTING', `Consensus 99.2%. Transitioning physical vehicle to green detour.`);
    if (onStepUpdate) {
      onStepUpdate({
        step: 5,
        title: "RECOMMEND & REPLAN",
        agent: "replanner",
        desc: `Replan executed: Switching spline to green detour bypass. Audio turn signal engaged.`
      });
    }

    // Trigger physical 3D car route switch
    if (onExecuteReplan) {
      onExecuteReplan(cuOptResult);
    }

    return cuOptResult;
  }
}
