// ===== DR DINO FITNESS & GYM — Script =====

// ===== PRELOADER =====
window.addEventListener("load", () => {
  setTimeout(() => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.classList.add("hidden");
    }
  }, 1200);
  animateCounters();
});

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById("particleCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedY = -Math.random() * 0.3 - 0.1;
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.3 + 0.05;
      this.color =
        Math.random() > 0.6
          ? "rgba(0, 0, 0," + this.opacity + ")"
          : "rgba(51, 51, 51," + this.opacity + ")";
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      if (this.y < -10) this.reset();
      if (this.y < -10) this.y = canvas.height + 10;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // Create particles
  for (let i = 0; i < 60; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// ===== CURSOR GLOW =====
const glow = document.getElementById("cursorGlow");
if (glow) {
  document.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById("navbar");
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  if (navbar) {
    if (currentScroll > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  lastScroll = currentScroll;
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const closeMenu = document.getElementById("closeMenu");

if (hamburger && mobileMenu && closeMenu) {
  hamburger.addEventListener("click", () => {
    mobileMenu.classList.add("active");
  });
  closeMenu.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
  });
}

function closeMobile() {
  if (mobileMenu) {
    mobileMenu.classList.remove("active");
  }
}

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("active");
        }, i * 120);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
);

revealElements.forEach((el) => revealObserver.observe(el));

// ===== ABOUT EXPERIENCE BAR =====
const barFill = document.querySelector(".bar-fill");
if (barFill) {
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          barFill.classList.add("active");
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );
  barObserver.observe(barFill.closest(".about-exp-bar"));
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll("[data-count]");
  counters.forEach((counter) => {
    const target = parseInt(counter.dataset.count);
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      if (target >= 1000) {
        counter.textContent = current.toLocaleString() + "+";
      } else {
        counter.textContent = current + "+";
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }
    // Delay start for visual effect
    setTimeout(() => requestAnimationFrame(updateCounter), 800);
  });
}

// ===== REVIEWS INFINITE SCROLL =====
// Removed innerHTML duplication to avoid breaking inline script references

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Collect values
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const interest = document.getElementById("interest").value;
    const message = document.getElementById("message").value;

    const btn = document.getElementById("submitBtn");
    const originalText = btn.textContent;

    // The UX
    btn.textContent = "Connecting to WhatsApp...";
    btn.style.opacity = "0.7";
    btn.disabled = true;

    // The Backup: Silently send to Netlify Forms
    const formData = new URLSearchParams();
    formData.append("form-name", "Gym-Leads");
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("interest", interest);
    formData.append("message", message);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    }).catch((error) => console.error("Form submission error:", error));

    setTimeout(() => {
      // The Formatting
      const waMessage = `🦖 DR DINO GYM INQUIRY\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n✉️ Email: ${email}\n🏋️ Interest: ${interest}\n🎯 Goal: ${message}`;
      const encodedMessage = encodeURIComponent(waMessage);

      // The Redirection
      const waUrl = `https://wa.me/918838344590?text=${encodedMessage}`;
      window.open(waUrl, "_blank");

      contactForm.reset();

      btn.textContent = originalText;
      btn.style.opacity = "1";
      btn.disabled = false;
    }, 1200);
  });
}

// ===== PARALLAX EFFECT ON HERO =====
window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;
  const heroVisual = document.querySelector(".hero-visual");
  if (heroVisual && scrolled < window.innerHeight) {
    heroVisual.style.transform = `translateY(${scrolled * 0.08}px)`;
  }
});

// ===== ACTIVE NAV LINK HIGHLIGHT =====
const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY + 200;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.style.color = "var(--gold)";
      } else {
        link.style.color = "";
      }
    }
  });
});

