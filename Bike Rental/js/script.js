/* ============================================================
   BIKE RENTAL – MAIN JAVASCRIPT
   Author  : BikeRental Team
   Version : 1.0.0

   CONTENTS:
   1.  Bike Data
   2.  DOM References
   3.  Render Bike Cards
   4.  Video Modal
   5.  Booking Modal
   6.  Date Validation & Auto-Calculations
   7.  Animated Counter
   8.  Form Validation
   9.  WhatsApp Booking
   10. Navigation (Hamburger + Scroll)
   11. Scroll Animations (Fade-in)
   12. Init
   ============================================================ */

/* ── 1. BIKE DATA ──────────────────────────────────────────
   To add a new bike: copy one object, change the values.
   Image/video paths are easy to update here.
─────────────────────────────────────────────────────────── */
const bikes = [
  {
    id: 1,
    name: "Honda Dio",
    pricePerDay: 2000,
    image: "images/bike1.jpeg",
    // Local path (swap to real file when available): "images/bike1.jpg"
    video: "videos/bike1.mp4",
    // Thumbnail shown on card (same as image or separate thumb)
    videoThumb: "images/bike1.jpeg",
    features: [ "Automatic", "Helmet Included", "Well Maintained", "Fuel Efficient", "Extra Storage"]
  },
  {
    id: 2,
    name: "Honda Dio",
    pricePerDay: 2000,
    image: "images/bike1.jpeg",
    video: "videos/bike2.mp4",
    videoThumb: "images/bike1.jpeg",
    features: [ "Automatic", "Helmet Included", "Well Maintained", "Fuel Efficient", "Extra Storage"]
  },
  {
    id: 3,
    name: "Honda Dio",
    pricePerDay: 2000,
    image: "images/bike3.jpeg",
    video: "videos/bike3.mp4",
    videoThumb: "images/bike3.jpeg",
    features: [ "Automatic", "Helmet Included", "Well Maintained", "Fuel Efficient", "Extra Storage"]
  },
  {
    id: 4,
    name: "Hero XOOM",
    pricePerDay: 2000,
    image: "images/bike4.jpeg",
    video: "videos/bike4.mp4",
    videoThumb: "images/bike4.jpeg",
    features: [ "Automatic", "Helmet Included", "Well Maintained", "Fuel Efficient", "Extra Storage"]
  }
];

/* ── 2. DOM REFERENCES ─────────────────────────────────── */
const bikesGrid         = document.getElementById("bikesGrid");

// Video Modal
const videoModal        = document.getElementById("videoModal");
const videoModalClose   = document.getElementById("videoModalClose");
const modalVideo        = document.getElementById("modalVideo");

// Booking Modal
const bookingModal      = document.getElementById("bookingModal");
const bookingModalClose = document.getElementById("bookingModalClose");
const bookingForm       = document.getElementById("bookingForm");
const selectedBikeSummary = document.getElementById("selectedBikeSummary");

// Booking Form Fields
const custName          = document.getElementById("custName");
const custPhone         = document.getElementById("custPhone");
const selectedBikeInput = document.getElementById("selectedBike");
const rentalDateInput   = document.getElementById("rentalDate");
const returnDateInput   = document.getElementById("returnDate");
const rentalDaysInput   = document.getElementById("rentalDays");
const pricePerDayInput  = document.getElementById("pricePerDay");
const totalAmountInput  = document.getElementById("totalAmount");
const pickupTime        = document.getElementById("pickupTime");
const pickupLocation    = document.getElementById("pickupLocation");
const specialNotes      = document.getElementById("specialNotes");
const dateErrorBanner   = document.getElementById("dateErrorBanner");

// Error spans
const errName           = document.getElementById("errName");
const errPhone          = document.getElementById("errPhone");
const errRentalDate     = document.getElementById("errRentalDate");
const errReturnDate     = document.getElementById("errReturnDate");
const errPickupTime     = document.getElementById("errPickupTime");
const errPickupLocation = document.getElementById("errPickupLocation");

// Nav
const hamburger         = document.getElementById("hamburger");
const navLinks          = document.getElementById("navLinks");
const siteHeader        = document.querySelector(".site-header");

