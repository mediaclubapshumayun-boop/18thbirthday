/**
 * Interactive 16-Bit Pixel Birthday Party Room Engine
 */

// 1. CONFIGURATION
const CONFIG = {
    birthdayPerson: "Alex",
    finalMessage: "May this new year around the sun bring you endless joy, cozy laughter, unbelievable adventures, and all the dreams your heart can hold! You are truly irreplaceable ❤️✨",
    gifts: [
        { id: 0, title: "💌 Sweet Note", message: "I hope this year brings you countless reasons to smile every single day!" },
        { id: 1, title: "⭐ Secret Wish", message: "May all your silent wishes and biggest dreams come true smoothly!" },
        { id: 2, title: "☕ Cozy Hug", message: "Sending you the warmest digital hug and endless cozy vibes!" },
        { id: 3, title: "🎵 Lovely Melody", message: "Here's to a year full of wonderful memories and great music!" },
        { id: 4, title: "🌸 Flower Blessing", message: "May your day bloom as brightly as these pixel flowers!" },
        { id: 5, title: "✨ Cosmic Joy", message: "You shine brighter than all the stars outside the window!" }
    ],
    secretHints: [
        "Found the secret heart behind the chair! ❤️",
        "Spotted a shining star outside the cozy window! ⭐",
        "Discovered the hidden note under the party table! 📝",
        "Found the hidden present tucked behind decorations! 🎁",
        "Found the tiny pixel sparkle on the bookshelf! ✨"
    ]
};

// 2. STATE MANAGEMENT
const state = {
    giftsOpened: [false, false, false, false, false, false],
    balloonsPopped: 0,
    heartsCollected: 0,
    secretsFound: [false, false, false, false, false],
    cakeBlown: false,
    completedMiniGameMemory: false,
    completedMiniGameScratch: false,
    isFinaleUnlocked: false,
    soundEnabled: true,
    micStream: null,
    audioCtx: null
};

// Canvas & Engine Vars
let canvas, ctx;
let entities = [];
let particles = [];
let pet = { x: 700, y: 470, vx: 0.5, dir: 1, frame: 0, timer: 0, heartTimer: 0 };
let animFrame = 0;

// WebAudio Synth Sound Effects
function playSynthSound(type) {
    if (!state.soundEnabled) return;
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!state.audioCtx) state.audioCtx = new AudioCtx();
        const ctx = state.audioCtx;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === 'pop') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'gift') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        } else if (type === 'secret' || type === 'heart') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(523.25, now);
            osc.frequency.setValueAtTime(659.25, now + 0.08);
            osc.frequency.setValueAtTime(783.99, now + 0.16);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'pet') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.linearRampToValueAtTime(900, now + 0.1);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        } else if (type === 'camera') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'win') {
            const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
            notes.forEach((freq, idx) => {
                const subOsc = ctx.createOscillator();
                const subGain = ctx.createGain();
                subOsc.type = 'triangle';
                subOsc.frequency.setValueAtTime(freq, now + idx * 0.1);
                subGain.gain.setValueAtTime(0.2, now + idx * 0.1);
                subGain.gain.linearRampToValueAtTime(0.01, now + idx * 0.1 + 0.25);
                subOsc.connect(subGain);
                subGain.connect(ctx.destination);
                subOsc.start(now + idx * 0.1);
                subOsc.stop(now + idx * 0.1 + 0.3);
            });
        }
    } catch (e) {
        console.log("Audio play error:", e);
    }
}

