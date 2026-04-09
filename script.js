/**
 * ABHISHEK AKUNURU — PORTFOLIO SCRIPT
 * ─────────────────────────────────────────────────────────────
 * Sections:
 *  1. Custom Cursor
 *  2. Navbar: Scroll & Mobile Toggle
 *  3. Scroll-Reveal Animations (Intersection Observer)
 *  4. Animated Counters
 *  5. Skill Bar Animations (Intersection Observer)
 *  6. GitHub API Integration
 *  7. Contact Form Validation
 *  8. Footer Year
 *  9. Active Nav Link Highlighting
 * ─────────────────────────────────────────────────────────────
 */

'use strict';

/* ────────────────────────────────────────────────────────────
   1. CUSTOM CURSOR
   ──────────────────────────────────────────────────────────── */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let rafId = null;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Move the dot cursor immediately
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower via RAF
  function animateFollower() {
    const dx = mouseX - followerX;
    const dy = mouseY - followerY;
    followerX += dx * 0.12;
    followerY += dy * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    rafId = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity   = '1';
    follower.style.opacity = '1';
  });
})();


/* ────────────────────────────────────────────────────────────
   2. NAVBAR: SCROLL & MOBILE TOGGLE
   ──────────────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (!navbar) return;

  // Scrolled state
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load

  // Mobile toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      // Prevent body scroll when menu open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      }
    });
  }
})();


/* ────────────────────────────────────────────────────────────
   3. SCROLL-REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ──────────────────────────────────────────────────────────── */
(function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right'
  );

  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  targets.forEach(el => observer.observe(el));
})();


/* ────────────────────────────────────────────────────────────
   4. ANIMATED COUNTERS
   ──────────────────────────────────────────────────────────── */
