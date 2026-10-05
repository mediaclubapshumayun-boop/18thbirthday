const canvas = document.getElementById("room-canvas");
const ctx = canvas.getContext("2d");

// Interactive State
let candlesLit = true;
let activeFlames = [true, true, true, true, true];
let selectedColor = "#ff70a6";
let selectedRibbon = "#ffffff";
let selectedName = "PINK HEARTS";

// Room Balloons Data (Click to Pop)
let roomBalloons = [
    { x: 100, y: 100, radius: 10, color: "#ff70a6", popped: false },
    { x: 120, y: 125, radius: 11, color: "#ffbe0b", popped: false },
    { x: 530, y: 100, radius: 10, color: "#8338ec", popped: false },
    { x: 550, y: 125, radius: 11, color: "#ff006e", popped: false },
    { x: 520, y: 155, radius: 10, color: "#06d6a0", popped: false }
];

// Interactive Presents Data (On Table & Floor)
let presents = [
    { id: 1, sender: "Rebekah", message: "You better have a good day!", photoUrl: "https://picsum.photos/id/1025/300/200", color: "#3a86ff", ribbon: "#ffffff", x: 255, y: 175, w: 28, h: 28 }, // On Chair/Table
    { id: 2, sender: "Alex", message: "Happy 25th Birthday!! Wishing you joy and cake!", photoUrl: "https://picsum.photos/id/237/300/200", color: "#ff70a6", ribbon: "#ffffff", x: 195, y: 250, w: 28, h: 28 }, // Left Floor
    { id: 3, sender: "Sam", message: "Hope you open all the presents today!", photoUrl: "", color: "#8338ec", ribbon: "#ffffff", x: 435, y: 235, w: 28, h: 28 } // Right Floor
];

// Load / Save Local Storage
if (localStorage.getItem("savado_party_presents")) {
    try { presents = JSON.parse(localStorage.getItem("savado_party_presents")); } catch(e){}
}
function savePresents() {
    localStorage.setItem("savado_party_presents", JSON.stringify(presents));
}

// Simple Web Audio API Sound Generator (No external audio files needed)
function playPopSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.08);
    } catch(e){}
}