// 3. ENTITY & ROOM INITIALIZATION
function initEntities() {
    entities = [];

    // Gifts (6 main boxes around table/floor)
    const giftPositions = [
        { x: 340, y: 480, w: 32, h: 32, color: '#f72585', id: 0 },
        { x: 380, y: 490, w: 28, h: 28, color: '#4cc9f0', id: 1 },
        { x: 550, y: 485, w: 36, h: 30, color: '#7209b7', id: 2 },
        { x: 600, y: 495, w: 26, h: 26, color: '#ffb703', id: 3 },
        { x: 280, y: 510, w: 34, h: 34, color: '#06d6a0', id: 4 },
        { x: 650, y: 510, w: 30, h: 30, color: '#ff477e', id: 5 }
    ];

    giftPositions.forEach(g => {
        entities.push({ type: 'gift', id: g.id, x: g.x, y: g.y, w: g.w, h: g.h, color: g.color });
    });

    // Balloons (10 interactive floating balloons)
    const balloonColors = ['#ff4d6d', '#ffb703', '#4cc9f0', '#7209b7', '#06d6a0', '#ff70a6', '#4361ee', '#ffb703', '#ff4d6d', '#4cc9f0'];
    for (let i = 0; i < 10; i++) {
        entities.push({
            type: 'balloon',
            id: i,
            x: 80 + i * 82,
            y: 120 + (i % 3) * 25,
            baseY: 120 + (i % 3) * 25,
            w: 24,
            h: 32,
            color: balloonColors[i],
            popped: false
        });
    }

    // Cake on Table
    entities.push({ type: 'cake', x: 448, y: 380, w: 64, h: 50 });

    // Interactive Camera
    entities.push({ type: 'camera', x: 270, y: 410, w: 26, h: 20 });

    // Interactive Photo Frame
    entities.push({ type: 'photo', x: 230, y: 220, w: 40, h: 48 });

    // Interactive Flowers
    entities.push({ type: 'flowers', x: 660, y: 395, w: 30, h: 45 });

    // Interactive Window & Night Stars
    entities.push({ type: 'window', x: 400, y: 80, w: 160, h: 140 });

    // Memory Game Shelf
    entities.push({ type: 'memory_shelf', x: 130, y: 320, w: 50, h: 40 });

    // Scratch Card Box
    entities.push({ type: 'scratch_card', x: 770, y: 400, w: 35, h: 30 });

    // Secrets (5 hidden subtle spots)
    entities.push({ type: 'secret', id: 0, x: 200, y: 490, w: 16, h: 16 }); // Behind chair
    entities.push({ type: 'secret', id: 1, x: 510, y: 100, w: 16, h: 16 }); // Star in window
    entities.push({ type: 'secret', id: 2, x: 470, y: 460, w: 16, h: 16 }); // Note under table
    entities.push({ type: 'secret', id: 3, x: 720, y: 360, w: 16, h: 16 }); // Behind bookshelf item
    entities.push({ type: 'secret', id: 4, x: 150, y: 220, w: 16, h: 16 }); // Wall decor secret
}

