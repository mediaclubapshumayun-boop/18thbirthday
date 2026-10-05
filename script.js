const canvas = document.getElementById("room-canvas");
const ctx = canvas.getContext("2d");

let candlesLit = true;
let activeFlames = [true, true, true, true, true];
let selectedColor = "#d4a373";
let selectedRibbon = "#800020";
let selectedName = "PARCHMENT RED";

// Room Balloons
let roomBalloons = [
    { x: 190, y: 110, color: "#800020", popped: false }, // Dark Red
    { x: 210, y: 135, color: "#f4a261", popped: false }, // Yellow
    { x: 440, y: 110, color: "#7b2cbf", popped: false }, // Purple
    { x: 460, y: 130, color: "#e63946", popped: false }, // Red
    { x: 495, y: 160, color: "#2a9d8f", popped: false }  // Green
];

// Exact Presents Layout from First Image
let presents = [
    { id: 1, sender: "Hagrid", message: "Bak'd it meself! Happee Birthdae Zash!", photoUrl: "https://picsum.photos/id/1025/300/200", color: "#d4a373", ribbon: "#800020", x: 215, y: 185, w: 26, h: 26 }, // On Left Chair
    { id: 2, sender: "Ron & Hermione", message: "Happy 28th Birthday Zash!", photoUrl: "https://picsum.photos/id/237/300/200", color: "#d4a373", ribbon: "#800020", x: 135, y: 245, w: 28, h: 28 }, // Left Floor
    { id: 3, sender: "Dumbledore", message: "Have a magical 28th birthday feast!", photoUrl: "", color: "#d4a373", ribbon: "#1d3557", x: 485, y: 235, w: 28, h: 28 } // Right Floor
];

function playPopSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(550, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.08);
    } catch(e){}
}