// ===== TILT EFFECT ON CARDS =====
document.querySelectorAll(".infra-card, .achiever-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// ===== FOUNDERS CAROUSEL =====
function initFoundersCarousel() {
  const carousel = document.getElementById("foundersCarousel");
  const imageStage = document.getElementById("foundersImageStage");
  const textPanel = document.getElementById("foundersTextPanel");
  const nameEl = document.getElementById("foundersName");
  const roleEl = document.getElementById("foundersRole");
  const quoteEl = document.getElementById("foundersQuote");
  const prevBtn = document.getElementById("foundersPrev");
  const nextBtn = document.getElementById("foundersNext");

  if (!carousel || !imageStage) return;

  let savedFoundersData = null;
  try {
    savedFoundersData = JSON.parse(
      localStorage.getItem("drdino_founders_data"),
    );
  } catch (_) {}

  const defaultFounders = [
    {
      name: "Mr Rubesh",
      role: "Founder & Head Coach",
      quote:
        "A dedicated fitness professional with a vision to revolutionize the training experience. With over a decade of mastery in bodybuilding and nutrition, he has laid the foundation for DR DINO's elite standards.",
    },
    {
      name: "The Strategist",
      role: "Founder & Strategic Lead",
      quote:
        "Driving the strategic growth and excellence of DR DINO. His commitment to providing a world-class environment ensures that every athlete has the tools needed to surpass their own limits.",
    },
  ];

  const founders =
    savedFoundersData && savedFoundersData.length
      ? savedFoundersData
      : defaultFounders;

  const images = Array.from(
    imageStage.querySelectorAll(".founders-carousel-img"),
  );

  // Load any saved founder images from CMS
  images.forEach((img, idx) => {
    const savedImg = localStorage.getItem("drdino_cms_founder_img_" + idx);
    if (savedImg) img.src = savedImg;
  });

  const total = founders.length;
  let activeIndex = 0;

  window.foundersCarouselState = {
    founders,
    getActiveIndex: () => activeIndex,
    updateActiveFounder: (field, value) => {
      if (founders[activeIndex]) {
        founders[activeIndex][field] = value;
        localStorage.setItem("drdino_founders_data", JSON.stringify(founders));
      }
    },
  };
  let autoplayTimer = null;

  function calculateGap(width) {
    const minWidth = 320;
    const maxWidth = 1456;
    const minGap = width <= 480 ? 36 : 60;
    const maxGap = 86;
    if (width <= minWidth) return minGap;
    if (width >= maxWidth)
      return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
    return (
      minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth))
    );
  }

  function updateLayoutVars() {
    const width = imageStage.offsetWidth;
    const gap = calculateGap(width);
    imageStage.style.setProperty("--founders-gap", `${gap}px`);
    imageStage.style.setProperty("--founders-stick-up", `${gap * 0.8}px`);
  }

  function updateImages() {
    images.forEach((img, index) => {
      img.classList.remove("is-active", "is-left", "is-right", "is-hidden");
      const isActive = index === activeIndex;
      const isLeft = index === (activeIndex - 1 + total) % total;
      const isRight = index === (activeIndex + 1) % total;

      if (isActive) img.classList.add("is-active");
      else if (isLeft) {
        img.classList.add("is-left");
        img.style.setProperty("--founders-side", "-1");
      } else if (isRight) {
        img.classList.add("is-right");
        img.style.setProperty("--founders-side", "1");
      } else img.classList.add("is-hidden");
    });
  }

  function renderQuote(text) {
    quoteEl.innerHTML = "";
    text.split(" ").forEach((word, i) => {
      const span = document.createElement("span");
      span.className = "quote-word";
      span.style.animationDelay = `${0.025 * i}s`;
      span.textContent = `${word} `;
      quoteEl.appendChild(span);
    });
  }

  function updateText() {
    const founder = founders[activeIndex];
    textPanel.classList.add("is-changing");

    window.setTimeout(() => {
      nameEl.textContent = founder.name;
      roleEl.textContent = founder.role;
      renderQuote(founder.quote);
      textPanel.classList.remove("is-changing");
    }, 180);
  }

  function goTo(index, fromAutoplay = false) {
    activeIndex = (index + total) % total;
    updateLayoutVars();
    updateImages();
    updateText();
    if (!fromAutoplay) resetAutoplay();
  }

  function next(fromAutoplay = false) {
    goTo(activeIndex + 1, fromAutoplay);
  }

  function prev() {
    goTo(activeIndex - 1);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => next(true), 5000);
  }

  prevBtn?.addEventListener("click", () => prev());
  nextBtn?.addEventListener("click", () => next());

  carousel.addEventListener("mouseenter", () => clearInterval(autoplayTimer));
  carousel.addEventListener("mouseleave", resetAutoplay);

  window.addEventListener("keydown", (e) => {
    const inView =
      carousel.getBoundingClientRect().top < window.innerHeight &&
      carousel.getBoundingClientRect().bottom > 0;
    if (!inView) return;
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });

  window.addEventListener("resize", () => {
    updateLayoutVars();
    updateImages();
  });

  // Touch swipe support for mobile
  let touchStartX = 0;
  imageStage.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true },
  );

  imageStage.addEventListener(
    "touchend",
    (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) < 40) return;
      if (diff > 0) prev();
      else next();
    },
    { passive: true },
  );

  updateLayoutVars();
  updateImages();
  renderQuote(founders[0].quote);
  resetAutoplay();
}

