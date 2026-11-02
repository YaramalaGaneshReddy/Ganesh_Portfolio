/**
 * Ganesh Reddy Yaramala - Portfolio Website Scripts
 * Features: Mobile Navigation Toggle, Persistent Dark Mode,
 * Active Nav State, Smooth Scroll Handling, Form Validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initScrollHeader();
  initActiveNavLink();
  initContactForm();
  initFooterYear();
  initPlaceholderTooltips();
});

/* ==========================================================================
   1. Dark Mode / Theme Toggle with LocalStorage Persistence
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const storageKey = 'ganesh_portfolio_theme';

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem(storageKey);
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem(storageKey, newTheme);
    });
  }

  // Listen to system theme changes if user hasn't explicitly set a preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(storageKey)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

function applyTheme(theme) {
  const themeToggle = document.getElementById('theme-toggle');
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
      themeToggle.setAttribute('title', 'Switch to light mode');
    }
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
      themeToggle.setAttribute('title', 'Switch to dark mode');
    }
  }
}

/* ==========================================================================
   2. Mobile Navigation Toggle
   ========================================================================== */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  function toggleMenu(forceClose = false) {
    const isOpen = forceClose ? false : !navMenu.classList.contains('open');
    navMenu.classList.toggle('open', isOpen);
    mobileToggle.classList.toggle('active', isOpen);
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
  }

  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close mobile nav when clicking any nav link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        toggleMenu(true);
      }
    });
  });

  // Close when clicking outside of nav
  document.addEventListener('click', (event) => {
    if (navMenu.classList.contains('open')) {
      if (!navMenu.contains(event.target) && !mobileToggle.contains(event.target)) {
        toggleMenu(true);
      }
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMenu(true);
      mobileToggle.focus();
    }
  });
}

/* ==========================================================================
   3. Sticky Header Scrolled State
   ========================================================================== */
function initScrollHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  function handleScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   4. Active Navigation State with IntersectionObserver
   ========================================================================== */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!('IntersectionObserver' in window) || sections.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/* ==========================================================================
   5. Contact Form Validation and Submission Feedback
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).trim().toLowerCase());
  }

  function validateField(input, condition) {
    const parent = input.closest('.form-group');
    if (!parent) return condition;

    if (!condition) {
      parent.classList.add('has-error');
    } else {
      parent.classList.remove('has-error');
    }
    return condition;
  }

  // Live error clear on input
  [nameInput, emailInput, messageInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => {
      const parent = input.closest('.form-group');
      if (parent && parent.classList.contains('has-error')) {
        parent.classList.remove('has-error');
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, nameInput.value.trim().length > 0);
    const isEmailValid = validateField(emailInput, validateEmail(emailInput.value));
    const isMessageValid = validateField(messageInput, messageInput.value.trim().length > 0);

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      if (feedback) {
        feedback.className = 'form-feedback error';
        feedback.textContent = 'Please fix the errors above before submitting.';
      }
      return;
    }

    // Successful validation feedback
    if (feedback) {
      feedback.className = 'form-feedback success';
      feedback.textContent = 'Thank you! Your message has been sent successfully.';
    }

    form.reset();

    setTimeout(() => {
      if (feedback) {
        feedback.className = 'form-feedback';
        feedback.textContent = '';
      }
    }, 6000);
  });
}

/* ==========================================================================
   6. Dynamic Copyright Year
   ========================================================================== */
function initFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   7. Placeholder Links Handler (Friendly notification for pending links)
   ========================================================================== */
function initPlaceholderTooltips() {
  const disabledLinks = document.querySelectorAll('.disabled-link');
  disabledLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const message = link.getAttribute('data-tooltip') || 'This link is currently a placeholder.';
      alert(message);
    });
  });
}

