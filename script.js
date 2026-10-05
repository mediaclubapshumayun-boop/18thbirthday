const canvas = document.getElementById("room-canvas");
const ctx = canvas.getContext("2d");

// Interactive State
let candlesLit = true;
let activeFlames = [true, true, true, true, true];
let selectedColor = "#740001";
let selectedRibbon = "#d3a625";
let selectedName = "GRYFFINDOR RED";

// 8-Bit Styled Room Balloons (Interactive)
let roomBalloons = [
    { x: 90, y: 110, color: "#e63946", popped: false },
    { x: 115, y: 135, color: "#2a9d8f", popped: false },
    { x: 530, y: 105, color: "#f4a261", popped: false },
    { x: 555, y: 130, color: "#e63946", popped: false },
    { x: 520, y: 160, color: "#2a9d8f", popped: false }
];

// Interactive Presents Data (On Table & Floor)
let presents = [
    { id: 1, sender: "Hagrid", message: "Bak'd it meself, words an' all! Happee Birthdae Harry!", photoUrl: "https://picsum.photos/id/1025/300/200", color: "#e63946", ribbon: "#2a9d8f", x: 255, y: 175, w: 28, h: 28 }, 
    { id: 2, sender: "Ron & Hermione", message: "Hope you have the best birthday at Hogwarts!", photoUrl: "https://picsum.photos/id/237/300/200", color: "#740001", ribbon: "#d3a625", x: 195, y: 250, w: 28, h: 28 }, 
    { id: 3, sender: "Dumbledore", message: "Words are, in my not-so-humble opinion, our most inexhaustible source of magic.", photoUrl: "", color: "#0e1a40", ribbon: "#946b2d", x: 435, y: 235, w: 28, h: 28 } 
];

if (localStorage.getItem("wizard_party_presents")) {
    try { presents = JSON.parse(localStorage.getItem("wizard_party_presents")); } catch(e){}
}
function savePresents() {
    localStorage.setItem("wizard_party_presents", JSON.stringify(presents));
}

function playPopSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "square"; // 8-bit chip synth tone
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.09);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.09);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.09);
    } catch(e){}
}

