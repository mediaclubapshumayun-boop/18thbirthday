// Default initial gift presets
const defaultPresents = [
    {
        sender: "Rebekah",
        message: "You better have a good day!",
        photoUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300",
        style: "wrap-pink-hearts"
    },
    {
        sender: "Alex",
        message: "Happy Birthday! So glad we get to celebrate with you!",
        photoUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300",
        style: "wrap-blue-squares"
    }
];

let loadedPresents = [];
let selectedWrapStyle = "wrap-pink-hearts";
let selectedWrapName = "PINK HEARTS";
let candlesBlownOut = false;

document.addEventListener("DOMContentLoaded", () => {
    loadLocalPresents();
    setupListeners();
});

// Load gifts from localStorage or initialize default gifts
function loadLocalPresents() {
    const stored = localStorage.getItem("birthday_presents");
    if (stored) {
        try {
            loadedPresents = JSON.parse(stored);
        } catch(e) {
            loadedPresents = defaultPresents;
        }
    } else {
        loadedPresents = defaultPresents;
    }
    renderPresentsInRoom();
}

function savePresentsLocally() {
    localStorage.setItem("birthday_presents", JSON.stringify(loadedPresents));
    renderPresentsInRoom();
}

function renderPresentsInRoom() {
    const leftContainer = document.getElementById("gifts-left-container");
    const rightContainer = document.getElementById("gifts-right-container");
    
    leftContainer.innerHTML = "";
    rightContainer.innerHTML = "";

    loadedPresents.forEach((gift, index) => {
        const giftEl = document.createElement("div");
        giftEl.className = `gift-item ${gift.style || 'wrap-pink-hearts'}`;
        giftEl.innerText = "🎁";
        giftEl.onclick = () => openPresentModal(gift);

        if (index % 2 === 0) {
            leftContainer.appendChild(giftEl);
        } else {
            rightContainer.appendChild(giftEl);
        }
    });
}

// Modal View Gift
function openPresentModal(gift) {
    document.getElementById("card-sender-name").innerText = gift.sender || "Anonymous";
    document.getElementById("card-letter-text").innerText = gift.message || "Happy Birthday!";
    
    const photoImg = document.getElementById("card-photo-img");
    if (gift.photoUrl) {
        photoImg.src = gift.photoUrl;
        photoImg.parentElement.style.display = "block";
    } else {
        photoImg.parentElement.style.display = "none";
    }

    document.getElementById("view-present-modal").classList.remove("hidden");
}

function setupListeners() {
    // Close View Present Modal
    document.getElementById("close-view-btn").onclick = () => {
        document.getElementById("view-present-modal").classList.add("hidden");
    };
    document.getElementById("close-card-btn").onclick = () => {
        document.getElementById("view-present-modal").classList.add("hidden");
    };

    // Open Leave Present Modal
    document.getElementById("add-gift-btn").onclick = () => {
        document.getElementById("create-present-modal").classList.remove("hidden");
    };
    document.getElementById("cancel-wrap-btn").onclick = () => {
        document.getElementById("create-present-modal").classList.add("hidden");
    };

    // Wrapping Option Buttons
    document.querySelectorAll(".wrap-option").forEach(opt => {
        opt.onclick = (e) => {
            document.querySelectorAll(".wrap-option").forEach(o => o.classList.remove("active"));
            e.currentTarget.classList.add("active");
            selectedWrapStyle = e.currentTarget.dataset.style;
            selectedWrapName = e.currentTarget.dataset.name;
            
            document.getElementById("wrap-selected-name").innerText = selectedWrapName;
            document.getElementById("wrap-preview-icon").className = `big-gift-preview ${selectedWrapStyle}`;
        };
    });

    // Create Present Submission
    document.getElementById("submit-wrap-btn").onclick = () => {
        const sender = document.getElementById("input-sender").value.trim();
        const message = document.getElementById("input-message").value.trim();
        const photoUrl = document.getElementById("input-photo-url").value.trim();

        if (!message) {
            alert("Please write a letter for the birthday gift!");
            return;
        }

        const newGift = {
            sender: sender || "A Friend",
            message: message,
            photoUrl: photoUrl || "",
            style: selectedWrapStyle
        };

        loadedPresents.push(newGift);
        savePresentsLocally();

        document.getElementById("create-present-modal").classList.add("hidden");
        document.getElementById("input-sender").value = "";
        document.getElementById("input-message").value = "";
        document.getElementById("input-photo-url").value = "";
    };

    // Cake Click & Microphone Setup
    document.getElementById("cake-trigger").onclick = () => {
        if (candlesBlownOut) {
            // Relight candles on click
            candlesBlownOut = false;
            document.getElementById("candles-container").innerHTML = `
                <span class="flame">🔥</span>
                <span class="flame">🔥</span>
                <span class="flame">🔥</span>
            `;
            document.getElementById("mic-status-bar").innerHTML = "🕯️ Candles relit! Blow into your mic or click the cake!";
            return;
        }
        
        initMicrophoneBlow();
    };
}

// Web Audio API Microphone Detection for Blowing Out Candles
function initMicrophoneBlow() {
    const statusBar = document.getElementById("mic-status-bar");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        extinguishCandles();
        statusBar.innerText = "💨 Candles blown out!";
        return;
    }

    statusBar.innerText = "🎙️ Requesting microphone permission... Blow directly into your mic!";

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(stream => {
            statusBar.innerText = "🌬️ Microphone active! Blow hard into your microphone to put out the flames!";
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const microphone = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            
            microphone.connect(analyser);
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            function checkBlow() {
                if (candlesBlownOut) return;

                analyser.getByteFrequencyData(dataArray);
                
                // Calculate average volume level
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                    sum += dataArray[i];
                }
                let averageVolume = sum / dataArray.length;

                // Blowing creates a strong low-frequency/high-volume threshold
                if (averageVolume > 45) {
                    extinguishCandles();
                    statusBar.innerText = "🎉 Yay! You blew out the candles! Click the cake to relight them.";
                    
                    // Stop tracks to release mic icon in browser
                    stream.getTracks().forEach(track => track.stop());
                    audioContext.close();
                    return;
                }

                requestAnimationFrame(checkBlow);
            }

            checkBlow();
        })
        .catch(err => {
            console.warn("Microphone access denied or error:", err);
            // Fallback to instant blow out if mic is blocked/denied
            extinguishCandles();
            statusBar.innerText = "💨 Blow out successful! (Microphone permission was not granted)";
        });
}

function extinguishCandles() {
    candlesBlownOut = true;
    document.getElementById("candles-container").innerHTML = `
        <span class="smoke">💨</span>
        <span class="smoke">💨</span>
        <span class="smoke">💨</span>
    `;
}
