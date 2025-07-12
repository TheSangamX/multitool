// ===== NAVIGATION MANAGEMENT =====

class NavigationManager {
  constructor() {
    this.header = document.querySelector('.header');
    this.navToggle = document.getElementById('navToggle');
    this.navMenu = document.getElementById('navMenu');
    this.navLinks = document.querySelectorAll('.nav__link');
    
    this.isMenuOpen = false;
    this.lastScrollY = window.scrollY;
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.updateActiveLink();
  }
  
  bindEvents() {
    // Mobile menu toggle
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    // Navigation links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
    });
    
    // Scroll events
    if (window.Utils && window.Utils.throttle) {
      window.addEventListener('scroll', window.Utils.throttle(() => this.handleScroll(), 16));
    } else {
      window.addEventListener('scroll', () => this.handleScroll());
    }
    
    // Resize events
    window.addEventListener('resize', () => this.handleResize());
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => this.handleOutsideClick(e));
  }
  
  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    if (this.navToggle) {
      this.navToggle.classList.toggle('nav__toggle--active', this.isMenuOpen);
    }
    
    if (this.navMenu) {
      this.navMenu.classList.toggle('nav__menu--open', this.isMenuOpen);
    }
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }
  
  closeMobileMenu() {
    if (this.isMenuOpen) {
      this.toggleMobileMenu();
    }
  }
  
  handleNavClick(e) {
    const link = e.currentTarget;
    const href = link.getAttribute('href');
    
    // Handle anchor links
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        this.scrollToElement(targetElement);
        this.updateActiveLink(link);
        this.closeMobileMenu();
      }
    }
  }
  
  scrollToElement(element) {
    const headerHeight = this.header ? this.header.offsetHeight : 0;
    const targetPosition = element.offsetTop - headerHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
  
  handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Add scrolled class to header
    if (this.header) {
      this.header.classList.toggle('header--scrolled', currentScrollY > 50);
    }
    
    // Update active navigation link based on scroll position
    this.updateActiveNavOnScroll();
    
    this.lastScrollY = currentScrollY;
  }
  
  updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const headerHeight = this.header ? this.header.offsetHeight : 0;
    
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerHeight - 100;
      const sectionHeight = section.offsetHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    if (currentSection) {
      const activeLink = document.querySelector(`.nav__link[href="#${currentSection}"]`);
      if (activeLink) {
        this.updateActiveLink(activeLink);
      }
    }
  }
  
  updateActiveLink(activeLink = null) {
    // Remove active class from all links
    this.navLinks.forEach(link => {
      link.classList.remove('nav__link--active');
    });
    
    // Add active class to current link
    if (activeLink) {
      activeLink.classList.add('nav__link--active');
    } else {
      // Default to first link if none specified
      const firstLink = this.navLinks[0];
      if (firstLink) {
        firstLink.classList.add('nav__link--active');
      }
    }
  }
  
  handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.closeMobileMenu();
    }
  }
  
  handleOutsideClick(e) {
    if (this.isMenuOpen && 
        !this.navMenu?.contains(e.target) && 
        !this.navToggle?.contains(e.target)) {
      this.closeMobileMenu();
    }
  }
}

// Initialize navigation manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.navigationManager = new NavigationManager();
});

export default NavigationManager;