// MAIN RENDER LOOP (EXACT MATCH TO GEMINI GENERATED IMAGE 1)
function drawPixelRoom() {
    ctx.imageSmoothingEnabled = false;

    // 1. Wooden Wall Panels
    ctx.fillStyle = "#6f4e37"; ctx.fillRect(0, 0, 640, 175);
    ctx.fillStyle = "#523724"; ctx.fillRect(0, 175, 640, 30);
    ctx.fillStyle = "#3d2314"; for(let x=0; x<640; x+=20) ctx.fillRect(x, 175, 2, 30);

    // Ceiling Beams
    ctx.fillStyle = "#3d2314"; ctx.fillRect(0, 0, 640, 18);
    for(let x=0; x<640; x+=30) ctx.fillRect(x, 0, 12, 18);

    // Center Lantern
    ctx.fillStyle = "#f4a261"; ctx.fillRect(312, 16, 16, 18);
    ctx.strokeStyle = "#6f4e37"; ctx.strokeRect(312, 16, 16, 18);

    // 2. House Banners & Potions Ceiling Strings
    const houseColors = ["#800020", "#1d3557", "#2a9d8f", "#800020", "#1d3557", "#2a9d8f"];
    for(let i=0; i<6; i++) {
        drawPennantBanner(20 + i*32, 18, houseColors[i]);
        drawPennantBanner(410 + i*32, 18, houseColors[i]);
    }

    // Snitches & Floating Potions
    drawSnitch(210, 25); drawPotion(245, 22, "#7b2cbf");
    drawPotion(390, 22, "#2a9d8f"); drawSnitch(425, 25);

    // Floating Candles
    drawFloatingCandle(60, 95); drawFloatingCandle(85, 80); drawFloatingCandle(105, 80);
    drawFloatingCandle(280, 45); drawFloatingCandle(360, 45);
    drawFloatingCandle(535, 80); drawFloatingCandle(555, 95); drawFloatingCandle(580, 80);

    // 3. Center Window View
    ctx.fillStyle = "#3d2314"; ctx.fillRect(225, 38, 190, 125);
    ctx.fillStyle = "#0d1b2a"; ctx.fillRect(231, 44, 178, 113);
    
    // Moon & Castle Silhouette
    ctx.fillStyle = "#e0e1dd"; ctx.beginPath(); ctx.arc(280, 65, 10, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#1b263b"; ctx.fillRect(231, 115, 178, 42); // Castle distant

    // Window Frames & Curtains
    ctx.fillStyle = "#3d2314"; ctx.fillRect(319, 44, 2, 113); ctx.fillRect(231, 95, 178, 2);
    ctx.fillStyle = "#5c061c"; ctx.fillRect(225, 38, 22, 125); ctx.fillRect(393, 38, 22, 125);

    // 4. Center Banner "Zash's 28th Birthday Feast!"
    ctx.fillStyle = "#f4e1d2"; ctx.fillRect(200, 25, 240, 24);
    ctx.strokeStyle = "#6f4e37"; ctx.lineWidth = 2; ctx.strokeRect(200, 25, 240, 24);
    ctx.fillStyle = "#3d2314"; ctx.font = "8px 'Press Start 2P'"; ctx.textAlign = "center";
    ctx.fillText("Zash's 28th Birthday Feast!", 320, 40);

    // 5. Side Props (Frames, Photo Booth, Shelf)
    // Left Frames & Photo Booth
    ctx.fillStyle = "#2a9d8f"; ctx.fillRect(135, 80, 14, 14);
    ctx.fillStyle = "#e63946"; ctx.fillRect(135, 100, 14, 14);
    ctx.fillStyle = "#6f4e37"; ctx.fillRect(122, 125, 26, 32); // Photo Booth
    ctx.fillStyle = "#000000"; ctx.fillRect(126, 138, 18, 10);
    ctx.fillStyle = "#ffffff"; ctx.font = "5px 'Press Start 2P'"; ctx.fillText("Hogwarts", 135, 145);

    // Right Plant Shelf & Potions
    ctx.fillStyle = "#3d2314"; ctx.fillRect(490, 100, 42, 4);
    ctx.fillStyle = "#2a9d8f"; ctx.fillRect(495, 88, 8, 12);

    // 6. Balloons
    roomBalloons.forEach(b => {
        if (!b.popped) draw8BitBalloon(b.x, b.y, b.color);
    });

    // 7. Wooden Floor & Blue Hogwarts Crest Rug
    ctx.fillStyle = "#a06d3b"; ctx.fillRect(0, 205, 640, 175);
    ctx.fillStyle = "#805327"; for(let y=205; y<380; y+=16) ctx.fillRect(0, y, 640, 2);

    // Blue Rug with Gold Crest Icons
    ctx.fillStyle = "#1d3557"; ctx.fillRect(145, 225, 350, 120);
    ctx.strokeStyle = "#e9c46a"; ctx.lineWidth = 3; ctx.strokeRect(149, 229, 342, 112);
    drawGoldCrest(170, 245); drawGoldCrest(450, 245);

    // 8. Chairs with Shield Crests
    drawChair(195, 200, "#800020"); drawChair(415, 200, "#1d3557");
    drawFrontChair(245, 305, "#800020"); drawFrontChair(365, 305, "#1d3557");

    // 9. Table & Marauder's Map Pattern
    ctx.fillStyle = "#f4e1d2"; ctx.fillRect(220, 210, 200, 80);
    ctx.strokeStyle = "#b5835a"; ctx.lineWidth = 1; ctx.strokeRect(220, 210, 200, 80);
    
    // Cupcake Tier Stand
    ctx.fillStyle = "#e9c46a"; ctx.fillRect(280, 215, 16, 20);
    ctx.fillText("🧁", 288, 225);

    // 10. Pink Hagrid Cake "HAPPEE BIRTHDAE ZASH"
    drawPinkHagridCake(320, 215);

    // 11. Black Cat (Bottom Right Floor)
    drawBlackCat(495, 315);

    // 12. Presents
    drawPresents();
}

function drawPennantBanner(x, y, color) {
    ctx.fillStyle = color; ctx.fillRect(x, y, 14, 20);
    ctx.beginPath(); ctx.moveTo(x, y+20); ctx.lineTo(x+7, y+26); ctx.lineTo(x+14, y+20); ctx.fill();
}

function drawSnitch(x, y) {
    ctx.fillStyle = "#e9c46a"; ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.fillRect(x-6, y-2, 4, 2); ctx.fillRect(x+2, y-2, 4, 2);
}

function drawPotion(x, y, color) {
    ctx.fillStyle = color; ctx.fillRect(x, y+4, 8, 8);
    ctx.fillStyle = "#d4a373"; ctx.fillRect(x+2, y, 4, 4);
}

function drawFloatingCandle(x, y) {
    ctx.fillStyle = "#fffdf9"; ctx.fillRect(x, y, 3, 10);
    ctx.fillStyle = "#f4a261"; ctx.fillRect(x-1, y-4, 5, 4);
}

function draw8BitBalloon(x, y, color) {
    ctx.fillStyle = color; ctx.fillRect(x-6, y-8, 12, 16); ctx.fillRect(x-8, y-6, 16, 12);
    ctx.fillStyle = "#ffffff"; ctx.fillRect(x-4, y-6, 3, 3);
    ctx.fillStyle = color; ctx.fillRect(x-2, y+8, 4, 2);
    ctx.strokeStyle = "#e9c46a"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, y+10); ctx.quadraticCurveTo(x-4, y+18, x, y+24); ctx.stroke();
}

