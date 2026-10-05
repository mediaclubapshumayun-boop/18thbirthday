const CONFIG = {
    birthdayPerson: "Alex",
    finalMessage: "May your day be filled with warm smiles, sweet treats, amazing friends, and magical memories! Happy Birthday! ❤️✨",
    gifts: [
        "💌 Sweet Note: I hope this year brings you endless joy and smiles!",
        "⭐ Secret Wish: May all your silent wishes come true smoothly!",
        "☕ Cozy Hug: Sending you the warmest digital hug!",
        "🎵 Lovely Melody: Here's to a year full of wonderful memories!",
        "🌸 Flower Blessing: May your day bloom as brightly as these flowers!",
        "✨ Cosmic Joy: You shine brighter than all the stars!"
    ]
};

const state = {
    giftsOpened: 0,
    balloonsPopped: 0,
    heartsCollected: 0,
    secretsFound: 0,
    cakeBlown: false,
    soundEnabled: true
};

window.addEventListener('load', () => {
    // Start Overlay
    document.getElementById('start-btn').onclick = () => {
        document.getElementById('intro-modal').classList.add('hidden');
    };

    // Close Modals
    document.getElementById('dialogue-close').onclick = () => {
        document.getElementById('dialogue-modal').classList.add('hidden');
    };

    // Click Gifts
    document.querySelectorAll('.gift').forEach(g => {
        g.onclick = () => {
            if (g.dataset.opened) return;
            g.dataset.opened = "true";
            g.innerText = "📦";
            state.giftsOpened++;
            showDialogue("🎁 Present Opened!", CONFIG.gifts[g.dataset.id] || "A special gift!");
            updateHUD();
            checkFinale();
        };
    });

    // Click Balloons
    document.querySelectorAll('.balloon').forEach(b => {
        b.onclick = () => {
            if (b.dataset.popped) return;
            b.dataset.popped = "true";
            b.style.visibility = "hidden";
            state.balloonsPopped++;
            updateHUD();
            checkFinale();
        };
    });

    // Pet Cat
    document.getElementById('pet').onclick = () => {
        state.heartsCollected = Math.min(10, state.heartsCollected + 1);
        showDialogue("🐱 Pixel Pet", "Meow! The kitty loves you! ❤️");
        updateHUD();
        checkFinale();
    };

    // Camera & Photos
    document.getElementById('camera').onclick = () => {
        showDialogue("📸 Photo Booth", "Say cheese! Captured a sweet photo memory! 🧀");
    };

    // Cake Interaction
    document.getElementById('cake').onclick = () => {
        if (!state.cakeBlown) {
            document.getElementById('cake-modal').classList.remove('hidden');
        }
    };

    document.getElementById('blow-btn').onclick = () => {
        state.cakeBlown = true;
        document.getElementById('candles').innerText = "💨";
        document.getElementById('cake-modal').classList.add('hidden');
        showDialogue("✨ Wish Made!", "HAPPY BIRTHDAY! 🎂 Your wish is sent up to the stars!");
        updateHUD();
        checkFinale();
    };

    document.getElementById('cake-cancel-btn').onclick = () => {
        document.getElementById('cake-modal').classList.add('hidden');
    };

    document.getElementById('finale-replay-btn').onclick = () => {
        document.getElementById('finale-modal').classList.add('hidden');
    };
});

function showDialogue(title, message) {
    document.getElementById('dialogue-title').innerText = title;
    document.getElementById('dialogue-content').innerText = message;
    document.getElementById('dialogue-modal').classList.remove('hidden');
}

function updateHUD() {
    document.getElementById('hud-gifts').innerText = `${state.giftsOpened}/6`;
    document.getElementById('hud-balloons').innerText = `${state.balloonsPopped}/5`;
    document.getElementById('hud-hearts').innerText = `${state.heartsCollected}/10`;
    document.getElementById('hud-secrets').innerText = `${state.secretsFound}/5`;
    document.getElementById('hud-cake').innerText = state.cakeBlown ? '✓' : '❌';
    saveProgressToFirebase(state);
}

function checkFinale() {
    if (state.giftsOpened >= 6 && state.cakeBlown) {
        document.getElementById('finale-greeting').innerText = `🎂 HAPPY BIRTHDAY, ${CONFIG.birthdayPerson}! 🎂`;
        document.getElementById('finale-message').innerText = CONFIG.finalMessage;
        document.getElementById('finale-modal').classList.remove('hidden');
    }
}
