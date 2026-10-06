const canvas = document.getElementById('roomCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Audio / Mic Variables
let audioContext;
let analyser;
let microphone;
let isMicActive = false;
let candlesLit = true;

// Balloons State
let balloons = [
  { id: 1, x: 220, y: 190, radius: 18, color: '#9b59b6', popped: false },
  { id: 2, x: 250, y: 220, radius: 16, color: '#f1c40f', popped: false },
  { id: 3, x: 570, y: 200, radius: 18, color: '#e74c3c', popped: false },
  { id: 4, x: 600, y: 230, radius: 16, color: '#2ecc71', popped: false }
];

// Gifts State & Wishes
let gifts = [
  { id: 1, x: 200, y: 390, width: 35, height: 35, opened: false, wish: "✨ May your 28th year be filled with pure magic, joy, and endless spells of victory!" },
  { id: 2, x: 310, y: 350, width: 30, height: 30, opened: false, wish: "🦉 A special Hogwarts owl brought this: Have a fantastic and happy Birthday Zash!" },
  { id: 3, x: 580, y: 380, width: 40, height: 35, opened: false, wish: "⚡ Accio happiness! May all your dreams and magical ambitions come true this year!" }
];

// Floating Cake Candles
let cakeCandles = [
  { x: 380, y: 225 },
  { x: 390, y: 222 },
  { x: 400, y: 220 },
  { x: 410, y: 222 },
  { x: 420, y: 225 }
];

let particles = [];

// Initialize Microphone Input
async function initMicrophone() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
    analyser.fftSize = 256;
    
    isMicActive = true;
    document.getElementById('micStatusText').innerText = "Mic Active! Blow now!";
    document.getElementById('micBtn').style.display = 'none';
    listenForBlow();
  } catch (err) {
    alert("Microphone permission denied or not supported.");
    document.getElementById('micStatusText').innerText = "Mic Permission Denied";
  }
}

// Detect Blowing Sound
function listenForBlow() {
  if (!isMicActive || !candlesLit) return;

  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);

  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i];
  }
  let average = sum / dataArray.length;

  // Threshold for blowing sound
  if (average > 45) {
    candlesLit = false;
    document.getElementById('micStatusText').innerText = "🎉 Candles Blown Out!";
  } else {
    requestAnimationFrame(listenForBlow);
  }
}

document.getElementById('micBtn').addEventListener('click', initMicrophone);