function drawGoldCrest(x, y) {
    ctx.fillStyle = "#e9c46a"; ctx.fillRect(x, y, 12, 12);
}

function drawChair(x, y, houseColor) {
    ctx.fillStyle = "#3d2314"; ctx.fillRect(x, y, 22, 38);
    ctx.fillStyle = houseColor; ctx.fillRect(x+4, y+8, 14, 8);
}

function drawFrontChair(x, y, houseColor) {
    ctx.fillStyle = "#3d2314"; ctx.fillRect(x, y, 24, 18);
    ctx.fillStyle = houseColor; ctx.fillRect(x+8, y-3, 8, 8);
}

function drawPinkHagridCake(x, y) {
    // Pink Frosting Cake Body
    ctx.fillStyle = "#e63946"; ctx.fillRect(x, y+10, 48, 22);
    ctx.fillStyle = "#ff70a6"; ctx.fillRect(x, y+10, 48, 6);

    // Green Cracked Letters Text "HAPPEE BIRTHDAE ZASH"
    ctx.fillStyle = "#2a9d8f";
    ctx.fillRect(x+6, y+18, 36, 2);
    ctx.fillRect(x+10, y+24, 28, 2);

    // 5 Lit Candles
    for(let i=0; i<5; i++) {
        let cx = x + 6 + i * 9;
        ctx.fillStyle = "#fffdf9"; ctx.fillRect(cx, y, 2, 10);

        if (candlesLit && activeFlames[i]) {
            ctx.fillStyle = Math.random() > 0.4 ? "#f4a261" : "#e63946";
            ctx.fillRect(cx - 1, y - 4 + Math.floor(Math.random()*2), 4, 4);
        } else {
            ctx.fillStyle = "#8d99ae"; ctx.fillRect(cx - 1, y - 4 - Math.floor(Math.random()*2), 3, 3);
        }
    }
}

function drawBlackCat(x, y) {
    ctx.fillStyle = "#111111"; ctx.fillRect(x, y, 16, 12); ctx.fillRect(x+10, y-6, 7, 7);
    ctx.fillStyle = "#e9c46a"; ctx.fillRect(x+11, y-5, 2, 2); ctx.fillRect(x+14, y-5, 2, 2);
    ctx.fillStyle = "#111111"; ctx.fillRect(x+16, y+2, 4, 8); // Tail UP
}

function drawPresents() {
    presents.forEach(p => {
        ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = p.ribbon;
        ctx.fillRect(p.x + Math.floor(p.w/2) - 2, p.y, 4, p.h);
        ctx.fillRect(p.x, p.y + Math.floor(p.h/2) - 2, p.w, 4);
    });
}

