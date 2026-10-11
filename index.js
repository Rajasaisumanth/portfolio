/**
 * ALEX RIVERA | VIDEO EDITOR PORTFOLIO
 * Interactive Controller & Features Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroReelPlayer();
  initProjectFiltering();
  initLightboxModal();
  initColorGradingSlider();
  initMetricCounters();
  initTestimonialsSlider();
  initBookingForm();
  initEmailCopy();
  initLiveClock();
  initAudioFX();
  initServiceSelectCTA();
});

/* ==========================================================================
   1. NAVBAR & SCROLL SPY
   ========================================================================== */
function initNavbar() {
  const nav = document.getElementById('siteNav');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Scroll Spy active state
    let current = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const isOpen = mobileDrawer.classList.contains('open');
      mobileToggle.innerHTML = isOpen 
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>` 
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>`;
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>`;
      });
    });
  }
}

/* ==========================================================================
   2. HERO 60-SECOND REEL PLAYER (Custom Controls & Ambient Glow)
   ========================================================================== */
function initHeroReelPlayer() {
  const reelCard = document.getElementById('heroReelCard');
  const reelVideo = document.getElementById('heroReelVideo');
  const bigPlayBtn = document.getElementById('reelBigPlay');
  const playPauseBtn = document.getElementById('reelPlayPauseBtn');
  const muteBtn = document.getElementById('reelMuteBtn');
  const ambientToggle = document.getElementById('ambientToggle');
  const ambientGlow = document.getElementById('ambientGlow');
  const scrubberTrack = document.getElementById('reelScrubberTrack');
  const scrubberProgress = document.getElementById('reelScrubberProgress');
  const timecodeCurrent = document.getElementById('reelTimeCurrent');
  const timecodeTotal = document.getElementById('reelTimeTotal');
  const speedBtn = document.getElementById('reelSpeedBtn');
  const fullscreenBtn = document.getElementById('reelFullscreenBtn');

  if (!reelCard || !reelVideo) return;

  let isPlaying = false;
  let totalDuration = 60; // 60-second highlight reel
  let currentTime = 14;
  let playbackRate = 1;
  let timerInterval = null;

  function updateScrubber() {
    const percent = (currentTime / totalDuration) * 100;
    if (scrubberProgress) scrubberProgress.style.width = `${percent}%`;
    if (timecodeCurrent) {
      const mins = Math.floor(currentTime / 60).toString().padStart(2, '0');
      const secs = Math.floor(currentTime % 60).toString().padStart(2, '0');
      timecodeCurrent.textContent = `${mins}:${secs}`;
    }
  }

  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      currentTime += 0.5 * playbackRate;
      if (currentTime >= totalDuration) {
        currentTime = 0;
      }
      updateScrubber();
    }, 500);
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    playSFX('click');

    if (isPlaying) {
      if (reelVideo.tagName === 'VIDEO') {
        reelVideo.play().catch(() => {});
      }
      bigPlayBtn.classList.add('hidden');
      playPauseBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
      startTimer();
    } else {
      if (reelVideo.tagName === 'VIDEO') {
        reelVideo.pause();
      }
      bigPlayBtn.classList.remove('hidden');
      playPauseBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
      clearInterval(timerInterval);
    }
  }

  bigPlayBtn?.addEventListener('click', togglePlay);
  playPauseBtn?.addEventListener('click', togglePlay);

  // Scrubber interactive click / scrub
  if (scrubberTrack) {
    scrubberTrack.addEventListener('click', (e) => {
      const rect = scrubberTrack.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      currentTime = ratio * totalDuration;
      updateScrubber();
      if (reelVideo.tagName === 'VIDEO' && reelVideo.duration) {
        reelVideo.currentTime = ratio * reelVideo.duration;
      }
      playSFX('tick');
    });
  }

  // Mute / Unmute
  if (muteBtn) {
    let isMuted = false;
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      if (reelVideo.tagName === 'VIDEO') reelVideo.muted = isMuted;
      muteBtn.innerHTML = isMuted
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
      playSFX('click');
    });
  }

  // Ambient Backlight Toggle
  if (ambientToggle && ambientGlow) {
    ambientToggle.addEventListener('click', () => {
      const isActive = ambientToggle.classList.toggle('active');
      ambientGlow.classList.toggle('dimmed', !isActive);
      playSFX('click');
    });
  }

  // Playback Speed Toggle
  if (speedBtn) {
    speedBtn.addEventListener('click', () => {
      if (playbackRate === 1) {
        playbackRate = 1.5;
        speedBtn.textContent = '1.5x';
      } else if (playbackRate === 1.5) {
        playbackRate = 2;
        speedBtn.textContent = '2.0x';
      } else {
        playbackRate = 1;
        speedBtn.textContent = '1.0x';
      }
      if (reelVideo.tagName === 'VIDEO') reelVideo.playbackRate = playbackRate;
      playSFX('click');
    });
  }

  // Fullscreen Toggle
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        reelCard.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
      playSFX('click');
    });
  }

  updateScrubber();
}

/* ==========================================================================
   3. FEATURED WORK FILTERING
   ========================================================================== */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playSFX('click');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   4. PROJECT LIGHTBOX MODAL & GALLERY
   ========================================================================== */
const projectsData = [
  {
    id: 'zenith-gt',
    title: 'Zenith GT: Midnight Run',
    client: 'Zenith Motors Global',
    category: 'commercial',
    stat: '+3.4x Ad ROAS',
    aspect: '16:9',
    image: 'assets/images/commercial-zenith.jpg',
    videoType: 'commercial',
    role: 'Lead Editing • DaVinci Color Grade • Sound Design',
    turnaround: '5 Business Days',
    software: 'DaVinci Resolve Studio 19, Adobe Premiere Pro, iZotope RX',
    deliverables: '1x 60s Anamorphic Master (4K), 3x 15s Paid Social Cuts (9:16), 1x Clean Cut (1:1)',
    description: 'A dark, visceral cyberpunk commercial highlighting the launch of the Zenith GT electric supercar. Shot on Arri Alexa Mini LF in Tokyo rain, we sculpted an adrenaline-inducing narrative using custom sound effects, anamorphic lens flares, and high-contrast color grading.'
  },
  {
    id: 'deep-space',
    title: 'Deep Space 7: The Untold Mission',
    client: 'Horizon Documentaries (1.8M Subs)',
    category: 'youtube',
    stat: '84% Avg Retention',
    aspect: '16:9',
    image: 'assets/images/youtube-documentary.jpg',
    videoType: 'youtube',
    role: 'Story Architecture • Motion Design • Audio Score',
    turnaround: '6 Business Days',
    software: 'Adobe Premiere Pro, After Effects, DaVinci Resolve',
    deliverables: '1x 28-min 4K Narrative Master, 2x A/B Tested Hook Openers, Soundscape Stem Mix',
    description: 'An investigative video essay analyzing classified space program flight data. We restructured the 4-hour raw interview footage into a gripping 3-act narrative, achieving an unprecedented 84% 30-second retention rate and generating 1.9M views in 14 days.'
  },
  {
    id: 'apex-calisthenics',
    title: 'Apex Calisthenics: Unbroken Pacing',
    client: 'Gymshark Creator Lab',
    category: 'short-form',
    stat: '+4.8M Views',
    aspect: '9:16',
    image: 'assets/images/short-viral.jpg',
    videoType: 'short',
    role: 'Viral Hook Crafting • Sound Design • Kinetic FX',
    turnaround: '24 Hours',
    software: 'CapCut Pro, Adobe Premiere Pro, After Effects',
    deliverables: '1x 45s High-Energy Vertical Master, 2x Alternative Hook Intros',
    description: 'A viral short-form fitness reel crafted with frame-accurate bass drops, subtle speed ramps, and retention zooms. The first 3 seconds were meticulously calibrated to stop thumb-scrolling, resulting in 4.8 million views and 65,000+ shares across TikTok and Instagram Reels.'
  },
  {
    id: 'nova-tech',
    title: 'Nova Smartphone: The Next Era',
    client: 'Nova Tech Media (820k Subs)',
    category: 'short-form',
    stat: '91% Hook Retention',
    aspect: '9:16',
    image: 'assets/images/short-tech.jpg',
    videoType: 'short',
    role: 'Kinetic Captions • SFX Synthesis • Motion Graphics',
    turnaround: '36 Hours',
    software: 'Adobe After Effects, Premiere Pro, Illustrator',
    deliverables: '1x 50s Vertical Review Cut, Custom Holographic UI Graphics Pack',
    description: 'High-production tech unboxing formatted for YouTube Shorts and TikTok. Features custom holographic HUD overlays, crisp mechanical switch sound effects, and kinetic subtitles that drove a 340% increase in comment engagement.'
  },
  {
    id: 'cinematic-reel',
    title: 'Visual Architecture 2026 Director Cut',
    client: 'Director Showcase',
    category: 'commercial',
    stat: 'Staff Pick Award',
    aspect: '16:9',
    image: 'assets/images/hero-reel.jpg',
    videoType: 'commercial',
    role: 'Creative Direction • Color Grading • Audio Mix',
    turnaround: '4 Days',
    software: 'DaVinci Resolve, Premiere Pro, Fairlight',
    deliverables: '60s Cinema 4K Master, Prores 422HQ',
    description: 'A tour de force showcase combining commercials, music videos, and cinematic documentaries edited with rhythmic cadence, seamless invisible match cuts, and rich film emulation.'
  },
  {
    id: 'creator-economy',
    title: 'The Algorithm Shift: How Views Disappeared',
    client: 'Alex Tech Media',
    category: 'youtube',
    stat: '+310% Watch Time',
    aspect: '16:9',
    image: 'assets/images/youtube-documentary.jpg',
    videoType: 'youtube',
    role: 'Editorial • Motion Graphics • Sound Mix',
    turnaround: '4 Days',
    software: 'Adobe Premiere Pro, After Effects',
    deliverables: '1x 18-min 4K Master, Custom Thumbnails',
    description: 'Deep dive into YouTube retention analytics with animated data charts, dynamic zoom punch-ins, and bespoke riser transitions that prevented viewer fatigue.'
  }
];

function initLightboxModal() {
  const modal = document.getElementById('lightboxModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const modalPlayerWrap = document.getElementById('modalPlayerWrap');
  const modalTitle = document.getElementById('modalTitle');
  const modalClient = document.getElementById('modalClient');
  const modalStat = document.getElementById('modalStat');
  const modalDesc = document.getElementById('modalDesc');
  const modalRole = document.getElementById('modalRole');
  const modalTurnaround = document.getElementById('modalTurnaround');
  const modalSoftware = document.getElementById('modalSoftware');
  const modalDeliverables = document.getElementById('modalDeliverables');
  const modalInquireBtn = document.getElementById('modalInquireBtn');

  if (!modal) return;

  let currentProjectIndex = 0;

  function openProject(index) {
    currentProjectIndex = index;
    const project = projectsData[index];
    if (!project) return;

    modalTitle.textContent = project.title;
    modalClient.textContent = project.client;
    modalStat.textContent = project.stat;
    modalDesc.textContent = project.description;
    modalRole.textContent = project.role;
    modalTurnaround.textContent = project.turnaround;
    modalSoftware.textContent = project.software;
    modalDeliverables.textContent = project.deliverables;

    // Set player container aspect ratio
    if (project.aspect === '9:16') {
      modalPlayerWrap.classList.add('aspect-vertical');
    } else {
      modalPlayerWrap.classList.remove('aspect-vertical');
    }

    // Video/Poster representation inside modal
    modalPlayerWrap.innerHTML = `
      <div style="position: relative; width: 100%; height: 100%;">
        <img src="${project.image}" alt="${project.title}" class="modal-player-element" style="object-fit: cover;">
        <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;">
          <div style="width: 68px; height: 68px; border-radius: 50%; background: rgba(139, 92, 246, 0.95); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 30px rgba(139, 92, 246, 0.8); cursor: pointer;" onclick="alert('Demo Reel Stream Active: Playing ${project.title} in 4K')">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFFFFF" style="transform: translateX(2px);"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
        <div style="position: absolute; bottom: 1rem; left: 1.25rem; background: rgba(10, 13, 20, 0.85); padding: 0.35rem 0.85rem; border-radius: 999px; font-size: 0.75rem; font-family: var(--font-mono); color: #FFFFFF; border: 1px solid rgba(255,255,255,0.2);">
          ● 4K PRORES MASTER • ${project.aspect}
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playSFX('swoosh');
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    playSFX('click');
  }

  // Bind clicks on project cards
  document.querySelectorAll('.project-card').forEach((card, index) => {
    card.addEventListener('click', () => {
      openProject(index % projectsData.length);
    });
  });

  closeBtn?.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowRight') {
      openProject((currentProjectIndex + 1) % projectsData.length);
    } else if (e.key === 'ArrowLeft') {
      openProject((currentProjectIndex - 1 + projectsData.length) % projectsData.length);
    }
  });

  if (modalInquireBtn) {
    modalInquireBtn.addEventListener('click', () => {
      closeModal();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* ==========================================================================
   5. INTERACTIVE BEFORE & AFTER COLOR GRADING SLIDER
   ========================================================================== */
function initColorGradingSlider() {
  const container = document.getElementById('gradingComparison');
  const divider = document.getElementById('sliderDivider');
  const rawLayer = document.getElementById('gradingRaw');

  if (!container || !divider || !rawLayer) return;

  let isDragging = false;

  function setSliderPosition(x) {
    const rect = container.getBoundingClientRect();
    let pos = (x - rect.left) / rect.width;
    pos = Math.max(0.05, Math.min(0.95, pos));
    const percent = pos * 100;

    divider.style.left = `${percent}%`;
    rawLayer.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
  }

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Support for mobile
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* ==========================================================================
   6. ANIMATED COUNTER METRICS
   ========================================================================== */
function initMetricCounters() {
  const counterElements = document.querySelectorAll('.counter-val');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counterElements.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          const duration = 1800;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.textContent = target;
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.getElementById('metrics');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}

/* ==========================================================================
   7. TESTIMONIALS SLIDER
   ========================================================================== */
function initTestimonialsSlider() {
  const slides = document.querySelectorAll('.testimonial-item');
  const prevBtn = document.getElementById('testPrevBtn');
  const nextBtn = document.getElementById('testNextBtn');
  const dotsContainer = document.getElementById('sliderDots');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoTimer = null;

  // Generate pagination dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `dot-btn ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        playSFX('click');
      });
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.dot-btn').forEach(d => d.classList.remove('active'));

    currentIndex = (index + slides.length) % slides.length;
    slides[currentIndex].classList.add('active');
    const dots = document.querySelectorAll('.dot-btn');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
  }

  prevBtn?.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
    playSFX('click');
  });

  nextBtn?.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
    playSFX('click');
  });

  function startAutoplay() {
    autoTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 6000);
  }

  startAutoplay();

  const sliderBox = document.querySelector('.testimonials-slider-box');
  sliderBox?.addEventListener('mouseenter', () => clearInterval(autoTimer));
  sliderBox?.addEventListener('mouseleave', () => startAutoplay());
}

