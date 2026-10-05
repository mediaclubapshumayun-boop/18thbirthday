// --- STATE & DATA ---
const canvas = document.getElementById("room-canvas");
const ctx = canvas.getContext("2d");

let candlesLit = true;
let micActive = false;
let selectedColor = "#ff70a6";
let selectedRibbon = "#ffffff";
let selectedName = "PINK HEARTS";

let presents = [
    { id: 1, sender: "Rebekah", message: "You better have a good day!", photoUrl: "https://picsum.photos/id/1025/300/200", color: "#ff70a6", ribbon: "#ffffff", x: 490, y: 280, w: 26, h: 26 },
    { id: 2, sender: "Alex", message: "Happy Birthday!! Wish you the best year ahead!", photoUrl: "https://picsum.photos/id/237/300/200", color: "#3a86ff", ribbon: "#ffbe0b", x: 520, y: 285, w: 28, h: 28 },
    { id: 3, sender: "Sam", message: "Hope your day is full of cake & fun!", photoUrl: "", color: "#8338ec", ribbon: "#ff70a6", x: 500, y: 258, w: 24, h: 24 }
];

// Load Saved Presents
if (localStorage.getItem("pixel_party_presents")) {
    try { presents = JSON.parse(localStorage.getItem("pixel_party_presents")); } catch(e){}
}

function savePresents() {
    localStorage.setItem("pixel_party_presents", JSON.stringify(presents));
}