/* ── State ── */
let currentBike  = null;  // Currently selected bike object
let prevTotal    = 0;     // Previous total for counter animation
let counterTimer = null;  // requestAnimationFrame handle

/* ── 3. RENDER BIKE CARDS ──────────────────────────────────
   Dynamically creates a card for each bike in the array.
   Modify the bikes[] array above to add / remove bikes.
─────────────────────────────────────────────────────────── */
function renderBikeCards() {
  bikesGrid.innerHTML = ""; // Clear grid first

  bikes.forEach((bike, index) => {
    // Build features HTML
    const featuresHTML = bike.features
      .map(f => `<span class="feature-tag">${f}</span>`)
      .join("");

    // Build card HTML
    const card = document.createElement("article");
    card.className = "bike-card";
    card.setAttribute("data-index", index);

    card.innerHTML = `
      <!-- Bike Image -->
      <div class="card-image-wrap">
        <img
          src="${bike.image}"
          alt="${bike.name}"
          loading="lazy"
        />
        <span class="price-badge">Rs.${bike.pricePerDay.toLocaleString()}/day</span>
      </div>

      <!-- Card Body -->
      <div class="card-body">
        <h3 class="card-name">${bike.name}</h3>

        <!-- Features -->
        <div class="card-features">
          ${featuresHTML}
        </div>

        <!-- Video Thumbnail -->
        <div
          class="video-thumb-wrap"
          role="button"
          tabindex="0"
          aria-label="Play ${bike.name} video"
          data-video="${bike.video}"
          data-thumb="${bike.videoThumb}"
          data-bike-index="${index}"
          title="Click to play video"
        >
          <img src="${bike.videoThumb}" alt="${bike.name} video preview" loading="lazy" />
          <div class="play-btn">
            <div class="play-icon"></div>
          </div>
        </div>
      </div>

      <!-- Card Footer: Book Now -->
      <div class="card-footer">
        <button
          class="btn btn-book-now"
          data-bike-index="${index}"
          aria-label="Book ${bike.name}"
        >
           Book Now
        </button>
      </div>
    `;

    bikesGrid.appendChild(card);

    // Stagger animation delay
    setTimeout(() => {
      card.style.transitionDelay = `${index * 80}ms`;
    }, 0);
  });

  // Attach event listeners after rendering
  attachCardListeners();

  // Trigger scroll observer for cards
  observeCards();
}

/* ── 4. VIDEO MODAL ────────────────────────────────────────
   Opens a modal with the selected bike's video.
   Video stops automatically when modal closes.
─────────────────────────────────────────────────────────── */
function openVideoModal(videoSrc) {
  modalVideo.src = videoSrc;
  videoModal.classList.add("open");
  document.body.classList.add("modal-open");
  modalVideo.play().catch(() => {
    // Autoplay might be blocked; user can press play manually
  });
}

function closeVideoModal() {
  videoModal.classList.remove("open");
  document.body.classList.remove("modal-open");
  modalVideo.pause();
  modalVideo.src = ""; // Release the video resource
}

/* ── 5. BOOKING MODAL ──────────────────────────────────────
   Opens the booking form pre-filled with the selected bike.
─────────────────────────────────────────────────────────── */
function openBookingModal(bikeIndex) {
  currentBike = bikes[bikeIndex];

  // Pre-fill bike info
  selectedBikeInput.value = currentBike.name;
  pricePerDayInput.value  = `Rs.${currentBike.pricePerDay.toLocaleString()}`;

  // Reset calculated fields
  rentalDaysInput.value  = "";
  totalAmountInput.value = "";
  prevTotal = 0;

  // Reset date fields
  rentalDateInput.value = "";
  returnDateInput.value = "";
  returnDateInput.min   = "";

  // Set today as the minimum rental date
  rentalDateInput.min = getTodayString();

  // Hide error banner
  hideDateError();

  // Populate summary banner
  selectedBikeSummary.innerHTML = `
    <img
      class="summary-img"
      src="${currentBike.image}"
      alt="${currentBike.name}"
    />
    <div class="summary-info">
      <strong>${currentBike.name}</strong>
      <span>Rs.${currentBike.pricePerDay.toLocaleString()} / day</span>
    </div>
  `;

  // Clear any previous validation errors
  clearAllErrors();

  // Open modal
  bookingModal.classList.add("open");
  document.body.classList.add("modal-open");

  // Focus first input
  setTimeout(() => custName.focus(), 300);
}

