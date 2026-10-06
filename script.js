let audioContext, analyser, microphone;
let isMicActive = false;
let candlesLit = true;

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
        document.getElementById('micStatus').innerText = "Mic Active! Blow into mic now!";
        document.getElementById('micBtn').style.display = 'none';
        detectBlow();
    } catch (err) {
        alert("Microphone permission required to blow candles.");
    }
}

function detectBlow() {
    if (!isMicActive || !candlesLit) return;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    let average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    
    // Blowing threshold
    if (average > 22) {
        candlesLit = false;
        document.querySelectorAll('.candle-flame').forEach(el => el.style.display = 'none');
        document.getElementById('micStatus').innerText = "🎉 Candles Blown Out!";
    } else {
        requestAnimationFrame(detectBlow);
    }
}

document.getElementById('micBtn').addEventListener('click', initMicrophone);

// Balloon Pop Event
document.querySelectorAll('.balloon').forEach(b => {
    b.addEventListener('click', (e) => {
        e.target.style.visibility = 'hidden';
        alert("🎈 POP! Balloon Popped!");
    });
});

// Gift Click Event
const modal = document.getElementById('wishModal');
const wishText = document.getElementById('wishText');

document.querySelectorAll('.gift').forEach(g => {
    g.addEventListener('click', (e) => {
        const wish = e.target.getAttribute('data-wish');
        wishText.innerText = wish;
        modal.classList.remove('hidden');
    });
});

document.getElementById('closeModal').addEventListener('click', () => {
    modal.classList.add('hidden');
});
