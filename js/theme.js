// ===== THEME MANAGEMENT =====

class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    this.themeToggle = document.getElementById('theme-toggle');
    
    this.init();
  }
  
  init() {
    this.applyTheme(this.currentTheme);
    this.bindEvents();
    this.updateToggleIcon();
  }
  
  bindEvents() {
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!this.getStoredTheme()) {
          this.currentTheme = e.matches ? 'dark' : 'light';
          this.applyTheme(this.currentTheme);
          this.updateToggleIcon();
        }
      });
  }
  
  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  getStoredTheme() {
    return localStorage.getItem('theme');
  }
  
  storeTheme(theme) {
    localStorage.setItem('theme', theme);
  }
  
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    this.storeTheme(theme);
  }
  
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    this.updateToggleIcon();
    
    // Add a subtle animation effect
    document.body.style.transition = 'background-color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
    
    // Show notification
    if (window.Utils && window.Utils.showNotification) {
      window.Utils.showNotification(`Switched to ${newTheme} theme`, 'info');
    }
  }
  
  updateToggleIcon() {
    if (this.themeToggle) {
      this.themeToggle.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
      this.themeToggle.setAttribute('aria-label', `Switch to ${this.currentTheme === 'light' ? 'dark' : 'light'} theme`);
    }
  }
  
  getCurrentTheme() {
    return this.currentTheme;
  }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
});

export default ThemeManager;