function closeBookingModal() {
  bookingModal.classList.remove("open");
  document.body.classList.remove("modal-open");
  bookingForm.reset();
  clearAllErrors();
}

/* ── 6. DATE VALIDATION & AUTO-CALCULATIONS ────────────────
   • Rental Days  = Return Date − Rental Date (in days)
   • Total Amount = Rental Days × Price Per Day
   • Return date min is set to rental date + 1 day
─────────────────────────────────────────────────────────── */

/** Returns today's date in YYYY-MM-DD format (local time) */
function getTodayString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const dd   = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Format a date string (YYYY-MM-DD) to a readable format: e.g. "10 August 2025" */
function formatDateReadable(dateStr) {
  if (!dateStr) return "";
  const options = { day: "numeric", month: "long", year: "numeric" };
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-GB", options);
}

/** Format time from HH:MM (24h) to 12-hour AM/PM string */
function formatTime12h(timeStr) {
  if (!timeStr) return "";
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

/** Called whenever rentalDate or returnDate changes */
function recalculate() {
  const rentalVal = rentalDateInput.value;
  const returnVal = returnDateInput.value;

  // Reset if no dates
  if (!rentalVal || !returnVal) {
    rentalDaysInput.value  = "";
    totalAmountInput.value = "";
    hideDateError();
    return;
  }

  const rentalDate = new Date(rentalVal + "T00:00:00");
  const returnDate = new Date(returnVal + "T00:00:00");
  const today      = new Date(getTodayString() + "T00:00:00");

  // Validate: rental date not in past
  if (rentalDate < today) {
    showDateError("⚠️ Rental date cannot be in the past. Please select future date.");
    rentalDaysInput.value  = "";
    totalAmountInput.value = "";
    return;
  }

  // Validate: return date not before rental date
  if (returnDate <= rentalDate) {
    showDateError("⚠️ Return date must be after the rental date.");
    rentalDaysInput.value  = "";
    totalAmountInput.value = "";
    return;
  }

  // All valid — hide error
  hideDateError();

  // Calculate rental days
  const diffMs   = returnDate - rentalDate;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  rentalDaysInput.value = `${diffDays} Day${diffDays !== 1 ? "s" : ""}`;

  // Calculate total
  const total = diffDays * currentBike.pricePerDay;

  // Animate counter from previous value
  animateCounter(prevTotal, total, 900);
  prevTotal = total;
}

/** When rental date changes, update returnDate's minimum */
function onRentalDateChange() {
  errRentalDate.textContent = "";
  rentalDateInput.classList.remove("input-error");

  const rentalVal = rentalDateInput.value;

  if (rentalVal) {
    // Minimum return date is rental date + 1
    const nextDay = new Date(rentalVal + "T00:00:00");
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayStr = nextDay.toISOString().split("T")[0];
    returnDateInput.min = nextDayStr;

    // If existing return date is no longer valid, clear it
    if (returnDateInput.value && returnDateInput.value <= rentalVal) {
      returnDateInput.value = "";
      rentalDaysInput.value  = "";
      totalAmountInput.value = "";
      prevTotal = 0;
    }
  }

  recalculate();
}

function onReturnDateChange() {
  errReturnDate.textContent = "";
  returnDateInput.classList.remove("input-error");
  recalculate();
}

function showDateError(msg) {
  dateErrorBanner.textContent = msg;
  dateErrorBanner.style.display = "block";
}

function hideDateError() {
  dateErrorBanner.style.display = "none";
  dateErrorBanner.textContent = "";
}

/* ── 7. ANIMATED COUNTER ───────────────────────────────────
   Smoothly counts from `start` to `end` over `duration` ms.
─────────────────────────────────────────────────────────── */
function animateCounter(start, end, duration) {
  // Cancel any ongoing animation
  if (counterTimer) cancelAnimationFrame(counterTimer);

  const startTime = performance.now();
  const diff = end - start;

  function step(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(start + diff * eased);

    totalAmountInput.value = `Rs.${value.toLocaleString()}`;

    if (progress < 1) {
      counterTimer = requestAnimationFrame(step);
    }
  }

  counterTimer = requestAnimationFrame(step);
}

/* ── 8. FORM VALIDATION ────────────────────────────────────
   Returns true if form is valid, false otherwise.
   Shows inline error messages below each field.
─────────────────────────────────────────────────────────── */
function validateForm() {
  let isValid = true;

  // Helper: show error on a field
  function showError(input, errorEl, msg) {
    errorEl.textContent = msg;
    input.classList.add("input-error");
    isValid = false;
  }
  function clearError(input, errorEl) {
    errorEl.textContent = "";
    input.classList.remove("input-error");
  }

  // Name
  if (!custName.value.trim()) {
    showError(custName, errName, "Please enter your name.");
  } else {
    clearError(custName, errName);
  }

  // Phone
  const phoneRaw = custPhone.value.trim();
  if (!phoneRaw) {
    showError(custPhone, errPhone, "Please enter your phone number.");
  } else if (!/^[\d\s\+\-]{7,15}$/.test(phoneRaw)) {
    showError(custPhone, errPhone, "Enter a valid phone number.");
  } else {
    clearError(custPhone, errPhone);
  }

  // Rental Date
  if (!rentalDateInput.value) {
    showError(rentalDateInput, errRentalDate, "Please select a rental date.");
  } else if (rentalDateInput.value < getTodayString()) {
    showError(rentalDateInput, errRentalDate, "Rental date cannot be in the past.");
  } else {
    clearError(rentalDateInput, errRentalDate);
  }

  // Return Date
  if (!returnDateInput.value) {
    showError(returnDateInput, errReturnDate, "Please select a return date.");
  } else if (returnDateInput.value <= rentalDateInput.value) {
    showError(returnDateInput, errReturnDate, "Return date must be after rental date.");
  } else {
    clearError(returnDateInput, errReturnDate);
  }

  // Pickup Time
  if (!pickupTime.value) {
    showError(pickupTime, errPickupTime, "Please select a pickup time.");
  } else {
    clearError(pickupTime, errPickupTime);
  }

  // Pickup Location
  if (!pickupLocation.value.trim()) {
    showError(pickupLocation, errPickupLocation, "Please enter a pickup location.");
  } else {
    clearError(pickupLocation, errPickupLocation);
  }

  return isValid;
}

/** Clears all validation errors */
function clearAllErrors() {
  const errorEls = [errName, errPhone, errRentalDate, errReturnDate, errPickupTime, errPickupLocation];
  const inputEls = [custName, custPhone, rentalDateInput, returnDateInput, pickupTime, pickupLocation];
  errorEls.forEach(el => { el.textContent = ""; });
  inputEls.forEach(el => { el.classList.remove("input-error"); });
  hideDateError();
}

/* ── 9. WHATSAPP BOOKING ───────────────────────────────────
   Constructs a pre-filled WhatsApp message and opens it.
─────────────────────────────────────────────────────────── */
const WHATSAPP_NUMBER = "94771234567"; // Change to your number (no + or spaces)

function sendWhatsApp() {
  const name     = custName.value.trim();
  const phone    = custPhone.value.trim();
  const bike     = currentBike.name;
  const rDate    = formatDateReadable(rentalDateInput.value);
  const retDate  = formatDateReadable(returnDateInput.value);
  const days     = rentalDaysInput.value;
  const total    = totalAmountInput.value;
  const time     = formatTime12h(pickupTime.value);
  const location = pickupLocation.value.trim();
  const notes    = specialNotes.value.trim();

  // Build the WhatsApp message
  const message =
`Hello,

I would like to book a bike.

*Name:*
${name}

*Phone:*
${phone}

*Bike:*
${bike}

*Rental Date:*
${rDate}

*Return Date:*
${retDate}

*Rental Days:*
${days}

*Total Amount:*
${total}

*Pickup Time:*
${time}

*Pickup Location:*
${location}${notes ? `\n\n*Special Notes:*\n${notes}` : ""}

Thank you.`;

  // Encode and open WhatsApp
  const encodedMsg = encodeURIComponent(message);
  const waURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;
  window.open(waURL, "_blank", "noopener,noreferrer");
}

/* ── 10. NAVIGATION ────────────────────────────────────────
   Hamburger toggle + sticky header shadow on scroll.
─────────────────────────────────────────────────────────── */
function initNav() {
  // Hamburger toggle
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  // Close nav when a link is clicked (mobile)
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });

  // Sticky header – add 'scrolled' class after scrolling down
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  }, { passive: true });
}