// 4. RENDERING ENGINE
function drawPixelRoom() {
    // Clear canvas
    ctx.fillStyle = '#1e0f28';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 1. Wallpaper / Wall
    ctx.fillStyle = '#3a1c4a';
    ctx.fillRect(0, 0, canvas.width, 440);

    // Wall Stripes
    ctx.fillStyle = '#47225b';
    for (let x = 0; x < canvas.width; x += 40) {
        ctx.fillRect(x, 0, 20, 440);
    }

    // 2. Wooden Floor
    ctx.fillStyle = '#834b22';
    ctx.fillRect(0, 440, canvas.width, 200);
    ctx.fillStyle = '#673715';
    for (let y = 440; y < canvas.height; y += 25) {
        ctx.fillRect(0, y, canvas.width, 3);
    }

    // 3. Window & Night Sky
    ctx.fillStyle = '#0d1b2a';
    ctx.fillRect(400, 80, 160, 140);
    // Moon
    ctx.fillStyle = '#ffecd1';
    ctx.beginPath();
    ctx.arc(520, 120, 22, 0, Math.PI * 2);
    ctx.fill();
    // Twinkling Stars
    ctx.fillStyle = '#ffffff';
    const starOffsets = [[420, 100], [450, 140], [480, 90], [530, 170], [430, 180]];
    starOffsets.forEach(([sx, sy], i) => {
        if ((animFrame + i * 10) % 40 < 20) {
            ctx.fillRect(sx, sy, 3, 3);
        }
    });
    // Window Frame & Curtains
    ctx.strokeStyle = '#2b1035';
    ctx.lineWidth = 6;
    ctx.strokeRect(400, 80, 160, 140);
    ctx.beginPath();
    ctx.moveTo(480, 80); ctx.lineTo(480, 220);
    ctx.moveTo(400, 150); ctx.lineTo(560, 150);
    ctx.stroke();

    // Pink Curtains
    ctx.fillStyle = '#ff70a6';
    const curtainWave = Math.sin(animFrame * 0.05) * 3;
    ctx.fillRect(380, 75, 25 + curtainWave, 150);
    ctx.fillRect(555 - curtainWave, 75, 25 + curtainWave, 150);

    // 4. "HAPPY BIRTHDAY!" Banner
    ctx.fillStyle = '#ffb703';
    ctx.fillRect(200, 30, 560, 28);
    ctx.strokeStyle = '#fb8500';
    ctx.strokeRect(200, 30, 560, 28);
    ctx.fillStyle = '#2b1035';
    ctx.font = '12px "Press Start 2P"';
    ctx.fillText("🎉 HAPPY BIRTHDAY " + CONFIG.birthdayPerson.toUpperCase() + "! 🎉", 215, 50);

    // 5. Party Table & Tablecloth
    ctx.fillStyle = '#ffb703'; // Table legs
    ctx.fillRect(310, 430, 15, 60);
    ctx.fillRect(635, 430, 15, 60);
    // Checkered Tablecloth
    const tcX = 290, tcY = 410, tcW = 380, tcH = 40;
    ctx.fillStyle = '#ff70a6';
    ctx.fillRect(tcX, tcY, tcW, tcH);
    ctx.fillStyle = '#ffffff';
    for (let x = tcX; x < tcX + tcW; x += 20) {
        for (let y = tcY; y < tcY + tcH; y += 20) {
            if (((x - tcX) / 20 + (y - tcY) / 20) % 2 === 0) {
                ctx.fillRect(x, y, 20, 20);
            }
        }
    }

    // Chairs
    ctx.fillStyle = '#9c6644';
    ctx.fillRect(240, 390, 45, 70); // Left chair
    ctx.fillRect(675, 390, 45, 70); // Right chair

    // Shelves & Wall Photos
    ctx.fillStyle = '#522e19';
    ctx.fillRect(120, 260, 80, 10);
    ctx.fillRect(760, 320, 80, 10);

    // Memory Game Icon on Shelf
    ctx.fillStyle = '#ffb703';
    ctx.fillRect(135, 240, 20, 20);
    ctx.fillStyle = '#000';
    ctx.font = '10px monospace';
    ctx.fillText("🧠", 137, 255);

    // Scratch Card Box on Shelf
    ctx.fillStyle = '#06d6a0';
    ctx.fillRect(780, 300, 20, 20);
    ctx.fillText("💌", 782, 315);

    // Render Dynamic Entities
    entities.forEach(ent => {
        if (ent.type === 'gift') {
            drawGift(ent);
        } else if (ent.type === 'balloon') {
            drawBalloon(ent);
        } else if (ent.type === 'cake') {
            drawCake(ent);
        } else if (ent.type === 'camera') {
            ctx.fillStyle = '#4a5568';
            ctx.fillRect(ent.x, ent.y, ent.w, ent.h);
            ctx.fillStyle = '#cbd5e0';
            ctx.beginPath(); ctx.arc(ent.x + 13, ent.y + 10, 6, 0, Math.PI * 2); ctx.fill();
        } else if (ent.type === 'photo') {
            ctx.fillStyle = '#ffb703';
            ctx.fillRect(ent.x, ent.y, ent.w, ent.h);
            ctx.fillStyle = '#4cc9f0';
            ctx.fillRect(ent.x + 4, ent.y + 4, ent.w - 8, ent.h - 8);
            ctx.fillStyle = '#fff';
            ctx.fillText("🖼️", ent.x + 8, ent.y + 28);
        } else if (ent.type === 'flowers') {
            ctx.fillStyle = '#fb8500';
            ctx.fillRect(ent.x + 8, ent.y + 20, 14, 25);
            ctx.fillStyle = '#ff477e';
            ctx.beginPath(); ctx.arc(ent.x + 15, ent.y + 12, 10, 0, Math.PI * 2); ctx.fill();
        } else if (ent.type === 'secret' && !state.secretsFound[ent.id]) {
            // Tiny sparkling hint for secrets
            if (animFrame % 30 < 15) {
                ctx.fillStyle = '#ffb703';
                ctx.fillRect(ent.x + 6, ent.y + 6, 4, 4);
            }
        }
    });

    // Render Cute Pixel Pet
    updateAndDrawPet();

    // Render Particles
    updateAndDrawParticles();

    // Loop
    animFrame++;
    requestAnimationFrame(drawPixelRoom);
}

