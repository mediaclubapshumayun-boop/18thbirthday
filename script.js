const CONFIG = {
    birthdayPerson: "Alex",
    finalMessage: "May this year bring you endless joy, cozy laughter, unbelievable adventures, and all the warmth your heart can hold! You are truly special ❤️✨",
    gifts: [
        { title: "💌 Sweet Note", message: "I hope this year brings you countless reasons to smile!" },
        { title: "⭐ Secret Wish", message: "May all your silent wishes come true smoothly!" },
        { title: "☕ Cozy Hug", message: "Sending you the warmest digital hug and endless cozy vibes!" },
        { title: "🎵 Lovely Melody", message: "Here's to a year full of wonderful memories and great music!" },
        { title: "🌸 Flower Blessing", message: "May your day bloom as brightly as these pixel flowers!" },
        { title: "✨ Cosmic Joy", message: "You shine brighter than all the stars outside the window!" }
    ],
    secretHints: [
        "Found the secret heart behind the chair! ❤️",
        "Spotted a shining star outside the window! ⭐",
        "Discovered the note under the party table! 📝",
        "Found the hidden present behind decorations! 🎁",
        "Found the tiny pixel sparkle on the shelf! ✨"
    ]
};

const state = {
    giftsOpened: [false, false, false, false, false, false],
    balloonsPopped: 0,
    heartsCollected: 0,
    secretsFound: [false, false, false, false, false],
    cakeBlown: false,
    soundEnabled: true,
    audioCtx: null
};

let canvas, ctx;
let entities = [], particles = [];
let pet = { x: 700, y: 470, vx: 0.5, dir: 1, timer: 0, heartTimer: 0 };
let animFrame = 0;

window.addEventListener('load', () => {
    canvas = document.getElementById('roomCanvas');
    ctx = canvas.getContext('2d');

    initEntities();
    setupEventListeners();
    requestAnimationFrame(drawPixelRoom);
});

function setupEventListeners() {
    canvas.addEventListener('click', handleCanvasClick);

    document.getElementById('start-btn').onclick = () => {
        document.getElementById('intro-modal').classList.add('hidden');
    };

    document.getElementById('dialogue-close').onclick = () => {
        document.getElementById('dialogue-modal').classList.add('hidden');
    };

    document.getElementById('audio-toggle').onclick = () => {
        state.soundEnabled = !state.soundEnabled;
        document.getElementById('audio-toggle').innerText = state.soundEnabled ? "🔊 Sound ON" : "🔇 Sound OFF";
    };

    document.getElementById('blow-fallback-btn').onclick = () => {
        triggerCakeExtinguished();
    };

    document.getElementById('cake-close-btn').onclick = () => {
        document.getElementById('cake-modal').classList.add('hidden');
    };

    document.getElementById('memory-close').onclick = () => {
        document.getElementById('memory-modal').classList.add('hidden');
    };

    document.getElementById('scratch-close').onclick = () => {
        document.getElementById('scratch-modal').classList.add('hidden');
    };

    document.getElementById('finale-replay-btn').onclick = () => {
        document.getElementById('finale-modal').classList.add('hidden');
    };
}

function initEntities() {
    entities = [];
    const giftPositions = [
        { x: 340, y: 480, w: 32, h: 32, color: '#f72585', id: 0 },
        { x: 380, y: 490, w: 28, h: 28, color: '#4cc9f0', id: 1 },
        { x: 550, y: 485, w: 36, h: 30, color: '#7209b7', id: 2 },
        { x: 600, y: 495, w: 26, h: 26, color: '#ffb703', id: 3 },
        { x: 280, y: 510, w: 34, h: 34, color: '#06d6a0', id: 4 },
        { x: 650, y: 510, w: 30, h: 30, color: '#ff477e', id: 5 }
    ];
    giftPositions.forEach(g => entities.push({ type: 'gift', ...g }));

    const colors = ['#ff4d6d', '#ffb703', '#4cc9f0', '#7209b7', '#06d6a0', '#ff70a6', '#4361ee', '#ffb703', '#ff4d6d', '#4cc9f0'];
    for (let i = 0; i < 10; i++) {
        entities.push({ type: 'balloon', id: i, x: 80 + i * 82, y: 120 + (i % 3) * 25, baseY: 120 + (i % 3) * 25, w: 24, h: 32, color: colors[i], popped: false });
    }

    entities.push({ type: 'cake', x: 448, y: 380, w: 64, h: 50 });
    entities.push({ type: 'camera', x: 270, y: 410, w: 26, h: 20 });
    entities.push({ type: 'photo', x: 230, y: 220, w: 40, h: 48 });
    entities.push({ type: 'flowers', x: 660, y: 395, w: 30, h: 45 });
    entities.push({ type: 'window', x: 400, y: 80, w: 160, h: 140 });

    entities.push({ type: 'secret', id: 0, x: 200, y: 490, w: 16, h: 16 });
    entities.push({ type: 'secret', id: 1, x: 510, y: 100, w: 16, h: 16 });
    entities.push({ type: 'secret', id: 2, x: 470, y: 460, w: 16, h: 16 });
    entities.push({ type: 'secret', id: 3, x: 720, y: 360, w: 16, h: 16 });
    entities.push({ type: 'secret', id: 4, x: 150, y: 220, w: 16, h: 16 });
}

