/* global-features.js — global expansion features for lantern-player
   Features:
   - Global leaderboard (cross-kit rankings)
   - Community discovery (find games near you)
   - Localized content support
   - Currency conversion
   - Timezone handling
   - Social features (team invites, achievements)
*/

const GlobalFeatures = {
  // Configuration
  config: {
    apiBase: window.location.hostname === 'localhost' ? 'http://localhost:8090' : 'https://api.zqmlabs.com',
    defaultCurrency: 'USD',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'BRL'],
    defaultTimezone: 'America/New_York',
    mapTileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxLeaderboardEntries: 100,
    communityRadiusKm: 50
  },

  // State
  state: {
    globalLeaderboard: [],
    nearbyCommunities: [],
    userCurrency: 'USD',
    userTimezone: 'America/New_York',
    achievements: [],
    teamInvites: []
  },

  // Initialize global features
  init() {
    this.loadUserPreferences();
    this.setupGlobalLeaderboard();
    this.setupCommunityDiscovery();
    this.setupCurrencyConverter();
    this.setupTimezoneHandler();
    this.setupSocialFeatures();
    this.setupAchievements();
  },

  // Load user preferences from localStorage
  loadUserPreferences() {
    const prefs = JSON.parse(localStorage.getItem('lantern-global-prefs') || '{}');
    this.state.userCurrency = prefs.currency || this.config.defaultCurrency;
    this.state.userTimezone = prefs.timezone || this.config.defaultTimezone;
  },

  // Save user preferences
  saveUserPreferences() {
    localStorage.setItem('lantern-global-prefs', JSON.stringify({
      currency: this.state.userCurrency,
      timezone: this.state.userTimezone
    }));
  },

  // ============================================================
  // Global Leaderboard
  // ============================================================

  async setupGlobalLeaderboard() {
    // Fetch global leaderboard from all kits
    try {
      const response = await fetch(`${this.config.apiBase}/api/lantern/global-leaderboard`);
      if (response.ok) {
        const data = await response.json();
        this.state.globalLeaderboard = data.leaderboard || [];
        this.renderGlobalLeaderboard();
      }
    } catch (e) {
      console.warn('Failed to load global leaderboard:', e);
    }
  },

  renderGlobalLeaderboard() {
    const container = document.getElementById('global-leaderboard');
    if (!container) return;

    const html = this.state.globalLeaderboard.slice(0, 20).map((entry, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
      const flag = this.getCountryFlag(entry.country);
      return `<div class="lb-entry">
        <span class="lb-rank">${medal}</span>
        <span class="lb-team">${this.escapeHtml(entry.team)}</span>
        <span class="lb-flag">${flag}</span>
        <span class="lb-score">${entry.score}</span>
        <span class="lb-location">${this.escapeHtml(entry.location || '')}</span>
      </div>`;
    }).join('');

    container.innerHTML = html || '<p class="lb-empty">No global rankings yet. Be the first!</p>';
  },

  // Submit score to global leaderboard
  async submitGlobalScore(teamData) {
    try {
      const response = await fetch(`${this.config.apiBase}/api/lantern/global-leaderboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team: teamData.team,
          score: teamData.score,
          kit: teamData.kit,
          country: teamData.country,
          location: teamData.location,
          timestamp: new Date().toISOString()
        })
      });
      return response.ok;
    } catch (e) {
      console.warn('Failed to submit global score:', e);
      return false;
    }
  },

  // ============================================================
  // Community Discovery
  // ============================================================

  async setupCommunityDiscovery() {
    // Find nearby communities based on user location
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await this.findNearbyCommunities(latitude, longitude);
      },
      () => {
        // Default to showing all communities
        this.loadAllCommunities();
      },
      { enableHighAccuracy: false, timeout: 5000 }
    );
  },

  async findNearbyCommunities(lat, lng) {
    try {
      const response = await fetch(
        `${this.config.apiBase}/api/communities/nearby?lat=${lat}&lng=${lng}&radius=${this.config.communityRadiusKm}`
      );
      if (response.ok) {
        const data = await response.json();
        this.state.nearbyCommunities = data.communities || [];
        this.renderCommunityDiscovery();
      }
    } catch (e) {
      console.warn('Failed to find nearby communities:', e);
    }
  },

  async loadAllCommunities() {
    try {
      const response = await fetch(`${this.config.apiBase}/api/communities`);
      if (response.ok) {
        const data = await response.json();
        this.state.nearbyCommunities = data.communities || [];
        this.renderCommunityDiscovery();
      }
    } catch (e) {
      console.warn('Failed to load communities:', e);
    }
  },

  renderCommunityDiscovery() {
    const container = document.getElementById('community-discovery');
    if (!container) return;

    const html = this.state.nearbyCommunities.map(community => {
      const flag = this.getCountryFlag(community.country);
      return `<div class="community-card">
        <div class="community-header">
          <span class="community-flag">${flag}</span>
          <span class="community-name">${this.escapeHtml(community.name)}</span>
        </div>
        <div class="community-meta">
          <span>${this.escapeHtml(community.tier)}</span>
          <span>${community.active ? '🟢 Active' : '⚪ Inactive'}</span>
        </div>
        <button class="community-join" data-community="${community.id}">
          View Games
        </button>
      </div>`;
    }).join('');

    container.innerHTML = html || '<p class="community-empty">No communities found nearby.</p>';
  },

  // ============================================================
  // Currency Conversion
  // ============================================================

  setupCurrencyConverter() {
    // Load exchange rates
    this.loadExchangeRates();

    // Setup currency selector
    const selector = document.getElementById('currency-selector');
    if (selector) {
      selector.addEventListener('change', (e) => {
        this.state.userCurrency = e.target.value;
        this.saveUserPreferences();
        this.updateDisplayedPrices();
      });
    }
  },

  async loadExchangeRates() {
    try {
      // Use a free exchange rate API
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (response.ok) {
        const data = await response.json();
        this.state.exchangeRates = data.rates;
      }
    } catch (e) {
      console.warn('Failed to load exchange rates:', e);
      // Fallback rates
      this.state.exchangeRates = {
        USD: 1, EUR: 0.85, GBP: 0.73, CAD: 1.25, AUD: 1.35, JPY: 110, CNY: 6.45, BRL: 5.2
      };
    }
  },

  convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;
    const rates = this.state.exchangeRates || {};
    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[toCurrency] || 1;
    return (amount / fromRate) * toRate;
  },

  formatPrice(amount, currency = this.state.userCurrency) {
    const converted = this.convertCurrency(amount, 'USD', currency);
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency
    }).format(converted);
  },

  updateDisplayedPrices() {
    document.querySelectorAll('[data-price-usd]').forEach(el => {
      const usdPrice = parseFloat(el.dataset.priceUsd);
      el.textContent = this.formatPrice(usdPrice);
    });
  },

  // ============================================================
  // Timezone Handling
  // ============================================================

  setupTimezoneHandler() {
    // Auto-detect timezone
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detected) {
      this.state.userTimezone = detected;
    }

    // Setup timezone selector
    const selector = document.getElementById('timezone-selector');
    if (selector) {
      selector.addEventListener('change', (e) => {
        this.state.userTimezone = e.target.value;
        this.saveUserPreferences();
        this.updateDisplayedTimes();
      });
    }
  },

  formatTime(date, options = {}) {
    return new Intl.DateTimeFormat(undefined, {
      timeZone: this.state.userTimezone,
      hour: '2-digit',
      minute: '2-digit',
      ...options
    }).format(date);
  },

  formatDate(date, options = {}) {
    return new Intl.DateTimeFormat(undefined, {
      timeZone: this.state.userTimezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }).format(date);
  },

  updateDisplayedTimes() {
    document.querySelectorAll('[data-timestamp]').forEach(el => {
      const timestamp = parseInt(el.dataset.timestamp);
      el.textContent = this.formatDate(new Date(timestamp));
    });
  },

  // ============================================================
  // Social Features
  // ============================================================

  setupSocialFeatures() {
    // Team invite system
    this.setupTeamInvites();

    // Social sharing
    this.setupSocialSharing();
  },

  setupTeamInvites() {
    const inviteBtn = document.getElementById('btn-invite-team');
    if (inviteBtn) {
      inviteBtn.addEventListener('click', () => {
        this.showTeamInviteModal();
      });
    }
  },

  showTeamInviteModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Invite Your Team</h3>
        <p>Share this link with your team members:</p>
        <input type="text" id="team-invite-link" readonly value="${window.location.href}">
        <button id="copy-invite-link">Copy Link</button>
        <button id="close-invite-modal">Close</button>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#copy-invite-link').addEventListener('click', () => {
      const link = modal.querySelector('#team-invite-link');
      link.select();
      document.execCommand('copy');
      modal.querySelector('#copy-invite-link').textContent = 'Copied!';
    });

    modal.querySelector('#close-invite-modal').addEventListener('click', () => {
      modal.remove();
    });
  },

  setupSocialSharing() {
    const shareBtn = document.getElementById('btn-share-finale');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        this.shareResult();
      });
    }
  },

  async shareResult() {
    const shareData = {
      title: 'Wisp\'s Lost Lanterns',
      text: 'I just completed the Lantern Hunt! Can you beat my score?',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        console.warn('Share failed:', e);
      }
    } else {
      // Fallback: copy to clipboard
      const text = `${shareData.text} ${shareData.url}`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  },

  // ============================================================
  // Achievements
  // ============================================================

  setupAchievements() {
    this.state.achievements = JSON.parse(localStorage.getItem('lantern-achievements') || '[]');
    this.checkAchievements();
  },

  checkAchievements() {
    const stats = this.getGameStats();
    const newAchievements = [];

    // First completion
    if (stats.completions >= 1 && !this.hasAchievement('first_completion')) {
      newAchievements.push({
        id: 'first_completion',
        name: 'First Light',
        description: 'Complete your first lantern hunt',
        icon: '🏮'
      });
    }

    // Speed demon (under 30 minutes)
    if (stats.bestTime > 0 && stats.bestTime < 30 && !this.hasAchievement('speed_demon')) {
      newAchievements.push({
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete a hunt in under 30 minutes',
        icon: '⚡'
      });
    }

    // No hints used
    if (stats.noHintCompletions >= 1 && !this.hasAchievement('no_hints')) {
      newAchievements.push({
        id: 'no_hints',
        name: 'Pure Light',
        description: 'Complete a hunt without using any hints',
        icon: '🌟'
      });
    }

    // All clean solves
    if (stats.allCleanCompletions >= 1 && !this.hasAchievement('all_clean')) {
      newAchievements.push({
        id: 'all_clean',
        name: 'Flawless Glow',
        description: 'Complete a hunt with all clean solves',
        icon: '✨'
      });
    }

    // Night owl (play after 9 PM)
    if (stats.nightCompletions >= 1 && !this.hasAchievement('night_owl')) {
      newAchievements.push({
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Complete a hunt after 9 PM',
        icon: '🦉'
      });
    }

    // Save and display new achievements
    if (newAchievements.length > 0) {
      this.state.achievements.push(...newAchievements);
      localStorage.setItem('lantern-achievements', JSON.stringify(this.state.achievements));
      this.displayAchievements(newAchievements);
    }
  },

  hasAchievement(id) {
    return this.state.achievements.some(a => a.id === id);
  },

  displayAchievements(achievements) {
    const container = document.getElementById('achievements-toast');
    if (!container) return;

    achievements.forEach(achievement => {
      const toast = document.createElement('div');
      toast.className = 'achievement-toast';
      toast.innerHTML = `
        <span class="achievement-icon">${achievement.icon}</span>
        <div class="achievement-text">
          <strong>${achievement.name}</strong>
          <p>${achievement.description}</p>
        </div>
      `;
      container.appendChild(toast);

      setTimeout(() => toast.remove(), 5000);
    });
  },

  getGameStats() {
    return JSON.parse(localStorage.getItem('lantern-stats') || '{}');
  },

  // ============================================================
  // Utility Functions
  // ============================================================

  getCountryFlag(countryCode) {
    if (!countryCode) return '🌍';
    return countryCode
      .toUpperCase()
      .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // Get user's country from IP (fallback)
  async detectCountry() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        return data.country_code || 'US';
      }
    } catch (e) {
      console.warn('Failed to detect country:', e);
    }
    return 'US';
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => GlobalFeatures.init());
} else {
  GlobalFeatures.init();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GlobalFeatures;
}
