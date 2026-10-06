const canvas = document.getElementById('birthdayCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Embedded Stand-in canvas-based sprite generator so you don't need any local image file!
let audioContext, analyser, microphone;
let candlesLit = true, isMicActive = false;
let cat, balloons = [], gifts = [], particles = [];

function initObjects() {
    gifts = [
        { x: 210, y: 380, width: 45, height: 40, color: '#c0392b', ribbon: '#f1c40f', wish: "✨ May your 28th year be filled with pure magic, joy, and endless spells of victory!" },
        { x: 320, y: 350, width: 40, height: 35, color: '#2980b9', ribbon: '#ecf0f1', wish: "🦉 A special Hogwarts owl brought this: Have a fantastic and happy Birthday Zash!" },
        { x: 570, y: 380, width: 50, height: 45, color: '#d35400', ribbon: '#f1c40f', wish: "⚡ Accio happiness! May all your dreams and magical ambitions come true this year!" }
    ];

    balloons = [
        { x: 200, y: 140, radius: 18, color: '#8e44ad', popped: false },
        { x: 580, y: 170, radius: 18, color: '#2ecc71', popped: false },
        { x: 540, y: 210, radius: 18, color: '#e74c3c', popped: false, isHeart: true }
    ];

    cat = {
        x: 650, y: 410,
        width: 32, height: 26,
        speedX: 1, direction: 1
    };
}

// Background Drawing
function drawRoom() {
    // Wall & Floor
    ctx.fillStyle = '#6e4a30'; ctx.fillRect(0, 0, 800, 340);
    ctx.fillStyle = '#4a3118'; ctx.fillRect(0, 340, 800, 160);

    // Floor lines
    ctx.strokeStyle = '#3a2612'; ctx.lineWidth = 2;
    for (let i = 340; i < 500; i += 20) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(800, i); ctx.stroke();
    }

    // Window
    ctx.fillStyle = '#0f172a'; ctx.fillRect(40, 60, 160, 180);
    ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(90, 100, 15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#580d18'; ctx.fillRect(25, 50, 25, 200); ctx.fillRect(190, 50, 25, 200);

    // Banner
    ctx.fillStyle = '#ebd2b0'; ctx.fillRect(230, 60, 340, 45);
    ctx.strokeStyle = '#6b3a19'; ctx.lineWidth = 3; ctx.strokeRect(230, 60, 340, 45);
    ctx.fillStyle = '#2b1405'; ctx.font = '10px "Press Start 2P"'; ctx.textAlign = 'center';
    ctx.fillText("Zash's 28th Birthday Feast!", 400, 87);

    // Rug
    ctx.fillStyle = '#173863'; ctx.fillRect(180, 320, 440, 150);
    ctx.strokeStyle = '#d6a011'; ctx.lineWidth = 3; ctx.strokeRect(185, 325, 430, 140);

    // Table
    ctx.fillStyle = '#d6b88d'; ctx.fillRect(260, 260, 280, 90);
    ctx.fillStyle = '#4a250e'; ctx.fillRect(270, 350, 18, 40); ctx.fillRect(512, 350, 18, 40);

    // Cake ("Happee Birthdae Zash")
    ctx.fillStyle = '#e6739f'; ctx.fillRect(350, 220, 100, 45);
    ctx.fillStyle = '#4a250e'; ctx.fillRect(350, 245, 100, 20);
    ctx.fillStyle = '#ffffff'; ctx.font = '6px "Press Start 2P"';
    ctx.fillText("HAPPEE", 400, 232);
    ctx.fillText("BIRTHDAE", 400, 242);
    ctx.fillText("ZASH", 400, 252);
}

// Candle & Blow Detection
async function initMicrophone() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        
        isMicActive = true;
        document.getElementById('micStatus').innerText = "Mic Active! Blow into mic now!";
        document.getElementById('micBtn').style.display = 'none';
        detectBlow();
    } catch (err) {
        alert("Microphone permission denied.");
    }
}

