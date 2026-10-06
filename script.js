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

    // Music Elements
    const bgMusic = document.getElementById('bgMusic');
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    let isMusicPlaying = false;

    // Function to Start Audio
    function playAudio() {
        if (!isMusicPlaying) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                musicToggleBtn.textContent = "🎵 Music: ON";
            }).catch(err => {
                console.log("Autoplay blocked, waiting for user click.", err);
            });
        }
    }

    // Toggle Music Button
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

    // Auto-play music on first interaction anywhere on page
    document.body.addEventListener('click', () => {
        playAudio();
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

            micStatus.textContent = "🎙️ Listening... Blow loudly into your mic!";
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

    // Pop Balloons
    balloons.forEach(balloon => {
        balloon.addEventListener('click', () => {
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