// --- DRAWING HARRY POTTER STYLE PIXEL SCENE ---
function drawPixelRoom() {
    ctx.imageSmoothingEnabled = false;

    // 1. Hogwarts Great Hall Brick Wall Background
    ctx.fillStyle = "#2b1e3a"; ctx.fillRect(0, 0, 640, 175);
    ctx.fillStyle = "#1e1429";
    for(let y=0; y<175; y+=16) {
        let offsetX = (y % 32 === 0) ? 0 : 12;
        for(let x=offsetX; x<640; x+=24) { ctx.fillRect(x, y, 22, 14); }
    }

    ctx.fillStyle = "#3a2850"; ctx.fillRect(0, 175, 640, 30); // Wainscoting

    // 2. Ceilings & House Banners
    ctx.fillStyle = "#12091f"; ctx.fillRect(0, 0, 640, 20);
    drawHouseBanner(30, 20, "#740001", "G");  // Gryffindor
    drawHouseBanner(150, 20, "#1a472a", "S"); // Slytherin
    drawHouseBanner(450, 20, "#0e1a40", "R"); // Ravenclaw
    drawHouseBanner(570, 20, "#ecb939", "H"); // Hufflepuff

    // 3. Center Gothic Window & Starry Night / Floating Hogwarts Letter
    ctx.fillStyle = "#3a2218"; ctx.fillRect(255, 35, 130, 125); // Window Frame
    ctx.fillStyle = "#0a071b"; ctx.fillRect(261, 41, 118, 113); // Sky
    
    // Moon & Stars
    ctx.fillStyle = "#f4a261"; ctx.beginPath(); ctx.arc(280, 60, 8, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(340, 55, 2, 2); ctx.fillRect(320, 75, 2, 2); ctx.fillRect(360, 90, 2, 2);

    // Window Arches
    ctx.fillStyle = "#3a2218";
    ctx.fillRect(319, 41, 2, 113); ctx.fillRect(261, 95, 118, 2);

    // 4. Hagrid Style "HAPPEE BIRTHDAE" Banner
    ctx.fillStyle = "#e63946"; ctx.fillRect(210, 20, 220, 22);
    ctx.strokeStyle = "#2a9d8f"; ctx.lineWidth = 2; ctx.strokeRect(210, 20, 220, 22);
    ctx.fillStyle = "#2a9d8f"; ctx.font = "8px 'Press Start 2P'"; ctx.textAlign = "center";
    ctx.fillText("HAPPEE BIRTHDAE HARRY!", 320, 34);

    // 5. 8-Bit Iconic Balloons (Shutterstock 8-Bit Icon Style)
    roomBalloons.forEach(b => {
        if (!b.popped) {
            draw8BitBalloon(b.x, b.y, b.color);
        }
    });

    // 6. Stone/Wood Floor & Wizarding Rug
    ctx.fillStyle = "#38291e"; ctx.fillRect(0, 205, 640, 175);
    ctx.fillStyle = "#2b1e14";
    for(let y=205; y<380; y+=16) { ctx.fillRect(0, y, 640, 2); }

    // Crimson Rug
    ctx.fillStyle = "#740001"; ctx.fillRect(170, 230, 300, 110);
    ctx.strokeStyle = "#d3a625"; ctx.lineWidth = 3; ctx.strokeRect(174, 234, 292, 102);

    // Chairs & Bows
    drawChair(205, 205); drawChair(405, 205);
    drawFrontChair(245, 305); drawFrontChair(365, 305);

    // 7. Table & Checkered Cloth
    ctx.fillStyle = "#e63946"; ctx.fillRect(230, 215, 180, 75);
    ctx.fillStyle = "#2a9d8f";
    for(let x=230; x<410; x+=12) {
        for(let y=215; y<290; y+=12) {
            if ((x+y)%24 === 0) ctx.fillRect(x, y, 6, 6);
        }
    }

    // 8. Pixel Cake with Lit Candles (Pngtree Pixel Cake Style)
    drawPixelCakeWithCandles(290, 210);

    // 9. Hedwig Owl & Presents
    drawHedwig(130, 140);
    drawPresents();
}

// Draw 8-Bit Style Balloon (Grid/Pixel Art Icon)
function draw8BitBalloon(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x-6, y-8, 12, 16);
    ctx.fillRect(x-8, y-6, 16, 12);
    // Highlight Pixel
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x-4, y-6, 3, 3);
    // Tie Base
    ctx.fillStyle = color;
    ctx.fillRect(x-2, y+8, 4, 3);
    // Wavy String
    ctx.strokeStyle = "#d3a625"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, y+11);
    ctx.quadraticCurveTo(x-4, y+18, x, y+26);
    ctx.stroke();
}

function drawHouseBanner(x, y, color, letter) {
    ctx.fillStyle = color; ctx.fillRect(x, y, 20, 45);
    ctx.beginPath(); ctx.moveTo(x, y+45); ctx.lineTo(x+10, y+55); ctx.lineTo(x+20, y+45); ctx.fill();
    ctx.fillStyle = "#ffe6a7"; ctx.font = "8px 'Press Start 2P'"; ctx.fillText(letter, x+10, y+25);
}