initFoundersCarousel();

// ===== REVIEWS STACKED CAROUSEL =====
function initReviewsCarousel() {
  const carousel = document.getElementById("reviewsCarousel");
  const stage = document.getElementById("reviewsCarouselStage");
  const dotsWrap = document.getElementById("reviewCarouselDots");
  const prevBtn = document.getElementById("reviewCarouselPrev");
  const nextBtn = document.getElementById("reviewCarouselNext");

  if (!carousel || !stage || !dotsWrap) return;

  const cards = Array.from(stage.querySelectorAll(".review-card"));
  const total = cards.length;
  let currentIndex = 0;
  let exitX = 0;
  let isAnimating = false;
  let autoTimer = null;

  let dragStartX = 0;
  let dragCurrentX = 0;
  let isDragging = false;

  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "review-carousel-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Go to review ${i + 1}`);
    dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.querySelectorAll(".review-carousel-dot"));

  function stackIndex(offset) {
    return (currentIndex + offset) % total;
  }

  function getCurrentCard() {
    return cards[currentIndex];
  }

  function updateStack() {
    cards.forEach((card, index) => {
      card.classList.remove(
        "review-card--current",
        "review-card--stack-1",
        "review-card--stack-2",
        "review-card--hidden",
        "review-card--exiting-left",
        "review-card--exiting-right",
      );
      card.style.transform = "";
      card.style.opacity = "";

      if (index === currentIndex) {
        card.classList.add("review-card--current");
      } else if (index === stackIndex(1)) {
        card.classList.add("review-card--stack-1");
      } else if (index === stackIndex(2)) {
        card.classList.add("review-card--stack-2");
      } else {
        card.classList.add("review-card--hidden");
      }
    });

    dots.forEach((dot, i) => {
      const active = i === currentIndex;
      dot.classList.toggle("active", active);
      dot.setAttribute("aria-selected", active ? "true" : "false");
    });

    applyDragTransform();
  }

  function applyDragTransform() {
    const current = getCurrentCard();
    if (!current || !isDragging) return;

    const rotate = exitX / 20;
    current.style.transform = `translate(${exitX}px, 0) scale(1) rotate(${rotate}deg)`;
    current.style.opacity = String(Math.max(0.4, 1 - Math.abs(exitX) / 400));
  }

  function clearDragStyles() {
    const current = getCurrentCard();
    if (current) {
      current.style.transform = "";
      current.style.opacity = "";
    }
    exitX = 0;
    isDragging = false;
  }

  function advance(direction = 1) {
    if (isAnimating) return;
    isAnimating = true;

    const current = getCurrentCard();
    const outClass =
      direction > 0
        ? "review-card--exiting-right"
        : "review-card--exiting-left";
    const outX = direction > 0 ? 120 : -120;

    if (current) {
      current.classList.add(outClass);
      current.style.transform = `translate(${outX}px, 0) rotate(${outX / 20}deg)`;
      current.style.opacity = "0";
    }

    window.setTimeout(() => {
      currentIndex = (currentIndex + direction + total) % total;
      clearDragStyles();
      updateStack();
      isAnimating = false;
      resetAuto();
    }, 220);
  }

  function next() {
    advance(1);
  }

  function prev() {
    advance(-1);
  }

  function goTo(index) {
    if (isAnimating || index === currentIndex) return;
    clearDragStyles();
    currentIndex = ((index % total) + total) % total;
    updateStack();
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      if (!isDragging && !isAnimating) next();
    }, 5000);
  }

  function onPointerDown(e) {
    if (isAnimating) return;
    const current = getCurrentCard();
    if (!current || !current.classList.contains("review-card--current")) return;
    if (e.target.closest(".review-card-arrow")) return;

    isDragging = true;
    dragStartX = e.clientX;
    dragCurrentX = dragStartX;
    current.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    dragCurrentX = e.clientX;
    exitX = dragCurrentX - dragStartX;
    applyDragTransform();
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    const current = getCurrentCard();
    if (current) {
      try {
        current.releasePointerCapture(e.pointerId);
      } catch (_) {
        /* ignore */
      }
    }

    if (Math.abs(exitX) > 100) {
      const direction = exitX < 0 ? 1 : -1;
      isDragging = false;
      advance(direction);
    } else {
      clearDragStyles();
      updateStack();
    }

    isDragging = false;
    resetAuto();
  }

  prevBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    prev();
  });
  nextBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    next();
  });

  stage.addEventListener("pointerdown", onPointerDown);
  stage.addEventListener("pointermove", onPointerMove);
  stage.addEventListener("pointerup", onPointerUp);
  stage.addEventListener("pointercancel", onPointerUp);

  carousel.addEventListener("mouseenter", () => clearInterval(autoTimer));
  carousel.addEventListener("mouseleave", resetAuto);

  updateStack();
  resetAuto();
}

