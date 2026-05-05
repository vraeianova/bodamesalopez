function initRingsLayer() {
  const layer = document.getElementById("flower-layer");
  const btn = document.getElementById("layer-btn");
  const landing = document.getElementById("main-content");
  if (!layer || !btn || !landing) return;

  let dismissed = false;

  function dismiss() {
    if (dismissed) return;
    dismissed = true;

    layer.classList.add("is-clearing");
    document.body.classList.add("is-revealed");

    landing.setAttribute("tabindex", "-1");
    landing.focus({ preventScroll: true });
    landing.removeAttribute("tabindex");

    window.setTimeout(() => layer.remove(), 900);
  }

  btn.addEventListener("click", dismiss);
}

const elements = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
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
    clearInterval(countdownInterval);
    return;
  }

  const totalSeconds = Math.floor(difference / 1000);
  elements.days.textContent    = pad(Math.floor(totalSeconds / 86400));
  elements.hours.textContent   = pad(Math.floor((totalSeconds % 86400) / 3600));
  elements.minutes.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
  elements.seconds.textContent = pad(totalSeconds % 60);
}

function startCountdown() {
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

function initScrollFade() {
  const targets = document.querySelectorAll(
    ".hero, .message, .details-grid, .parents, .dresscode, .editorial, .gallery, .rsvp, .footer"
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  targets.forEach((el) => observer.observe(el));
}

initRingsLayer();
startCountdown();
initScrollFade();
