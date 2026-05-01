const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const floatingWhatsApp = document.querySelector("[data-floating-whatsapp]");
const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let floatingReady = false;
let floatingTimer = null;

const staggerRevealGroups = () => {
  const groups = document.querySelectorAll(".procedure-grid, .pillar-grid, .gallery-grid, .testimonial-track");

  groups.forEach((group) => {
    const items = group.querySelectorAll(".reveal");

    items.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${Math.min(index * 110, 520)}ms`);
    });
  });
};

const handleScroll = () => {
  const scrolled = window.scrollY > 12;
  header?.classList.toggle("is-scrolled", scrolled);

  if (window.scrollY > 80 && !floatingTimer && !floatingReady) {
    floatingTimer = window.setTimeout(() => {
      floatingReady = true;
      floatingTimer = null;
      floatingWhatsApp?.classList.add("is-visible");
    }, 1000);
  }

  if (window.scrollY <= 80) {
    floatingReady = false;
    floatingWhatsApp?.classList.remove("is-visible");

    if (floatingTimer) {
      window.clearTimeout(floatingTimer);
      floatingTimer = null;
    }
  }
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  menuToggle.classList.toggle("is-open", !isOpen);
  menu?.classList.toggle("is-open", !isOpen);
});

menu?.addEventListener("click", (event) => {
  const target = event.target;

  if (target instanceof Element && target.closest("a")) {
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menu");
    menuToggle?.classList.remove("is-open");
    menu.classList.remove("is-open");
  }
});

staggerRevealGroups();

if (prefersReducedMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

window.addEventListener("scroll", handleScroll, { passive: true });
window.addEventListener("load", () => {
  setTimeout(handleScroll, 1000);
});
handleScroll();