// Pixel Cake (Pink Frosting + Green Lettering + Lit Candles)
function drawPixelCakeWithCandles(x, y) {
    // Cake Base Layer
    ctx.fillStyle = "#f4a261"; ctx.fillRect(x, y+15, 60, 22);
    ctx.fillStyle = "#e63946"; ctx.fillRect(x, y+15, 60, 6); // Pink Frosting Top

    // Hagrid "Green" Cracks / Text Simulation
    ctx.fillStyle = "#2a9d8f"; 
    ctx.fillRect(x+8, y+23, 44, 2);
    ctx.fillRect(x+14, y+28, 32, 2);

    // 5 Lit Magical Star Candles
    for(let i=0; i<5; i++) {
        let cx = x + 8 + i * 11;
        ctx.fillStyle = "#ffe6a7"; ctx.fillRect(cx, y + 2, 3, 13); // Candle Stick

        if (candlesLit && activeFlames[i]) {
            // Magical flickering flame
            ctx.fillStyle = Math.random() > 0.4 ? "#f4a261" : "#e63946";
            ctx.fillRect(cx - 1, y - 4 + Math.floor(Math.random()*2), 5, 5);
            ctx.fillStyle = "#ffffff"; ctx.fillRect(cx, y - 2, 2, 2);
        } else {
            // Extinguished Smoke Pixel
            ctx.fillStyle = "#8d99ae";
            ctx.fillRect(cx - 1, y - 4 - Math.floor(Math.random()*3), 3, 3);
        }
    }
}

function drawChair(x, y) {
    ctx.fillStyle = "#2b1e14"; ctx.fillRect(x, y, 22, 38);
    ctx.fillStyle = "#740001"; ctx.fillRect(x+4, y+8, 14, 8);
}

function drawFrontChair(x, y) {
    ctx.fillStyle = "#1e1429"; ctx.fillRect(x, y, 24, 18);
    ctx.fillStyle = "#d3a625"; ctx.fillRect(x+8, y-3, 8, 8);
}

function drawHedwig(x, y) {
    ctx.fillStyle = "#ffffff"; ctx.fillRect(x, y, 16, 18); ctx.fillRect(x+3, y-6, 10, 8);
    ctx.fillStyle = "#000000"; ctx.fillRect(x+5, y-4, 2, 2); ctx.fillRect(x+9, y-4, 2, 2); // Eyes
    ctx.fillStyle = "#f4a261"; ctx.fillRect(x+7, y-2, 2, 2); // Beak
}

function drawPresents() {
    presents.forEach(p => {
        ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = p.ribbon;
        ctx.fillRect(p.x + Math.floor(p.w/2) - 2, p.y, 4, p.h);
        ctx.fillRect(p.x, p.y + Math.floor(p.h/2) - 2, p.w, 4);
        ctx.fillRect(p.x + Math.floor(p.w/2) - 3, p.y - 3, 6, 3);
    });
}

// --- INTERACTION HANDLING ---
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // 1. Pop 8-Bit Balloons
    roomBalloons.forEach(b => {
        if (!b.popped) {
            let dist = Math.hypot(clickX - b.x, clickY - b.y);
            if (dist <= 12) {
                b.popped = true;
                playPopSound();
            }
        }
    });

    // 2. Click Cake to Blow / Relight Candles
    if (clickX >= 285 && clickX <= 355 && clickY >= 195 && clickY <= 245) {
        if (!candlesLit) {
            candlesLit = true;
            activeFlames = [true, true, true, true, true];
            document.getElementById("mic-status-bar").innerText = "🕯️ Candles relit! Blow into your mic or click to extinguish!";
        } else {
            initMicrophone();
        }
        return;
    }

    // 3. Open Present
    presents.forEach(p => {
        if (clickX >= p.x && clickX <= p.x + p.w && clickY >= p.y && clickY <= p.y + p.h) {
            openViewModal(p);
        }
    });
});

// Outer Background Floating 8-Bit Balloons
function spawnBackgroundBalloons() {
    const container = document.getElementById("bg-balloons-container");
    const balloonEmojis = ["🎈", "⚡", "🔮", "🦉", "✨"];

    for (let i = 0; i < 8; i++) {
        const balloon = document.createElement("div");
        balloon.className = "bg-balloon";
        balloon.innerText = balloonEmojis[i % balloonEmojis.length];
        balloon.style.left = `${Math.random() * 92 + 2}%`;
        balloon.style.animationDelay = `${Math.random() * 8}s`;
        balloon.style.animationDuration = `${9 + Math.random() * 5}s`;

        balloon.onclick = () => {
            playPopSound();
            balloon.style.transform = "scale(1.8)";
            balloon.style.opacity = "0";
            setTimeout(() => balloon.remove(), 150);
        };

        container.appendChild(balloon);
    }
}

