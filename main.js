/**
 * Aditya Sharma — Stark HUD & Iron Man Cinematic Portfolio
 * Scroll-Driven Video Scrubbing, Arc Reactor Preloader, Comms Relay & Hologram Tilt.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. J.A.R.V.I.S. Arc Reactor Preloader
  const preloader = document.getElementById('stark-preloader');
  const preloaderCounter = document.getElementById('preloader-counter');

  let loadPercent = 0;
  const loadInterval = setInterval(() => {
    loadPercent += Math.floor(Math.random() * 12) + 5;
    if (loadPercent >= 100) {
      loadPercent = 100;
      clearInterval(loadInterval);
      if (preloaderCounter) preloaderCounter.textContent = 'SYSTEM BOOT: 100% [ONLINE]';

      setTimeout(() => {
        if (preloader) preloader.classList.add('done');
        startBackgroundVideo();
      }, 400);
    } else {
      if (preloaderCounter) preloaderCounter.textContent = `SYSTEM BOOT: ${loadPercent}%`;
    }
  }, 40);

  // 2. Cinematic Video Background & Scroll Scrubbing
  const video = document.getElementById('bg-ironman-video');
  let targetTime = 0;
  let isVideoReady = false;

  function startBackgroundVideo() {
    if (!video) return;
    video.play().then(() => {
      isVideoReady = true;
    }).catch(() => {
      // Autoplay fallback with mute
      video.muted = true;
      video.play().then(() => { isVideoReady = true; });
    });
  }

  // Smooth Scroll Video Scrubbing
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateVideoScrub() {
    if (!video || !video.duration) return;

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0;

    targetTime = progress * video.duration;

    // Smooth seek to target time
    if (Math.abs(video.currentTime - targetTime) > 0.08) {
      video.currentTime += (targetTime - video.currentTime) * 0.25;
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(updateVideoScrub);
      ticking = true;
    }

    // Header HUD Scrolled State
    const nav = document.getElementById('hud-nav');
    if (nav) {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // 3. Audio & Suit Sound Toggle
  const btnSound = document.getElementById('btn-sound-toggle');
  const audioLabel = document.getElementById('audio-btn-label');

  if (btnSound && video) {
    btnSound.addEventListener('click', () => {
      if (video.muted) {
        video.muted = false;
        video.play();
        btnSound.classList.add('active');
        if (audioLabel) audioLabel.textContent = 'AUDIO: ON';
      } else {
        video.muted = true;
        btnSound.classList.remove('active');
        if (audioLabel) audioLabel.textContent = 'AUDIO: OFF';
      }
    });
  }

  // 4. Holographic Portrait Parallax & Tilt
  const holoCard = document.querySelector('.holo-portrait-frame');
  if (holoCard && window.matchMedia('(pointer: fine)').matches) {
    holoCard.addEventListener('mousemove', (e) => {
      const rect = holoCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotX = -(y / (rect.height / 2)) * 8;
      const rotY = (x / (rect.width / 2)) * 8;

      holoCard.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    });

    holoCard.addEventListener('mouseleave', () => {
      holoCard.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  // 5. One-Click Copy Email Button
  const btnCopyEmail = document.getElementById('btn-copy-email');
  if (btnCopyEmail) {
    btnCopyEmail.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'mradityaraj84@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const originalText = btnCopyEmail.textContent;
        btnCopyEmail.textContent = '✓ COPIED';
        btnCopyEmail.style.background = 'var(--arc-cyan)';
        btnCopyEmail.style.color = '#000000';

        setTimeout(() => {
          btnCopyEmail.textContent = originalText;
          btnCopyEmail.style.background = '';
          btnCopyEmail.style.color = '';
        }, 2200);
      });
    });
  }

  // 6. Comms Transmission Form
  const commsForm = document.getElementById('comms-form');
  const btnTransmit = document.getElementById('btn-stark-transmit');
  if (commsForm && btnTransmit) {
    commsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const originalText = btnTransmit.innerHTML;
      btnTransmit.innerHTML = 'TRANSMITTING VIA J.A.R.V.I.S...';
      btnTransmit.disabled = true;

      setTimeout(() => {
        btnTransmit.innerHTML = '✓ TRANSMISSION DELIVERED TO ADITYA';
        btnTransmit.style.background = 'linear-gradient(135deg, #059669, #10b981)';

        setTimeout(() => {
          commsForm.reset();
          btnTransmit.innerHTML = originalText;
          btnTransmit.style.background = '';
          btnTransmit.disabled = false;
        }, 3200);
      }, 800);
    });
  }

  // 7. Personnel Dossier Modal
  const dossierModal = document.getElementById('dossier-modal');
  const openDossierBtns = document.querySelectorAll('.btn-open-resume');
  const closeDossierBtn = document.getElementById('dossier-close-btn');

  openDossierBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (dossierModal) {
        dossierModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeDossierBtn && dossierModal) {
    closeDossierBtn.addEventListener('click', () => {
      dossierModal.classList.remove('open');
      document.body.style.overflow = '';
    });

    dossierModal.addEventListener('click', (e) => {
      if (e.target === dossierModal) {
        dossierModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dossierModal.classList.contains('open')) {
        dossierModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // 8. Mobile HUD Menu Toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.nav-menu-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navLinks.style.position = 'absolute';
        navLinks.style.top = '74px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'rgba(6, 7, 10, 0.98)';
        navLinks.style.flexDirection = 'column';
        navLinks.style.padding = '2rem 1.5rem';
        navLinks.style.borderBottom = '1px solid var(--border-hud)';
      }
    });
  }
});
