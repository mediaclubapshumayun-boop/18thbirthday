document.addEventListener('DOMContentLoaded', () => {
    const candles = document.querySelectorAll('.candle-flame');
    const cakeContainer = document.getElementById('cakeContainer');
    const smokeEffect = document.getElementById('smokeEffect');
    const micBtn = document.getElementById('micBtn');
    const micStatus = document.getElementById('micStatus');
    
    const wishModal = document.getElementById('wishModal');
    const wishText = document.getElementById('wishText');
    const closeModal = document.getElementById('closeModal');
    const giftItems = document.querySelectorAll('.gift-item');
    const balloons = document.querySelectorAll('.balloon');

    // Music & Overlay Elements
    const bgMusic = document.getElementById('bgMusic');
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    const startOverlay = document.getElementById('startOverlay'); // Agar aapne HTML mein overlay lagaya hai
    const startBtn = document.getElementById('startBtn');         // Celebration start button
    let isMusicPlaying = false;

    // Function to Play Balloon Pop Sound using Web Audio API (No external file needed)
    function playPopSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            // Quick frequency drop for a realistic pop effect
            osc.type = 'sine';
            osc.frequency.setValueAtTime(450, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.08);
            
            gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.08);
        } catch (err) {
            console.log("AudioContext error:", err);
        }
    }

    // Function to Start Audio & Hide Overlay
    function startCelebration() {
        if (bgMusic) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                if (musicToggleBtn) musicToggleBtn.textContent = "🎵 Music: ON";
            }).catch(err => {
                console.log("Autoplay blocked:", err);
            });
        }
        
        // Hide overlay if it exists in HTML
        if (startOverlay) {
            startOverlay.style.opacity = '0';
            setTimeout(() => {
                startOverlay.style.display = 'none';
            }, 500);
        }
    }

    // Start Button Listener (if present)
    if (startBtn) {
        startBtn.addEventListener('click', startCelebration);
    }

    // Toggle Music Button
    if (musicToggleBtn) {
        musicToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isMusicPlaying) {
                bgMusic.pause();
                isMusicPlaying = false;
                musicToggleBtn.textContent = "🎵 Music: OFF";
            } else {
                bgMusic.play().then(() => {
                    isMusicPlaying = true;
                    musicToggleBtn.textContent = "🎵 Music: ON";
                });
            }
        });
    }

    // Fallback: First click anywhere starts audio if no overlay clicked
    document.body.addEventListener('click', () => {
        if (!isMusicPlaying && bgMusic) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                if (musicToggleBtn) musicToggleBtn.textContent = "🎵 Music: ON";
            }).catch(() => {});
        }
    }, { once: true });

    let candlesBlown = false;

    // Extinguish Candles Function
    function blowOutCandles() {
        if (candlesBlown) return;
        
        candles.forEach(candle => candle.classList.add('extinguished'));
        if (smokeEffect) smokeEffect.classList.add('active');
        candlesBlown = true;
        
        if (micStatus) {
            micStatus.textContent = "🎉 Candles blown out! Happy 18th Birthday Zash!";
        }
    }

    // Manual Click on Cake
    if (cakeContainer) {
        cakeContainer.addEventListener('click', blowOutCandles);
    }

    // Microphone Detection Logic
    if (micBtn) {
        micBtn.addEventListener('click', async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const analyser = audioContext.createAnalyser();
                const microphone = audioContext.createMediaStreamSource(stream);
                
                analyser.fftSize = 256;
                microphone.connect(analyser);

                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                if (micStatus) micStatus.textContent = "🎙️ Listening... Blow loudly into your mic!";
                micBtn.style.backgroundColor = "#2e7d32";

                function checkBlow() {
                    if (candlesBlown) return;

                    analyser.getByteFrequencyData(dataArray);
                    let sum = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        sum += dataArray[i];
                    }
                    let average = sum / bufferLength;

                    if (average > 40) {
                        blowOutCandles();
                        stream.getTracks().forEach(track => track.stop());
                    } else {
                        requestAnimationFrame(checkBlow);
                    }
                }

                checkBlow();
            } catch (err) {
                if (micStatus) micStatus.textContent = "⚠️ Mic access denied. Click the cake instead!";
                console.error('Mic Error:', err);
            }
        });
    }

    // Pop Balloons with Built-in Pop Sound
    balloons.forEach(balloon => {
        balloon.addEventListener('click', () => {
            playPopSound(); // Play synthesized pop sound immediately
            balloon.classList.add('popping');
            setTimeout(() => {
                balloon.style.display = 'none';
            }, 200);
        });
    });

    // Open Gift Boxes for Wishes
    giftItems.forEach(gift => {
        gift.addEventListener('click', () => {
            const wish = gift.getAttribute('data-wish');
            if (wishText) wishText.textContent = wish;
            if (wishModal) wishModal.classList.remove('hidden');
            gift.classList.add('opened');
        });
    });

    // Close Wish Modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (wishModal) wishModal.classList.add('hidden');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === wishModal) {
            wishModal.classList.add('hidden');
        }
    });
});
