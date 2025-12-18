// --- AUDIO STATE ---
let isMuted = true;
const bgm = document.getElementById('bgm-audio');
const flipSfx = document.getElementById('flip-audio');
const soundBtn = document.getElementById('sound-toggle');

// --- FUNGSI AUDIO ---
export function initAudio() {
    bgm.volume = 0.3; 
    flipSfx.volume = 0.6;
    
    soundBtn.addEventListener('click', toggleMute);
}

function toggleMute() {
    isMuted = !isMuted;
    if (isMuted) {
        bgm.pause();
        soundBtn.innerText = "🔇";
        soundBtn.style.borderColor = "#666";
    } else {
        bgm.play().catch(e => console.log("Interaksi user dibutuhkan"));
        soundBtn.innerText = "🔊";
        soundBtn.style.borderColor = "#e94560";
    }
}

export function playFlipSound() {
    if (!isMuted) {
        flipSfx.currentTime = 0; 
        flipSfx.play();
    }
}

export function startBGM() {
    if (isMuted) {
        isMuted = false;
        soundBtn.innerText = "🔊";
        soundBtn.style.borderColor = "#e94560";
    }
    if (bgm.paused) {
        bgm.play().catch(e => console.error("Audio error:", e));
    }
}

// --- FUNGSI ALERT & MODAL ---
export function showAlert(message) {
    const modal = document.getElementById('custom-alert');
    const msgElement = document.getElementById('alert-msg');
    msgElement.innerText = message;
    modal.classList.add('active');
}

export function closeCustomAlert() {
    document.getElementById('custom-alert').classList.remove('active');
    document.getElementById('user-question').focus();
}

// --- FUNGSI KARTU KE LAYAR ---
export function renderCardsToScreen(cards) {
    const container = document.getElementById('reading-area');
    container.innerHTML = ''; 
    const positions = ["Masa Lalu", "Masa Kini", "Masa Depan"];

    cards.forEach((card, index) => {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card';

        const meaningArray = card.isReversed ? card.meanings.shadow : card.meanings.light;
        const randomMeaning = meaningArray[Math.floor(Math.random() * meaningArray.length)];
        const statusLabel = card.isReversed ? " (Terbalik)" : "";
        const imgStyle = card.isReversed ? 'transform: rotate(180deg);' : '';

        cardContainer.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <div class="card-position">${positions[index]}</div>
                    <p style="margin-top:10px; font-size:0.8em; opacity:0.7;">...</p>
                </div>
                <div class="card-back">
                    <div class="card-position">${positions[index]}<span style="color:#e94560">${statusLabel}</span></div>
                    <img src="images/${card.img}" alt="${card.name}" style="${imgStyle}">
                    <h3>${card.name}</h3>
                    <p class="keywords"><i>${card.keywords.join(", ")}</i></p>
                    <p>"${randomMeaning}"</p>
                </div>
            </div>
        `;
        
        container.appendChild(cardContainer);

        setTimeout(() => {
            cardContainer.classList.add('is-flipped');
            playFlipSound();
        }, (index * 1000) + 100); 
    });
}

// --- UTILS LAIN ---
export function toggleLoading(isLoading) {
    const loadingEl = document.getElementById('ai-loading');
    const drawBtn = document.getElementById('draw-btn');
    
    if (isLoading) {
        loadingEl.style.display = 'block';
        drawBtn.disabled = true; 
        drawBtn.innerText = "⏳ Sedang Menafsirkan...";
    } else {
        loadingEl.style.display = 'none';
        // Tombol tidak langsung dinyalakan di sini (nunggu reset)
    }
}

export function resetUI() {
    document.getElementById('reading-area').innerHTML = ''; 
    document.getElementById('ai-response').innerText = ''; 
    document.getElementById('user-question').value = ''; 
    document.getElementById('reset-container').style.display = 'none';
    
    const drawBtn = document.getElementById('draw-btn');
    drawBtn.disabled = false;
    drawBtn.innerText = "Tarik Kartu (Past, Present, Future)";
    
    document.getElementById('user-question').focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}