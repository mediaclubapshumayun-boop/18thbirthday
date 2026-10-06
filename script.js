document.addEventListener('DOMContentLoaded', () => {
    const candles = document.querySelectorAll('.candle-flame');
    const cakeContainer = document.getElementById('cakeContainer');
    const smokeEffect = document.getElementById('smokeEffect');
    const micBtn = document.getElementById('micBtn');
    const micStatus = document.getElementById('micStatus');
    
    const wishModal = document.getElementById('wishModal');
    const wishText = document.getElementById('wishText');
    const closeModal = document.getElementById('closeModal');
    const giftItems = document.querySelectorAll('.gift-item');document.addEventListener('DOMContentLoaded', () => {
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

    // Background Audio Elements & Controls
    const bgMusic = document.getElementById('bgMusic');
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    let isMusicPlaying = false;

    // Create a Web Audio API synthesizer for the balloon pop sound effect
    function playPopSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc.type = 'sine';
            // Start high and drop quickly for a pop sound
            osc.frequency.setValueAtTime(400, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        } catch (e) {
            console.log("AudioContext not supported or blocked", e);
        }
    }

    function playAudio() {
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            musicToggleBtn.textContent = "🎵 Music: ON";
            console.log("Audio playing successfully!");
        }).catch(err => {
            console.log("Autoplay prevented by browser, waiting for user interaction:", err);
        });
    }

    // Try playing immediately on load
    bgMusic.volume = 0.5;
    playAudio();

    musicToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isMusicPlaying) {
            bgMusic.pause();
            isMusicPlaying = false;
            musicToggleBtn.textContent = "🎵 Music: OFF";
        } else {
            playAudio();
        }
    });

    // Fallback: Start music on the very first click anywhere if browser blocked initial autoplay
    document.addEventListener('click', () => {
        if (!isMusicPlaying) {
            playAudio();
        }
    }, { once: true });

    let candlesBlown = false;

    // Extinguish Candles Function
    function blowOutCandles() {
        if (candlesBlown) return;
        
        candles.forEach(candle => candle.classList.add('extinguished'));
        smokeEffect.classList.add('active');
        candlesBlown = true;
        micStatus.textContent = "🎉 Candles blown out! Happy 18th Birthday Zash!";
    }

    // Manual Click on Cake
    cakeContainer.addEventListener('click', blowOutCandles);

    // Microphone Detection Logic
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

            micStatus.textContent = "🎙 Listening... Blow loudly into your mic!";
            micBtn.style.backgroundColor = "#2e7d32";

            function checkBlow() {
                if (candlesBlown) return;

                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                let average = sum / bufferLength;

                if (average > 45) {
                    blowOutCandles();
                } else {
                    requestAnimationFrame(checkBlow);
                }
            }

            checkBlow();
        } catch (err) {
            micStatus.textContent = "⚠️ Mic access denied. Click the cake instead!";
            console.error('Mic Error:', err);
        }
    });

    // Pop Balloons with Sound Effect
    balloons.forEach(balloon => {
        balloon.addEventListener('click', (e) => {
            e.stopPropagation();
            playPopSound(); // Trigger the pop sound effect
            balloon.classList.add('popping');
            setTimeout(() => {
                balloon.style.display = 'none';
            }, 200);
        });
    });

    // Open Gift Boxes for Wishes
    giftItems.forEach(gift => {
        gift.addEventListener('click', (e) => {
            e.stopPropagation();
            const wish = gift.getAttribute('data-wish');
            wishText.textContent = wish;
            wishModal.classList.remove('hidden');
            gift.classList.add('opened');
        });
    });

    // Close Wish Modal
    closeModal.addEventListener('click', () => {
        wishModal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if (e.target === wishModal) {
            wishModal.classList.add('hidden');
        }
    });
});
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