// --- RENDER PIXEL ROOM ---
function drawPixelRoom() {
    ctx.imageSmoothingEnabled = false;

    // 1. Warm Brown Wall & Wood Wainscoting
    ctx.fillStyle = "#8a4b38";
    ctx.fillRect(0, 0, 640, 175); // Upper Wall

    ctx.fillStyle = "#5c2d1e";
    ctx.fillRect(0, 175, 640, 30); // Wainscoting Rail
    ctx.fillStyle = "#421f14";
    for(let x=0; x<640; x+=24) { ctx.fillRect(x, 175, 2, 30); }

    // 2. Ceiling Rafters & Hanging Lantern
    ctx.fillStyle = "#3a1c11";
    ctx.fillRect(0, 0, 640, 20);
    ctx.fillStyle = "#2b140b";
    for(let x=0; x<640; x+=32) { ctx.fillRect(x, 0, 14, 20); }

    // Center Lantern Light
    ctx.fillStyle = "#ffb703"; ctx.fillRect(312, 18, 16, 20);
    ctx.fillStyle = "#fb8500"; ctx.strokeRect(312, 18, 16, 20);

    // Festive Paper Garlands Across Ceiling
    const colors = ["#ff70a6", "#3a86ff", "#ffbe0b", "#ff006e", "#8338ec", "#06d6a0"];
    for(let i=0; i<32; i++) {
        ctx.fillStyle = colors[i % colors.length];
        let offset = Math.sin(i * 0.4) * 6;
        ctx.fillRect(i * 20, 22 + offset, 16, 6);
    }

    // 3. Center Window & Night View
    ctx.fillStyle = "#3a1c11"; ctx.fillRect(255, 45, 130, 115); // Frame
    ctx.fillStyle = "#081026"; ctx.fillRect(261, 51, 118, 103); // Sky
    
    // Moon & Stars & Distant Houses
    ctx.fillStyle = "#ffea00";
    ctx.beginPath(); ctx.arc(280, 70, 7, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(340, 65, 2, 2); ctx.fillRect(320, 85, 2, 2); ctx.fillRect(355, 100, 2, 2);
    ctx.fillStyle = "#111a3a"; ctx.fillRect(261, 130, 118, 24); // City Silhouette

    // Window Divider Grids
    ctx.fillStyle = "#3a1c11";
    ctx.fillRect(319, 51, 2, 103); ctx.fillRect(261, 100, 118, 2);

    // Pink Checkered Curtains
    drawCurtain(256, 51, 20, 103);
    drawCurtain(365, 51, 20, 103);

    // 4. Happy Birthday Banner
    ctx.fillStyle = "#ffffff"; ctx.fillRect(230, 32, 180, 20);
    ctx.strokeStyle = "#ff70a6"; ctx.lineWidth = 2; ctx.strokeRect(230, 32, 180, 20);
    ctx.fillStyle = "#3a86ff"; ctx.font = "8px 'Press Start 2P'"; ctx.textAlign = "center";
    ctx.fillText("HAPPY BIRTHDAY!", 320, 46);

    // 5. Left & Right Wall Props
    // Left: Frames & Photo Booth Stand
    ctx.fillStyle = "#ffbe0b"; ctx.fillRect(35, 75, 16, 16);
    ctx.fillStyle = "#ff70a6"; ctx.fillRect(35, 100, 16, 16);
    ctx.fillStyle = "#fb5607"; ctx.fillRect(30, 130, 24, 30); // Speaker/Booth

    // Right: Plant Shelf
    ctx.fillStyle = "#3a1c11"; ctx.fillRect(520, 90, 40, 5);
    ctx.fillStyle = "#3a5a40"; ctx.fillRect(530, 78, 10, 12); // Potted Plant

    // 6. Floating Room Balloons (Interactive)
    roomBalloons.forEach(b => {
        if (!b.popped) {
            ctx.fillStyle = b.color;
            ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2); ctx.fill();
            // Balloon String
            ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(b.x, b.y + b.radius);
            ctx.quadraticCurveTo(b.x - 4, b.y + b.radius + 10, b.x, b.y + b.radius + 22);
            ctx.stroke();
        }
    });

    // 7. Wooden Floorboards Perspective
    ctx.fillStyle = "#a85d38"; ctx.fillRect(0, 205, 640, 175);
    ctx.fillStyle = "#8a4b38";
    for(let y=205; y<380; y+=16) { ctx.fillRect(0, y, 640, 2); }

    // 8. Blue Rug with White Decorative Border
    ctx.fillStyle = "#2b5c8f"; ctx.fillRect(170, 230, 300, 110);
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.strokeRect(174, 234, 292, 102);

    // 9. Chairs with Pink Bow Backs
    drawChair(205, 205); drawChair(405, 205);
    drawFrontChair(245, 305); drawFrontChair(365, 305);

    // 10. Dining Table & Pink-White Checkered Tablecloth
    ctx.fillStyle = "#ff70a6"; ctx.fillRect(230, 215, 180, 75);
    ctx.fillStyle = "#ffffff";
    for(let x=230; x<410; x+=12) {
        for(let y=215; y<290; y+=12) {
            if ((x+y)%24 === 0) ctx.fillRect(x, y, 6, 6);
        }
    }
    ctx.fillStyle = "#ab2d53"; ctx.fillRect(230, 288, 180, 4);

    // Table Treats (Cupcakes, Flower Vase, Drinks)
    ctx.font = "12px sans-serif";
    ctx.fillText("🧁", 250, 240);
    ctx.fillText("🌸", 355, 240);
    ctx.fillText("🍹", 380, 240);

    // 11. Multi-Tiered Cake & Candles
    drawCake(300, 220);

    // 12. Little Orange Cat
    drawCat(320, 325);

    // 13. Draw Presents Stack
    drawPresents();
}

function drawCurtain(x, y, w, h) {
    ctx.fillStyle = "#ff70a6"; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#ffffff";
    for(let cy=y; cy<y+h; cy+=10) ctx.fillRect(x, cy, w, 3);
}

function drawChair(x, y) {
    ctx.fillStyle = "#4a2416"; ctx.fillRect(x, y, 22, 38);
    ctx.fillStyle = "#ff70a6"; ctx.fillRect(x+4, y+8, 14, 8); // Pink Bow
}

function drawFrontChair(x, y) {
    ctx.fillStyle = "#3a1c11"; ctx.fillRect(x, y, 24, 18);
    ctx.fillStyle = "#ff70a6"; ctx.fillRect(x+8, y-3, 8, 8);
}