function drawPixelRoom() {
    ctx.fillStyle = '#1e0f28';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#3a1c4a';
    ctx.fillRect(0, 0, canvas.width, 440);
    ctx.fillStyle = '#47225b';
    for (let x = 0; x < canvas.width; x += 40) ctx.fillRect(x, 0, 20, 440);

    ctx.fillStyle = '#834b22';
    ctx.fillRect(0, 440, canvas.width, 200);

    ctx.fillStyle = '#0d1b2a';
    ctx.fillRect(400, 80, 160, 140);
    ctx.fillStyle = '#ffecd1';
    ctx.beginPath(); ctx.arc(520, 120, 22, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#ffb703';
    ctx.fillRect(200, 30, 560, 28);
    ctx.fillStyle = '#2b1035';
    ctx.font = '12px "Press Start 2P"';
    ctx.fillText("🎉 HAPPY BIRTHDAY " + CONFIG.birthdayPerson.toUpperCase() + "! 🎉", 215, 50);

    ctx.fillStyle = '#ff70a6';
    ctx.fillRect(290, 410, 380, 40);

    entities.forEach(ent => {
        if (ent.type === 'gift') {
            ctx.fillStyle = state.giftsOpened[ent.id] ? '#6c757d' : ent.color;
            ctx.fillRect(ent.x, ent.y, ent.w, ent.h);
        } else if (ent.type === 'balloon' && !ent.popped) {
            ctx.fillStyle = ent.color;
            ctx.beginPath(); ctx.ellipse(ent.x + 12, ent.y + 16, 12, 16, 0, 0, Math.PI * 2); ctx.fill();
        } else if (ent.type === 'cake') {
            ctx.fillStyle = '#f72585'; ctx.fillRect(ent.x, ent.y + 20, ent.w, 30);
            ctx.fillStyle = '#7209b7'; ctx.fillRect(ent.x + 6, ent.y, ent.w - 12, 20);
            ctx.fillStyle = '#ffffff'; ctx.fillRect(ent.x - 2, ent.y + 18, ent.w + 4, 6);
        }
    });

    animFrame++;
    requestAnimationFrame(drawPixelRoom);
}

function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);

    entities.filter(ent => ent.type === 'gift').forEach(g => {
        if (mx >= g.x && mx <= g.x + g.w && my >= g.y && my <= g.y + g.h) {
            if (!state.giftsOpened[g.id]) {
                state.giftsOpened[g.id] = true;
                showDialogue(CONFIG.gifts[g.id].title, CONFIG.gifts[g.id].message);
                updateHUD();
                checkGrandFinale();
            }
        }
    });

    entities.filter(ent => ent.type === 'balloon' && !ent.popped).forEach(b => {
        if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h + 30) {
            b.popped = true;
            state.balloonsPopped++;
            updateHUD();
            checkGrandFinale();
        }
    });

    const cake = entities.find(ent => ent.type === 'cake');
    if (cake && mx >= cake.x && mx <= cake.x + cake.w && my >= cake.y && my <= cake.y + cake.h) {
        if (!state.cakeBlown) {
            document.getElementById('cake-modal').classList.remove('hidden');
        }
    }
}

function showDialogue(title, content) {
    document.getElementById('dialogue-title').innerText = title;
    document.getElementById('dialogue-content').innerText = content;
    document.getElementById('dialogue-modal').classList.remove('hidden');
}

function triggerCakeExtinguished() {
    state.cakeBlown = true;
    document.getElementById('cake-modal').classList.add('hidden');
    showDialogue("✨ WISH MADE! ✨", "HAPPY BIRTHDAY! 🎂 Your wish is flying high into the stars!");
    updateHUD();
    checkGrandFinale();
}

function updateHUD() {
    const openedCount = state.giftsOpened.filter(Boolean).length;
    const secretsCount = state.secretsFound.filter(Boolean).length;
    document.getElementById('hud-gifts').innerText = `${openedCount}/6`;
    document.getElementById('hud-balloons').innerText = `${state.balloonsPopped}/10`;
    document.getElementById('hud-hearts').innerText = `${state.heartsCollected}/10`;
    document.getElementById('hud-secrets').innerText = `${secretsCount}/5`;
    document.getElementById('hud-cake').innerText = state.cakeBlown ? '✓' : '❌';
    saveProgressToFirebase(state);
}

function checkGrandFinale() {
    const allGifts = state.giftsOpened.every(Boolean);
    if (allGifts && state.cakeBlown && !state.isFinaleUnlocked) {
        state.isFinaleUnlocked = true;
        document.getElementById('finale-greeting').innerText = `🎂 HAPPY BIRTHDAY, ${CONFIG.birthdayPerson}! 🎂`;
        document.getElementById('finale-message').innerText = CONFIG.finalMessage;
        document.getElementById('finale-modal').classList.remove('hidden');
    }
}
