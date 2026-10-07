/**
 * AWS Student Builder Group - RGUKT Ongole
 * Master Interactive Script
 * Framework-free vanilla JavaScript adhering to anti-slop principles:
 * High performance, zero layout thrashing, accessible interactions.
 */

(function () {
  'use strict';

  // --- Utility: DOM Ready Helper ---
  function onReady(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  // --- 1. Sticky Header & Scroll Elevation ---
  function initHeader() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    let ticking = false;
    const handleScroll = () => {
      const isScrolled = window.scrollY > 24;
      if (isScrolled !== header.classList.contains('scrolled')) {
        header.classList.toggle('scrolled', isScrolled);
      }
      ticking = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(handleScroll);
          ticking = true;
        }
      },
      { passive: true }
    );
    handleScroll();
  }

  // --- 2. Mobile Navigation Toggle & Focus Management ---
  function initMobileNav() {
    const toggle = document.getElementById('mobileNavToggle');
    const nav = document.getElementById('mainNav');
    if (!toggle || !nav) return;

    const toggleNav = (open) => {
      const willOpen = typeof open === 'boolean' ? open : !nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', String(willOpen));
      nav.classList.toggle('open', willOpen);
      toggle.classList.toggle('active', willOpen);
      document.body.classList.toggle('nav-lock-scroll', willOpen);
    };

    toggle.addEventListener('click', () => toggleNav());

    // Close when clicking nav links
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        toggleNav(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        toggleNav(false);
        toggle.focus();
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        nav.classList.contains('open') &&
        !nav.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        toggleNav(false);
      }
    });
  }

  // --- 3. Accessible Image Lightbox ---
  function initLightbox() {
    let lightbox = document.getElementById('sbgLightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'sbgLightbox';
      lightbox.className = 'sbg-lightbox';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.setAttribute('aria-label', 'Image preview');
      lightbox.innerHTML = `
        <div class="lightbox-overlay" data-action="close"></div>
        <div class="lightbox-dialog">
          <button class="lightbox-close" data-action="close" aria-label="Close preview">&times;</button>
          <img class="lightbox-image" src="" alt="">
          <div class="lightbox-caption"></div>
        </div>
      `;
      document.body.appendChild(lightbox);
    }

    const imgEl = lightbox.querySelector('.lightbox-image');
    const capEl = lightbox.querySelector('.lightbox-caption');

    const openLightbox = (src, alt, caption) => {
      imgEl.src = src;
      imgEl.alt = alt || 'Preview image';
      capEl.textContent = caption || alt || '';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        imgEl.src = '';
      }, 200);
    };

    lightbox.addEventListener('click', (e) => {
      if (e.target.dataset.action === 'close' || e.target.classList.contains('lightbox-overlay')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });

    // Delegate click on gallery items
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.gallery-card, .archive-gallery-strip img, .pitch-gallery .gallery-card, .hackathon-photo-gallery .gallery-card');
      if (!trigger) return;

      const img = trigger.tagName === 'IMG' ? trigger : trigger.querySelector('img');
      if (!img) return;

      const captionNode = trigger.querySelector('.gallery-caption') || trigger.closest('.archive-card')?.querySelector('.archive-title');
      const captionText = captionNode ? captionNode.textContent.trim() : (img.getAttribute('alt') || '');

      openLightbox(img.currentSrc || img.src, img.alt, captionText);
    });
  }

  // --- 4. Live Event Countdown ---
  function initCountdown() {
    const clock = document.getElementById('workshopCountdown');
    if (!clock) return;

    const daysEl = document.getElementById('cdDays');
    const hoursEl = document.getElementById('cdHours');
    const minsEl = document.getElementById('cdMins');
    const secsEl = document.getElementById('cdSecs');

    const targetDateAttr = clock.getAttribute('data-target-date') || '2026-10-11T15:30:00';
    const targetTime = new Date(targetDateAttr).getTime();

    const updateClock = () => {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minsEl) minsEl.textContent = '00';
        if (secsEl) secsEl.textContent = '00';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      const pad = (n) => String(n).padStart(2, '0');
      if (daysEl) daysEl.textContent = pad(days);
      if (hoursEl) hoursEl.textContent = pad(hours);
      if (minsEl) minsEl.textContent = pad(mins);
      if (secsEl) secsEl.textContent = pad(secs);
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  // --- 5. Interactive Event Filter & Search (workshops.html) ---
  function initArchiveFilters() {
    const container = document.getElementById('archiveContainer');
    const searchInput = document.getElementById('eventSearchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (!container) return;

    let currentCategory = 'all';
    let searchQuery = '';

    const applyFilter = () => {
      const cards = container.querySelectorAll('.archive-card');
      let visibleCount = 0;

      cards.forEach((card) => {
        const cat = card.getAttribute('data-category') || '';
        const cardText = card.textContent.toLowerCase();

        const matchesCat = currentCategory === 'all' || cat === currentCategory;
        const matchesSearch = !searchQuery || cardText.includes(searchQuery);

        if (matchesCat && matchesSearch) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Handle empty state
      let emptyMsg = container.querySelector('.archive-empty-state');
      if (visibleCount === 0) {
        if (!emptyMsg) {
          emptyMsg = document.createElement('div');
          emptyMsg.className = 'archive-empty-state';
          emptyMsg.innerHTML = `
            <div class="empty-icon">&#128269;</div>
            <h4>No archive sessions found</h4>
            <p>Try searching with another keyword or select "All Events".</p>
          `;
          container.appendChild(emptyMsg);
        }
        emptyMsg.style.display = 'block';
      } else if (emptyMsg) {
        emptyMsg.style.display = 'none';
      }
    };

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        currentCategory = btn.getAttribute('data-category') || 'all';
        applyFilter();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        applyFilter();
      });
    }
  }

  // --- 6. Number Counter Animation on Scroll ---
  function initStatCounters() {
    const counterElements = document.querySelectorAll('.metric-value, .b-value');
    if (!counterElements.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            obs.unobserve(el);

            const rawText = el.textContent.trim();
            const numeric = parseInt(rawText.replace(/\D/g, ''), 10);
            if (isNaN(numeric) || numeric === 0) return;

            const suffix = rawText.includes('+') ? '+' : (rawText.includes('%') ? '%' : '');
            let start = 0;
            const duration = 1200;
            const startTime = performance.now();

            const animate = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out quad
              const easeProgress = 1 - (1 - progress) * (1 - progress);
              const currentVal = Math.floor(easeProgress * numeric);

              el.textContent = currentVal + suffix;
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                el.textContent = numeric + suffix;
              }
            };

            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.2 }
    );

    counterElements.forEach((el) => observer.observe(el));
  }

  // --- 7. Dynamic Footer Year ---
  function initFooterYear() {
    document.querySelectorAll('.current-year').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  // --- Boot application on DOM ready ---
  onReady(() => {
    initHeader();
    initMobileNav();
    initLightbox();
    initCountdown();
    initArchiveFilters();
    initStatCounters();
    initFooterYear();
  });
})();