/* ==========================================================================
   8. BOOKING FORM & INTERACTIVE SUBMISSION
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  const toast = document.getElementById('toastNotice');
  const toastMessage = document.getElementById('toastMessage');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Loading state
    submitBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s infinite linear;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
        <path d="M12 2a10 10 0 0 1 10 10"/>
      </svg>
      Encrypting Brief & Sending...
    `;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = `✓ Project Brief Received!`;
      submitBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
      playSFX('success');

      // Show toast
      if (toast) {
        if (toastMessage) toastMessage.textContent = 'Thanks! Alex will review your footage and respond within 4 hours.';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 5000);
      }

      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 4000);
    }, 1200);
  });
}

/* ==========================================================================
   9. 1-CLICK EMAIL COPY & TOOLTIP
   ========================================================================== */
function initEmailCopy() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyStatus = document.getElementById('copyStatus');
  const emailText = 'alex@riveraedits.com';

  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(emailText).then(() => {
      playSFX('success');
      if (copyStatus) copyStatus.textContent = 'Copied to Clipboard! ✓';
      copyBtn.style.borderColor = 'var(--accent-emerald)';

      setTimeout(() => {
        if (copyStatus) copyStatus.textContent = 'Click to Copy';
        copyBtn.style.borderColor = '';
      }, 2500);
    }).catch(() => {
      window.location.href = `mailto:${emailText}`;
    });
  });
}

