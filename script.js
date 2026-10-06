const canvas = document.getElementById('birthdayCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Load the PNG asset sheet
const assetPackUrl = 'image_3.png';
const assets = new Image();
assets.src = assetPackUrl;

// Asset Coordinates from PNG image
const spriteCoords = {
    table: [27, 280, 237, 163],
    chair: [280, 281, 79, 161],
    tripodCamera: [378, 280, 78, 163],
    blueHanging: [480, 292, 160, 137],
    curtainWindow: [671, 283, 161, 155],
    cakeZash: [28, 563, 111, 126],
    cupcakes: [159, 563, 114, 126],
    giftRedBow: [292, 559, 97, 133],
    giftBlueBow: [419, 574, 102, 113],
    giftStack: [533, 545, 121, 153],
    candleLit: [684, 577, 65, 113],
    gantry: [25, 765, 230, 230],
    balloonPurple: [433, 778, 57, 169],
    balloonGreen: [508, 778, 57, 169],
    balloonHeartRed: [577, 778, 75, 169],
    catLeft: [669, 799, 93, 142],
    frameRose: [902, 799, 83, 142]
};

let audioContext, analyser, microphone;
let candlesLit = true, isMicActive = false;
let cat, balloons = [], gifts = [], particles = [], mainCake;

function createSceneObjects() {
    gifts.push(
        { ...spriteCoords.giftStack, x: 210, y: 390, wish: "✨ May your 28th year be filled with pure magic, joy, and endless spells of victory!" },
        { ...spriteCoords.giftBlueBow, x: 310, y: 360, wish: "🦉 A special Hogwarts owl brought this: Have a fantastic and happy Birthday Zash!" },
        { ...spriteCoords.giftRedBow, x: 570, y: 380, wish: "⚡ Accio happiness! May all your dreams and magical ambitions come true this year!" }
    );

    balloons.push(
        { ...spriteCoords.balloonPurple, x: 200, y: 150, popped: false },
        { ...spriteCoords.balloonGreen, x: 580, y: 180, popped: false },
        { ...spriteCoords.balloonHeartRed, x: 540, y: 220, popped: false }
    );

    mainCake = { ...spriteCoords.cakeZash, x: 345, y: 230 };

    cat = {
        ...spriteCoords.catLeft,
        x: 650, y: 380,
        speedX: 1, speedY: 0,
        scale: 0.6, direction: 1
    };
}

function drawBackground() {
    ctx.fillStyle = '#6e4a30'; ctx.fillRect(0, 0, 800, 340);
    ctx.fillStyle = '#4a3118'; ctx.fillRect(0, 340, 800, 160);

    ctx.strokeStyle = '#3a2612'; ctx.lineWidth = 1;
    for (let i = 340; i < 500; i += 15) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(800, i); ctx.stroke();
    }

    ctx.drawImage(assets, ...spriteCoords.gantry, 310, 0, 180, 180);
    ctx.drawImage(assets, ...spriteCoords.blueHanging, 320, 150, 160, 137);
    ctx.drawImage(assets, ...spriteCoords.curtainWindow, 20, 100, 161, 155);
    ctx.drawImage(assets, ...spriteCoords.cupcakes, 160, 240, 114, 126);
    ctx.drawImage(assets, ...spriteCoords.tripodCamera, 120, 210, 78, 163);
    ctx.drawImage(assets, ...spriteCoords.frameRose, 700, 150, 83, 142);
}

async function initMicrophone() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        
        isMicActive = true;
        document.getElementById('micStatus').innerText = "Mic Active! Blow now!";
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

    let average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    if (average > 18) {
        candlesLit = false;
        document.getElementById('micStatus').innerText = "🎉 Candles Blown Out!";
    } else {
        requestAnimationFrame(detectBlow);
    }
}

document.getElementById('micBtn').addEventListener('click', initMicrophone);

function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    ctx.drawImage(assets, ...spriteCoords.table, 260, 260, 237, 163);
    ctx.drawImage(assets, ...mainCake, mainCake.x, mainCake.y, mainCake[2], mainCake[3]);

    gifts.forEach(g => ctx.drawImage(assets, g[0], g[1], g[2], g[3], g.x, g.y, g[2], g[3]));

    const time = Date.now() * 0.005;
    balloons.forEach(b => {
        if (!b.popped) {
            let floatY = b.y + Math.sin(time + b.x) * 5;
            ctx.drawImage(assets, b[0], b[1], b[2], b[3], b.x, floatY, b[2], b[3]);
        }
    });

    // Cat walking animation
    cat.x += cat.speedX;
    if (cat.x > 720) { cat.speedX = -1; cat.direction = -1; }
    if (cat.x < 50) { cat.speedX = 1; cat.direction = 1; }

    ctx.save();
    ctx.translate(cat.x + (cat[2] * cat.scale) / 2, cat.y);
    ctx.scale(cat.direction * cat.scale, cat.scale);
    ctx.drawImage(assets, ...spriteCoords.catLeft, -cat[2] / 2, 0, cat[2], cat[3]);
    ctx.restore();

    if (candlesLit) {
        ctx.drawImage(assets, ...spriteCoords.candleLit, 395, 232, 20, 30);
    }

    particles.forEach((p, index) => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.02;
        ctx.fillStyle = p.color || `#ffd700`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        if (p.life <= 0) particles.splice(index, 1);
    });

    requestAnimationFrame(drawScene);
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    balloons.forEach(b => {
        if (!b.popped && clickX >= b.x && clickX <= b.x + b[2] && clickY >= b.y && clickY <= b.y + b[3]) {
            b.popped = true;
            createParticles(b.x + b[2] / 2, b.y + b[3] / 2);
        }
    });

    gifts.forEach(g => {
        if (clickX >= g.x && clickX <= g.x + g[2] && clickY >= g.y && clickY <= g.y + g[3]) {
            document.getElementById('wishText').innerText = g.wish;
            document.getElementById('wishModal').classList.remove('hidden');
        }
    });
});

function createParticles(x, y) {
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6,
            size: Math.random() * 5 + 2, life: 1.0
        });
    }
}

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('wishModal').classList.add('hidden');
});

assets.onload = () => {
    createSceneObjects();
    drawScene();
};