initReviewsCarousel();

// ===== GOLD SHIMMER ON SECTION TITLES =====
const sectionTitles = document.querySelectorAll(".section-title");
const shimmerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "goldShimmer 3s ease-in-out";
        shimmerObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);
sectionTitles.forEach((el) => shimmerObserver.observe(el));

// ===== DYNAMIC CLOUDINARY FOUNDERS & CLASSES LOADING =====
async function loadDynamicCloudinarySections() {
  const cloudName = "ddq8m4oec";

  // 1. Founder Section Images
  const founderImages = document.querySelectorAll(".founders-carousel-img");
  if (founderImages.length > 0) {
    try {
      const res = await fetch(
        `https://res.cloudinary.com/${cloudName}/image/list/gym_founders.json`,
      );
      if (res.ok) {
        const data = await res.json();
        if (data.resources && data.resources.length > 0) {
          data.resources.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at),
          );
          data.resources.forEach((item, idx) => {
            if (founderImages[idx]) {
              founderImages[idx].src =
                `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto:good,w_900,c_limit/v${item.version}/${item.public_id}.${item.format}`;
            }
          });
        }
      }
    } catch (_) {}
  }

  // 2. Classes Section Images
  const classImages = document.querySelectorAll(".classes-img-wrap img");
  if (classImages.length > 0) {
    try {
      const res = await fetch(
        `https://res.cloudinary.com/${cloudName}/image/list/gym_classes.json`,
      );
      if (res.ok) {
        const data = await res.json();
        if (data.resources && data.resources.length > 0) {
          data.resources.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at),
          );
          data.resources.forEach((item, idx) => {
            if (classImages[idx]) {
              classImages[idx].src =
                `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto:good,w_800,c_limit/v${item.version}/${item.public_id}.${item.format}`;
            }
          });
        }
      }
    } catch (_) {}
  }
}
document.addEventListener("DOMContentLoaded", loadDynamicCloudinarySections);

// ===== ON-SITE LIVE CMS & ADMIN ENGINE =====
const CLOUDINARY_CLOUD_NAME = "ddq8m4oec";
const CLOUDINARY_UPLOAD_PRESET = "gym_admin_upload";
let activeUploadTarget = null;

// Universal Toast for Admin & Site
function showLiveToast(message, duration = 3500) {
  let toast = document.getElementById("liveAdminToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "liveAdminToast";
    toast.className = "live-admin-toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = message;
  toast.classList.add("active");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove("active");
  }, duration);
}

// 1. Client-Side Image Compressor (300KB - 350KB)
async function compressImageToTarget(file) {
  return new Promise((resolve) => {
    if (file.size <= 360 * 1024 && !file.type.includes("png")) {
      resolve({
        blob: file,
        originalSize: file.size,
        compressedSize: file.size,
      });
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const maxDim = 1600;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        let minQ = 0.55;
        let maxQ = 0.88;

        function tryQuality(q) {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve({
                  blob: file,
                  originalSize: file.size,
                  compressedSize: file.size,
                });
                return;
              }
              const targetMax = 350 * 1024;
              if (blob.size <= targetMax || q <= minQ + 0.05) {
                resolve({
                  blob: blob,
                  originalSize: file.size,
                  compressedSize: blob.size,
                });
              } else {
                const nextQ = Math.max(minQ, q - 0.12);
                tryQuality(nextQ);
              }
            },
            "image/jpeg",
            q,
          );
        }

        tryQuality(maxQ);
      };
      img.onerror = () =>
        resolve({
          blob: file,
          originalSize: file.size,
          compressedSize: file.size,
        });
    };
    reader.onerror = () =>
      resolve({
        blob: file,
        originalSize: file.size,
        compressedSize: file.size,
      });
  });
}