// --- CANVAS RENDERING ENGINE ---
function drawPixelRoom() {
    ctx.imageSmoothingEnabled = false;

    // 1. Upper Wall (Warm Pink Pixel Paper)
    ctx.fillStyle = "#cf6382";
    ctx.fillRect(0, 0, 600, 240);

    // Wall Wallpaper Texture Dots
    ctx.fillStyle = "#b85270";
    for(let x=10; x<600; x+=20) {
        for(let y=10; y<240; y+=20) {
            ctx.fillRect(x, y, 2, 2);
        }
    }

    // 2. Ceiling Rafters
    ctx.fillStyle = "#4a2416";
    ctx.fillRect(0, 0, 600, 22);
    ctx.fillStyle = "#36190d";
    for(let x=0; x<600; x+=40) {
        ctx.fillRect(x, 0, 18, 22);
    }

    // Hanging Party Garland & Lights
    const garlandColors = ["#ffbe0b", "#ff006e", "#8338ec", "#3a86ff", "#06d6a0"];
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#5a321d";
    ctx.beginPath();
    ctx.arc(150, 0, 150, 0.2, Math.PI - 0.2);
    ctx.arc(450, 0, 150, 0.2, Math.PI - 0.2);
    ctx.stroke();

    for(let i=0; i<12; i++) {
        ctx.fillStyle = garlandColors[i % garlandColors.length];
        ctx.fillRect(30 + i * 45, 22 + Math.sin(i)*6, 6, 8);
    }

    // 3. Lower Wall Wood Panel WainsCoting
    ctx.fillStyle = "#5c2e17";
    ctx.fillRect(0, 210, 600, 30);
    ctx.fillStyle = "#3e1e0e";
    ctx.fillRect(0, 210, 600, 4);
    for(let x=0; x<600; x+=30) {
        ctx.fillRect(x, 214, 2, 26);
    }

    // 4. Wooden Floorboards
    ctx.fillStyle = "#3a1c0d";
    ctx.fillRect(0, 240, 600, 160);
    ctx.fillStyle = "#2e160a";
    for(let y=240; y<400; y+=20) {
        ctx.fillRect(0, y, 600, 2);
    }
    for(let y=240; y<400; y+=20) {
        let offset = (y % 40 === 0) ? 0 : 30;
        for(let x=offset; x<600; x+=60) {
            ctx.fillRect(x, y, 2, 20);
        }
    }

    // 5. Central Window (Night View & Crescent Moon)
    ctx.fillStyle = "#3e1e0e"; // Frame
    ctx.fillRect(210, 50, 180, 140);
    ctx.fillStyle = "#0a0e29"; // Sky
    ctx.fillRect(218, 58, 164, 124);

    // Stars & Moon inside Window
    ctx.fillStyle = "#ffea00";
    ctx.beginPath(); ctx.arc(245, 80, 12, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#0a0e29";
    ctx.beginPath(); ctx.arc(249, 77, 10, 0, Math.PI*2); ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(320, 70, 2, 2); ctx.fillRect(340, 95, 3, 3); ctx.fillRect(280, 110, 2, 2); ctx.fillRect(310, 130, 2, 2);

    // Window Grids
    ctx.fillStyle = "#3e1e0e";
    ctx.fillRect(298, 58, 4, 124);
    ctx.fillRect(218, 120, 164, 4);

    // Curtains (Pink Gingham Checkered)
    drawCurtain(212, 58, 28, 124);
    drawCurtain(360, 58, 28, 124);

    // 6. Happy Birthday Banner
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(160, 32, 280, 24);
    ctx.strokeStyle = "#ff70a6"; ctx.lineWidth = 3;
    ctx.strokeRect(160, 32, 280, 24);
    
    ctx.fillStyle = "#3a86ff";
    ctx.font = "10px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.fillText("HAPPY BIRTHDAY!", 300, 48);

    // 7. Side Decor Props
    // Left: Frame & Speaker
    ctx.fillStyle = "#3e1e0e"; ctx.fillRect(40, 110, 24, 24);
    ctx.fillStyle = "#06d6a0"; ctx.fillRect(43, 113, 18, 18);
    ctx.fillStyle = "#fb5607"; ctx.fillRect(40, 150, 22, 30); // Retro Speaker

    // Right: Wall Shelf & Plant
    ctx.fillStyle = "#3e1e0e"; ctx.fillRect(510, 110, 50, 6);
    ctx.fillStyle = "#3a5a40"; ctx.fillRect(520, 96, 12, 14); // Plant

    // Balloons Left & Right
    drawBalloon(100, 100, "#ff70a6");
    drawBalloon(130, 125, "#fb5607");
    drawBalloon(480, 100, "#8338ec");
    drawBalloon(460, 130, "#3a86ff");

    // 8. Large Blue Rug
    ctx.fillStyle = "#255384";
    ctx.fillRect(110, 260, 380, 110);
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 3;
    ctx.strokeRect(114, 264, 372, 102);

    // 9. Dining Chairs (With Bows)
    drawChair(140, 250);
    drawChair(430, 250);
    drawFrontChair(220, 345);
    drawFrontChair(350, 345);

    // 10. Dining Table & Checkered Tablecloth
    ctx.fillStyle = "#ff477e";
    ctx.fillRect(170, 270, 260, 65);
    ctx.fillStyle = "#ffffff";
    for(let x=170; x<430; x+=16) {
        for(let y=270; y<335; y+=16) {
            if ((x+y)%32 === 0) ctx.fillRect(x, y, 8, 8);
        }
    }
    ctx.fillStyle = "#ab2d53"; // Table rim shadow
    ctx.fillRect(170, 335, 260, 6);

    // Table Feast Items
    ctx.font = "16px sans-serif";
    ctx.fillText("🧁", 200, 305);
    ctx.fillText("🌸", 370, 305);
    ctx.fillText("🍹", 395, 305);

    // 11. Center Multi-Layer Birthday Cake & Candles
    drawCake(280, 280);

    // 12. Little Orange Pixel Cat
    drawCat(290, 355);

    // 13. Draw Presents Stack
    drawPresents();
}

// Custom Pixel Graphics Helper Functions
function drawCurtain(x, y, w, h) {
    ctx.fillStyle = "#ff70a6";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#ffffff";
    for(let cy=y; cy<y+h; cy+=12) {
        ctx.fillRect(x, cy, w, 4);
    }
}

function drawBalloon(x, y, color) {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, y+12); ctx.lineTo(x-3, y+30); ctx.stroke();
}

function drawChair(x, y) {
    ctx.fillStyle = "#5c2e17";
    ctx.fillRect(x, y, 26, 45);
    ctx.fillStyle = "#ff70a6"; // Back Bow
    ctx.fillRect(x+5, y+10, 16, 10);
}

function drawFrontChair(x, y) {
    ctx.fillStyle = "#4a2416";
    ctx.fillRect(x, y, 30, 20);
    ctx.fillStyle = "#ff70a6"; // Heart Bow
    ctx.fillRect(x+10, y-4, 10, 10);
}

function drawCake(x, y) {
    // Chocolate Tiers
    ctx.fillStyle = "#5c3317";
    ctx.fillRect(x, y+10, 40, 20); // Bottom Tier
    ctx.fillRect(x+6, y, 28, 12);  // Top Tier

    // Frosting
    ctx.fillStyle = "#ffb703";
    ctx.fillRect(x, y+10, 40, 4);
    ctx.fillRect(x+6, y, 28, 3);

    // Candles & Flame / Smoke
    for(let i=0; i<3; i++) {
        let cx = x + 10 + i * 10;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(cx, y - 8, 3, 8); // Candle Stick

        if (candlesLit) {
            // Animated Flame
            ctx.fillStyle = Math.random() > 0.5 ? "#ff006e" : "#ffbe0b";
            ctx.fillRect(cx - 1, y - 14 + Math.floor(Math.random()*2), 5, 5);
        } else {
            // Smoke Puff
            ctx.fillStyle = "#8d99ae";
            ctx.fillRect(cx - 1, y - 14 - Math.floor(Math.random()*4), 4, 4);
        }
    }
}

