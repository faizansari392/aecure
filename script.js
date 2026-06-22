// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {

  // ---------- Toast (success message) ----------
  function showToast(title, message) {
    let toast = document.getElementById('site-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'site-toast';
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.innerHTML = `
        <span class="toast-icon">
          <svg viewBox="0 0 24 24" fill="none"><path d="M5 13L9.5 17.5L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <div class="toast-body">
          <h4 id="site-toast-title"></h4>
          <p id="site-toast-text"></p>
        </div>
        <button type="button" class="toast-close" aria-label="Dismiss">
          <svg viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
        </button>`;
      document.body.appendChild(toast);
      toast.querySelector('.toast-close').addEventListener('click', () => hideToast());
    }
    toast.querySelector('#site-toast-title').textContent = title;
    toast.querySelector('#site-toast-text').textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(hideToast, 5000);

    function hideToast() {
      toast.classList.remove('show');
    }
  }

  // ---------- Modal (out of stock notice) ----------
  function ensureStockModal() {
    let overlay = document.getElementById('stock-modal');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'stock-modal';
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'stock-modal-title');
    overlay.innerHTML = `
      <div class="modal-card">
        <button type="button" class="modal-close" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
        </button>
        <div class="modal-icon">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 21C12 21 5 14.5 5 9.5C5 5.9 8.1 3 12 3C15.9 3 19 5.9 19 9.5C19 14.5 12 21 12 21Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="9.5" r="2.3" stroke="currentColor" stroke-width="2"/></svg>
        </div>
        <h3 id="stock-modal-title">We've sold out — for now</h3>
        <p>Ice Cap Pro is currently out of stock. We didn't expect such a warm response, and we're working to restock as quickly as we can.</p>
        <p class="modal-sub">Thank you for your patience and for wanting one — it means a lot to us. Please check back again soon.</p>
        <div class="modal-actions">
          <button type="button" class="btn btn-primary btn-block" id="stock-modal-ok">Got it, thank you</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector('.modal-close');
    const okBtn = overlay.querySelector('#stock-modal-ok');
    let lastFocused = null;

    function close() {
      overlay.classList.remove('open');
      document.body.classList.remove('scroll-locked');
      if (lastFocused) lastFocused.focus();
    }
    overlay.open = (triggerEl) => {
      lastFocused = triggerEl || document.activeElement;
      overlay.classList.add('open');
      document.body.classList.add('scroll-locked');
      closeBtn.focus();
    };

    closeBtn.addEventListener('click', close);
    okBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });

    return overlay;
  }

  // Intercept every "Buy Now" button site-wide
  document.querySelectorAll('.nav-cta .btn-primary, a.btn-primary').forEach(btn => {
    const label = (btn.textContent || '').trim();
    if (label.startsWith('Buy Now')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = ensureStockModal();
        modal.open(btn);
      });
    }
  });

  // ---------- Contact form ----------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const name = contactForm.querySelector('#name').value.trim();
      const email = contactForm.querySelector('#email').value.trim();
      const orderId = contactForm.querySelector('#order-id').value.trim();
      const topic = contactForm.querySelector('#topic').value;
      const message = contactForm.querySelector('#message').value.trim();

      const bodyLines = [
        `Name: ${name}`,
        `Email: ${email}`,
        orderId ? `Order ID: ${orderId}` : null,
        `Topic: ${topic}`,
        '',
        message
      ].filter(Boolean).join('\n');

      const mailto = `mailto:support@aecure.com?subject=${encodeURIComponent('[Aecure Contact] ' + topic)}&body=${encodeURIComponent(bodyLines)}`;

      // Open the user's email app with everything pre-filled
      window.location.href = mailto;

      showToast('Message sent successfully', "Thanks " + (name.split(' ')[0] || '') + "! Your message is on its way to support@aecure.com. We'll get back to you within 1\u20132 business days.");

      contactForm.reset();
    });
  }

  const toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => document.body.classList.remove('nav-open'));
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Zone diagram interaction
  const zoneData = {
    left: {
      title: 'Left side',
      text: 'Targets the left temple and side of the head — built for one-sided migraines, tension, and discomfort that sit on a single side.'
    },
    right: {
      title: 'Right side',
      text: 'Mirrors the same relief on the right temple and side — useful for right-sided migraines and pressure.'
    },
    front: {
      title: 'Front',
      text: 'Soothes the forehead and brow — the zone most linked to sinus pressure, tension headaches, and eye strain.'
    },
    back: {
      title: 'Back',
      text: 'Cools the back of the head and base of the skull — where neck tension and occipital headaches build up.'
    },
    full: {
      title: 'Full coverage',
      text: 'All four ports filled together for 360° relief — the setting most people reach for at the end of a long day.'
    }
  };

  const tabs = document.querySelectorAll('.zone-tab');
  const nodes = document.querySelectorAll('.zone-node');
  const detailTitle = document.querySelector('.zone-detail h3');
  const detailText = document.querySelector('.zone-detail p');

  function setZone(key) {
    if (!zoneData[key]) return;
    tabs.forEach(t => t.classList.toggle('active', t.dataset.zone === key));
    nodes.forEach(n => n.classList.toggle('active', n.dataset.zone === key));
    if (detailTitle && detailText) {
      detailTitle.textContent = zoneData[key].title;
      detailText.textContent = zoneData[key].text;
    }
  }

  tabs.forEach(t => t.addEventListener('click', () => setZone(t.dataset.zone)));
  nodes.forEach(n => n.addEventListener('click', () => setZone(n.dataset.zone)));

  if (tabs.length) setZone('full');

  // ============================================================
  // IMAGE SLIDERS (mobile step-by-step + fill port views)
  // ============================================================
  document.querySelectorAll('.img-slider').forEach(slider => {
    const track = slider.querySelector('.img-slider-track');
    const slides = slider.querySelectorAll('.img-slider-slide');
    const dotsWrap = slider.querySelector('.slider-dots');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    if (!track || !slides.length) return;

    let current = 0;
    const total = slides.length;

    // Build dots
    const dots = Array.from({ length: total }, (_, i) => {
      const d = document.createElement('button');
      d.className = 'slider-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Go to slide ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
      return d;
    });

    function goTo(index) {
      current = Math.max(0, Math.min(total - 1, index));
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      if (prevBtn) prevBtn.disabled = current === 0;
      if (nextBtn) nextBtn.disabled = current === total - 1;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    // Touch / swipe support
    let touchStartX = 0, touchStartY = 0, dragging = false;
    slider.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      dragging = true;
    }, { passive: true });
    slider.addEventListener('touchend', e => {
      if (!dragging) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        goTo(current + (dx < 0 ? 1 : -1));
      }
      dragging = false;
    }, { passive: true });

    goTo(0);
  });

  // ============================================================
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    let lastFocused = null;

    function openLightbox(src, alt) {
      lastFocused = document.activeElement;
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.classList.add('open');
      document.body.classList.add('scroll-locked');
      closeBtn.focus();
    }
    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.classList.remove('scroll-locked');
      lightboxImg.src = '';
      if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll('.zoomable').forEach(btn => {
      btn.addEventListener('click', () => {
        const img = btn.querySelector('img');
        if (img) openLightbox(img.src, img.alt);
      });
    });
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }
});
