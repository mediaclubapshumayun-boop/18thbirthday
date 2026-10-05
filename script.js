// ==========================================
// 1. EASY EDITABLE MESSAGES CONFIG
// ==========================================
const gifts = [
    { message: "MESSAGE 1: Wishing you a day full of warmth, laughter, and your favorite treats! Happy Birthday!" },
    { message: "MESSAGE 2: May this coming year bring you closer to all your dreams and quiet wishes." },
    { message: "MESSAGE 3: Thank you for being such an awesome person. Enjoy your special day!" },
    { message: "MESSAGE 4: Here's a little digital hug and a giant slice of virtual cake for you!" },
    { message: "MESSAGE 5: Hope your birthday is as wonderfully unique and cozy as you are!" }
];

// State tracking
let audioContext = null;
let micStream = null;
let analyser = null;
let isAudioPlaying = false;
let candlesBlown = false;

// ==========================================
// 2. INITIALIZATION & FIREBASE INTEGRATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    setupGifts();
    setupCakeInteraction();
    setupAudioToggle();
    loadFirebaseState();
});

// Load opened state from Firebase if configured
function loadFirebaseState() {
    if (window.db) {
        window.db.collection("party_state").doc("room").get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                if (data.openedGifts) {
                    data.openedGifts.forEach(index => markGiftOpened(index, false));
                }
                if (data.candlesBlown) {
                    extinguishCandles(false);
                }
            }
        }).catch(err => console.log("Firebase sync fallback:", err));
    }
}

function saveGiftState(giftIndex) {
    if (window.db) {
        window.db.collection("party_state").doc("room").set({
            openedGifts: firebase.firestore.FieldValue.arrayUnion(giftIndex)
        }, { merge: true });
    }
}

function saveCandleState() {
    if (window.db) {
        window.db.collection("party_state").doc("room").set({
            candlesBlown: true
        }, { merge: true });
    }
}

// ==========================================
// 3. GIFT INTERACTION & ANIMATIONS
// ==========================================
function setupGifts() {
    const giftElements = document.querySelectorAll(".gift-box");
    
    giftElements.forEach(el => {
        el.addEventListener("click", () => {
            const index = parseInt(el.getAttribute("data-index"));
            triggerFirstAudio();
            
            // Shake Animation
            el.classList.add("shaking");
            setTimeout(() => {
                el.classList.remove("shaking");
                markGiftOpened(index, true);
                openMessageModal(gifts[index] ? gifts[index].message : "Happy Birthday!");
            }, 400);
        });
    });

    document.getElementById("close-message-btn").addEventListener("click", () => {
        document.getElementById("message-modal").classList.add("hidden");
    });
}

function markGiftOpened(index, isNewOpen) {
    const giftEl = document.querySelector(`.gift-box[data-index="${index}"]`);
    if (giftEl) {
        giftEl.classList.add("opened");
        if (isNewOpen) {
            saveGiftState(index);
        }
    }
}

function openMessageModal(text) {
    const modal = document.getElementById("message-modal");
    document.getElementById("modal-text").innerText = text;
    modal.classList.remove("hidden");
}

// ==========================================
// 4. CAKE & MICROPHONE CANDLE BLOWING
// ==========================================
function setupCakeInteraction() {
    const cakeTrigger = document.getElementById("cake-trigger");
    const cakeModal = document.getElementById("cake-modal");
    const manualBtn = document.getElementById("manual-blow-btn");
    const cancelBtn = document.getElementById("close-cake-btn");

    cakeTrigger.addEventListener("click", () => {
        triggerFirstAudio();
        if (candlesBlown) {
            openMessageModal("✨ Wish made! Happy Birthday! 🎂");
            return;
        }
        cakeModal.classList.remove("hidden");
        initMicrophoneDetection();
    });

    manualBtn.addEventListener("click", () => {
        extinguishCandles(true);
        cakeModal.classList.add("hidden");
    });

    cancelBtn.addEventListener("click", () => {
        stopMicrophone();
        cakeModal.classList.add("hidden");
    });
}

async function initMicrophoneDetection() {
    try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(micStream);
        
        analyser.fftSize = 256;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        function checkBlowing() {
            if (candlesBlown || !micStream) return;
            
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
            }
            let average = sum / dataArray.length;

            // Blow volume threshold
            if (average > 65) {
                extinguishCandles(true);
                document.getElementById("cake-modal").classList.add("hidden");
                stopMicrophone();
                return;
            }
            requestAnimationFrame(checkBlowing);
        }
        checkBlowing();

    } catch (err) {
        document.getElementById("mic-status-text").innerText = "Click below to blow out your candles!";
    }
}

function stopMicrophone() {
    if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
        micStream = null;
    }
}

function extinguishCandles(save) {
    candlesBlown = true;
    const candlesContainer = document.getElementById("candles");
    candlesContainer.innerHTML = "<span style='font-size:10px;'>💨</span>";
    
    if (save) {
        saveCandleState();
        openMessageModal("✨ Wish made! Happy Birthday! 🎂");
    }
}

// ==========================================
// 5. AUDIO SYSTEM
// ==========================================
function setupAudioToggle() {
    const audioBtn = document.getElementById("audio-toggle");
    const bgMusic = document.getElementById("bg-music");

    audioBtn.addEventListener("click", () => {
        if (isAudioPlaying) {
            bgMusic.pause();
            audioBtn.innerText = "🔇";
            isAudioPlaying = false;
        } else {
            bgMusic.play().then(() => {
                audioBtn.innerText = "🎵";
                isAudioPlaying = true;
            }).catch(() => {});
        }
    });
}

function triggerFirstAudio() {
    const bgMusic = document.getElementById("bg-music");
    if (!isAudioPlaying) {
        bgMusic.play().then(() => {
            isAudioPlaying = true;
            document.getElementById("audio-toggle").innerText = "🎵";
        }).catch(() => {});
    }
}
