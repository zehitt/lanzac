(() => {
  "use strict";
  document.documentElement.classList.add("js");
  const header = document.querySelector(".masthead");
  const menu = document.querySelector(".mobile-menu");
  const summary = menu.querySelector("summary");
  const menuLabel = menu.querySelector(".menu-label");
  const desktop = window.matchMedia("(min-width: 701px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const typingCopy = document.querySelector(".hero-copy[data-typing-text]");
  if (typingCopy) {
    const fullText = typingCopy.dataset.typingText;
    if (reducedMotion.matches) {
      typingCopy.textContent = fullText;
    } else {
      typingCopy.textContent = "";
      let character = 0;
      const typeNextCharacter = () => {
        typingCopy.textContent = fullText.slice(0, character);
        if (character < fullText.length) {
          character += 1;
          window.setTimeout(typeNextCharacter, 32);
        }
      };
      window.setTimeout(typeNextCharacter, 100);
    }
  }
  const closeMenu = (restoreFocus = false) => {
    if (!menu.open) return;
    menu.open = false;
    if (restoreFocus) summary.focus();
  };
  menu.addEventListener("toggle", () => {
    summary.setAttribute("aria-expanded", String(menu.open));
    menuLabel.textContent = menu.open ? "Cerrar" : "Menú";
  });
  summary.setAttribute("aria-expanded", "false");
  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target)) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu(true);
  });
  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      closeMenu();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    }),
  );
  desktop.addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
  document.addEventListener("focusin", (event) => {
    if (!menu.contains(event.target)) closeMenu();
  });

  const hero = document.querySelector(".hero");
  const slides = Array.from(document.querySelectorAll(".photo"));
  const dots = Array.from(document.querySelectorAll(".gallery-dot"));
  const caption = document.getElementById("gallery-caption");
  const number = document.getElementById("gallery-number");
  const status = document.getElementById("gallery-status");
  const labels = [
    "Sala de reuniones",
    "Libros jurídicos",
    "Oficina y biblioteca",
    "Diplomas",
    "Retrato familiar",
    "Detalle de la oficina",
  ];
  let currentSlide = 0;
  const showSlide = (requested) => {
    const next = (requested + slides.length) % slides.length;
    if (next === currentSlide) return;
    currentSlide = next;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === next);
      slide.setAttribute("aria-hidden", String(i !== next));
      dots[i].setAttribute("aria-pressed", String(i === next));
    });
    number.textContent = String(next + 1).padStart(2, "0");
    caption.textContent = labels[next];
    status.textContent = `Fotografía ${next + 1} de ${slides.length}: ${labels[next]}.`;
  };
  dots.forEach((dot, i) => dot.addEventListener("click", () => showSlide(i)));
  document
    .getElementById("gallery-prev")
    .addEventListener("click", () => showSlide(currentSlide - 1));
  document
    .getElementById("gallery-next")
    .addEventListener("click", () => showSlide(currentSlide + 1));
  document
    .querySelector(".gallery-controls")
    .addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
        return;
      event.preventDefault();
      showSlide(
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? slides.length - 1
            : currentSlide + (event.key === "ArrowRight" ? 1 : -1),
      );
      if (event.target.classList.contains("gallery-dot"))
        dots[currentSlide].focus();
    });
  let touchStart = null;
  hero.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1 || event.target.closest("a, button")) {
        touchStart = null;
        return;
      }
      touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    },
    { passive: true },
  );
  hero.addEventListener(
    "touchend",
    (event) => {
      if (!touchStart || !event.changedTouches.length) return;
      const dx = event.changedTouches[0].clientX - touchStart.x;
      const dy = event.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5)
        showSlide(currentSlide + (dx < 0 ? 1 : -1));
      touchStart = null;
    },
    { passive: true },
  );
  hero.addEventListener(
    "touchcancel",
    () => {
      touchStart = null;
    },
    { passive: true },
  );

  const reviewViewport = document.querySelector("[data-review-viewport]");
  const reviewTrack = document.querySelector("[data-review-track]");
  if (reviewViewport && reviewTrack) {
    const originalReviews = Array.from(reviewTrack.children);
    originalReviews.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("a, button, input, textarea, select").forEach((element) => {
        element.setAttribute("tabindex", "-1");
      });
      reviewTrack.appendChild(clone);
    });

    let reviewOffset = 0;
    let reviewSetWidth = 0;
    let reviewPaused = false;
    let reviewLastTime = 0;
    const reviewSpeed = 34;
    const measureReviews = () => {
      reviewSetWidth = reviewTrack.scrollWidth / 2;
      if (reviewSetWidth > 0 && Math.abs(reviewOffset) >= reviewSetWidth) {
        reviewOffset = 0;
      }
    };
    const animateReviews = (time) => {
      if (!reviewLastTime) reviewLastTime = time;
      const delta = Math.min(50, time - reviewLastTime);
      reviewLastTime = time;
      if (!reviewPaused && !reducedMotion.matches && reviewSetWidth > 0) {
        reviewOffset -= reviewSpeed * (delta / 1000);
        if (reviewOffset <= -reviewSetWidth) reviewOffset += reviewSetWidth;
        reviewTrack.style.transform = `translate3d(${reviewOffset}px, 0, 0)`;
      }
      window.requestAnimationFrame(animateReviews);
    };
    reviewViewport.addEventListener("mouseenter", () => {
      reviewPaused = true;
    });
    reviewViewport.addEventListener("mouseleave", () => {
      reviewPaused = false;
    });
    reviewViewport.addEventListener("focusin", () => {
      reviewPaused = true;
    });
    reviewViewport.addEventListener("focusout", (event) => {
      if (!reviewViewport.contains(event.relatedTarget)) reviewPaused = false;
    });
    window.addEventListener("resize", measureReviews, { passive: true });
    measureReviews();
    window.requestAnimationFrame(animateReviews);
  }

  const anchors = ["inicio", "trayectoria", "servicios", "reseñas", "contacto"]
    .map((id) => document.getElementById(id))
    .filter((section) => section && getComputedStyle(section).display !== "none");
  const navLinks = document.querySelectorAll(".nav a, .mobile-panel nav a");
  let scrollQueued = false;
  const updateNavigation = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
    let active = "inicio";
    const threshold =
      header.offsetHeight + Math.min(180, window.innerHeight * 0.2);
    anchors.forEach((section) => {
      if (section.getBoundingClientRect().top <= threshold) active = section.id;
    });
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === "#" + active)
        link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    scrollQueued = false;
  };
  const queueNavigation = () => {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(updateNavigation);
    }
  };
  window.addEventListener("scroll", queueNavigation, { passive: true });
  window.addEventListener("resize", queueNavigation, { passive: true });
  window.addEventListener("pageshow", queueNavigation);
  updateNavigation();

  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("pending");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px 30px 0px" },
    );
    document.querySelectorAll(".reveal").forEach((element) => {
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.classList.add("pending");
        observer.observe(element);
      }
    });
    const revealAll = () => {
      document
        .querySelectorAll(".reveal.pending")
        .forEach((element) => element.classList.remove("pending"));
      observer.disconnect();
    };
    reducedMotion.addEventListener("change", (event) => {
      if (event.matches) revealAll();
    });
    document.addEventListener("focusin", (event) => {
      const parent = event.target.closest(".reveal.pending");
      if (parent) {
        parent.classList.remove("pending");
        observer.unobserve(parent);
      }
    });
    window.addEventListener("beforeprint", revealAll);
  }
})();
