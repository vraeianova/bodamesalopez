// Direction each flower flies when tapped (matches data-idx order in HTML)
const FLOWER_FLY = [
  { x: "80vw",   y: "-120vh", spin: "210deg"  },  // 0 center       → top-right
  { x: "110vw",  y: "-70vh",  spin: "190deg"  },  // 1 top-right    → right-up
  { x: "-110vw", y: "90vh",   spin: "-200deg" },  // 2 bottom-left  → bottom-left
  { x: "-90vw",  y: "-110vh", spin: "-210deg" },  // 3 top-left     → top-left
  { x: "120vw",  y: "40vh",   spin: "230deg"  },  // 4 right-middle → right
  { x: "100vw",  y: "110vh",  spin: "200deg"  },  // 5 bottom-right → bottom-right
  { x: "10vw",   y: "-130vh", spin: "-170deg" },  // 6 top-center   → straight up
  { x: "-120vw", y: "10vh",   spin: "-230deg" },  // 7 left-middle  → left
  { x: "-20vw",  y: "130vh",  spin: "170deg"  },  // 8 bottom-center→ straight down
];

function initFlowerLayer() {
  const layer = document.getElementById("flower-layer");
  if (!layer) return;

  const flowers = Array.from(layer.querySelectorAll(".flower"));
  let dismissed = false;

  function dismiss() {
    if (dismissed) return;
    dismissed = true;

    flowers.forEach((flower) => {
      const dir = FLOWER_FLY[parseInt(flower.dataset.idx, 10)];
      flower.style.setProperty("--fly-x", dir.x);
      flower.style.setProperty("--fly-y", dir.y);
      flower.style.setProperty("--fly-spin", dir.spin);
      flower.classList.add("is-gone");
    });

    window.setTimeout(() => {
      window.scrollTo(0, 0);
      layer.classList.add("is-clearing");
      window.setTimeout(() => layer.remove(), 900);
    }, 250);
  }

  layer.addEventListener("click", dismiss);
  layer.addEventListener("touchstart", (e) => {
    e.preventDefault();
    dismiss();
  }, { passive: false });
}

const elements = {
  openButton: document.getElementById("open-invitation"),
  introScreen: document.getElementById("intro-screen"),
  landing: document.getElementById("main-content"),
  tapHint: document.getElementById("tap-hint"),
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  readButton: document.getElementById("read-invitation")
};

let countdownInterval;

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const targetDate = new Date("2026-06-06T16:00:00-06:00");
  const now = new Date();
  const difference = targetDate - now;

  if (difference <= 0) {
    elements.days.textContent = "00";
    elements.hours.textContent = "00";
    elements.minutes.textContent = "00";
    elements.seconds.textContent = "00";

    if (countdownInterval) {
      clearInterval(countdownInterval);
    }

    return;
  }

  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  elements.days.textContent = pad(days);
  elements.hours.textContent = pad(hours);
  elements.minutes.textContent = pad(minutes);
  elements.seconds.textContent = pad(seconds);
}

function openEnvelope() {
  if (document.body.classList.contains("is-opening")) {
    return;
  }

  document.body.classList.add("is-opening");
  elements.openButton.setAttribute("aria-expanded", "true");

  window.setTimeout(() => {
    document.body.classList.add("show-read-button");
  }, 1800);
}

function revealLanding() {
  if (document.body.classList.contains("is-revealed")) {
    return;
  }

  document.body.classList.add("is-revealed");
  elements.landing.setAttribute("tabindex", "-1");
  elements.landing.focus({ preventScroll: true });
  elements.landing.removeAttribute("tabindex");

  window.setTimeout(() => {
    elements.introScreen.setAttribute("hidden", "hidden");
  }, 1200);
}

function bindEvents() {
  elements.openButton.addEventListener("click", openEnvelope);
  elements.readButton.addEventListener("click", revealLanding);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      if (document.activeElement === elements.openButton) {
        openEnvelope();
      } else if (document.activeElement === elements.readButton) {
        revealLanding();
      }
    }
  });
}

function startCountdown() {
  updateCountdown();
  countdownInterval = window.setInterval(updateCountdown, 1000);
}

function init() {
  initFlowerLayer();
  bindEvents();
  startCountdown();
}

init();