// Entity Render Helpers
function drawGift(g) {
    const isOpened = state.giftsOpened[g.id];
    ctx.fillStyle = isOpened ? '#6c757d' : g.color;
    ctx.fillRect(g.x, g.y, g.w, g.h);

    if (!isOpened) {
        // Shaking Ribbon / Lid
        const shake = (animFrame % 20 < 10) ? 0 : 1;
        ctx.fillStyle = '#ffb703';
        ctx.fillRect(g.x + g.w / 2 - 3 + shake, g.y, 6, g.h);
        ctx.fillRect(g.x, g.y + g.h / 2 - 3, g.w, 6);
    } else {
        // Opened Box Top Lid
        ctx.fillStyle = '#343a40';
        ctx.fillRect(g.x + 2, g.y + 2, g.w - 4, 6);
    }
}

function drawBalloon(b) {
    if (b.popped) return;
    const floatY = b.baseY + Math.sin((animFrame + b.id * 10) * 0.05) * 6;
    b.y = floatY;

    // String
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(b.x + 12, floatY + 32);
    ctx.lineTo(b.x + 12, floatY + 65);
    ctx.stroke();

    // Balloon Body
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.ellipse(b.x + 12, floatY + 16, 12, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillRect(b.x + 6, floatY + 8, 4, 6);
}

function drawCake(c) {
    // Cake Layers
    ctx.fillStyle = '#f72585';
    ctx.fillRect(c.x, c.y + 20, c.w, 30);
    ctx.fillStyle = '#7209b7';
    ctx.fillRect(c.x + 6, c.y, c.w - 12, 20);

    // Frosting
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(c.x - 2, c.y + 18, c.w + 4, 6);
    ctx.fillRect(c.x + 4, c.y - 2, c.w - 8, 5);

    // Candles
    const candleCoords = [c.x + 16, c.x + 32, c.x + 48];
    candleCoords.forEach(cx => {
        ctx.fillStyle = '#4cc9f0';
        ctx.fillRect(cx, c.y - 14, 4, 12);

        if (!state.cakeBlown) {
            // Flame flicker
            ctx.fillStyle = (animFrame % 10 < 5) ? '#ffb703' : '#ff4800';
            ctx.beginPath();
            ctx.arc(cx + 2, c.y - 17, 3 + Math.random() * 1.5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Smoke rise
            ctx.fillStyle = 'rgba(200,200,200,0.5)';
            ctx.fillRect(cx, c.y - 18 - (animFrame % 20), 3, 3);
        }
    });
}

function updateAndDrawPet() {
    pet.timer++;
    if (pet.timer > 120) {
        pet.dir *= -1;
        pet.timer = 0;
    }
    pet.x += pet.vx * pet.dir;

    // Bound pet near right side
    if (pet.x < 680) pet.x = 680;
    if (pet.x > 820) pet.x = 820;

    // Draw Cute Cat
    ctx.fillStyle = '#ffb703';
    ctx.fillRect(pet.x, pet.y, 24, 18); // Body
    ctx.fillRect(pet.x + (pet.dir > 0 ? 14 : -2), pet.y - 8, 12, 12); // Head

    // Ears
    ctx.fillStyle = '#fb8500';
    ctx.fillRect(pet.x + (pet.dir > 0 ? 14 : -2), pet.y - 12, 4, 4);
    ctx.fillRect(pet.x + (pet.dir > 0 ? 22 : 6), pet.y - 12, 4, 4);

    // Floating Hearts when clicked
    if (pet.heartTimer > 0) {
        pet.heartTimer--;
        ctx.fillStyle = '#ff477e';
        ctx.font = '12px monospace';
        ctx.fillText("❤️", pet.x + 4, pet.y - 18 - (30 - pet.heartTimer));
    }
}

function updateAndDrawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);

        if (p.life <= 0) particles.splice(i, 1);
    }
}

function spawnSparkles(x, y, color = '#ffb703', count = 15) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            color: color,
            size: Math.random() * 4 + 2,
            life: 30 + Math.random() * 20
        });
    }
}

