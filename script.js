const overlay = document.getElementById("introOverlay");

const passwordForm = document.getElementById("passwordForm");
const pwLabel = document.getElementById("pwLabel");
const pwInput = document.getElementById("pwInput");
const pwMessage = document.getElementById("pwMessage");

const questionBox = document.getElementById("questionBox");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const heartsLayer = document.getElementById("hearts");
const song = document.getElementById("loveSong");

const heartColors = ["#ff4aa2", "#ff77b7", "#7a5cff", "#b86bff", "#4aa3ff", "#7aa7ff"];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* ===== Hearts (SVG so colors work on phones) ===== */
function createHeartSVG() {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");

  const path = document.createElementNS(ns, "path");
  path.setAttribute(
    "d",
    "M12 21s-7.2-4.4-9.6-8.4C.9 10.1 1.5 6.9 4.1 5.5c1.9-1 4.2-.6 5.6.9L12 8.8l2.3-2.4c1.4-1.5 3.7-1.9 5.6-.9 2.6 1.4 3.2 4.6 1.7 7.1C19.2 16.6 12 21 12 21z"
  );
  path.setAttribute("fill", "currentColor");
  svg.appendChild(path);

  return svg;
}

function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";

  const color = heartColors[Math.floor(Math.random() * heartColors.length)];
  heart.style.setProperty("--x", rand(0, 100) + "vw");
  heart.style.setProperty("--size", rand(18, 54) + "px");
  heart.style.setProperty("--color", color);
  heart.style.setProperty("--dur", rand(2.2, 4.6) + "s");
  heart.style.setProperty("--rise", rand(420, 980) + "px");
  heart.style.setProperty("--rot", rand(-25, 25) + "deg");

  heart.appendChild(createHeartSVG());
  heartsLayer.appendChild(heart);

  setTimeout(() => heart.remove(), 6500);
}

function burstHearts(count = 30) {
  for (let i = 0; i < count; i++) setTimeout(spawnHeart, i * 45);
}

let heartsIntervalId = null;
function startHearts() {
  burstHearts(40);
  if (!heartsIntervalId) {
    heartsIntervalId = setInterval(() => {
      spawnHeart();
      if (Math.random() < 0.35) spawnHeart();
    }, 200);
  }
}

/* ===== Reveal on scroll ===== */
function setupRevealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.18 }
  );
  items.forEach((el) => io.observe(el));
}

/* ===== Password 3-phase flow ===== */
let phase = 1;

function normalize(s) {
  return String(s || "").trim().toLowerCase();
}

passwordForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const input = normalize(pwInput.value);

  if (phase === 1) {
    pwLabel.textContent = "Your password is incorrect:";
    pwInput.value = "";
    pwInput.focus();
    phase = 2;
    return;
  }

  if (phase === 2) {
    if (input !== "incorrect") {
      pwInput.select();
      return;
    }

    pwLabel.textContent = "Try Again:";
    pwInput.value = "";
    pwInput.focus();
    phase = 3;
    return;
  }

  if (input !== "again") {
    pwInput.select();
    return;
  }

  passwordForm.classList.add("hidden");
  questionBox.classList.remove("hidden");
});

/* ===== No button: runs away, then poofs ===== */
let noMoves = 0;
let noGone = false;

function moveNoButton() {
  if (noGone) return;

  const padding = 16;
  const rect = noBtn.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width - padding;
  const maxY = window.innerHeight - rect.height - padding;

  const x = rand(padding, Math.max(padding, maxX));
  const y = rand(padding, Math.max(padding, maxY));

  // Move NO around the screen
  noBtn.style.position = "fixed";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;

  noMoves += 1;

  if (noMoves >= 6) {
    noGone = true;

    // Poof animation
    noBtn.style.pointerEvents = "none";
    noBtn.classList.add("poof");

    // After poof: remove NO and force YES to remain with new text
    setTimeout(() => {
      // 1) Remove NO completely
      if (noBtn && noBtn.parentNode) noBtn.parentNode.removeChild(noBtn);

      // 2) Update YES text and make sure it's visible + clickable
      yesBtn.textContent = "YES — you do not have a choice 😏";
      yesBtn.disabled = false;

        // 3) Style YES to new position
        yesBtn.style.position = "fixed";

      // 4) Safety: ensure YES is not hidden by any accidental classes
      yesBtn.classList.remove("hidden");
      yesBtn.style.opacity = "1";
      yesBtn.style.pointerEvents = "auto";
      yesBtn.style.position = "relative";
      yesBtn.style.zIndex = "1";
    }, 340);
  }
}



/* ✅ UPDATED: No moves ONLY on click/tap (not hover) */
noBtn.addEventListener("click", moveNoButton);
noBtn.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    moveNoButton();
  },
  { passive: false }
);

/* ===== Yes: start the experience ===== */
function startValentineExperience() {
  overlay.classList.add("hidden");
  setTimeout(() => overlay.remove(), 450);

  document.body.classList.add("love-mode");

  if (song) {
    song.currentTime = 0;
    song.volume = 0.75;
    song.play().catch((err) => console.warn("Audio play failed:", err));
  }

  startHearts();
  setupRevealOnScroll();
}

yesBtn.addEventListener("click", startValentineExperience);

/* Focus on load */
window.addEventListener("load", () => {
  try { pwInput.focus(); } catch {}
});