function detectBlow() {
    if (!isMicActive || !candlesLit) return;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    let average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    if (average > 20) {
        candlesLit = false;
        document.getElementById('micStatus').innerText = "🎉 Candles Blown Out!";
    } else {
        requestAnimationFrame(detectBlow);
    }
}

document.getElementById('micBtn').addEventListener('click', initMicrophone);

// Main Game/Scene Loop
function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRoom();

    const time = Date.now() * 0.005;

    // Cake Candles
    for (let i = 0; i < 5; i++) {
        let cx = 365 + i * 16;
        let cy = 205;
        ctx.fillStyle = '#ffffff'; ctx.fillRect(cx, cy, 4, 15);

        if (candlesLit) {
            ctx.fillStyle = '#ff9900';
            ctx.beginPath();
            ctx.arc(cx + 2, cy - 4, 3 + Math.sin(time * 4 + i) * 1, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
            ctx.fillRect(cx + 1, cy - 8 - Math.sin(time + i) * 3, 2, 5);
        }
    }

    // Gifts
    gifts.forEach(g => {
        ctx.fillStyle = g.color; ctx.fillRect(g.x, g.y, g.width, g.height);
        ctx.fillStyle = g.ribbon;
        ctx.fillRect(g.x + g.width / 2 - 2, g.y, 4, g.height);
        ctx.fillRect(g.x, g.y + g.height / 2 - 2, g.width, 4);
    });

    // Balloons
    balloons.forEach(b => {
        if (!b.popped) {
            let floatY = b.y + Math.sin(time + b.x) * 4;
            ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(b.x, floatY + b.radius); ctx.lineTo(b.x, floatY + b.radius + 30); ctx.stroke();

            ctx.fillStyle = b.color;
            ctx.beginPath();
            if (b.isHeart) {
                ctx.arc(b.x - 6, floatY, 10, 0, Math.PI * 2);
                ctx.arc(b.x + 6, floatY, 10, 0, Math.PI * 2);
            } else {
                ctx.arc(b.x, floatY, b.radius, 0, Math.PI * 2);
            }
            ctx.fill();
        }
    });

    // Cat Movement
    cat.x += cat.speedX;
    if (cat.x > 730) { cat.speedX = -1; cat.direction = -1; }
    if (cat.x < 50) { cat.speedX = 1; cat.direction = 1; }

    // Cat Graphics
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(cat.x, cat.y, cat.width, cat.height); // Body
    ctx.fillRect(cat.x + (cat.direction === 1 ? 22 : -4), cat.y - 8, 14, 14); // Head
    ctx.fillStyle = '#f1c40f'; // Eyes
    ctx.fillRect(cat.x + (cat.direction === 1 ? 28 : 0), cat.y - 4, 3, 3);

    // Particles
    particles.forEach((p, index) => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.03;
        ctx.fillStyle = p.color || '#ffd700';
        ctx.fillRect(p.x, p.y, p.size, p.size);
        if (p.life <= 0) particles.splice(index, 1);
    });

    requestAnimationFrame(drawScene);
}

// Click Events (Pop Balloons & Open Gifts)
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    balloons.forEach(b => {
        if (!b.popped) {
            const dist = Math.hypot(clickX - b.x, clickY - b.y);
            if (dist < b.radius + 10) {
                b.popped = true;
                createParticles(b.x, b.y, b.color);
            }
        }
    });

    gifts.forEach(g => {
        if (clickX >= g.x && clickX <= g.x + g.width &&
            clickY >= g.y && clickY <= g.y + g.height) {
            document.getElementById('wishText').innerText = g.wish;
            document.getElementById('wishModal').classList.remove('hidden');
            createParticles(g.x + g.width / 2, g.y, '#ffd700');
        }
    });
});

function createParticles(x, y, color) {
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            size: Math.random() * 5 + 2,
            color: color, life: 1.0
        });
    }
}

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('wishModal').classList.add('hidden');
});

initObjects();
drawScene();