(function initCounters() {
  const counterEls = document.querySelectorAll('.counter-value[data-target]');
  if (!counterEls.length) return;

  /**
   * Eases a value from 0 to target over duration ms
   * @param {HTMLElement} el
   * @param {number} target
   * @param {string} suffix
   * @param {number} duration
   */
  function animateCounter(el, target, suffix, duration = 1800) {
    const startTime = performance.now();

    function tick(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + (suffix || '');
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => observer.observe(el));
})();


/* ────────────────────────────────────────────────────────────
   5. SKILL BAR ANIMATIONS
   ──────────────────────────────────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill[data-width]');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill  = entry.target;
        const width = fill.dataset.width;
        // Small delay so CSS transition fires after paint
        setTimeout(() => {
          fill.style.width = width + '%';
        }, 100);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(el => observer.observe(el));
})();


/* ────────────────────────────────────────────────────────────
   6. GITHUB API INTEGRATION
   ──────────────────────────────────────────────────────────── */
(function initGitHub() {
  const container = document.getElementById('githubRepos');
  const loading   = document.getElementById('githubLoading');
  const USERNAME  = 'Abhishek-Akunuru-901';
  const API_URL   = `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=9&type=public`;

  if (!container) return;

  /**
   * Renders a single repo card
   * @param {Object} repo - GitHub repo object
   * @returns {string} HTML string
   */
  function renderRepoCard(repo) {
    const name        = repo.name || 'Unnamed Repo';
    const description = repo.description || 'No description provided.';
    const stars       = repo.stargazers_count || 0;
    const lang        = repo.language || '';
    const url         = repo.html_url || '#';
    const forks       = repo.forks_count || 0;

    return `
      <a href="${url}" target="_blank" rel="noopener noreferrer" class="repo-card reveal-up">
        <div class="repo-name">⬡ ${escapeHTML(name)}</div>
        <p class="repo-desc">${escapeHTML(description)}</p>
        <div class="repo-meta">
          ${lang ? `<span>◈ ${escapeHTML(lang)}</span>` : ''}
          <span class="repo-stars">★ ${stars}</span>
          ${forks > 0 ? `<span>⑂ ${forks}</span>` : ''}
        </div>
      </a>
    `;
  }

  /**
   * Minimal HTML escape to prevent XSS from API data
   * @param {string} str
   * @returns {string}
   */
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Shows fallback repo cards when API fails or returns no data
   */
  function showFallback() {
    const fallbackRepos = [
      {
        name: 'ShopNest-PowerBI',
        description: 'Power BI dashboard for retail analytics — product performance, customer segmentation, and sales KPIs.',
        html_url: `https://github.com/${USERNAME}`,
        stargazers_count: 0,
        language: 'Power BI',
        forks_count: 0
      },
      {
        name: 'Freshco-Hypermarket-Analysis',
        description: 'Excel-based customer segmentation and sales analysis for a hypermarket chain. 18% ROI improvement.',
        html_url: `https://github.com/${USERNAME}`,
        stargazers_count: 0,
        language: 'Excel',
        forks_count: 0
      },
      {
        name: 'Airline-DB-SQL-Analysis',
        description: 'Complex relational database analysis for airline operations using advanced SQL: CTEs, window functions, and aggregations.',
        html_url: `https://github.com/${USERNAME}`,
        stargazers_count: 0,
        language: 'SQL',
        forks_count: 0
      },
      {
        name: 'Python-Data-Science-Capstone',
        description: 'End-to-end data processing pipeline built with Pandas & NumPy — ETL, EDA, and statistical visualization.',
        html_url: `https://github.com/${USERNAME}`,
        stargazers_count: 0,
        language: 'Python',
        forks_count: 0
      }
    ];

    if (loading) loading.remove();

    const notice = `
      <p class="github-error" style="grid-column:1/-1; margin-bottom:1rem;">
        📡 GitHub API rate limit reached. Showing project portfolio below.
      </p>
    `;

    container.innerHTML = notice + fallbackRepos.map(renderRepoCard).join('');

    // Trigger reveal for dynamically inserted cards
    triggerReveal();
  }

  /**
   * Re-runs the IntersectionObserver for dynamically added .reveal-up cards
   */
  function triggerReveal() {
    const newCards = container.querySelectorAll('.reveal-up:not(.revealed)');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    newCards.forEach(card => observer.observe(card));
  }

  // Fetch repos from GitHub API
  fetch(API_URL)
    .then(response => {
      if (!response.ok) throw new Error(`GitHub API responded with status ${response.status}`);
      return response.json();
    })
    .then(repos => {
      if (loading) loading.remove();

      if (!Array.isArray(repos) || repos.length === 0) {
        showFallback();
        return;
      }

      // Render up to 8 repos
      const html = repos.slice(0, 8).map(renderRepoCard).join('');
      container.innerHTML = html;
      triggerReveal();
    })
    .catch((err) => {
      console.warn('GitHub API error:', err.message);
      showFallback();
    });
})();


/* ────────────────────────────────────────────────────────────
   7. CONTACT FORM VALIDATION
   ──────────────────────────────────────────────────────────── */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (!form) return;

  const fields = {
    name:    { el: document.getElementById('name'),    errEl: document.getElementById('nameError') },
    email:   { el: document.getElementById('email'),   errEl: document.getElementById('emailError') },
    message: { el: document.getElementById('message'), errEl: document.getElementById('messageError') }
  };

  /** Validation rules */
  const validators = {
    name(value) {
      if (!value.trim()) return 'Name is required.';
      if (value.trim().length < 2) return 'Name must be at least 2 characters.';
      return null;
    },
    email(value) {
      if (!value.trim()) return 'Email is required.';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) return 'Please enter a valid email address.';
      return null;
    },
    message(value) {
      if (!value.trim()) return 'Message is required.';
      if (value.trim().length < 20) return 'Message must be at least 20 characters.';
      return null;
    }
  };

  /**
   * Validates a single field and updates UI
   * @param {string} fieldName
   * @returns {boolean} - true if valid
   */
  function validateField(fieldName) {
    const { el, errEl } = fields[fieldName];
    const error = validators[fieldName](el.value);

    if (error) {
      errEl.textContent = error;
      el.classList.add('error');
      el.classList.remove('valid');
      return false;
    } else {
      errEl.textContent = '';
      el.classList.remove('error');
      el.classList.add('valid');
      return true;
    }
  }

  // Real-time validation on blur
  Object.keys(fields).forEach(name => {
    const { el } = fields[name];
    el.addEventListener('blur', () => validateField(name));
    el.addEventListener('input', () => {
      // Clear error on typing if field was previously invalid
      if (el.classList.contains('error')) {
        validateField(name);
      }
    });
  });

  // Form submit
  form.addEventListener('submit', (e) => {
    // e.preventDefault();

    // Validate all fields
    const isValid = Object.keys(fields).map(name => validateField(name)).every(Boolean);

    if (!isValid) return;

    // Simulate async send
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      // Show success state
      formSuccess.classList.add('visible');
      form.reset();

      // Clear valid classes
      Object.values(fields).forEach(({ el }) => el.classList.remove('valid', 'error'));

      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message <span class="btn-arrow">→</span>';

      // Auto-hide success after 6s
      setTimeout(() => {
        formSuccess.classList.remove('visible');
      }, 6000);
    }, 1200);
  });
})();


/* ────────────────────────────────────────────────────────────
   8. FOOTER YEAR
   ──────────────────────────────────────────────────────────── */
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ────────────────────────────────────────────────────────────
   9. ACTIVE NAV LINK HIGHLIGHTING (SCROLL SPY)
   ──────────────────────────────────────────────────────────── */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${id}`);
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -60% 0px'
  });

  sections.forEach(section => observer.observe(section));
})();


/* ────────────────────────────────────────────────────────────
   BONUS: Smooth scroll for all anchor links (polyfill for
   Safari if needed, though most modern browsers handle it)
   ──────────────────────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ────────────────────────────────────────────────────────────
   BONUS: Subtle parallax on hero orbs for desktop
   ──────────────────────────────────────────────────────────── */
(function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      orbs.forEach((orb, i) => {
        const speed = 0.08 + i * 0.04;
        orb.style.transform = `translateY(${scrollY * speed}px)`;
      });
      ticking = false;
    });
  }, { passive: true });
})();

/* ===== SCROLL PROGRESS BAR ===== */
(function initScrollProgress() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / height) * 100;
    bar.style.width = progress + '%';
  });
})();