// 5. INTERACTION ENGINE
function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    // 1. Check Gifts
    entities.filter(ent => ent.type === 'gift').forEach(g => {
        if (mx >= g.x && mx <= g.x + g.w && my >= g.y && my <= g.y + g.h) {
            if (!state.giftsOpened[g.id]) {
                state.giftsOpened[g.id] = true;
                spawnSparkles(g.x + 15, g.y, g.color, 25);
                playSynthSound('gift');
                showDialogue(CONFIG.gifts[g.id].title, CONFIG.gifts[g.id].message);
                updateHUD();
                checkGrandFinale();
            } else {
                showDialogue(CONFIG.gifts[g.id].title, "You've already opened this sweet gift! 🎁");
            }
        }
    });

    // 2. Check Balloons
    entities.filter(ent => ent.type === 'balloon' && !ent.popped).forEach(b => {
        if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h + 30) {
            b.popped = true;
            state.balloonsPopped++;
            spawnSparkles(b.x + 12, b.y + 16, b.color, 20);
            playSynthSound('pop');
            updateHUD();

            if (state.balloonsPopped === 3) {
                showDialogue("🎈 Hidden Note!", "You're amazing ❤️");
            } else if (state.balloonsPopped === 7) {
                showDialogue("🎈 Hidden Note!", "Another year of magical adventures await!");
            }
            checkGrandFinale();
        }
    });

    // 3. Check Cake
    const cake = entities.find(ent => ent.type === 'cake');
    if (cake && mx >= cake.x && mx <= cake.x + cake.w && my >= cake.y && my <= cake.y + cake.h) {
        if (!state.cakeBlown) {
            openCakeModal();
        } else {
            showDialogue("🎂 Birthday Cake", "The candles are blown and your wish is flying high into the stars! ✨");
        }
    }

    // 4. Check Pet
    if (mx >= pet.x && mx <= pet.x + 30 && my >= pet.y - 10 && my <= pet.y + 20) {
        pet.heartTimer = 30;
        state.heartsCollected = Math.min(10, state.heartsCollected + 1);
        spawnSparkles(pet.x + 12, pet.y, '#ff477e', 10);
        playSynthSound('pet');
        updateHUD();
        checkGrandFinale();
    }

    // 5. Check Camera
    const cam = entities.find(ent => ent.type === 'camera');
    if (cam && mx >= cam.x && mx <= cam.x + cam.w && my >= cam.y && my <= cam.y + cam.h) {
        playSynthSound('camera');
        // Flash effect
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        showDialogue("📷 Click!", "Captured a lovely birthday memory! Say cheese! 🧀✨");
    }

    // 6. Check Photo Frame
    const photo = entities.find(ent => ent.type === 'photo');
    if (photo && mx >= photo.x && mx <= photo.x + photo.w && my >= photo.y && my <= photo.y + photo.h) {
        playSynthSound('secret');
        showDialogue("🖼️ Framed Memory", "A cherished memory from a wonderful day. Here's to making 100 more!");
    }

    // 7. Check Flowers
    const flowers = entities.find(ent => ent.type === 'flowers');
    if (flowers && mx >= flowers.x && mx <= flowers.x + flowers.w && my >= flowers.y && my <= flowers.y + flowers.h) {
        spawnSparkles(flowers.x + 15, flowers.y + 10, '#ff70a6', 15);
        playSynthSound('heart');
    }

    // 8. Check Window / Night Stars
    const win = entities.find(ent => ent.type === 'window');
    if (win && mx >= win.x && mx <= win.x + win.w && my >= win.y && my <= win.y + win.h) {
        showDialogue("🪟 Cozy Night Sky", "The stars are shining especially bright tonight just for your birthday!");
    }

    // 9. Check Memory Game Shelf
    const shelf = entities.find(ent => ent.type === 'memory_shelf');
    if (shelf && mx >= shelf.x && mx <= shelf.x + shelf.w && my >= shelf.y - 20 && my <= shelf.y + shelf.h) {
        openMemoryGame();
    }

    // 10. Check Scratch Card Box
    const scratchBox = entities.find(ent => ent.type === 'scratch_card');
    if (scratchBox && mx >= scratchBox.x && mx <= scratchBox.x + scratchBox.w && my >= scratchBox.y - 20 && my <= scratchBox.y + scratchBox.h) {
        openScratchCard();
    }

    // 11. Check Secrets
    entities.filter(ent => ent.type === 'secret').forEach(sec => {
        if (!state.secretsFound[sec.id] && mx >= sec.x && mx <= sec.x + sec.w && my >= sec.y && my <= sec.y + sec.h) {
            state.secretsFound[sec.id] = true;
            spawnSparkles(sec.x, sec.y, '#ffb703', 25);
            playSynthSound('secret');
            showDialogue("✨ SECRET FOUND!", CONFIG.secretHints[sec.id]);
            updateHUD();
            checkGrandFinale();
        }
    });
}

