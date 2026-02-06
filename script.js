const btn = document.getElementById("pressBtn");
const loveText = document.getElementById("loveText");
const heartsLayer = document.getElementById("hearts");

// <audio id="loveSong" src="love.mp3" preload="auto"></audio>
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

function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = "❤";

  heart.style.setProperty("--x", rand(0, 100) + "vw");
  heart.style.setProperty("--size", rand(18, 54) + "px");
  heart.style.setProperty(
    "--color",
    heartColors[Math.floor(Math.random() * heartColors.length)]
  );
  heart.style.setProperty("--dur", rand(2.2, 4.6) + "s");
  heart.style.setProperty("--rise", rand(420, 980) + "px");
  heart.style.setProperty("--rot", rand(-25, 25) + "deg");

  heartsLayer.appendChild(heart);

  setTimeout(() => heart.remove(), 5000);
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

  
  if (song) {
    song.currentTime = 0; // start from beginning each time
    song.volume = 0.7;    // optional (0.0 to 1.0)

    // play() can fail if browser blocks it for some reason, so catch just in case
    song.play().catch(() => {
      // If it fails, there’s nothing critical to break—visuals still work.
      // You can open DevTools console to see why in your browser.
    });
  }

  burstHearts(40);

  // ✅ NEW: only start interval once
  if (!heartsIntervalId) {
    heartsIntervalId = setInterval(() => {
      spawnHeart();
      if (Math.random() < 0.35) spawnHeart();
    }, 180);
  }
});
