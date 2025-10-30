const navbar = document.querySelector(".navbar");
const mobileNavbar = document.querySelector(".navbar__mobile");
const button = document.querySelector(".burguer");
const mobileLinks = document.querySelector(".mobile__links");
const themeToggleBtn = document.getElementById("theme-toggle");

(function initTheme() {
  const root = document.documentElement;
  const storageKey = "theme";
  const getSystemPref = () => (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const saved = localStorage.getItem(storageKey);
  const theme = saved || getSystemPref();
  if (theme === 'dark') root.setAttribute('data-theme', 'dark');
  else root.removeAttribute('data-theme');

  function toggleTheme() {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      localStorage.setItem(storageKey, 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem(storageKey, 'dark');
    }
  }

  themeToggleBtn?.addEventListener('click', toggleTheme);
})();

function toggleMobileMenu() {
  const isActive = mobileNavbar.classList.toggle("active");
  if (button) {
    button.setAttribute("aria-expanded", isActive ? "true" : "false");
    button.setAttribute("aria-label", isActive ? "Fechar menu" : "Abrir menu");
  }
}

button.addEventListener("click", function () {
  toggleMobileMenu();
});

button.addEventListener("keydown", function (e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleMobileMenu();
  }
});

if (mobileLinks) {
  mobileLinks.addEventListener("click", function (e) {
    if (e.target && e.target.matches("a")) {
      if (mobileNavbar.classList.contains("active")) toggleMobileMenu();
    }
  });
}

window.addEventListener("scroll", function () {
  if (this.window.pageYOffset > 0) return navbar.classList.add("active");
  return navbar.classList.remove("active");
});

ScrollReveal().reveal(".header__left", {
  origin: "left",
  duration: 2000,
  distance: "20%",
});

ScrollReveal().reveal(".header__right", {
  origin: "right",
  duration: 2000,
  distance: "20%",
});

(function initModernProjectsCarousel() {
  const carousel = document.querySelector(".projects__carousel");
  if (!carousel) return;

  const track = carousel.querySelector(".carousel__track");
  const slides = Array.from(carousel.querySelectorAll(".carousel__slide"));
  const prevBtn = carousel.querySelector(".carousel__control.prev");
  const nextBtn = carousel.querySelector(".carousel__control.next");
  const dotsContainer = carousel.querySelector(".carousel__dots");

  let currentIndex = 0;
  let itemsPerView = 1;
  let totalPages = slides.length;
  const AUTOPLAY_INTERVAL_MS = 5000;
  let autoplayId = null;

  function getItemsPerView() {
    if (window.matchMedia("(min-width: 1024px)").matches) return 3;
    if (window.matchMedia("(min-width: 768px)").matches) return 2;
    return 1;
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    for (let i = 0; i < totalPages; i++) {
      const btn = document.createElement("button");
      btn.className = "carousel__dot";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", i === currentIndex ? "true" : "false");
      btn.addEventListener("click", () => goTo(i));
      const sr = document.createElement("span");
      sr.className = "sr-only";
      sr.textContent = `Ir para slide ${i + 1}`;
      btn.appendChild(sr);
      dotsContainer.appendChild(btn);
    }
  }

  function updateActive() {
    slides.forEach((s, i) => {
      if (i === currentIndex) s.classList.add("is-active");
      else s.classList.remove("is-active");
    });
    const dots = Array.from(dotsContainer?.children || []);
    dots.forEach((d, i) =>
      d.setAttribute("aria-selected", i === currentIndex ? "true" : "false")
    );
  }

  function updateTransform() {
    const offset = (itemsPerView - 1) / 2;
    const step = 100 / itemsPerView;
    const translate = (currentIndex - offset) * step;
    const translatePercent = -translate;
    track.style.transform = `translateX(${translatePercent}%)`;
  }

  function goTo(index) {
    const maxIndex = slides.length - 1;
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    updateTransform();
    updateActive();
  }

  function next() {
    goTo(currentIndex + 1);
  }
  function prev() {
    goTo(currentIndex - 1);
  }

  function nextLoop() {
    const maxIndex = slides.length - 1;
    if (currentIndex >= maxIndex) goTo(0);
    else goTo(currentIndex + 1);
  }
  function prevLoop() {
    const maxIndex = slides.length - 1;
    if (currentIndex <= 0) goTo(maxIndex);
    else goTo(currentIndex - 1);
  }

  prevBtn?.addEventListener("click", prevLoop);
  nextBtn?.addEventListener("click", nextLoop);
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevLoop();
    if (e.key === "ArrowRight") nextLoop();
  });

  const viewport = carousel.querySelector(".carousel__viewport");
  let startX = 0;
  let deltaX = 0;
  const threshold = 40;
  let isDragging = false;
  function onStart(e) {
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    deltaX = 0;
    isDragging = false;
  }
  function onMove(e) {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    deltaX = x - startX;
    if (Math.abs(deltaX) > 3) isDragging = true;
  }
  function onEnd() {
    if (Math.abs(deltaX) > threshold) {
      deltaX > 0 ? prev() : next();
    }
  }
  viewport?.addEventListener("touchstart", onStart, { passive: true });
  viewport?.addEventListener("touchmove", onMove, { passive: true });
  viewport?.addEventListener("touchend", onEnd);
  viewport?.addEventListener("mousedown", onStart);
  viewport?.addEventListener("mousemove", onMove);
  viewport?.addEventListener("mouseup", onEnd);

  function recalc() {
    itemsPerView = getItemsPerView();
    totalPages = slides.length;
    buildDots();
    updateTransform();
    updateActive();
  }

  window.addEventListener("resize", recalc);
  recalc();

  function stopAutoplay() {
    if (autoplayId) {
      clearInterval(autoplayId);
      autoplayId = null;
    }
  }
  function startAutoplay() {
    stopAutoplay();
    autoplayId = setInterval(() => {
      if (document.hidden) return;
      nextLoop();
    }, AUTOPLAY_INTERVAL_MS);
  }

  viewport?.addEventListener("mouseenter", stopAutoplay);
  viewport?.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", startAutoplay);

  startAutoplay();

  slides.forEach((slide) => {
    const link = slide.querySelector("a[href]");
    if (!link) return;
    slide.setAttribute("tabindex", "0");
    slide.addEventListener("click", (e) => {
      const interactive = e.target.closest("a, button");
      if (interactive || isDragging) return;
      window.open(link.href, "_blank");
    });
    slide.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.open(link.href, "_blank");
      }
    });
  });
})();
