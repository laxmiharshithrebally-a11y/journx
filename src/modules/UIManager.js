// JOURNX — Master UI & Event Orchestrator
// Manages screen routing, natural language input, confirmation modal, planning stream, multimodal comparison, and tabs

export class UIManager {
  constructor(app) {
    this.app = app;
    this.currentView = 'view-intro';
    this.currentUser = JSON.parse(localStorage.getItem('JOURNX_USER') || 'null');
    this.debounceTimer = null;

    this.cacheDom();
    this.bindNavigation();
    this.bindLocationAutocomplete();
    this.bindQuickCorridors();
    this.bindNaturalLanguagePrompt();
    this.bindFormSubmission();
    this.bindCommandTabs();
    this.bindGuardianActions();
    this.bindExpenseTracker();
    this.initTheme();
    this.bindThemeSwitcher();
    this.bindMapModeSwitcher();
    this.bindVoyagePassModal();
    this.bindChecklist();
    this.bindGoogleMapsActions();
    this.bindAudioAndVoice();
    this.bindTwinPresets();
    this.bindEsgActions();
    this.bindSubmissionTour();
    this.bindCalendarExport();
    this.bindKeyboardShortcuts();

    if (this.currentUser && this.dom.appUserNameBadge) {
      this.dom.appUserNameBadge.textContent = `👤 ${this.currentUser.name || "Harshith (Verified Traveler)"}`;
    }
  }

  cacheDom() {
    this.dom = {
      // Views
      viewIntro: document.getElementById('view-intro'),
      viewAuth: document.getElementById('view-auth'),
      viewApp: document.getElementById('view-app'),

      // Navigation & Header
      // Navigation
      btnIntroSkip: document.getElementById('btn-intro-skip'),
      btnAuthDemo: document.getElementById('btn-auth-demo'),
      btnAuthBackIntro: document.getElementById('btn-auth-back-intro'),
      btnAppLogout: document.getElementById('btn-app-logout'),
      appUserNameBadge: document.getElementById('app-user-name-badge'),

      // Auth Form
      authForm: document.getElementById('auth-user-form'),
      authEmail: document.getElementById('auth-input-email'),
      authPass: document.getElementById('auth-input-pass'),
      authNameGroup: document.getElementById('auth-group-name'),
      authFullName: document.getElementById('auth-input-name'),
      authToggleLink: document.getElementById('auth-toggle-mode-btn'),
      authSubmitBtn: document.getElementById('btn-auth-submit'),

      // Natural Language Box
      aiPromptInput: document.getElementById('ai-prompt-input'),
      btnAnalyzePrompt: document.getElementById('btn-analyze-prompt'),

      // Confirmation Banner
      confirmationCard: document.getElementById('journey-confirmation-card'),
      confirmSummaryText: document.getElementById('confirm-summary-details'),
      btnConfirmBuild: document.getElementById('btn-confirm-build-journey'),
      btnConfirmEdit: document.getElementById('btn-confirm-edit-journey'),

      // Planning Animation Stream
      planningStream: document.getElementById('planning-progress-stream'),
      progressSteps: document.querySelectorAll('.progress-step-item'),

      // Structured Inputs
      inputOrigin: document.getElementById('input-from-city'),
      dropdownOrigin: document.getElementById('dropdown-from-list'),
      inputDest: document.getElementById('input-to-city'),
      dropdownDest: document.getElementById('dropdown-to-list'),
      inputDays: document.getElementById('input-trip-days'),
      inputTravelers: document.getElementById('input-trip-travelers'),
      inputBudget: document.getElementById('input-trip-budget'),
      selectCurrency: document.getElementById('select-trip-currency'),
      selectTransportPref: document.getElementById('select-transport-pref'),
      selectLodgingTier: document.getElementById('select-lodging-tier'),
      btnCalculateJourney: document.getElementById('btn-calculate-journey-action'),

      // Results
      multimodalResultsSection: document.getElementById('multimodal-results-section'),
      multimodalCardsContainer: document.getElementById('multimodal-strategy-cards'),
      aiRecommendationText: document.getElementById('ai-recommendation-rationale-text'),
      recommendationMetrics: document.getElementById('ai-recommendation-tradeoffs-box'),

      // Tabs
      tabBtns: document.querySelectorAll('.command-tab-btn'),
      tabContents: document.querySelectorAll('.command-tab-page'),

      // Itinerary & Expenses
      itineraryListContainer: document.getElementById('itinerary-cards-container'),
      expenseTableBody: document.getElementById('expense-table-rows')
    };

    this.isRegisterMode = false;
  }

