let audioContext, analyser, microphone;
let isMicActive = false;
let candlesLit = true;

// Synthesizer Pop Sound
function playPopSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
}

function playBlowSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const bufferSize = ctx.sampleRate * 0.4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
    } catch (e) {}
}

// Extinguish Candles Logic
function extinguishCandles() {
    if (!candlesLit) return;
    candlesLit = false;

    // Extinguish flames
    document.querySelectorAll('.candle-flame').forEach(el => {
        el.classList.add('extinguished');
    });

    // Trigger Smoke Animation
    const smoke = document.getElementById('smokeEffect');
    if (smoke) {
        smoke.classList.add('active');
    }

    // Play Sound & Update UI
    playBlowSound();
    document.getElementById('micStatus').innerText = "🎉 Candles Blown Out! Make a wish, Zash!";
}

// Microphone Blow Detection
async function initMicrophone() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;

        isMicActive = true;
        document.getElementById('micStatus').innerText = "Mic Active! Blow gently into mic now!";
        document.getElementById('micBtn').style.display = 'none';
        detectBlow();
    } catch (err) {
        document.getElementById('micStatus').innerText = "Mic denied. You can tap the cake to blow candles!";
    }
}

let blowCounter = 0;
function detectBlow() {
    if (!isMicActive || !candlesLit) return;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    let average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

    if (average > 35) {
        blowCounter++;
        document.querySelectorAll('.candle-flame').forEach(el => {
            el.style.transform = `scale(${1 + Math.random() * 0.4})`;
        });

        if (blowCounter > 4) {
            extinguishCandles();
            return;
        }
    } else {
        blowCounter = Math.max(0, blowCounter - 1);
    }

    requestAnimationFrame(detectBlow);
}

document.getElementById('micBtn').addEventListener('click', initMicrophone);

// Fallback direct cake tap interaction
document.getElementById('cakeContainer').addEventListener('click', () => {
    if (candlesLit) {
        extinguishCandles();
    }
});

// Interactive Balloon Popping
document.querySelectorAll('.interactive.balloon').forEach(b => {
    b.addEventListener('click', (e) => {
        const balloon = e.currentTarget;
        if (balloon.classList.contains('popping')) return;
        
        playPopSound();
        balloon.classList.add('popping');
        setTimeout(() => {
            balloon.style.display = 'none';
        }, 200);
    });
});

// Floor Gift Items Click Handler
const modal = document.getElementById('wishModal');
const wishText = document.getElementById('wishText');

document.querySelectorAll('.gift-item').forEach(g => {
    g.addEventListener('click', (e) => {
        const gift = e.currentTarget;
        const wish = gift.getAttribute('data-wish');
        
        gift.classList.add('opened');
        wishText.innerText = wish;
        modal.classList.remove('hidden');
    });
});

document.getElementById('closeModal').addEventListener('click', () => {
    modal.classList.add('hidden');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
    }
});