// 2. Trigger In-Place Upload
window.triggerInlineAdminUpload = function (targetType) {
  activeUploadTarget = targetType;
  let input = document.getElementById("inlineAdminFileInput");
  if (!input) {
    input = document.createElement("input");
    input.type = "file";
    input.id = "inlineAdminFileInput";
    input.style.display = "none";
    input.accept =
      "image/png,image/jpeg,image/webp,video/mp4,video/quicktime,video/webm";
    input.addEventListener("change", handleInlineFilePicked);
    document.body.appendChild(input);
  }
  input.multiple = targetType === "gallery";
  input.value = "";
  input.click();
};

// 3. Handle File Upload Directly to Cloudinary
async function handleInlineFilePicked(e) {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;

  const target = activeUploadTarget;

  for (const file of files) {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      showLiveToast("⚠️ Only images and videos are supported.");
      continue;
    }

    let uploadBlob = file;
    let sizeMsg = "";

    if (isImage) {
      showLiveToast(`⚡ Auto-resizing ${file.name} to 300-350KB...`, 6000);
      const comp = await compressImageToTarget(file);
      uploadBlob = comp.blob;
      const origKb = Math.round(comp.originalSize / 1024);
      const compKb = Math.round(comp.compressedSize / 1024);
      sizeMsg = `(${origKb}KB ➔ ${compKb}KB)`;
    } else {
      showLiveToast(`🎬 Preparing video ${file.name}...`, 6000);
    }

    // Determine Cloudinary folder and tag
    let folder = "gallery";
    let tag = "gym_gallery";
    if (target === "hero_bg") {
      folder = "hero";
      tag = "gym_hero_bg";
    } else if (target === "founders") {
      folder = "founders";
      tag = "gym_founders";
    } else if (target.startsWith("class_")) {
      folder = "classes";
      tag = "gym_classes";
    }

    showLiveToast(`⬆️ Uploading to Cloudinary ${sizeMsg}...`, 8000);

    const formData = new FormData();
    formData.append("file", uploadBlob, file.name);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", folder);
    formData.append("tags", tag);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (res.ok && data.secure_url) {
        const secureUrl = data.secure_url;

        // Apply immediately to current view and save to localStorage
        if (target === "hero_bg") {
          const heroBg = document.querySelector(".hero-bg");
          if (heroBg) {
            heroBg.style.backgroundImage = `url('${secureUrl}')`;
            heroBg.style.backgroundPosition = "top center";
          }
          localStorage.setItem("drdino_cms_hero_bg", secureUrl);
          showLiveToast("✅ Hero background updated live!");
        } else if (target === "founders") {
          const stage = document.getElementById("foundersImageStage");
          const activeIndex = window.foundersCarouselState
            ? window.foundersCarouselState.getActiveIndex()
            : 0;
          if (stage) {
            const activeImg =
              stage.querySelector(
                `.founders-carousel-img[data-index="${activeIndex}"]`,
              ) || stage.querySelector(".founders-carousel-img");
            if (activeImg) {
              activeImg.src = secureUrl;
              activeImg.style.objectPosition = "top center";
            }
          }
          localStorage.setItem(
            "drdino_cms_founder_img_" + activeIndex,
            secureUrl,
          );
          showLiveToast(`✅ Founder photo updated live!`);
        } else if (target === "class_cardio") {
          const img = document.getElementById("classCardioImg");
          if (img) {
            img.src = secureUrl;
            img.style.objectPosition = "top center";
          }
          localStorage.setItem("drdino_cms_class_cardio_img", secureUrl);
          showLiveToast("✅ Cardio class photo updated live!");
        } else if (target === "class_strength") {
          const img = document.getElementById("classStrengthImg");
          if (img) {
            img.src = secureUrl;
            img.style.objectPosition = "top center";
          }
          localStorage.setItem("drdino_cms_class_strength_img", secureUrl);
          showLiveToast("✅ Strength training photo updated live!");
        } else if (target === "gallery") {
          showLiveToast("✅ Uploaded to public gallery successfully!");
          // If on gallery page, refresh gallery items
          if (typeof loadMedia === "function") loadMedia();
        }
      } else {
        showLiveToast(
          `❌ Upload failed: ${data.error?.message || "Error"}`,
          4000,
        );
      }
    } catch (err) {
      console.error(err);
      showLiveToast("❌ Network error during upload.", 4000);
    }
  }
}

