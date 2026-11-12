// ===== Mobile nav toggle =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

// ===== Smooth scroll =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== Scroll reveal =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.project-card, .skill-group, .section-header, .about-grid, .hero-stats').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// ===== Navbar shadow on scroll =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 20 ? '0 4px 20px rgba(0,0,0,0.3)' : 'none';
});

// ===== PROJECT SLIDERS =====
document.querySelectorAll('.slider').forEach(slider => {
  const imageList = (slider.dataset.images || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!imageList.length) return;

  const imgEl   = slider.querySelector('.project-img');
  const prevBtn = slider.querySelector('.slider-btn.prev');
  const nextBtn = slider.querySelector('.slider-btn.next');
  const dotsEl  = slider.querySelector('.slider-dots');

  let index = 0;
  let slideInterval;

  // Build dots
  imageList.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to image ${i + 1}`);
    dot.addEventListener('click', () => {
      show(i);
      resetTimer(); // Reset timer when dot is clicked
    });
    dotsEl.appendChild(dot);
  });
  const dots = [...dotsEl.children];

  function show(i) {
    index = (i + imageList.length) % imageList.length;
    imgEl.src = imageList[index];
    imgEl.alt = `Project screenshot ${index + 1}`;
    dots.forEach((d, di) => d.classList.toggle('active', di === index));
  }

  // Auto-slide function
  function startTimer() {
    slideInterval = setInterval(() => {
      show(index + 1);
    }, 3000); // 3000ms = 3 seconds. Change this number to make it faster/slower.
  }

  function stopTimer() {
    clearInterval(slideInterval);
  }

  function resetTimer() {
    stopTimer();
    startTimer();
  }

  // Preload images so sliding is instant
  imageList.forEach(src => { const p = new Image(); p.src = src; });

  prevBtn?.addEventListener('click', () => { show(index - 1); resetTimer(); });
  nextBtn?.addEventListener('click', () => { show(index + 1); resetTimer(); });

  // Pause on hover
  slider.addEventListener('mouseenter', stopTimer);
  slider.addEventListener('mouseleave', startTimer);

  // Swipe on touch devices
  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; stopTimer(); }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
    startTimer();
  });

  // Show first image and start the auto-slide
  show(0);
  startTimer();
});