function drawCake(x, y) {
    // Cake Body
    ctx.fillStyle = "#ffffff"; ctx.fillRect(x, y+10, 40, 18); // Base
    ctx.fillStyle = "#ff70a6"; ctx.fillRect(x, y+10, 40, 4);   // Frosting
    ctx.fillStyle = "#5c3317"; ctx.fillRect(x+5, y, 30, 10);  // Top Layer
    ctx.fillStyle = "#ff70a6"; ctx.fillRect(x+5, y, 30, 3);

    // Candles & Flames
    for(let i=0; i<5; i++) {
        let cx = x + 7 + i * 6;
        ctx.fillStyle = "#ffea00"; ctx.fillRect(cx, y - 6, 2, 6); // Candle Stick

        if (candlesLit && activeFlames[i]) {
            ctx.fillStyle = Math.random() > 0.4 ? "#ff006e" : "#fb8500";
            ctx.fillRect(cx - 1, y - 11 + Math.floor(Math.random()*2), 4, 4);
        } else {
            ctx.fillStyle = "#8d99ae";
            ctx.fillRect(cx - 1, y - 11 - Math.floor(Math.random()*3), 3, 3);
        }
    }
}

function drawCat(x, y) {
    ctx.fillStyle = "#fb5607"; ctx.fillRect(x, y, 16, 10); ctx.fillRect(x+10, y-5, 7, 7);
    ctx.fillStyle = "#ffffff"; ctx.fillRect(x+11, y-7, 2, 2); ctx.fillRect(x+15, y-7, 2, 2);
    ctx.fillStyle = "#000000"; ctx.fillRect(x+14, y-3, 2, 2);
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

    // 1. Click Balloons to Pop
    roomBalloons.forEach(b => {
        if (!b.popped) {
            let dist = Math.hypot(clickX - b.x, clickY - b.y);
            if (dist <= b.radius + 4) {
                b.popped = true;
                playPopSound();
            }
        }
    });

    // 2. Click Cake to Blow Out / Relight Candles
    if (clickX >= 295 && clickX <= 345 && clickY >= 200 && clickY <= 250) {
        if (!candlesLit) {
            candlesLit = true;
            activeFlames = [true, true, true, true, true];
            document.getElementById("mic-status-bar").innerText = "🕯️ Candles relit! Blow into your mic or click to extinguish!";
        } else {
            initMicrophone();
        }
        return;
    }

    // 3. Click Presents to View
    presents.forEach(p => {
        if (clickX >= p.x && clickX <= p.x + p.w && clickY >= p.y && clickY <= p.y + p.h) {
            openViewModal(p);
        }
    });
});

// --- OUTER PAGE FLOATING BALLOONS ---
function spawnBackgroundBalloons() {
    const container = document.getElementById("bg-balloons-container");
    const balloonEmojis = ["🎈", "💖", "💜", "💙", "🧡"];

    for (let i = 0; i < 8; i++) {
        const balloon = document.createElement("div");
        balloon.className = "bg-balloon";
        balloon.innerText = balloonEmojis[i % balloonEmojis.length];
        balloon.style.left = `${Math.random() * 92 + 2}%`;
        balloon.style.animationDelay = `${Math.random() * 10}s`;
        balloon.style.animationDuration = `${10 + Math.random() * 6}s`;

        balloon.onclick = () => {
            playPopSound();
            balloon.style.transform = "scale(1.8)";
            balloon.style.opacity = "0";
            setTimeout(() => balloon.remove(), 150);
        };

        container.appendChild(balloon);
    }
}

// --- MICROPHONE DETECTION FOR CANDLE BLOWING ---
function initMicrophone() {
    const status = document.getElementById("mic-status-bar");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        extinguishCandles();
        status.innerText = "💨 Candles blown out!";
        return;
    }

    status.innerText = "🎙️ Requesting mic permission... Blow into your microphone!";

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            status.innerText = "🌬️ Mic Active! Blow hard into your microphone to blow out the candles!";
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

                if (avg > 38) { // Sound volume blow threshold
                    extinguishCandles();
                    status.innerText = "🎉 Yay! You blew out all the candles!";
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
            status.innerText = "💨 Candles blown out! (Microphone access bypassed)";
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
    }, 150);
}

// --- MODAL DIALOG CONTROLS ---
function openViewModal(present) {
    document.getElementById("card-sender-name").innerText = present.sender || "A Friend";
    document.getElementById("card-letter-text").innerText = present.message || "Happy Birthday!";
    
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

// Create Present Station
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
        alert("Please write a birthday message!");
        return;
    }

    const newX = 180 + (presents.length % 5) * 32;
    const newY = 250 + Math.floor(presents.length / 5) * 10;

    presents.push({
        id: Date.now(),
        sender: sender || "Friend",
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

// Initial Start
spawnBackgroundBalloons();
function render() {
    drawPixelRoom();
    requestAnimationFrame(render);
}
render();
