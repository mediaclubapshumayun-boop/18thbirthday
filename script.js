document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // ELEMENTS
    // ==========================================

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

    // Music
    const bgMusic = document.getElementById('bgMusic');
    const musicToggleBtn = document.getElementById('musicToggleBtn');

    // Start overlay
    const startOverlay = document.getElementById('startOverlay');
    const startBtn = document.getElementById('startBtn');


    // ==========================================
    // MUSIC SETUP
    // ==========================================

    let isMusicPlaying = false;

    if (bgMusic) {

        // Volume: 50%
        bgMusic.volume = 0.5;

        // Music successfully loaded
        bgMusic.addEventListener('canplaythrough', () => {
            console.log('✅ Music file loaded successfully!');
        });

        // Music loading error
        bgMusic.addEventListener('error', () => {

            console.error('❌ MUSIC ERROR:', bgMusic.error);

            if (musicToggleBtn) {
                musicToggleBtn.textContent = '🎵 Music File Error';
            }

        });

        // If music ends
        bgMusic.addEventListener('ended', () => {

            isMusicPlaying = false;

            if (musicToggleBtn) {
                musicToggleBtn.textContent = '🎵 Music: OFF';
            }

        });
    }


    // ==========================================
    // START CELEBRATION + MUSIC
    // ==========================================

    async function startCelebration() {

        if (!bgMusic) {
            console.error('❌ bgMusic element not found!');
            return;
        }

        try {

            await bgMusic.play();

            isMusicPlaying = true;

            console.log('🎵 MUSIC STARTED!');

            if (musicToggleBtn) {
                musicToggleBtn.textContent = '🎵 Music: ON';
            }

            // Hide start overlay
            if (startOverlay) {

                startOverlay.style.opacity = '0';

                setTimeout(() => {
                    startOverlay.style.display = 'none';
                }, 500);

            }

        } catch (error) {

            console.error('❌ Could not play music:', error);

            alert(
                'Music could not start.\n\n' +
                'Please make sure "bg-music.mp3" is in the same folder as index.html.'
            );

        }
    }


    // ==========================================
    // START BUTTON
    // ==========================================

    if (startBtn) {

        startBtn.addEventListener('click', startCelebration);

    }


    // ==========================================
    // MUSIC TOGGLE
    // ==========================================

    if (musicToggleBtn) {

        musicToggleBtn.addEventListener('click', async (event) => {

            event.stopPropagation();

            if (!bgMusic) {
                return;
            }


            // MUSIC IS OFF → TURN ON
            if (bgMusic.paused) {

                try {

                    await bgMusic.play();

                    isMusicPlaying = true;

                    musicToggleBtn.textContent = '🎵 Music: ON';

                } catch (error) {

                    console.error(
                        '❌ Music play error:',
                        error
                    );

                }

            }

            // MUSIC IS ON → TURN OFF
            else {

                bgMusic.pause();

                isMusicPlaying = false;

                musicToggleBtn.textContent = '🎵 Music: OFF';

            }

        });

    }


    // ==========================================
    // CANDLE SYSTEM
    // ==========================================

    let candlesBlown = false;


    function blowOutCandles() {

        if (candlesBlown) {
            return;
        }

        candles.forEach(candle => {
            candle.classList.add('extinguished');
        });

        if (smokeEffect) {
            smokeEffect.classList.add('active');
        }

        candlesBlown = true;


        if (micStatus) {

            micStatus.textContent =
                '🎉 Candles blown out! Happy 18th Birthday Zash!';

        }

    }


    // Click cake
    if (cakeContainer) {

        cakeContainer.addEventListener(
            'click',
            blowOutCandles
        );

    }


    // ==========================================
    // MICROPHONE
    // ==========================================

    if (micBtn) {

        micBtn.addEventListener('click', async () => {

            try {

                const stream =
                    await navigator.mediaDevices.getUserMedia({
                        audio: true
                    });


                const AudioContext =
                    window.AudioContext ||
                    window.webkitAudioContext;


                const audioContext =
                    new AudioContext();


                const analyser =
                    audioContext.createAnalyser();


                const microphone =
                    audioContext.createMediaStreamSource(stream);


                analyser.fftSize = 256;

                microphone.connect(analyser);


                const bufferLength =
                    analyser.frequencyBinCount;


                const dataArray =
                    new Uint8Array(bufferLength);


                if (micStatus) {

                    micStatus.textContent =
                        '🎙️ Listening... Blow loudly into your mic!';

                }


                micBtn.style.backgroundColor =
                    '#2e7d32';


                function checkBlow() {

                    if (candlesBlown) {

                        stream
                            .getTracks()
                            .forEach(track => track.stop());

                        return;

                    }


                    analyser.getByteFrequencyData(
                        dataArray
                    );


                    let sum = 0;


                    for (
                        let i = 0;
                        i < bufferLength;
                        i++
                    ) {

                        sum += dataArray[i];

                    }


                    const average =
                        sum / bufferLength;


                    if (average > 40) {

                        blowOutCandles();


                        stream
                            .getTracks()
                            .forEach(track => track.stop());


                        audioContext.close();

                    }

                    else {

                        requestAnimationFrame(
                            checkBlow
                        );

                    }

                }


                checkBlow();

            }

            catch (error) {

                console.error(
                    '❌ Mic Error:',
                    error
                );


                if (micStatus) {

                    micStatus.textContent =
                        '⚠️ Mic access denied. Click the cake instead!';

                }

            }

        });

    }


    // ==========================================
    // BALLOON POP SOUND
    // ==========================================

    function playPopSound() {

        try {

            const AudioContext =
                window.AudioContext ||
                window.webkitAudioContext;


            const audioCtx =
                new AudioContext();


            const oscillator =
                audioCtx.createOscillator();


            const gain =
                audioCtx.createGain();


            oscillator.connect(gain);

            gain.connect(
                audioCtx.destination
            );


            oscillator.type = 'sine';


            oscillator.frequency.setValueAtTime(
                450,
                audioCtx.currentTime
            );


            oscillator.frequency.exponentialRampToValueAtTime(
                80,
                audioCtx.currentTime + 0.08
            );


            gain.gain.setValueAtTime(
                0.6,
                audioCtx.currentTime
            );


            gain.gain.exponentialRampToValueAtTime(
                0.01,
                audioCtx.currentTime + 0.08
            );


            oscillator.start();


            oscillator.stop(
                audioCtx.currentTime + 0.08
            );

        }

        catch (error) {

            console.log(
                'AudioContext error:',
                error
            );

        }

    }


    // ==========================================
    // BALLOONS
    // ==========================================

    balloons.forEach(balloon => {

        balloon.addEventListener('click', () => {

            playPopSound();

            balloon.classList.add('popping');


            setTimeout(() => {

                balloon.style.display = 'none';

            }, 200);

        });

    });


    // ==========================================
    // GIFTS
    // ==========================================

    giftItems.forEach(gift => {

        gift.addEventListener('click', () => {

            const wish =
                gift.getAttribute('data-wish');


            if (wishText) {
                wishText.textContent = wish;
            }


            if (wishModal) {
                wishModal.classList.remove('hidden');
            }


            gift.classList.add('opened');

        });

    });


    // ==========================================
    // CLOSE WISH MODAL
    // ==========================================

    if (closeModal) {

        closeModal.addEventListener('click', () => {

            if (wishModal) {
                wishModal.classList.add('hidden');
            }

        });

    }


    // Click outside modal
    window.addEventListener('click', event => {

        if (event.target === wishModal) {

            wishModal.classList.add('hidden');

        }

    });

});