/* ==========================================================================
   10. LIVE STUDIO CLOCK WIDGET
   ========================================================================== */
function initLiveClock() {
  const clockElement = document.getElementById('liveClock');
  if (!clockElement) return;

  function updateClock() {
    const now = new Date();
    // Studio location formatted time (EST / UTC-5 or local)
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    clockElement.textContent = `${now.toLocaleTimeString([], options)} EST`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   11. SERVICE SELECTION PRE-FILL CTA
   ========================================================================== */
function initServiceSelectCTA() {
  const serviceButtons = document.querySelectorAll('.service-select-btn');
  const projectTypeSelect = document.getElementById('projectType');

  serviceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceTarget = btn.getAttribute('data-service');
      if (projectTypeSelect && serviceTarget) {
        projectTypeSelect.value = serviceTarget;
      }
      playSFX('swoosh');
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   12. SYNTHESIZED WEB AUDIO FX (No external audio file required)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioFX() {
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggleBtn.innerHTML = soundEnabled 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/></svg>`;
      soundToggleBtn.setAttribute('title', soundEnabled ? 'Audio Effects On' : 'Audio Effects Muted');
      if (soundEnabled) playSFX('click');
    });
  }
}

function playSFX(type) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'tick') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.02);
      osc.start(now);
      osc.stop(now + 0.02);
    } else if (type === 'swoosh') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.12);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (err) {
    // AudioContext blocked or unsupported, silent fail
  }
}
