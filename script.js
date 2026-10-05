* {
    box-sizing: border-box;
    user-select: none;
    margin: 0;
    padding: 0;
}

body {
    background-color: #120b18;
    font-family: 'Press Start 2P', monospace;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    overflow: hidden;
}

#game-view {
    position: relative;
    width: 960px;
    height: 640px;
    max-width: 100vw;
    max-height: 100vh;
    border: 4px solid #f687b3;
    box-shadow: 0 0 30px rgba(246, 135, 179, 0.4);
    background: #000;
    overflow: hidden;
}

/* Room Environment */
#room {
    position: relative;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, #d8839d 0%, #b85b77 65%, #6a3622 65%, #4a2211 100%);
}

/* Ceiling Rafters & String Lights */
.rafters {
    position: absolute;
    top: 0; width: 100%; height: 30px;
    background: repeating-linear-gradient(90deg, #5c2c19, #5c2c19 30px, #3a1a0e 30px, #3a1a0e 60px);
}

.garland {
    position: absolute;
    top: 30px; width: 100%; height: 20px;
    background: radial-gradient(circle, #ff477e 40%, transparent 45%) repeat-x;
    background-size: 30px 20px;
}

/* Birthday Banner */
.banner-wrapper {
    position: absolute;
    top: 50px; left: 50%;
    transform: translateX(-50%);
    width: 480px;
    height: 45px;
    background: #ffffff;
    border: 3px solid #ff70a6;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 0 #8d3a53;
}

.bday-banner {
    font-size: 14px;
    color: #4cc9f0;
    text-shadow: 2px 2px #f72585;
}

/* Window & Sky */
.window {
    position: absolute;
    top: 110px; left: 50%;
    transform: translateX(-50%);
    width: 240px; height: 180px;
    border: 6px solid #4a2416;
    background: #0c1821;
    overflow: hidden;
}

.night-sky {
    position: relative;
    width: 100%; height: 100%;
    background: radial-gradient(circle at 30% 30%, #1b2a4a, #090e17);
}

.moon {
    position: absolute;
    top: 20px; left: 30px;
    font-size: 24px;
}

.curtain {
    position: absolute;
    top: 0; width: 45px; height: 100%;
    background: repeating-linear-gradient(45deg, #ff70a6, #ff70a6 10px, #ffffff 10px, #ffffff 20px);
}
.curtain-left { left: 0; }
.curtain-right { right: 0; }

/* Left Decor (Photo Booth / Camera) */
.wall-decor-left {
    position: absolute;
    top: 130px; left: 40px;
}
.framed-photo {
    font-size: 28px;
    margin-bottom: 10px;
    cursor: pointer;
}
.photo-booth {
    margin-top: 30px;
    font-size: 36px;
    cursor: pointer;
}

/* Carpet & Table Section */
.carpet {
    position: absolute;
    bottom: 80px; left: 50%;
    transform: translateX(-50%);
    width: 600px; height: 210px;
    background: #2b5c8f;
    border: 6px solid #ffffff;
    border-radius: 12px;
    box-shadow: inset 0 0 0 4px #1b3a5c;
    display: flex;
    justify-content: center;
    align-items: center;
}

.table {
    position: relative;
    width: 420px; height: 90px;
    background: repeating-linear-gradient(45deg, #ff477e, #ff477e 15px, #ffffff 15px, #ffffff 30px);
    border: 4px solid #b8325a;
    box-shadow: 0 8px 0 #1b2430;
    display: flex;
    justify-content: center;
    align-items: center;
}

.table-feast {
    display: flex;
    align-items: center;
    gap: 20px;
    font-size: 28px;
}

.cake {
    cursor: pointer;
    text-align: center;
    position: relative;
}

.candles {
    font-size: 16px;
    position: absolute;
    top: -20px; left: 50%;
    transform: translateX(-50%);
}

.chair {
    font-size: 28px;
    position: absolute;
}
.chair-left { left: -40px; }
.chair-right { right: -40px; }
.chair-front-1 { bottom: -30px; left: 160px; }
.chair-front-2 { bottom: -30px; right: 160px; }

/* Pixel Pet */
.pixel-pet {
    position: absolute;
    bottom: 10px; left: 50%;
    transform: translateX(-50%);
    font-size: 28px;
    cursor: pointer;
    animation: bounce 1.5s infinite alternate;
}

@keyframes bounce {
    from { transform: translateX(-50%) translateY(0); }
    to { transform: translateX(-50%) translateY(-6px); }
}

/* Balloons & Presents */
.balloon {
    position: absolute;
    font-size: 32px;
    cursor: pointer;
    animation: float 2s infinite alternate ease-in-out;
}
.balloon-1 { top: 120px; left: 180px; }
.balloon-2 { top: 180px; left: 220px; }
.balloon-3 { top: 140px; right: 200px; }
.balloon-4 { top: 200px; right: 160px; }
.balloon-5 { top: 250px; right: 220px; }

@keyframes float {
    from { transform: translateY(0); }
    to { transform: translateY(-10px); }
}

.presents-left, .presents-right {
    position: absolute;
    bottom: 50px;
    display: flex;
    gap: 10px;
}
.presents-left { left: 40px; }
.presents-right { right: 40px; }

.gift {
    font-size: 36px;
    cursor: pointer;
    transition: transform 0.2s;
}
.gift:hover {
    transform: scale(1.15) rotate(-5deg);
}

/* HUD Overlay */
#hud {
    position: absolute;
    top: 10px; left: 10px; right: 10px;
    display: flex; gap: 8px; flex-wrap: wrap;
    z-index: 10; pointer-events: none;
}
.hud-item {
    background: rgba(30, 16, 40, 0.9);
    border: 2px solid #f687b3;
    padding: 6px 10px; font-size: 9px; color: #fbb6ce;
}
#audio-toggle {
    pointer-events: auto; margin-left: auto;
    font-size: 9px; padding: 6px 10px;
}

/* Modals */
.modal-overlay {
    position: absolute; inset: 0;
    background: rgba(10, 5, 15, 0.8);
    display: flex; justify-content: center; align-items: center;
    z-index: 100;
}
.modal-overlay.hidden { display: none; }
.pixel-box {
    background: #2b1035; border: 4px solid #f687b3;
    padding: 20px; width: 85%; max-width: 500px; text-align: center; color: #ffe5ec;
}
.dialogue-header { font-size: 13px; color: #ffb703; margin-bottom: 12px; }
.dialogue-body { font-size: 10px; line-height: 1.6; margin-bottom: 15px; }
.sub-text { font-size: 9px; color: #b5e2fa; margin-bottom: 15px; }
.pixel-btn {
    font-family: 'Press Start 2P', monospace; font-size: 10px;
    color: #fff; background: #7b2cbf; border: 3px solid #f687b3;
    padding: 8px 12px; cursor: pointer; margin: 4px;
}
.highlight-btn { background: #ff477e; border-color: #ffaa00; }
.final-body { font-size: 11px; background: rgba(0,0,0,0.4); padding: 12px; border: 2px dashed #f72585; }