/* ── 11. SCROLL ANIMATIONS (FADE-IN) ───────────────────────
   Uses IntersectionObserver for performance.
   Elements with class "fade-in" animate on scroll.
─────────────────────────────────────────────────────────── */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, observerOptions);

  // Observe all fade-in elements
  document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
}

/** Observe bike cards separately (since they're added dynamically) */
function observeCards() {
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger each card's entrance
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, entry.target.dataset.index * 80);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(".bike-card").forEach(card => cardObserver.observe(card));
}

/* ── 12. ATTACH CARD LISTENERS ─────────────────────────────
   Attach click events to video thumbnails and Book Now buttons.
─────────────────────────────────────────────────────────── */
function attachCardListeners() {
  // Video thumbnails
  document.querySelectorAll(".video-thumb-wrap").forEach(thumb => {
    // Click
    thumb.addEventListener("click", () => {
      const videoSrc = thumb.dataset.video;
      openVideoModal(videoSrc);
    });
    // Keyboard (Enter / Space)
    thumb.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openVideoModal(thumb.dataset.video);
      }
    });
  });

  // Book Now buttons
  document.querySelectorAll(".btn-book-now").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.bikeIndex, 10);
      openBookingModal(index);
    });
  });
}

/* ── INIT ──────────────────────────────────────────────────
   Entry point — runs when the page is fully loaded.
─────────────────────────────────────────────────────────── */
function init() {
  // Render bike cards into the grid
  renderBikeCards();

  // Init navigation
  initNav();

  // Init scroll animations for static elements
  initScrollAnimations();

  /* ── VIDEO MODAL EVENTS ── */
  videoModalClose.addEventListener("click", closeVideoModal);

  // Close on backdrop click
  videoModal.addEventListener("click", e => {
    if (e.target === videoModal) closeVideoModal();
  });

  /* ── BOOKING MODAL EVENTS ── */
  bookingModalClose.addEventListener("click", closeBookingModal);

  // Close on backdrop click
  bookingModal.addEventListener("click", e => {
    if (e.target === bookingModal) closeBookingModal();
  });

  // Date change listeners
  rentalDateInput.addEventListener("change", onRentalDateChange);
  returnDateInput.addEventListener("change", onReturnDateChange);

  // Clear individual field errors on input
  custName.addEventListener("input", () => {
    errName.textContent = "";
    custName.classList.remove("input-error");
  });
  custPhone.addEventListener("input", () => {
    errPhone.textContent = "";
    custPhone.classList.remove("input-error");
  });
  pickupTime.addEventListener("change", () => {
    errPickupTime.textContent = "";
    pickupTime.classList.remove("input-error");
  });
  pickupLocation.addEventListener("input", () => {
    errPickupLocation.textContent = "";
    pickupLocation.classList.remove("input-error");
  });

  /* ── BOOKING FORM SUBMIT ── */
  bookingForm.addEventListener("submit", e => {
    e.preventDefault();

    // Run validation
    if (!validateForm()) {
      // Scroll to first error inside the modal
      const firstError = bookingModal.querySelector(".input-error, .date-error-banner:not([style*='none'])");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Send booking via WhatsApp
    sendWhatsApp();

    // Optionally close the modal after sending
    closeBookingModal();
  });

  /* ── GLOBAL KEYBOARD LISTENER ── */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (videoModal.classList.contains("open"))   closeVideoModal();
      if (bookingModal.classList.contains("open")) closeBookingModal();
    }
  });
}

/* ── Run when DOM is ready ── */
document.addEventListener("DOMContentLoaded", init);