// 4. Activate Live Admin Mode
function activateLiveAdminMode(isFirstActivation = false) {
  localStorage.setItem("drdino_admin_mode", "true");
  document.body.classList.add("admin-mode-active");

  // Inject top admin bar if not already present
  if (!document.getElementById("liveAdminBar")) {
    const bar = document.createElement("div");
    bar.id = "liveAdminBar";
    bar.className = "live-admin-bar";
    bar.innerHTML = `
      <div class="admin-bar-left">
       
        <span class="admin-bar-title"> LIVE CMS</span>
        <span class="admin-bar-hint"> Click any outlined text to edit •  Tap buttons to upload</span>
      </div>
      <div class="admin-bar-right">
        <button type="button" class="admin-bar-btn save-btn" onclick="saveAllLiveContent(true)"> Save Changes</button>
        <button type="button" class="admin-bar-btn exit-btn" onclick="deactivateLiveAdminMode()"> Exit Admin</button>
      </div>
    `;
    document.body.prepend(bar);
  }

  // Make all data-editable fields live editable
  document.querySelectorAll('[data-editable="true"]').forEach((el) => {
    el.contentEditable = "true";
    el.setAttribute("spellcheck", "false");

    el.oninput = () => {
      const key = el.dataset.cmsKey;
      if (key) {
        if (key === "hero_badge") {
          const inner = el.querySelector(".editable-text-inner");
          localStorage.setItem(
            "drdino_cms_" + key,
            inner ? inner.innerHTML : el.innerHTML,
          );
        } else if (
          key === "founder_name" ||
          key === "founder_role" ||
          key === "founder_quote"
        ) {
          const field = key.replace("founder_", "");
          if (window.foundersCarouselState) {
            window.foundersCarouselState.updateActiveFounder(
              field,
              el.innerText.trim(),
            );
          }
        } else {
          localStorage.setItem("drdino_cms_" + key, el.innerHTML);
        }
      }
    };
  });

  if (isFirstActivation) {
    showLiveToast(
      "🛡️ Admin Mode Active! You can now edit text and upload photos live.",
      4500,
    );
  }
}

// 5. Deactivate Live Admin Mode
function deactivateLiveAdminMode() {
  localStorage.removeItem("drdino_admin_mode");
  document.body.classList.remove("admin-mode-active");
  const bar = document.getElementById("liveAdminBar");
  if (bar) bar.remove();

  document.querySelectorAll('[data-editable="true"]').forEach((el) => {
    el.contentEditable = "false";
  });

  showLiveToast("🚪 Admin Mode Exited. Normal visitor view active.", 3000);
}

// 6. Save All Live Content
window.saveAllLiveContent = function (showNotice = false) {
  document.querySelectorAll('[data-editable="true"]').forEach((el) => {
    const key = el.dataset.cmsKey;
    if (key) {
      if (key === "hero_badge") {
        const inner = el.querySelector(".editable-text-inner");
        localStorage.setItem(
          "drdino_cms_" + key,
          inner ? inner.innerHTML : el.innerHTML,
        );
      } else if (
        key !== "founder_name" &&
        key !== "founder_role" &&
        key !== "founder_quote"
      ) {
        localStorage.setItem("drdino_cms_" + key, el.innerHTML);
      }
    }
  });
  if (showNotice) {
    showLiveToast(
      "💾 All texts and photos are saved and live for all visitors!",
      3000,
    );
  }
};

