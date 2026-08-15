(function () {
  "use strict";

  const {
    whatsappNumber,
    pricing,
    heroSlides,
    packages,
    gallery,
    safariTypes,
    aboutImage,
  } = SITE_CONFIG;

  const PERSON_OPTIONS = [1, 2, 3, 4, 5, 6, 7];
  const HERO_INTERVAL = 4500;
  const imageCache = new Map();

  let currentHeroIndex = 0;
  let heroTimer = null;
  let resolvedHeroUrls = [];
  let bookingContext = { packageId: null, persons: 1 };

  // --- Utilities ---
  function formatLKR(amount) {
    return "LKR " + amount.toLocaleString("en-LK");
  }

  function getPrice(persons) {
    return pricing[persons] ?? pricing[1];
  }

  function getWhatsAppUrl(message) {
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${whatsappNumber}?text=${encoded}`;
  }

  function cssUrl(url) {
    return `url('${url.replace(/'/g, "%27")}')`;
  }

  function resolveImage(localPath, fallback) {
    const key = localPath + "|" + fallback;
    if (imageCache.has(key)) {
      return Promise.resolve(imageCache.get(key));
    }
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        imageCache.set(key, localPath);
        resolve(localPath);
      };
      img.onerror = () => {
        imageCache.set(key, fallback);
        resolve(fallback);
      };
      img.src = localPath;
    });
  }

  function preloadImage(url) {
    const img = new Image();
    img.src = url;
  }

  function animatePrice(el, target) {
    const start = parseInt(el.dataset.value || "0", 10) || 0;
    const duration = 500;
    const startTime = performance.now();

    function tick(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(start + (target - start) * eased);
      el.textContent = formatLKR(current);
      el.dataset.value = String(current);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function personLabel(n) {
    return n === 1 ? "1 Person" : `${n} Persons`;
  }

  function buildPersonSelectOptions(selected) {
    return PERSON_OPTIONS.map(
      (n) =>
        `<option value="${n}"${n === selected ? " selected" : ""}>${personLabel(n)}</option>`
    ).join("");
  }

  function todayISO() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  // --- Navbar ---
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  function onScroll() {
    navbar.classList.toggle("navbar--scrolled", window.scrollY > 40);
  }

  navToggle.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    navMenu.classList.toggle("is-open", !open);
    document.body.style.overflow = !open ? "hidden" : "";
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("is-open");
      document.body.style.overflow = "";
    });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const defaultWaMsg =
    "Hello, I would like to inquire about a safari tour with Arugambay Safari.";
  const waUrl = getWhatsAppUrl(defaultWaMsg);
  document.getElementById("navWhatsApp").href = waUrl;
  document.getElementById("footerWhatsApp").href = waUrl;

  // --- Hero slideshow ---
  const slideshowEl = document.getElementById("heroSlideshow");
  const subtitleEl = document.getElementById("heroSubtitle");

  function preloadHeroSlide(index) {
    const url = resolvedHeroUrls[index];
    if (url) preloadImage(url);
    const next = heroSlides[(index + 1) % heroSlides.length];
    if (next) {
      resolveImage(next.image, next.fallback).then(preloadImage);
    }
  }

  async function initHero() {
    resolvedHeroUrls = await Promise.all(
      heroSlides.map((s) => resolveImage(s.image, s.fallback))
    );

    heroSlides.forEach((slide, i) => {
      const div = document.createElement("div");
      div.className = "hero__slide" + (i === 0 ? " is-active" : "");
      div.style.backgroundImage = cssUrl(resolvedHeroUrls[i]);
      slideshowEl.appendChild(div);
    });

    preloadHeroSlide(0);

    const preloadLink = document.querySelector('link[rel="preload"][as="image"]');
    if (preloadLink && resolvedHeroUrls[0]) {
      preloadLink.href = resolvedHeroUrls[0];
    }

    startHeroTimer();
  }

  function setHeroSubtitle(text) {
    subtitleEl.classList.add("is-fading");
    setTimeout(() => {
      subtitleEl.textContent = text;
      subtitleEl.classList.remove("is-fading");
    }, 300);
  }

  function advanceHero() {
    const slides = slideshowEl.querySelectorAll(".hero__slide");
    slides[currentHeroIndex].classList.remove("is-active");
    currentHeroIndex = (currentHeroIndex + 1) % heroSlides.length;
    slides[currentHeroIndex].classList.add("is-active");
    setHeroSubtitle(heroSlides[currentHeroIndex].subtitle);
    preloadHeroSlide(currentHeroIndex);
  }

  function startHeroTimer() {
    if (heroTimer) clearInterval(heroTimer);
    heroTimer = setInterval(advanceHero, HERO_INTERVAL);
  }

  // --- Safari types ---
  async function renderSafariTypes() {
    const grid = document.getElementById("safariTypesGrid");
    if (!grid || !safariTypes) return;

    const urls = await Promise.all(
      safariTypes.map((t) => resolveImage(t.image, t.fallback))
    );

    grid.innerHTML = safariTypes
      .map(
        (type, i) => `
      <article class="safari-type-card reveal">
        <div class="safari-type-card__image" style="--bg: ${cssUrl(urls[i])}"></div>
        <div class="safari-type-card__content">
          <h3>${type.title}</h3>
          <p>${type.description}</p>
        </div>
      </article>`
      )
      .join("");
  }

  // --- About image ---
  async function initAboutImage() {
    const el = document.getElementById("aboutImage");
    if (!el || !aboutImage) return;
    const url = await resolveImage(aboutImage.image, aboutImage.fallback);
    el.style.setProperty("--bg", cssUrl(url));
  }

  // --- Packages ---
  const packagesGrid = document.getElementById("packagesGrid");

  async function renderPackages() {
    const imageUrls = await Promise.all(
      packages.map((p) => resolveImage(p.image, p.fallback))
    );

    packagesGrid.innerHTML = packages
      .map(
        (pkg, idx) => `
      <article class="package-card reveal" data-package-id="${pkg.id}">
        <div class="package-card__bg" style="--bg: ${cssUrl(imageUrls[idx])}"></div>
        <div class="package-card__overlay"></div>
        <div class="package-card__body">
          <span class="section__eyebrow" style="text-align:left;margin-bottom:0.5rem">${pkg.type}</span>
          <h3 class="package-card__title">${pkg.title}</h3>
          <p class="package-card__desc">${pkg.description}</p>
          <div class="package-card__meta">
            <span>${pkg.duration}</span>
            <span>Private Safari</span>
            <span>Hotel Pickup</span>
            <span>Professional Guide</span>
          </div>
          <div class="package-card__select">
            <label for="persons-${pkg.id}">How Many People?</label>
            <select id="persons-${pkg.id}" data-persons-select aria-label="Number of people for ${pkg.title}">
              ${buildPersonSelectOptions(1)}
            </select>
          </div>
          <div class="package-card__price-row">
            <span class="package-card__price-label">Total Price</span>
            <span class="package-card__price" data-price data-value="${pricing[1]}">${formatLKR(pricing[1])}</span>
          </div>
          <div class="package-card__actions">
            <button type="button" class="btn btn--primary" data-book-package="${pkg.id}">Book Safari</button>
          </div>
        </div>
      </article>`
      )
      .join("");

    packagesGrid.querySelectorAll("[data-persons-select]").forEach((select) => {
      select.addEventListener("change", (e) => {
        const card = e.target.closest(".package-card");
        const priceEl = card.querySelector("[data-price]");
        const persons = parseInt(e.target.value, 10);
        animatePrice(priceEl, getPrice(persons));
      });
    });

    packagesGrid.querySelectorAll("[data-book-package]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-book-package");
        const card = btn.closest(".package-card");
        const persons = parseInt(card.querySelector("[data-persons-select]").value, 10);
        openBookingModal(id, persons);
      });
    });
  }

  // --- Gallery ---
  const galleryEl = document.getElementById("galleryShowcase");

  async function renderGallery() {
    const urls = await Promise.all(
      gallery.map((item) => resolveImage(item.image, item.fallback))
    );

    gallery.forEach((item, i) => {
      const panel = document.createElement("section");
      panel.className = "gallery-panel";
      panel.innerHTML = `
      <div class="gallery-panel__bg" style="--bg: ${cssUrl(urls[i])}"></div>
      <div class="gallery-panel__overlay"></div>
      <div class="gallery-panel__content">
        <p class="gallery-panel__sub">${item.sub}</p>
        <h3 class="gallery-panel__caption">${item.caption}</h3>
      </div>`;
      galleryEl.appendChild(panel);
    });
  }

  // --- Scroll reveal ---
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  function observeReveal(selector) {
    document.querySelectorAll(selector).forEach((el) => revealObserver.observe(el));
  }

  // --- Booking modal ---
  const bookingModal = document.getElementById("bookingModal");
  const successModal = document.getElementById("successModal");
  const bookingForm = document.getElementById("bookingForm");
  const formPersons = document.getElementById("formPersons");
  const formPackage = document.getElementById("formPackage");
  const formPrice = document.getElementById("formPrice");
  const safariDateInput = document.getElementById("safariDate");

  safariDateInput.min = todayISO();

  function populateFormSelects() {
    formPersons.innerHTML = buildPersonSelectOptions(1);
    formPackage.innerHTML = packages
      .map((p) => `<option value="${p.id}">${p.title}</option>`)
      .join("");
  }

  populateFormSelects();

  function syncFormPrice() {
    const persons = parseInt(formPersons.value, 10);
    animatePrice(formPrice, getPrice(persons));
  }

  formPersons.addEventListener("change", syncFormPrice);
  formPackage.addEventListener("change", syncFormPrice);

  function openBookingModal(packageId = null, persons = 1) {
    bookingContext = { packageId, persons };
    if (packageId) formPackage.value = packageId;
    formPersons.value = String(persons);
    syncFormPrice();
    bookingModal.classList.add("is-open");
    bookingModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeBookingModal() {
    bookingModal.classList.remove("is-open");
    bookingModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-open-booking]").forEach((btn) => {
    btn.addEventListener("click", () => openBookingModal());
  });

  document.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", closeBookingModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && bookingModal.classList.contains("is-open")) {
      closeBookingModal();
    }
  });

  function formatDateForMessage(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const country = document.getElementById("country").value.trim();
    const whatsapp = document.getElementById("whatsapp").value.trim();
    const safariDate = safariDateInput.value;
    const pickup = document.getElementById("pickup").value.trim();
    const persons = parseInt(formPersons.value, 10);
    const packageId = formPackage.value;
    const notes = document.getElementById("notes").value.trim();

    const pkg = packages.find((p) => p.id === packageId);
    const packageName = pkg ? pkg.title : packageId;
    const price = getPrice(persons);

    const message = [
      "Hello, I would like to book a safari.",
      "",
      `Safari Package: ${packageName}`,
      `Persons: ${persons}`,
      `Price: ${formatLKR(price)}`,
      `Date: ${formatDateForMessage(safariDate)}`,
      `Pickup Location: ${pickup}`,
      `Customer Name: ${fullName}`,
      `Country: ${country}`,
      `WhatsApp Number: ${whatsapp}`,
      notes ? `Notes: ${notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    closeBookingModal();
    successModal.classList.add("is-open");
    successModal.setAttribute("aria-hidden", "false");

    setTimeout(() => {
      window.open(getWhatsAppUrl(message), "_blank", "noopener,noreferrer");
      successModal.classList.remove("is-open");
      successModal.setAttribute("aria-hidden", "true");
      bookingForm.reset();
      populateFormSelects();
      safariDateInput.min = todayISO();
    }, 1800);
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  // --- Boot ---
  (async function boot() {
    await Promise.all([
      initHero(),
      renderSafariTypes(),
      initAboutImage(),
      renderPackages(),
      renderGallery(),
    ]);
    observeReveal(".reveal, .gallery-panel, .safari-type-card");
  })();
})();