// Main Canvas Drawing Loop
function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Room Background & Wooden Floor
  ctx.fillStyle = '#5c2d12';
  ctx.fillRect(0, 0, 800, 330);
  ctx.fillStyle = '#3a1a09';
  ctx.fillRect(0, 330, 800, 170);

  // Floor Planks
  ctx.strokeStyle = '#251004';
  ctx.lineWidth = 2;
  for (let y = 330; y < 500; y += 22) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(800, y);
    ctx.stroke();
  }

  // 2. Arch Window
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(280, 40, 240, 200);
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(340, 90, 18, 0, Math.PI * 2);
  ctx.fill();

  // Curtains
  ctx.fillStyle = '#580d18';
  ctx.fillRect(255, 30, 30, 220);
  ctx.fillRect(515, 30, 30, 220);

  // Window Grids
  ctx.strokeStyle = '#3a1a09';
  ctx.lineWidth = 4;
  ctx.strokeRect(280, 40, 240, 200);

  // 3. Banner
  ctx.fillStyle = '#ebd2b0';
  ctx.fillRect(210, 65, 380, 45);
  ctx.strokeStyle = '#6b3a19';
  ctx.strokeRect(210, 65, 380, 45);
  ctx.fillStyle = '#2b1405';
  ctx.font = '11px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillText("Zash's 28th Birthday Feast!", 400, 92);

  // 4. Rug
  ctx.fillStyle = '#173863';
  ctx.fillRect(180, 320, 440, 150);
  ctx.strokeStyle = '#d6a011';
  ctx.lineWidth = 3;
  ctx.strokeRect(185, 325, 430, 140);

  // 5. Table & Chairs
  ctx.fillStyle = '#d6b88d';
  ctx.fillRect(260, 250, 280, 90);
  ctx.fillStyle = '#4a250e';
  ctx.fillRect(270, 340, 18, 40);
  ctx.fillRect(512, 340, 18, 40);

  ctx.fillStyle = '#5c2d12';
  ctx.fillRect(215, 260, 30, 80);
  ctx.fillRect(555, 260, 30, 80);

  // 6. Cake
  ctx.fillStyle = '#e6739f';
  ctx.fillRect(360, 230, 80, 40);
  ctx.fillStyle = '#4a250e';
  ctx.fillRect(360, 250, 80, 20);

  ctx.fillStyle = '#ffffff';
  ctx.font = '5px "Press Start 2P"';
  ctx.fillText("HAPPEE", 400, 240);
  ctx.fillText("BIRTHDAE", 400, 248);
  ctx.fillText("ZASH", 400, 256);

  // 7. Cake Candles
  const time = Date.now() * 0.005;
  cakeCandles.forEach((c) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(c.x, c.y, 4, 10);

    if (candlesLit) {
      // Animated Flame
      ctx.fillStyle = '#ff9900';
      ctx.beginPath();
      ctx.arc(c.x + 2, c.y - 3, 3 + Math.sin(time * 4) * 0.8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Smoke Effect when blown out
      ctx.fillStyle = 'rgba(180, 180, 180, 0.6)';
      ctx.fillRect(c.x + 1, c.y - 5 - (Math.sin(time) * 3), 2, 4);
    }
  });

  // 8. Balloons Rendering
  balloons.forEach((b) => {
    if (!b.popped) {
      let floatY = b.y + Math.sin(time + b.id) * 3;
      // String
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(b.x, floatY + b.radius);
      ctx.lineTo(b.x, floatY + b.radius + 30);
      ctx.stroke();

      // Balloon body
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(b.x, floatY, b.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // 9. Gifts Rendering
  gifts.forEach((g) => {
    ctx.fillStyle = g.opened ? '#8c501c' : '#bdc3c7';
    ctx.fillRect(g.x, g.y, g.width, g.height);

    if (!g.opened) {
      // Gift Box Color & Ribbon
      ctx.fillStyle = '#d35400';
      ctx.fillRect(g.x, g.y, g.width, g.height);
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(g.x + g.width / 2 - 2, g.y, 4, g.height);
      ctx.fillRect(g.x, g.y + g.height / 2 - 2, g.width, 4);
    } else {
      // Open Box Top
      ctx.fillStyle = '#7f8c8d';
      ctx.fillRect(g.x - 2, g.y - 6, g.width + 4, 6);
    }
  });

  // 10. Particles Animation (Sparks/Pops)
  particles.forEach((p, index) => {
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.03;
    ctx.fillStyle = p.color || `#ffd700`;
    ctx.fillRect(p.x, p.y, p.size, p.size);

    if (p.life <= 0) particles.splice(index, 1);
  });

  requestAnimationFrame(drawScene);
}

// Click Interactions: Balloon Pop & Gift Open
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  // 1. Check Balloon Clicks
  balloons.forEach((b) => {
    if (!b.popped) {
      const dist = Math.hypot(clickX - b.x, clickY - b.y);
      if (dist < b.radius + 5) {
        b.popped = true;
        createPopParticles(b.x, b.y, b.color);
      }
    }
  });

  // 2. Check Gift Clicks
  gifts.forEach((g) => {
    if (clickX >= g.x && clickX <= g.x + g.width &&
        clickY >= g.y && clickY <= g.y + g.height) {
      g.opened = true;
      showWishModal(g.wish);
    }
  });
});

// Create POP Particle Effect
function createPopParticles(x, y, color) {
  for (let i = 0; i < 15; i++) {
    particles.push({
      x: x, y: y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      size: Math.random() * 4 + 2,
      color: color,
      life: 1.0
    });
  }
}

// Wish Modal Logic
const modal = document.getElementById('wishModal');
const wishText = document.getElementById('wishText');
const closeModal = document.getElementById('closeModal');

function showWishModal(wish) {
  wishText.innerText = wish;
  modal.classList.remove('hidden');
}

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Start loop
drawScene();
