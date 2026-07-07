/**
 * Moon Real Estate — Main Script
 */

(function () {
  "use strict";

  /* ── Mobile navigation ── */
  const navToggle = document.querySelector(".nav__toggle");
  const navLinks = document.querySelector(".nav__links");
  const glassNav = document.querySelector(".glass-nav");

  if (navToggle && navLinks) {
    const setMenuOpen = (open) => {
      navToggle.classList.toggle("is-open", open);
      navLinks.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    };

    navToggle.addEventListener("click", () => {
      setMenuOpen(!navLinks.classList.contains("is-open"));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 991) setMenuOpen(false);
    });
  }

  /* ── Nav scroll effect ── */
  if (glassNav) {
    const onScroll = () => {
      glassNav.classList.toggle("is-scrolled", window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ── Scroll reveal ── */
  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  /* ── KPI counter animation ── */
  const kpiValues = document.querySelectorAll(".kpi-card__value[data-target]");

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  if (kpiValues.length && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    kpiValues.forEach((el) => counterObserver.observe(el));
  }

  /* ── Video autoplay fallback ── */
  document.querySelectorAll("video[autoplay]").forEach((video) => {
    video.muted = true;
    const play = () => video.play().catch(() => {});
    play();
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) play();
    });
  });

  /* ── Contact form ── */
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.querySelector(".form__status");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const phone = formData.get("phone");
      const message = formData.get("message");

      if (!name || !email || !message) {
        if (formStatus) formStatus.textContent = "Please fill in all required fields.";
        return;
      }

      const subject = encodeURIComponent(`Inquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\n\n${message}`
      );

      window.location.href = `mailto:srpddubai@gmail.com?subject=${subject}&body=${body}`;

      if (formStatus) {
        formStatus.textContent = "Opening your email client…";
      }
      contactForm.reset();
    });
  }

  /* ── Partnership carousel ── */
  const carousel = document.getElementById("partnership-carousel");

  if (carousel) {
    const track = carousel.querySelector(".partnership-carousel__track");
    const slides = carousel.querySelectorAll(".partnership-carousel__slide");
    const prevBtn = carousel.querySelector(".partnership-carousel__btn--prev");
    const nextBtn = carousel.querySelector(".partnership-carousel__btn--next");
    const total = slides.length;
    let index = 0;
    let autoplayTimer = null;
    let touchStartX = 0;

    function goTo(i) {
      index = (i + total) % total;
      track.style.transform = `translateX(-${index * 100}%)`;

      slides.forEach((slide, n) => {
        slide.classList.toggle("is-active", n === index);
      });
    }

    function next() {
      goTo(index + 1);
    }

    function prev() {
      goTo(index - 1);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(next, 5000);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    prevBtn?.addEventListener("click", () => {
      prev();
      startAutoplay();
    });

    nextBtn?.addEventListener("click", () => {
      next();
      startAutoplay();
    });

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);

    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
        startAutoplay();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
        startAutoplay();
      }
    });

    carousel.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    carousel.addEventListener(
      "touchend",
      (e) => {
        const diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) < 40) return;
        if (diff < 0) next();
        else prev();
        startAutoplay();
      },
      { passive: true }
    );

    startAutoplay();
  }

  /* ── Smooth anchor offset for fixed nav ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (id === "#" || !id) return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const navHeight = glassNav ? glassNav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();