// 7. Load Saved CMS Content on Every Page Load (For ALL Visitors)
function loadSavedCMSContent() {
  // Hero Background
  const savedHeroBg = localStorage.getItem("drdino_cms_hero_bg");
  if (savedHeroBg) {
    const heroBg = document.querySelector(".hero-bg");
    if (heroBg) {
      heroBg.style.backgroundImage = `url('${savedHeroBg}')`;
      heroBg.style.backgroundPosition = "top center";
    }
  }

  // Restore Text Content
  document.querySelectorAll('[data-editable="true"]').forEach((el) => {
    const key = el.dataset.cmsKey;
    if (key) {
      const saved = localStorage.getItem("drdino_cms_" + key);
      if (saved) {
        if (key === "hero_badge") {
          const inner = el.querySelector(".editable-text-inner");
          if (inner) inner.innerHTML = saved;
          else
            el.innerHTML = `<span class="dot"></span><span class="editable-text-inner">${saved}</span>`;
        } else if (
          key !== "founder_name" &&
          key !== "founder_role" &&
          key !== "founder_quote"
        ) {
          el.innerHTML = saved;
        }
      }
    }
  });

  // Restore Class Images
  const savedCardio = localStorage.getItem("drdino_cms_class_cardio_img");
  if (savedCardio) {
    const img = document.getElementById("classCardioImg");
    if (img) {
      img.src = savedCardio;
      img.style.objectPosition = "top center";
    }
  }

  const savedStrength = localStorage.getItem("drdino_cms_class_strength_img");
  if (savedStrength) {
    const img = document.getElementById("classStrengthImg");
    if (img) {
      img.src = savedStrength;
      img.style.objectPosition = "top center";
    }
  }

  // If Admin mode was active before page reload, restore it
  if (localStorage.getItem("drdino_admin_mode") === "true") {
    activateLiveAdminMode(false);
  }
}
document.addEventListener("DOMContentLoaded", loadSavedCMSContent);

// ===== SECRET SHIELD ENTRANCE (ON-PAGE CMS UNLOCK) =====
function initSecretShield() {
  const shields = document.querySelectorAll(".secret-shield");
  const modal = document.getElementById("passkey-modal");
  const passkeyInput = document.getElementById("passkey-input");
  const desktopMenuBtn = document.getElementById("desktopMenuBtn");
  const desktopShieldDropdown = document.getElementById("desktopShieldDropdown");

  if (desktopMenuBtn && desktopShieldDropdown) {
    desktopMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isActive = desktopShieldDropdown.classList.toggle("active");
      desktopMenuBtn.classList.toggle("active", isActive);
    });

    document.addEventListener("click", (e) => {
      if (!desktopShieldDropdown.contains(e.target) && !desktopMenuBtn.contains(e.target)) {
        desktopShieldDropdown.classList.remove("active");
        desktopMenuBtn.classList.remove("active");
      }
    });
  }

  if (shields.length > 0 && modal && passkeyInput) {
    let clickCount = 0;
    let clickTimer = null;

    shields.forEach((shield) => {
      shield.addEventListener("click", (e) => {
        e.stopPropagation();
        clickCount++;

        if (clickCount === 1) {
          clickTimer = setTimeout(() => {
            clickCount = 0;
          }, 1500);
        }

        if (clickCount === 3) {
          clearTimeout(clickTimer);
          clickCount = 0;
          if (desktopShieldDropdown) desktopShieldDropdown.classList.remove("active");
          if (desktopMenuBtn) desktopMenuBtn.classList.remove("active");
          modal.classList.add("active");
          passkeyInput.focus();
        }
      });
    });

    passkeyInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        if (passkeyInput.value === "111") {
          modal.classList.remove("active");
          passkeyInput.value = "";
          activateLiveAdminMode(true);
        } else {
          alert("Access Denied");
          modal.classList.remove("active");
          passkeyInput.value = "";
        }
      }
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        passkeyInput.value = "";
      }
    });
  }
}
document.addEventListener("DOMContentLoaded", initSecretShield);

// ===== PREVENT IMAGE DOWNLOADING & RIGHT-CLICK (DESKTOP & MOBILE) =====
document.addEventListener("contextmenu", (e) => {
  if (
    e.target.closest(
      "img, video, .gallery-item-card, .founders-carousel-img, .classes-img-wrap, .lightbox-overlay, .achiever-card, .infra-slider-track",
    )
  ) {
    e.preventDefault();
    return false;
  }
});

document.addEventListener("dragstart", (e) => {
  if (e.target.closest("img, video")) {
    e.preventDefault();
    return false;
  }
});