// Microphone Candle Blowing System
function initMicrophone() {
    const status = document.getElementById("mic-status-bar");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        extinguishCandles();
        status.innerText = "💨 Incendio reversed! Candles blown out!";
        return;
    }

    status.innerText = "🎙️ Requesting mic... Blow hard into your microphone!";

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            status.innerText = "🌬️ Blow into your mic to extinguish the candles!";
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const mic = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            mic.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            function listen() {
                if (!candlesLit) return;
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for(let i=0; i<dataArray.length; i++) sum += dataArray[i];
                let avg = sum / dataArray.length;

                if (avg > 36) { 
                    extinguishCandles();
                    status.innerText = "⚡ Mischief Managed! You blew out all the candles!";
                    stream.getTracks().forEach(t => t.stop());
                    audioCtx.close();
                    return;
                }
                requestAnimationFrame(listen);
            }
            listen();
        })
        .catch(() => {
            extinguishCandles();
            status.innerText = "💨 Candles blown out!";
        });
}

function extinguishCandles() {
    let unlitIndex = 0;
    let timer = setInterval(() => {
        if (unlitIndex < activeFlames.length) {
            activeFlames[unlitIndex] = false;
            unlitIndex++;
        } else {
            candlesLit = false;
            clearInterval(timer);
        }
    }, 140);
}

// Modal Handlers
function openViewModal(present) {
    document.getElementById("card-sender-name").innerText = present.sender || "Unknown Wizard";
    document.getElementById("card-letter-text").innerText = present.message || "Happee Birthdae!";
    
    const imgEl = document.getElementById("card-photo-img");
    if (present.photoUrl) {
        imgEl.src = present.photoUrl;
        imgEl.parentElement.style.display = "block";
    } else {
        imgEl.parentElement.style.display = "none";
    }

    document.getElementById("view-present-modal").classList.remove("hidden");
}

document.getElementById("close-card-btn").onclick = () => document.getElementById("view-present-modal").classList.add("hidden");
document.getElementById("close-view-x").onclick = () => document.getElementById("view-present-modal").classList.add("hidden");

document.getElementById("add-gift-btn").onclick = () => document.getElementById("create-present-modal").classList.remove("hidden");
document.getElementById("cancel-wrap-btn").onclick = () => document.getElementById("create-present-modal").classList.add("hidden");

document.querySelectorAll(".wrap-option").forEach(btn => {
    btn.onclick = (e) => {
        document.querySelectorAll(".wrap-option").forEach(b => b.classList.remove("active"));
        const target = e.currentTarget;
        target.classList.add("active");
        selectedColor = target.dataset.color;
        selectedRibbon = target.dataset.ribbon;
        selectedName = target.dataset.name;
        document.getElementById("wrap-selected-name").innerText = selectedName;
    };
});

document.getElementById("submit-wrap-btn").onclick = () => {
    const sender = document.getElementById("input-sender").value.trim();
    const message = document.getElementById("input-message").value.trim();
    const photoUrl = document.getElementById("input-photo-url").value.trim();

    if (!message) {
        alert("Write a birthday message before sending by owl!");
        return;
    }

    const newX = 180 + (presents.length % 5) * 32;
    const newY = 250 + Math.floor(presents.length / 5) * 10;

    presents.push({
        id: Date.now(),
        sender: sender || "Wizard Friend",
        message: message,
        photoUrl: photoUrl || "",
        color: selectedColor,
        ribbon: selectedRibbon,
        x: newX, y: newY, w: 28, h: 28
    });

    savePresents();
    document.getElementById("create-present-modal").classList.add("hidden");
    document.getElementById("input-sender").value = "";
    document.getElementById("input-message").value = "";
    document.getElementById("input-photo-url").value = "";
};

spawnBackgroundBalloons();
function render() {
    drawPixelRoom();
    requestAnimationFrame(render);
}
render();
