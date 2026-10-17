(() => {
  "use strict";
  document.documentElement.classList.add("js");
  const header = document.querySelector(".masthead");
  const menu = document.querySelector(".mobile-menu");
  const summary = menu.querySelector("summary");
  const menuLabel = menu.querySelector(".menu-label");
  const desktop = window.matchMedia("(min-width: 701px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
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
    "Identificación de la escribanía",
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

  const anchors = ["inicio", "trayectoria", "servicios", "contacto"].map((id) =>
    document.getElementById(id),
  );
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
