// ===== SMOOTH SCROLL FUNCTIONALITY =====

class SmoothScroll {
  constructor() {
    this.init();
  }
  
  init() {
    this.bindEvents();
  }
  
  bindEvents() {
    // Handle all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => this.handleAnchorClick(e));
    });
    
    // Handle tool card clicks for smooth scrolling
    document.querySelectorAll('.tool-card').forEach(card => {
      card.addEventListener('click', (e) => this.handleToolCardClick(e));
    });
  }
  
  handleAnchorClick(e) {
    const anchor = e.currentTarget;
    const href = anchor.getAttribute('href');
    
    if (href && href.startsWith('#') && href.length > 1) {
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        e.preventDefault();
        this.scrollToElement(targetElement);
      }
    }
  }
  
  handleToolCardClick(e) {
    const card = e.currentTarget;
    const toolId = card.id;
    
    if (toolId) {
      // Smooth scroll to the tool card itself
      this.scrollToElement(card);
      
      // Add active state
      this.setActiveToolCard(card);
    }
  }
  
  scrollToElement(element, offset = 100) {
    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
    const targetPosition = element.offsetTop - headerHeight - offset;
    
    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: 'smooth'
    });
  }
  
  setActiveToolCard(activeCard) {
    // Remove active class from all tool cards
    document.querySelectorAll('.tool-card').forEach(card => {
      card.classList.remove('tool-card--active');
    });
    
    // Add active class to clicked card
    if (activeCard) {
      activeCard.classList.add('tool-card--active');
    }
  }
  
  // Utility method to scroll to top
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  // Utility method to scroll to bottom
  scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }
}

// Initialize smooth scroll when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.smoothScroll = new SmoothScroll();
});

// Add scroll to top functionality
window.addEventListener('load', () => {
  // Create scroll to top button if it doesn't exist
  if (!document.getElementById('scroll-to-top')) {
    const scrollButton = document.createElement('button');
    scrollButton.id = 'scroll-to-top';
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top-btn';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    
    // Add styles
    scrollButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--bg-glass, rgba(255, 255, 255, 0.25));
      border: 1px solid var(--border-glass, rgba(255, 255, 255, 0.18));
      backdrop-filter: blur(16px);
      color: var(--text-primary, #0f172a);
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      box-shadow: var(--shadow-glass, 0 8px 32px 0 rgba(31, 38, 135, 0.37));
    `;
    
    document.body.appendChild(scrollButton);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollButton.style.opacity = '1';
        scrollButton.style.visibility = 'visible';
      } else {
        scrollButton.style.opacity = '0';
        scrollButton.style.visibility = 'hidden';
      }
    });
    
    // Handle click
    scrollButton.addEventListener('click', () => {
      if (window.smoothScroll) {
        window.smoothScroll.scrollToTop();
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
});