function drawCat(x, y) {
    ctx.fillStyle = "#fb5607"; // Orange body
    ctx.fillRect(x, y, 18, 12);
    ctx.fillRect(x+12, y-6, 8, 8); // Head
    ctx.fillStyle = "#ffffff"; // Cream belly & ears
    ctx.fillRect(x+13, y-8, 2, 2); ctx.fillRect(x+18, y-8, 2, 2);
    ctx.fillStyle = "#000000"; // Eyes
    ctx.fillRect(x+17, y-4, 2, 2);
}

function drawPresents() {
    presents.forEach(p => {
        // Box
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.w, p.h);

        // Ribbon Cross
        ctx.fillStyle = p.ribbon;
        ctx.fillRect(p.x + Math.floor(p.w/2) - 2, p.y, 4, p.h);
        ctx.fillRect(p.x, p.y + Math.floor(p.h/2) - 2, p.w, 4);

        // Ribbon Bow
        ctx.fillRect(p.x + Math.floor(p.w/2) - 4, p.y - 4, 8, 4);
    });
}

// --- INTERACTION & CLICK DETECTION ---
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // 1. Click Cake (Toggle/Light/Mic setup)
    if (clickX >= 275 && clickX <= 325 && clickY >= 260 && clickY <= 310) {
        if (!candlesLit) {
            candlesLit = true;
            document.getElementById("mic-status-bar").innerText = "🕯️ Candles relit! Click cake or blow into your mic to extinguish!";
        } else {
            initMicrophone();
        }
        return;
    }

    // 2. Click Presents
    presents.forEach(p => {
        if (clickX >= p.x && clickX <= p.x + p.w && clickY >= p.y && clickY <= p.y + p.h) {
            openViewModal(p);
        }
    });
});

// --- MICROPHONE DETECTION ---
function initMicrophone() {
    const status = document.getElementById("mic-status-bar");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        candlesLit = false;
        status.innerText = "💨 Candles blown out!";
        return;
    }

    status.innerText = "🎙️ Requesting mic permission... Blow into your microphone!";

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            micActive = true;
            status.innerText = "🌬️ Mic Active! Blow hard into your microphone to extinguish the candles!";

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

                if (avg > 40) { // Blow threshold
                    candlesLit = false;
                    status.innerText = "🎉 Yay! You blew out the candles! Click the cake to relight.";
                    stream.getTracks().forEach(t => t.stop());
                    audioCtx.close();
                    return;
                }
                requestAnimationFrame(listen);
            }
            listen();
        })
        .catch(() => {
            candlesLit = false;
            status.innerText = "💨 Candles blown out! (Mic permission bypassed)";
        });
}

// --- MODAL CONTROLS ---
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

// Create Present
document.getElementById("add-gift-btn").onclick = () => document.getElementById("create-present-modal").classList.remove("hidden");
document.getElementById("cancel-wrap-btn").onclick = () => document.getElementById("create-present-modal").classList.add("hidden");

// Select Wrapping Option
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

// Submit New Present
document.getElementById("submit-wrap-btn").onclick = () => {
    const sender = document.getElementById("input-sender").value.trim();
    const message = document.getElementById("input-message").value.trim();
    const photoUrl = document.getElementById("input-photo-url").value.trim();

    if (!message) {
        alert("Please write a short birthday message!");
        return;
    }

    // Place new present in stack
    const newX = 470 + (presents.length % 4) * 22;
    const newY = 320 - Math.floor(presents.length / 4) * 20;

    presents.push({
        id: Date.now(),
        sender: sender || "Friend",
        message: message,
        photoUrl: photoUrl || "",
        color: selectedColor,
        ribbon: selectedRibbon,
        x: newX, y: newY, w: 26, h: 26
    });

    savePresents();
    document.getElementById("create-present-modal").classList.add("hidden");
    document.getElementById("input-sender").value = "";
    document.getElementById("input-message").value = "";
    document.getElementById("input-photo-url").value = "";
};

// Render Loop
function render() {
    drawPixelRoom();
    requestAnimationFrame(render);
}
render();