// Interactivity
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    roomBalloons.forEach(b => {
        if (!b.popped && Math.hypot(clickX - b.x, clickY - b.y) <= 12) {
            b.popped = true; playPopSound();
        }
    });

    if (clickX >= 315 && clickX <= 375 && clickY >= 200 && clickY <= 245) {
        if (!candlesLit) {
            candlesLit = true; activeFlames = [true, true, true, true, true];
            document.getElementById("mic-status-bar").innerText = "🕯️ Candles relit! Blow into mic to extinguish!";
        } else {
            initMicrophone();
        }
    }

    presents.forEach(p => {
        if (clickX >= p.x && clickX <= p.x + p.w && clickY >= p.y && clickY <= p.y + p.h) {
            openViewModal(p);
        }
    });
});

function spawnBackgroundBalloons() {
    const container = document.getElementById("bg-balloons-container");
    const icons = ["🎈", "⚡", "🦉", "✨", "🎁"];
    for (let i = 0; i < 7; i++) {
        const balloon = document.createElement("div");
        balloon.className = "bg-balloon";
        balloon.innerText = icons[i % icons.length];
        balloon.style.left = `${Math.random() * 90 + 5}%`;
        balloon.style.animationDelay = `${Math.random() * 8}s`;
        balloon.onclick = () => { playPopSound(); balloon.remove(); };
        container.appendChild(balloon);
    }
}

function initMicrophone() {
    const status = document.getElementById("mic-status-bar");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        extinguishCandles(); return;
    }
    status.innerText = "🌬️ Mic Active! Blow hard to extinguish candles!";
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const mic = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256; mic.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function listen() {
            if (!candlesLit) return;
            analyser.getByteFrequencyData(dataArray);
            let avg = dataArray.reduce((a,b)=>a+b, 0) / dataArray.length;
            if (avg > 35) {
                extinguishCandles();
                status.innerText = "⚡ Candles blown out!";
                stream.getTracks().forEach(t => t.stop());
                return;
            }
            requestAnimationFrame(listen);
        }
        listen();
    }).catch(() => extinguishCandles());
}

function extinguishCandles() {
    let idx = 0;
    let timer = setInterval(() => {
        if (idx < activeFlames.length) activeFlames[idx++] = false;
        else { candlesLit = false; clearInterval(timer); }
    }, 120);
}

function openViewModal(p) {
    document.getElementById("card-sender-name").innerText = p.sender;
    document.getElementById("card-letter-text").innerText = p.message;
    const img = document.getElementById("card-photo-img");
    if (p.photoUrl) { img.src = p.photoUrl; img.parentElement.style.display = "block"; }
    else img.parentElement.style.display = "none";
    document.getElementById("view-present-modal").classList.remove("hidden");
}

document.getElementById("close-card-btn").onclick = () => document.getElementById("view-present-modal").classList.add("hidden");
document.getElementById("close-view-x").onclick = () => document.getElementById("view-present-modal").classList.add("hidden");
document.getElementById("add-gift-btn").onclick = () => document.getElementById("create-present-modal").classList.remove("hidden");
document.getElementById("cancel-wrap-btn").onclick = () => document.getElementById("create-present-modal").classList.add("hidden");

document.querySelectorAll(".wrap-option").forEach(btn => {
    btn.onclick = (e) => {
        document.querySelectorAll(".wrap-option").forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        selectedColor = e.currentTarget.dataset.color;
        selectedRibbon = e.currentTarget.dataset.ribbon;
        selectedName = e.currentTarget.dataset.name;
        document.getElementById("wrap-selected-name").innerText = selectedName;
    };
});

document.getElementById("submit-wrap-btn").onclick = () => {
    const sender = document.getElementById("input-sender").value.trim();
    const message = document.getElementById("input-message").value.trim();
    const photoUrl = document.getElementById("input-photo-url").value.trim();
    if (!message) return alert("Please enter a message!");

    presents.push({
        id: Date.now(), sender: sender || "Friend", message: message,
        photoUrl: photoUrl || "", color: selectedColor, ribbon: selectedRibbon,
        x: 170 + (presents.length % 5) * 30, y: 250, w: 28, h: 28
    });
    document.getElementById("create-present-modal").classList.add("hidden");
};

spawnBackgroundBalloons();
function render() { drawPixelRoom(); requestAnimationFrame(render); }
render();
