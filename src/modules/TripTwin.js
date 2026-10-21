// JOURNX — Trip Twin Simulation & What-If Engine
// Interactive parameter perturbation, dynamic multimodal re-evaluation, and conversational query handling

export class TripTwin {
  constructor(app) {
    this.app = app;
    this.debounceTimer = null;
    this.bindEvents();
    setTimeout(() => this.recalculateSimulation(), 300);
  }

  bindEvents() {
    const sliderBudget = document.getElementById('twin-slider-budget');
    const sliderTravelers = document.getElementById('twin-slider-travelers');
    const sliderDays = document.getElementById('twin-slider-days');
    const selectComfort = document.getElementById('twin-select-comfort');

    const triggerRecalc = () => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => this.recalculateSimulation(), 250);
    };

    if (sliderBudget) {
      sliderBudget.addEventListener('input', () => {
        const val = parseInt(sliderBudget.value);
        const label = document.getElementById('twin-val-budget');
        if (label) label.textContent = `₹${val.toLocaleString()}`;
        triggerRecalc();
      });
    }

    if (sliderTravelers) {
      sliderTravelers.addEventListener('input', () => {
        const val = sliderTravelers.value;
        const label = document.getElementById('twin-val-travelers');
        if (label) label.textContent = `${val} People`;
        triggerRecalc();
      });
    }

    if (sliderDays) {
      sliderDays.addEventListener('input', () => {
        const val = sliderDays.value;
        const label = document.getElementById('twin-val-days');
        if (label) label.textContent = `${val} Days`;
        triggerRecalc();
      });
    }

    if (selectComfort) {
      selectComfort.addEventListener('change', triggerRecalc);
    }

    // Conversational What-If Input Box
    const btnWhatIfAsk = document.getElementById('btn-twin-whatif-ask');
    const inputWhatIf = document.getElementById('twin-whatif-input');
    if (btnWhatIfAsk && inputWhatIf) {
      btnWhatIfAsk.addEventListener('click', () => this.handleWhatIfQuery());
      inputWhatIf.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.handleWhatIfQuery();
      });
    }
  }

  async recalculateSimulation() {
    const sliderBudget = document.getElementById('twin-slider-budget');
    const sliderTravelers = document.getElementById('twin-slider-travelers');
    const sliderDays = document.getElementById('twin-slider-days');
    const selectComfort = document.getElementById('twin-select-comfort');

    const budget = sliderBudget ? parseFloat(sliderBudget.value) : 60000;
    const travelers = sliderTravelers ? parseInt(sliderTravelers.value) : 4;
    const days = sliderDays ? parseInt(sliderDays.value) : 7;
    const stayTier = selectComfort ? selectComfort.value : 'comfort';
    const distKm = this.app.currentJourney?.distance_km || 660;

    try {
      const res = await fetch('/api/journey/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget,
          travelers,
          days,
          stay_tier: stayTier,
          distance_km: distKm,
          currency: '₹',
          origin: this.app.currentJourney?.origin || 'Hyderabad',
          destination: this.app.currentJourney?.destination || 'Goa'
        })
      });

      if (res.ok) {
        const json = await res.json();
        this.renderSimulatedResults(json.options, json.recommendation);
      }
    } catch (e) {
      console.warn("Trip twin simulation error:", e);
    }
  }

  renderSimulatedResults(options, recommendation) {
    const container = document.getElementById('twin-simulated-options-cards');
    if (!container) return;

    container.innerHTML = options.map(opt => `
      <div class="surface-card" style="padding: 1.35rem 1.6rem; border-left: 4px solid ${opt.mode === recommendation.recommended_mode ? 'var(--amber-primary)' : 'var(--border-medium)'};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <div>
            <div class="card-micro-label">${opt.mode} STRATEGY</div>
            <strong style="color: #fff; font-size: 1.1rem;">${opt.title}</strong>
          </div>
          <div style="text-align: right;">
            <div style="font-family: var(--font-display); font-size: 1.45rem; font-weight: 700; color: #fff;">₹${opt.total_cost.toLocaleString()}</div>
            <div style="font-size: 0.78rem; color: var(--text-dim);">₹${opt.cost_per_person.toLocaleString()} / person</div>
          </div>
        </div>
        <p style="font-size: 0.84rem; color: var(--text-sub); margin-bottom: 0.75rem;">${opt.summary}</p>
        <div style="display: flex; gap: 1.5rem; font-size: 0.78rem; color: var(--text-muted);">
          <span>⏱ Duration: <strong style="color: #fff;">${opt.travel_time_str}</strong></span>
          <span>🛋 Comfort: <strong style="color: var(--emerald-success);">${opt.comfort_rating}</strong></span>
          <span>🌱 CO₂: <strong style="color: #fff;">${opt.co2_kg} kg</strong></span>
        </div>
      </div>
    `).join('');

    const recBox = document.getElementById('twin-ai-rec-text');
    if (recBox && recommendation) {
      recBox.textContent = recommendation.rationale;
    }
  }

  async handleWhatIfQuery() {
    const input = document.getElementById('twin-whatif-input');
    const answerEl = document.getElementById('twin-whatif-answer-box');
    if (!input || !answerEl) return;

    const query = input.value.trim();
    if (!query) return;

    answerEl.style.display = 'block';
    answerEl.innerHTML = `
      <div style="display: flex; gap: 8px; align-items: center; color: var(--amber-primary); font-size: 0.88rem;">
        <span class="step-indicator-glyph" style="width: 16px; height: 16px; font-size: 10px;">⚡</span>
        Analyzing scenario parameters...
      </div>
    `;

    const res = await this.app.nemotronAgent.answerWhatIfQuery(query, this.app.currentJourney || { origin: 'Hyderabad', destination: 'Goa' }, this.app.currentOptions || []);

    answerEl.innerHTML = `
      <div style="font-size: 0.92rem; color: #fff; line-height: 1.55; margin-bottom: 0.5rem;">
        <strong>JOURNX Intelligence:</strong> ${res.answer}
      </div>
    `;

    // Apply auto-action if triggered
    if (res.action === 'REDUCE_BUDGET') {
      const slider = document.getElementById('twin-slider-budget');
      if (slider) {
        slider.value = 45000;
        document.getElementById('twin-val-budget').textContent = "₹45,000";
        this.recalculateSimulation();
      }
    }
  }
}
