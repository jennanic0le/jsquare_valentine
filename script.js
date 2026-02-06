const btn = document.getElementById("pressBtn");
const loveText = document.getElementById("loveText");
const heartsLayer = document.getElementById("hearts");
const song = document.getElementById("loveSong");

const heartColors = [
  "#ff4aa2",
  "#ff77b7",
  "#7a5cff",
  "#b86bff",
  "#4aa3ff",
  "#7aa7ff"
];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// ✅ Create a colorable heart that works everywhere (no emoji coloring issues)
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
  path.setAttribute("fill", "currentColor"); // inherits from .heart { color: ... }
  svg.appendChild(path);

  return svg;
}

function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";

  const color = heartColors[Math.floor(Math.random() * heartColors.length)];
  const size = rand(18, 54) + "px";

  heart.style.setProperty("--x", rand(0, 100) + "vw");
  heart.style.setProperty("--size", size);
  heart.style.setProperty("--color", color);
  heart.style.setProperty("--dur", rand(2.2, 4.6) + "s");
  heart.style.setProperty("--rise", rand(420, 980) + "px");
  heart.style.setProperty("--rot", rand(-25, 25) + "deg");

  // ✅ Use SVG instead of emoji heart (fixes mobile color issue)
  heart.appendChild(createHeartSVG());

  heartsLayer.appendChild(heart);

  setTimeout(() => heart.remove(), 6000);
}

function burstHearts(count = 30) {
  for (let i = 0; i < count; i++) {
    setTimeout(spawnHeart, i * 50);
  }
}

let heartsIntervalId = null;

btn.addEventListener("click", () => {
  btn.classList.add("hidden");
  document.body.classList.add("love-mode");
  loveText.classList.add("show");

  // 🔊 Play audio on click (GitHub Pages + browser policy safe)
  if (song) {
    song.currentTime = 0;
    song.volume = 0.7;

    song.play().catch((err) => {
      console.warn("Audio play failed:", err);
    });
  }

  burstHearts(40);

  if (!heartsIntervalId) {
    heartsIntervalId = setInterval(() => {
      spawnHeart();
      if (Math.random() < 0.35) spawnHeart();
    }, 180);
  }
});