// 6. MODAL & MINI-GAME CONTROLLERS
function showDialogue(title, content) {
    document.getElementById('dialogue-title').innerText = title;
    document.getElementById('dialogue-content').innerText = content;
    document.getElementById('dialogue-modal').classList.remove('hidden');
}

function updateHUD() {
    const openedCount = state.giftsOpened.filter(Boolean).length;
    const secretsCount = state.secretsFound.filter(Boolean).length;

    document.getElementById('hud-gifts').innerText = `${openedCount}/6`;
    document.getElementById('hud-balloons').innerText = `${state.balloonsPopped}/10`;
    document.getElementById('hud-hearts').innerText = `${state.heartsCollected}/10`;
    document.getElementById('hud-secrets').innerText = `${secretsCount}/5`;
    document.getElementById('hud-cake').innerText = state.cakeBlown ? '✓' : '❌';

    // Save progress to Firebase Firestore backend
    saveProgressToFirebase(state);
}

// Cake Candle Blow Handler (Mic + Fallback)
function openCakeModal() {
    const modal = document.getElementById('cake-modal');
    modal.classList.remove('hidden');

    // Init Mic listening
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            state.micStream = stream;
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const mic = audioCtx.createMediaStreamSource(stream);
            const analyzer = audioCtx.createAnalyser();
            analyzer.fftSize = 256;
            mic.connect(analyzer);

            const dataArray = new Uint8Array(analyzer.frequencyBinCount);
            const indicator = document.getElementById('mic-indicator');

            function checkBlow() {
                if (state.cakeBlown || modal.classList.contains('hidden')) {
                    stream.getTracks().forEach(t => t.stop());
                    return;
                }
                analyzer.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
                let average = sum / dataArray.length;

                indicator.style.width = Math.min(100, average * 2) + '%';

                if (average > 45) { // Mic blow threshold
                    triggerCakeExtinguished();
                    stream.getTracks().forEach(t => t.stop());
                } else {
                    requestAnimationFrame(checkBlow);
                }
            }
            checkBlow();
        }).catch(err => {
            console.log("Mic access not granted, fallback enabled:", err);
        });
    }
}

function triggerCakeExtinguished() {
    state.cakeBlown = true;
    document.getElementById('cake-modal').classList.add('hidden');
    playSynthSound('win');
    spawnSparkles(480, 380, '#ffb703', 50);
    showDialogue("✨ WISH MADE! ✨", "HAPPY BIRTHDAY! 🎂 Your wish is sent up to the stars!");
    updateHUD();
    checkGrandFinale();
}

// Memory Match Game logic
function openMemoryGame() {
    const modal = document.getElementById('memory-modal');
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';

    const icons = ['❤️️', '🎂', '🎁', '⭐', '🎈', '🌸'];
    const cardsData = [...icons, ...icons].sort(() => Math.random() - 0.5);
    let flippedCards = [];

    cardsData.forEach((icon, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.icon = icon;
        card.dataset.index = index;
        card.innerText = '❓';

        card.addEventListener('click', () => {
            if (card.classList.contains('flipped') || flippedCards.length === 2) return;

            card.classList.add('flipped');
            card.innerText = icon;
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                if (flippedCards[0].dataset.icon === flippedCards[1].dataset.icon) {
                    flippedCards[0].classList.add('matched');
                    flippedCards[1].classList.add('matched');
                    flippedCards = [];
                    playSynthSound('secret');

                    // Check win
                    if (document.querySelectorAll('.memory-card.matched').length === cardsData.length) {
                        state.completedMiniGameMemory = true;
                        setTimeout(() => {
                            modal.classList.add('hidden