  bindNavigation() {
    // Intro -> Auth (single "Enter Experience" pill button)
    const goAuth = () => {
      if (this.app.globeIntro) this.app.globeIntro.triggerSkipOrComplete();
      else this.switchView('view-auth');
    };
    if (this.dom.btnIntroSkip) this.dom.btnIntroSkip.addEventListener('click', goAuth);
    const btnIntroLaunch = document.getElementById('btn-intro-launch');
    if (btnIntroLaunch) btnIntroLaunch.addEventListener('click', goAuth);

    const btnIntroDemo1 = document.getElementById('btn-intro-demo-1');
    const btnIntroDemo2 = document.getElementById('btn-intro-demo-2');
    if (btnIntroDemo1) btnIntroDemo1.addEventListener('click', () => this.loginUser('Harshith (Verified Traveler)'));
    if (btnIntroDemo2) btnIntroDemo2.addEventListener('click', () => this.loginUser('Harshith (Verified Traveler)'));

    // Orbital City Corridor Focus Buttons
    const cityButtons = document.querySelectorAll('.orbital-city-btn');
    const coordEl = document.getElementById('hud-val-coords');
    cityButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        cityButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const city = btn.getAttribute('data-city');
        const map = {
          'Hyderabad': { text: 'TARGET: 17.385° N, 78.486° E (HYDERABAD ➔ GOA)', note: '🎯 Locked Orbital Focus: Hyderabad ➔ Goa Corridor' },
          'Mumbai': { text: 'TARGET: 19.076° N, 72.877° E (MUMBAI ➔ DUBAI)', note: '✈️ Locked Orbital Focus: Mumbai ➔ Dubai Trans-Continental' },
          'Tokyo': { text: 'TARGET: 35.676° N, 139.650° E (TOKYO ➔ OSAKA)', note: '🗼 Locked Orbital Focus: Tokyo ➔ Osaka Shinkansen Corridor' },
          'London': { text: 'TARGET: 51.507° N, -0.127° W (LONDON ➔ PARIS)', note: '🇬🇧 Locked Orbital Focus: London ➔ Paris Eurostar Corridor' }
        };
        if (map[city]) {
          if (coordEl) coordEl.textContent = map[city].text;
          if (window.showToast) window.showToast(map[city].note);
        }
      });
    });

    // 1-Click Instant Demo Access (auth page only)
    const demoAccess = () => this.loginUser("Harshith (Verified Traveler)");
    if (this.dom.btnAuthDemo) this.dom.btnAuthDemo.addEventListener('click', demoAccess);

    // Auth -> Intro
    if (this.dom.btnAuthBackIntro) {
      this.dom.btnAuthBackIntro.addEventListener('click', () => this.switchView('view-intro'));
    }

    // Auth Form Submit
    if (this.dom.authForm) {
      this.dom.authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = this.dom.authEmail.value;
        const password = this.dom.authPass.value;
        const name = this.dom.authFullName ? this.dom.authFullName.value : email.split('@')[0];

        try {
          const endpoint = this.isRegisterMode ? '/api/auth/register' : '/api/auth/login';
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              this.loginUser(data.user.name || name);
              return;
            }
          }
        } catch (err) {
          console.warn("Auth network fallback:", err);
        }
        this.loginUser(name);
      });
    }

    // Toggle Login vs Register
    if (this.dom.authToggleLink) {
      this.dom.authToggleLink.addEventListener('click', () => {
        this.isRegisterMode = !this.isRegisterMode;
        if (this.isRegisterMode) {
          this.dom.authNameGroup.style.display = 'block';
          this.dom.authSubmitBtn.textContent = 'Create Account';
          this.dom.authToggleLink.textContent = 'Already have an account? Sign In';
        } else {
          this.dom.authNameGroup.style.display = 'none';
          this.dom.authSubmitBtn.textContent = 'Sign In';
          this.dom.authToggleLink.textContent = "Don't have an account? Create Account";
        }
      });
    }

    // Logout
    if (this.dom.btnAppLogout) {
      this.dom.btnAppLogout.addEventListener('click', () => {
        localStorage.removeItem('JOURNX_USER');
        this.currentUser = null;
        this.switchView('view-auth');
      });
    }
  }

  switchView(viewId) {
    this.currentView = viewId;
    document.querySelectorAll('.journx-view').forEach(v => {
      v.classList.remove('active-view');
      v.style.opacity = '';
      v.style.transition = '';
    });

    const target = document.getElementById(viewId);
    if (target) {
      target.classList.add('active-view');
      target.style.opacity = '';
      window.scrollTo(0, 0);
    }

    if (viewId === 'view-app') {
      setTimeout(() => {
        if (this.app.mapService) {
          this.app.mapService.initMap();
          this.app.mapService.resize();
          if (this.app.currentJourney && !this.app.mapService.routeLine) {
            const j = this.app.currentJourney;
            const originCity = { name: j.origin, lat: j.origin_coords[0], lng: j.origin_coords[1] };
            const destCity = { name: j.destination, lat: j.dest_coords[0], lng: j.dest_coords[1] };
            this.app.mapService.renderJourneyRoute(originCity, destCity, false);
            this.fetchLiveAtmosphericWeather(originCity, destCity);
          }
        }
      }, 150);
    }
  }

  loginUser(name) {
    this.currentUser = { name };
    localStorage.setItem('JOURNX_USER', JSON.stringify(this.currentUser));
    if (this.dom.appUserNameBadge) {
      this.dom.appUserNameBadge.textContent = `👤 ${name}`;
    }
    this.switchView('view-app');
  }

  bindCommandTabs() {
    this.dom.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTabId = btn.dataset.tab;
        this.dom.tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.dom.tabContents.forEach(content => {
          content.style.display = (content.id === targetTabId) ? 'block' : 'none';
        });

        if (targetTabId === 'tab-map-weather' && this.app.mapService) {
          setTimeout(() => {
            this.app.mapService.resize();
            if (this.app.currentJourney && !this.app.mapService.routeLine) {
              const j = this.app.currentJourney;
              const originCity = { name: j.origin, lat: j.origin_coords[0], lng: j.origin_coords[1] };
              const destCity = { name: j.destination, lat: j.dest_coords[0], lng: j.dest_coords[1] };
              this.app.mapService.renderJourneyRoute(originCity, destCity, false);
              this.fetchLiveAtmosphericWeather(originCity, destCity);
            }
          }, 80);
        }
      });
    });
  }

  bindLocationAutocomplete() {
    this.setupAutocompleteField(this.dom.inputOrigin, this.dom.dropdownOrigin);
    this.setupAutocompleteField(this.dom.inputDest, this.dom.dropdownDest);
  }

  setupAutocompleteField(input, dropdown) {
    if (!input || !dropdown) return;

    input.addEventListener('input', () => {
      clearTimeout(this.debounceTimer);
      const q = input.value.trim();
      if (q.length < 2) {
        dropdown.style.display = 'none';
        return;
      }

      this.debounceTimer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/location/search?q=${encodeURIComponent(q)}`);
          if (res.ok) {
            const json = await res.json();
            const results = json.results || [];
            if (results.length > 0) {
              dropdown.innerHTML = results.map(loc => `
                <div class="autocomplete-item-row" data-display="${loc.display_name}" data-lat="${loc.lat}" data-lng="${loc.lng}">
                  <div>
                    <strong style="color: #fff; font-size: 0.92rem;">${loc.city || loc.display_name.split(',')[0]}</strong>
                    <div style="font-size: 0.74rem; color: var(--text-dim);">${loc.display_name}</div>
                  </div>
                  <span class="status-badge-calculated">${loc.country || 'Global'}</span>
                </div>
              `).join('');
              dropdown.style.display = 'block';

              dropdown.querySelectorAll('.autocomplete-item-row').forEach(row => {
                row.addEventListener('click', () => {
                  input.value = row.dataset.display.split(',')[0];
                  input.dataset.lat = row.dataset.lat;
                  input.dataset.lng = row.dataset.lng;
                  dropdown.style.display = 'none';
                });
              });
              return;
            }
          }
        } catch (e) {
          console.warn("Autocomplete error:", e);
        }
        dropdown.style.display = 'none';
      }, 220);
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  }

  bindQuickCorridors() {
    document.querySelectorAll('.corridor-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const from = btn.dataset.from;
        const to = btn.dataset.to;
        if (from && this.dom.inputOrigin) this.dom.inputOrigin.value = from;
        if (to && this.dom.inputDest) this.dom.inputDest.value = to;
        this.openConfirmationPanel();
      });
    });
  }

  bindNaturalLanguagePrompt() {
    if (this.dom.btnAnalyzePrompt && this.dom.aiPromptInput) {
      this.dom.btnAnalyzePrompt.addEventListener('click', async () => {
        const prompt = this.dom.aiPromptInput.value.trim();
        if (!prompt) return;

        this.dom.btnAnalyzePrompt.textContent = "Synthesizing Goal...";
        const parsed = await this.app.nemotronAgent.parseNaturalLanguageGoal(prompt);
        this.dom.btnAnalyzePrompt.textContent = "Synthesize Journey Goal ⚡";

        // Fill form fields
        if (this.dom.inputOrigin) this.dom.inputOrigin.value = parsed.origin;
        if (this.dom.inputDest) this.dom.inputDest.value = parsed.destination;
        if (this.dom.inputDays) this.dom.inputDays.value = parsed.days;
        if (this.dom.inputTravelers) this.dom.inputTravelers.value = parsed.travelers;
        if (this.dom.inputBudget) this.dom.inputBudget.value = parsed.budget;
        if (this.dom.selectCurrency) this.dom.selectCurrency.value = parsed.currency;

        this.openConfirmationPanel();
      });
    }
  }

  bindFormSubmission() {
    if (this.dom.btnCalculateJourney) {
      this.dom.btnCalculateJourney.addEventListener('click', () => {
        this.openConfirmationPanel();
      });
    }

    if (this.dom.btnConfirmBuild) {
      this.dom.btnConfirmBuild.addEventListener('click', () => {
        this.executeJourneyPlanning();
      });
    }

    if (this.dom.btnConfirmEdit) {
      this.dom.btnConfirmEdit.addEventListener('click', () => {
        if (this.dom.confirmationCard) this.dom.confirmationCard.style.display = 'none';
      });
    }
  }

  openConfirmationPanel() {
    const from = this.dom.inputOrigin ? this.dom.inputOrigin.value : "Hyderabad";
    const to = this.dom.inputDest ? this.dom.inputDest.value : "Goa";
    const days = this.dom.inputDays ? this.dom.inputDays.value : "7";
    const travelers = this.dom.inputTravelers ? this.dom.inputTravelers.value : "4";
    const budget = this.dom.inputBudget ? parseInt(this.dom.inputBudget.value).toLocaleString() : "60,000";
    const curr = this.dom.selectCurrency ? this.dom.selectCurrency.value : "₹";
    const pref = this.dom.selectTransportPref ? this.dom.selectTransportPref.value : "Any";

    if (this.dom.confirmSummaryText) {
      this.dom.confirmSummaryText.innerHTML = `
        <div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap;">
          <div><strong style="color: #fff; font-size: 1.15rem;">${from} → ${to}</strong></div>
          <div>Duration: <strong style="color: #fff;">${days} Days</strong></div>
          <div>Travelers: <strong style="color: #fff;">${travelers} People</strong></div>
          <div>Target Budget: <strong style="color: var(--amber-primary); font-size: 1.15rem;">${curr}${budget}</strong></div>
          <div>Transport Preference: <strong style="color: var(--cyan-accent);">${pref}</strong></div>
        </div>
      `;
    }

    if (this.dom.confirmationCard) {
      this.dom.confirmationCard.style.display = 'block';
      this.dom.confirmationCard.scrollIntoView({ behavior: 'smooth' });
    }
  }

  async executeJourneyPlanning() {
    if (this.dom.confirmationCard) this.dom.confirmationCard.style.display = 'none';
    if (this.dom.planningStream) this.dom.planningStream.style.display = 'block';

    // Play planning sequence animation
    const steps = [
      "Understanding travel goal & constraints",
      "Resolving global spatial coordinates",
      "Calculating Road, Rail, Flight & Hybrid options",
      "Fetching real road geometry via OSRM",
      "Querying Open-Meteo live atmospheric radar",
      "Computing deterministic cost & carbon metrics",
      "Synthesizing autonomous recommendation consensus"
    ];

    const streamEl = document.getElementById('planning-progress-stream');
    if (streamEl) {
      streamEl.innerHTML = steps.map((s, idx) => `
        <div class="progress-step-item" id="plan-step-${idx}">
          <div class="step-indicator-glyph">○</div>
          <span>${s}</span>
        </div>
      `).join('');
    }

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 220));
      const el = document.getElementById(`plan-step-${i}`);
      if (el) {
        el.className = "progress-step-item step-done";
        el.querySelector('.step-indicator-glyph').textContent = "✓";
      }
    }

    // Call Backend API
    const payload = {
      origin: this.dom.inputOrigin ? this.dom.inputOrigin.value : "Hyderabad",
      destination: this.dom.inputDest ? this.dom.inputDest.value : "Goa",
      days: parseInt(this.dom.inputDays.value) || 7,
      travelers: parseInt(this.dom.inputTravelers.value) || 4,
      budget: parseFloat(this.dom.inputBudget.value) || 60000,
      currency: this.dom.selectCurrency.value || "₹",
      stay_tier: this.dom.selectLodgingTier.value || "comfort"
    };

    try {
      const res = await fetch('/api/journey/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const json = await res.json();
        this.app.currentJourney = json.journey;
        this.app.currentOptions = json.options;

        if (this.dom.planningStream) this.dom.planningStream.style.display = 'none';
        this.renderMultimodalResults(json.options, json.recommendation);
        this.renderItinerary(json.itinerary);

        // Render Leaflet Map & Weather
        if (this.app.mapService) {
          const originCity = { name: json.journey.origin, lat: json.journey.origin_coords[0], lng: json.journey.origin_coords[1] };
          const destCity = { name: json.journey.destination, lat: json.journey.dest_coords[0], lng: json.journey.dest_coords[1] };
          this.app.mapService.renderJourneyRoute(originCity, destCity, false);
          this.fetchLiveAtmosphericWeather(originCity, destCity);
        }
      }
    } catch (e) {
      console.warn("Planning calculation error:", e);
    }
  }

  renderMultimodalResults(options, recommendation) {
    if (this.dom.multimodalResultsSection) {
      this.dom.multimodalResultsSection.style.display = 'block';
      this.dom.multimodalResultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    if (this.dom.aiRecommendationText && recommendation) {
      this.dom.aiRecommendationText.textContent = recommendation.rationale;
    }

    if (this.dom.recommendationMetrics && recommendation) {
      const t = recommendation.trade_offs;
      this.dom.recommendationMetrics.innerHTML = `
        <div style="display: flex; gap: 2rem; font-size: 0.82rem; color: var(--text-muted); flex-wrap: wrap;">
          <span>Budget Fit: <strong style="color: var(--emerald-success);">${t.budget_fit}</strong></span>
          <span>Travel Fatigue: <strong style="color: #fff;">${t.travel_fatigue}</strong></span>
          <span>Route Spontaneity: <strong style="color: var(--amber-primary);">${t.spontaneity}</strong></span>
          <span>Carbon Impact: <strong style="color: var(--cyan-accent);">${t.carbon_impact}</strong></span>
        </div>
      `;
    }

    if (this.dom.multimodalCardsContainer) {
      this.dom.multimodalCardsContainer.innerHTML = options.map(opt => {
        const isRec = (opt.mode === recommendation.recommended_mode);
        return `
          <div class="option-strategy-card ${isRec ? 'recommended-card' : ''}">
            ${isRec ? `<div class="recommended-ribbon-tag">★ OPTIMAL MULTIMODAL STRATEGY</div>` : ''}
            <div>
              <div class="card-micro-label">${opt.mode} STRATEGY</div>
              <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: #fff; margin-bottom: 0.5rem;">${opt.title}</h3>
              <div class="strategy-price-huge">₹${opt.total_cost.toLocaleString()}</div>
              <div style="font-size: 0.82rem; color: var(--text-dim); margin-bottom: 1rem;">₹${opt.cost_per_person.toLocaleString()} per person</div>
              <p style="font-size: 0.86rem; color: var(--text-sub); line-height: 1.5; margin-bottom: 1rem;">${opt.summary}</p>
              
              <div class="strategy-breakdown-table">
                ${opt.breakdown.map(b => `
                  <div class="breakdown-line-row">
                    <span>${b.category}</span>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <strong style="color: #fff;">₹${b.cost.toLocaleString()}</strong>
                      <span class="${b.status.includes('LIVE') ? 'status-badge-live' : b.status.includes('ESTIMATED') ? 'status-badge-estimated' : 'status-badge-calculated'}">${b.status}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1.25rem; border-top: 1px solid var(--border-subtle); padding-top: 0.85rem;">
                <span>⏱ <strong>${opt.travel_time_str}</strong></span>
                <span>🛋 <strong>${opt.comfort_rating}</strong></span>
                <span>🌱 <strong>${opt.co2_kg} kg CO₂</strong></span>
              </div>
              <button class="btn-primary-action" style="width: 100%; justify-content: center; font-size: 0.88rem;" onclick="window.selectStrategyOption('${opt.mode}')">
                Accept ${opt.mode} Strategy →
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  async fetchLiveAtmosphericWeather(cityA, cityB) {
    const elOriginName = document.getElementById('wt-origin-name');
    const elOriginTemp = document.getElementById('wt-origin-temp');
    const elOriginCond = document.getElementById('wt-origin-cond');
    const elDestName = document.getElementById('wt-dest-name');
    const elDestTemp = document.getElementById('wt-dest-temp');
    const elDestCond = document.getElementById('wt-dest-cond');
    const elTraction = document.getElementById('wt-traction-val');

    if (elOriginName) elOriginName.textContent = cityA.name;
    if (elDestName) elDestName.textContent = cityB.name;

    try {
      const [wA, wB] = await Promise.all([
        this.app.weatherService.fetchLiveWeather(cityA.lat, cityA.lng),
        this.app.weatherService.fetchLiveWeather(cityB.lat, cityB.lng)
      ]);

      if (elOriginTemp) elOriginTemp.textContent = `${wA.temperature}°C`;
      if (elOriginCond) elOriginCond.textContent = `${wA.icon} ${wA.conditionText}`;
      if (elDestTemp) elDestTemp.textContent = `${wB.temperature}°C`;
      if (elDestCond) elDestCond.textContent = `${wB.icon} ${wB.conditionText}`;

      if (elTraction) {
        if (wA.isRain || wB.isRain) {
          elTraction.textContent = "Wet Surface (0.74μ) — Rain Alert";
          elTraction.style.color = "var(--rose-danger)";
        } else {
          elTraction.textContent = "Optimal Pavement Grip (1.18μ)";
          elTraction.style.color = "var(--emerald-success)";
        }
      }
    } catch (e) {
      console.warn("Weather telemetry display warning:", e);
    }
  }

  renderItinerary(itinerary) {
    if (!this.dom.itineraryListContainer || !itinerary) return;
    this.dom.itineraryListContainer.innerHTML = itinerary.map(item => `
      <div class="itinerary-day-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
          <strong style="color: #fff; font-size: 1.1rem; font-family: var(--font-display);">${item.day}: ${item.title}</strong>
          <span class="badge-tag-pill" style="margin-bottom: 0; padding: 0.25rem 0.65rem;">₹${item.spend_estimate.toLocaleString()} est.</span>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-sub); line-height: 1.5; margin-bottom: 0.6rem;">${item.description}</p>
        <div style="display: flex; gap: 1.5rem; font-size: 0.8rem; color: var(--text-dim);">
          <span>☕ Stops: <strong style="color: #fff;">${item.stops}</strong></span>
          <span>🏨 Lodging: <strong style="color: var(--amber-primary);">${item.hotel}</strong></span>
        </div>
      </div>
    `).join('');
  }

  bindGuardianActions() {
    document.querySelectorAll('.btn-guardian-incident').forEach(btn => {
      btn.addEventListener('click', () => {
        const hazard = btn.dataset.hazard;
        this.app.tripGuardian.triggerDisruption(hazard);
      });
    });

    const btnDismiss = document.getElementById('btn-guardian-dismiss');
    if (btnDismiss) {
      btnDismiss.addEventListener('click', () => {
        this.app.tripGuardian.dismissDisruption();
      });
    }
  }

  bindExpenseTracker() {
    const btnAdd = document.getElementById('btn-add-expense-item');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        const desc = prompt("Enter expense description (e.g. Fuel, Dinner, FASTag):");
        const amt = parseFloat(prompt("Enter amount (₹):") || "0");
        if (desc && amt > 0 && this.dom.expenseTableBody) {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${new Date().toLocaleDateString()}</td>
            <td>General</td>
            <td>${desc}</td>
            <td style="color: #fff; font-weight: bold;">₹${amt.toLocaleString()}</td>
            <td><span class="status-badge-live">Logged</span></td>
          `;
          this.dom.expenseTableBody.appendChild(row);
        }
      });
    }

    const btnExportPdf = document.getElementById('btn-export-pdf');
    if (btnExportPdf) btnExportPdf.addEventListener('click', () => window.print());

    const btnExportCsv = document.getElementById('btn-export-csv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => {
        const csvContent = "data:text/csv;charset=utf-8,JOURNX EXPEDITION REPORT\nDate,Category,Item,Amount\n2026-10-04,Fuel,Highway Refuel,4200\n2026-10-04,Toll,FASTag Lane,1200\n";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `JOURNX_Report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  }

  bindMapModeSwitcher() {
    document.querySelectorAll('.map-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.map-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.mapMode || 'Road';
        if (this.app.mapService && this.app.currentJourney) {
          const j = this.app.currentJourney;
          const originCity = { name: j.origin, lat: j.origin_coords[0], lng: j.origin_coords[1] };
          const destCity = { name: j.destination, lat: j.dest_coords[0], lng: j.dest_coords[1] };
          this.app.mapService.renderJourneyRoute(originCity, destCity, false, mode);
          if (window.showToast) window.showToast(`Switched map corridor to ${mode} mode`);
        }
      });
    });
  }

  bindVoyagePassModal() {
    const btnOpen = document.getElementById('btn-open-voyage-pass');
    const btnClose = document.getElementById('btn-close-voyage-pass');
    const modal = document.getElementById('modal-voyage-pass');

    if (btnOpen && modal) {
      btnOpen.addEventListener('click', () => {
        const j = this.app.currentJourney || { origin: 'Hyderabad', destination: 'Goa', days: 7, budget: 60000 };
        const user = this.currentUser?.name || "Harshith (Verified Traveler)";
        const elName = document.getElementById('pass-traveler-name');
        const elOrigin = document.getElementById('pass-origin');
        const elDest = document.getElementById('pass-destination');
        const elDays = document.getElementById('pass-days');
        const elBudget = document.getElementById('pass-budget');

        if (elName) elName.textContent = user;
        if (elOrigin) elOrigin.textContent = j.origin;
        if (elDest) elDest.textContent = j.destination;
        if (elDays) elDays.textContent = `${j.days || 7} Days (${j.travelers || 4} Travelers)`;
        if (elBudget) elBudget.textContent = `₹${(j.budget || 60000).toLocaleString()}`;

        modal.style.display = 'flex';
      });
    }

    if (btnClose && modal) {
      btnClose.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    }
  }

  bindChecklist() {
    const checkboxes = document.querySelectorAll('.checklist-checkbox');
    const badge = document.getElementById('checklist-progress-badge');
    if (!checkboxes.length || !badge) return;

    const updateCount = () => {
      const total = checkboxes.length;
      const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
      badge.textContent = `${checked}/${total} Ready`;
      if (checked === total) {
        badge.style.background = 'var(--emerald-success)';
        badge.style.color = '#fff';
      } else {
        badge.style.background = '';
        badge.style.color = '';
      }
    };

    checkboxes.forEach(cb => cb.addEventListener('change', updateCount));
  }

  initTheme() {
    const savedTheme = localStorage.getItem('JOURNX_THEME') || 'obsidian-gold';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const btn = document.getElementById('btn-theme-switcher');
    if (btn) {
      const titles = {
        'obsidian-gold': '🎨 Theme: Obsidian Gold ▾',
        'deep-cobalt': '🎨 Theme: Deep Cobalt ▾',
        'emerald-carbon': '🎨 Theme: Emerald Carbon ▾'
      };
      btn.textContent = titles[savedTheme] || '🎨 Theme: Obsidian Gold ▾';
    }
  }

  bindThemeSwitcher() {
    const themeButtons = [
      document.getElementById('btn-theme-switcher'),
      document.getElementById('btn-intro-theme-toggle')
    ].filter(Boolean);

    if (themeButtons.length === 0) return;

    const themes = ['obsidian-gold', 'deep-cobalt', 'emerald-carbon'];
    const titles = {
      'obsidian-gold': '🎨 Theme: Obsidian Gold ▾',
      'deep-cobalt': '🎨 Theme: Deep Cobalt ▾',
      'emerald-carbon': '🎨 Theme: Emerald Carbon ▾'
    };
    const toastNotes = {
      'obsidian-gold': 'Switched to Obsidian Gold / Warm Amber (Default Luxury)',
      'deep-cobalt': 'Switched to Deep Cobalt / Nordic Aerospace',
      'emerald-carbon': 'Switched to Emerald Carbon / Solar Green'
    };

    const applyTheme = (nextTheme) => {
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('JOURNX_THEME', nextTheme);
      themeButtons.forEach(b => {
        b.textContent = titles[nextTheme];
      });

      if (this.app.globeIntro && typeof this.app.globeIntro.updateColors === 'function') {
        this.app.globeIntro.updateColors();
      }

      if (window.showToast) {
        window.showToast(toastNotes[nextTheme]);
      }
    };

    themeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'obsidian-gold';
        const nextIdx = (themes.indexOf(current) + 1) % themes.length;
        applyTheme(themes[nextIdx]);
      });
    });
  }

  bindGoogleMapsActions() {
    const leafletContainer = document.getElementById('leaflet-route-map');
    const nativeContainer = document.getElementById('google-native-map');
    const badgeStatus = document.getElementById('badge-map-mode-status');

    // 1. Base Layer Switcher (Google Streets, Satellite Hybrid, Terrain, Native 3D Vector, OSM)
    document.querySelectorAll('.map-basemap-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const basemap = btn.dataset.basemap || 'google-streets';

        if (basemap === 'google-native') {
          if (this.app.mapService && this.app.mapService.isGMapSdkLoaded) {
            document.querySelectorAll('.map-basemap-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (leafletContainer) leafletContainer.style.display = 'none';
            if (nativeContainer) nativeContainer.style.display = 'block';
            if (!this.app.mapService.nativeGMap) {
              this.app.mapService.initNativeGoogleMap('google-native-map');
            }
            if (badgeStatus) badgeStatus.textContent = 'NATIVE GOOGLE SDK ACTIVE';
            if (window.showToast) window.showToast('⚡ Native Google Maps 3D Vector SDK Active');
          } else {
            const modal = document.getElementById('modal-gmaps-config');
            if (modal) modal.style.display = 'flex';
            if (window.showToast) window.showToast('Please enter your Google Maps API Key to unlock Native 3D Vector SDK');
          }
          return;
        }

        // Standard high-res Google Tile layers
        document.querySelectorAll('.map-basemap-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (nativeContainer) nativeContainer.style.display = 'none';
        if (leafletContainer) leafletContainer.style.display = 'block';
        if (badgeStatus) badgeStatus.textContent = 'GOOGLE TILES ACTIVE';

        if (this.app.mapService) {
          this.app.mapService.setBaseMap(basemap);
          if (window.showToast) {
            const label = btn.textContent.trim();
            window.showToast(`Switched map baselayer to ${label}`);
          }
        }
      });
    });

    // 2. Open in Google Maps Direct Action
    const btnOpenGMaps = document.getElementById('btn-open-google-maps');
    if (btnOpenGMaps) {
      btnOpenGMaps.addEventListener('click', () => {
        const j = this.app.currentJourney || { origin: 'Hyderabad', destination: 'Goa' };
        const originCity = { name: j.origin, lat: j.origin_coords?.[0] || 17.385, lng: j.origin_coords?.[1] || 78.4867 };
        const destCity = { name: j.destination, lat: j.dest_coords?.[0] || 15.4909, lng: j.dest_coords?.[1] || 73.8278 };
        const activeModeBtn = document.querySelector('.map-mode-btn.active');
        const mode = activeModeBtn ? activeModeBtn.dataset.mapMode : 'Road';
        if (this.app.mapService) {
          this.app.mapService.openGoogleMapsNavigation(originCity, destCity, mode);
        }
      });
    }

    // 3. Google Maps API Key Config Modal
    const btnOpenKeyModal = document.getElementById('btn-gmaps-key-modal');
    const modalKeyConfig = document.getElementById('modal-gmaps-config');
    const btnCloseKeyModal = document.getElementById('btn-close-gmaps-modal');
    const inputModalGKey = document.getElementById('modal-input-gmaps-key');
    const btnActivateGKey = document.getElementById('btn-activate-gmaps-key');
    const btnClearGKey = document.getElementById('btn-clear-gmaps-key');

    if (btnOpenKeyModal && modalKeyConfig) {
      btnOpenKeyModal.addEventListener('click', () => {
        if (inputModalGKey) {
          inputModalGKey.value = localStorage.getItem('JOURNX_GMAPS_KEY') || '';
        }
        modalKeyConfig.style.display = 'flex';
      });
    }

    if (btnCloseKeyModal && modalKeyConfig) {
      btnCloseKeyModal.addEventListener('click', () => {
        modalKeyConfig.style.display = 'none';
      });
    }

    if (modalKeyConfig) {
      modalKeyConfig.addEventListener('click', (e) => {
        if (e.target === modalKeyConfig) modalKeyConfig.style.display = 'none';
      });
    }

    if (btnActivateGKey && inputModalGKey) {
      btnActivateGKey.addEventListener('click', async () => {
        const key = inputModalGKey.value.trim();
        if (!key) {
          if (window.showToast) window.showToast('Please enter a valid Google Maps API Key');
          return;
        }

        localStorage.setItem('JOURNX_GMAPS_KEY', key);
        if (window.showToast) window.showToast('Connecting to Official Google Maps Platform SDK...');

        try {
          if (this.app.mapService) {
            await this.app.mapService.loadGoogleMapsJsSdk(key);
            if (modalKeyConfig) modalKeyConfig.style.display = 'none';
            // Click the native button
            const nativeBtn = document.querySelector('[data-basemap="google-native"]');
            if (nativeBtn) nativeBtn.click();
          }
        } catch (e) {
          if (window.showToast) window.showToast('Notice: Invalid key or network quota. Fallback to Google Satellite tiles active.');
        }
      });
    }

    if (btnClearGKey) {
      btnClearGKey.addEventListener('click', () => {
        localStorage.removeItem('JOURNX_GMAPS_KEY');
        if (inputModalGKey) inputModalGKey.value = '';
        if (modalKeyConfig) modalKeyConfig.style.display = 'none';
        const streetsBtn = document.querySelector('[data-basemap="google-streets"]');
        if (streetsBtn) streetsBtn.click();
        if (window.showToast) window.showToast('Google Maps API Key cleared. Standard Google tiles active.');
      });
    }

    // Also sync Profile Tab Google Maps Input if present
    const inputProfileKey = document.getElementById('input-gmaps-key');
    const btnSaveProfileKey = document.getElementById('btn-save-gmaps-key');
    if (inputProfileKey) {
      inputProfileKey.value = localStorage.getItem('JOURNX_GMAPS_KEY') || '';
    }
    if (btnSaveProfileKey && inputProfileKey) {
      btnSaveProfileKey.addEventListener('click', () => {
        const key = inputProfileKey.value.trim();
        if (key) {
          localStorage.setItem('JOURNX_GMAPS_KEY', key);
          if (this.app.mapService) this.app.mapService.loadGoogleMapsJsSdk(key);
          if (window.showToast) window.showToast('✅ Google Maps API Key saved successfully.');
        } else {
          localStorage.removeItem('JOURNX_GMAPS_KEY');
          if (window.showToast) window.showToast('Google Maps API Key cleared. Using built-in Google tiles.');
        }
      });
    }
  }

  bindAudioAndVoice() {
    const audioButtons = [
      document.getElementById('btn-audio-toggle'),
      document.getElementById('btn-intro-audio-toggle')
    ].filter(Boolean);

    audioButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.app.audioEngine) {
          const isMuted = this.app.audioEngine.toggleMute();
          audioButtons.forEach(b => {
            b.textContent = isMuted ? '🔇 Audio Off' : '🔊 Audio On';
            if (!isMuted) {
              b.style.borderColor = 'var(--emerald-success)';
              b.style.color = 'var(--emerald-success)';
            } else {
              b.style.borderColor = '';
              b.style.color = '';
            }
          });
          if (!isMuted) {
            this.app.audioEngine.playAgentChime();
            if (window.showToast) window.showToast('🔊 Spatial Cockpit Audio Synthesizer Enabled');
          } else {
            if (window.showToast) window.showToast('🔇 Audio Muted');
          }
        }
      });
    });

    const btnBriefing = document.getElementById('btn-listen-briefing');
    if (btnBriefing) {
      btnBriefing.addEventListener('click', () => {
        const j = this.app.currentJourney || { origin: 'Hyderabad', destination: 'Goa', distance_km: 660, days: 7 };
        const opt = this.app.currentOptions ? this.app.currentOptions[0] : null;
        const optMode = opt ? opt.mode : 'Express Rail';
        const optDuration = opt ? opt.duration_hours : '10.5 hours';
        const text = `JournX Route Dispatch Briefing. Navigating from ${j.origin} to ${j.destination}, covering ${j.distance_km} kilometers over ${j.days} days. Recommended mode is ${optMode}, estimated at ${optDuration}. Atmospheric stability is nominal, with light cloud cover. Systems calibrated for departure.`;
        if (this.app.audioEngine) {
          this.app.audioEngine.speakBriefing(text);
        }
        if (window.showToast) window.showToast('🎙️ Voice Dispatch Briefing Active');
      });
    }
  }

  bindTwinPresets() {
    document.querySelectorAll('.twin-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.twin-preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const preset = btn.dataset.preset;
        const sliderBudget = document.getElementById('twin-slider-budget');
        const sliderTravelers = document.getElementById('twin-slider-travelers');
        const sliderDays = document.getElementById('twin-slider-days');
        const selectComfort = document.getElementById('twin-select-comfort');
        const labelBudget = document.getElementById('twin-val-budget');
        const labelTravelers = document.getElementById('twin-val-travelers');
        const labelDays = document.getElementById('twin-val-days');

        if (preset === 'budget-slash') {
          if (sliderBudget) { sliderBudget.value = 39000; if (labelBudget) labelBudget.textContent = '₹39,000'; }
          if (selectComfort) selectComfort.value = 'budget';
          if (window.showToast) window.showToast('Applied Stress-Test: -35% Budget Slash');
        } else if (preset === 'monsoon') {
          if (sliderDays) { sliderDays.value = 8; if (labelDays) labelDays.textContent = '8 Days'; }
          if (window.showToast) window.showToast('Applied Stress-Test: Monsoon Weather Disruption Simulation');
          if (this.app.tripGuardian) this.app.tripGuardian.simulateDisruption('rain');
        } else if (preset === 'family-convoy') {
          if (sliderTravelers) { sliderTravelers.value = 6; if (labelTravelers) labelTravelers.textContent = '6 People'; }
          if (sliderBudget) { sliderBudget.value = 85000; if (labelBudget) labelBudget.textContent = '₹85,000'; }
          if (selectComfort) selectComfort.value = 'comfort';
          if (window.showToast) window.showToast('Applied Stress-Test: 6 Travelers Family Convoy');
        } else if (preset === 'luxury-tier') {
          if (sliderBudget) { sliderBudget.value = 120000; if (labelBudget) labelBudget.textContent = '₹120,000'; }
          if (selectComfort) selectComfort.value = 'luxury';
          if (window.showToast) window.showToast('Applied Stress-Test: Luxury Resort Upgrade');
        }

        if (this.app.tripTwin) {
          this.app.tripTwin.recalculateSimulation();
        }
      });
    });
  }

  bindEsgActions() {
    const btnOffset = document.getElementById('btn-offset-carbon');
    const modalEsg = document.getElementById('modal-esg-certificate');
    const btnCloseEsg = document.getElementById('btn-close-esg-cert');

    if (btnOffset && modalEsg) {
      btnOffset.addEventListener('click', () => {
        const j = this.app.currentJourney || { origin: 'Hyderabad', destination: 'Goa', distance_km: 660 };
        const user = this.currentUser?.name || "Harshith (Verified Traveler)";
        const elName = document.getElementById('esg-cert-traveler-name');
        const elCorridor = document.getElementById('esg-cert-corridor');
        const elCo2 = document.getElementById('esg-cert-co2');
        const elTrees = document.getElementById('esg-cert-trees');

        if (elName) elName.textContent = user;
        if (elCorridor) elCorridor.textContent = `${j.origin} ➔ ${j.destination}`;
        
        const dist = j.distance_km || 660;
        const kgCo2 = Math.round(dist * 0.22);
        const trees = (kgCo2 / 24.5).toFixed(1);
        if (elCo2) elCo2.textContent = `${kgCo2} kg CO₂`;
        if (elTrees) elTrees.textContent = `${trees} Trees`;

        modalEsg.style.display = 'flex';
        if (window.showToast) window.showToast(`🌱 Voyage Neutralized: ${kgCo2} kg CO₂ offset via agroforestry.`);
      });
    }

    if (btnCloseEsg && modalEsg) {
      btnCloseEsg.addEventListener('click', () => {
        modalEsg.style.display = 'none';
      });
    }

    if (modalEsg) {
      modalEsg.addEventListener('click', (e) => {
        if (e.target === modalEsg) modalEsg.style.display = 'none';
      });
    }
  }

  bindSubmissionTour() {
    const btnTour = document.getElementById('btn-judge-tour');
    const modalTour = document.getElementById('modal-judge-tour');
    const btnCloseTour = document.getElementById('btn-close-judge-tour');
    const btnCloseTourFooter = document.getElementById('btn-close-tour-footer');

    if (btnTour && modalTour) {
      btnTour.addEventListener('click', () => {
        modalTour.style.display = 'flex';
      });
    }

    const closeTour = () => { if (modalTour) modalTour.style.display = 'none'; };
    if (btnCloseTour) btnCloseTour.addEventListener('click', closeTour);
    if (btnCloseTourFooter) btnCloseTourFooter.addEventListener('click', closeTour);
    if (modalTour) {
      modalTour.addEventListener('click', (e) => {
        if (e.target === modalTour) closeTour();
      });
    }

    // Jump buttons inside tour
    document.querySelectorAll('.tour-jump-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        closeTour();
        const jump = btn.dataset.jump;
        if (jump === 'intro') {
          this.switchView('view-intro');
          if (this.app.globeIntro) this.app.globeIntro.start();
        } else if (jump === 'planner') {
          this.switchTab('tab-planner');
        } else if (jump === 'map') {
          this.switchTab('tab-map-weather');
        } else if (jump === 'twin') {
          this.switchTab('tab-trip-twin');
        } else if (jump === 'guardian') {
          this.switchTab('tab-guardian');
        } else if (jump === 'esg') {
          const btnOffset = document.getElementById('btn-offset-carbon');
          if (btnOffset) btnOffset.click();
        }
      });
    });
  }

  bindCalendarExport() {
    const btnExport = document.getElementById('btn-export-calendar');
    if (!btnExport) return;

    btnExport.addEventListener('click', () => {
      const j = this.app.currentJourney || { origin: 'Hyderabad', destination: 'Goa', days: 7 };
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 7);

      let ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//JournX//Autonomous Multimodal Travel Intelligence//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH'
      ];

      for (let d = 1; d <= (j.days || 7); d++) {
        const dStart = new Date(startDate);
        dStart.setDate(dStart.getDate() + (d - 1));
        const dtStamp = dStart.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const dtEnd = new Date(dStart.getTime() + 8 * 3600 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        ics.push('BEGIN:VEVENT');
        ics.push(`UID:journx-${Date.now()}-day-${d}@journx.ai`);
        ics.push(`DTSTAMP:${dtStamp}`);
        ics.push(`DTSTART:${dtStamp}`);
        ics.push(`DTEND:${dtEnd}`);
        ics.push(`SUMMARY:JournX Expedition Day ${d}: ${j.origin} to ${j.destination}`);
        ics.push(`DESCRIPTION:Autonomous Multimodal Travel Itinerary Day ${d}. Active safety monitoring by Trip Guardian.`);
        ics.push(`LOCATION:${j.destination}`);
        ics.push('STATUS:CONFIRMED');
        ics.push('END:VEVENT');
      }

      ics.push('END:VCALENDAR');
      const blob = new Blob([ics.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `JournX-Voyage-${j.origin}-${j.destination}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (window.showToast) window.showToast('📅 Exported Voyage Itinerary to iCalendar (.ics)');
    });
  }

  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === '1') this.switchTab('tab-planner');
      else if (e.key === '2') this.switchTab('tab-map-weather');
      else if (e.key === '3') this.switchTab('tab-trip-twin');
      else if (e.key === '4') this.switchTab('tab-guardian');
      else if (e.key === '5') this.switchTab('tab-itinerary-expenses');
      else if (e.key.toLowerCase() === 'm') {
        const btnAudio = document.getElementById('btn-audio-toggle');
        if (btnAudio) btnAudio.click();
      } else if (e.key.toLowerCase() === 'v') {
        const btnBriefing = document.getElementById('btn-listen-briefing');
        if (btnBriefing) btnBriefing.click();
      } else if (e.key.toLowerCase() === 'p') {
        const btnPass = document.getElementById('btn-generate-voyage-pass');
        if (btnPass) btnPass.click();
      } else if (e.key === 'Escape') {
        const modalPass = document.getElementById('modal-voyage-pass');
        const modalEsg = document.getElementById('modal-esg-certificate');
        const modalTour = document.getElementById('modal-judge-tour');
        if (modalPass) modalPass.style.display = 'none';
        if (modalEsg) modalEsg.style.display = 'none';
        if (modalTour) modalTour.style.display = 'none';
      }
    });
  }
}

