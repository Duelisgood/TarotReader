import { shuffleDeck, drawCards } from './card-engine.js';
import { fetchAIReading } from './ai-service.js';
import * as UI from './ui-manager.js';
import { sampleQuestions } from './data.js';

const JSON_URL = 'tarot-images.json'; 

// --- INIT APP (Hapus DOMContentLoaded, jalankan langsung) ---
UI.initAudio();

// Welcome Screen Logic
const enterBtn = document.getElementById('enter-btn');
if (enterBtn) {
    enterBtn.addEventListener('click', () => {
        UI.startBGM();
        const welcomeScreen = document.getElementById('welcome-screen');
        welcomeScreen.classList.add('fade-out');
        setTimeout(() => { welcomeScreen.style.display = 'none'; }, 1000);
    });
}

// Event Listeners
const drawBtn = document.getElementById('draw-btn');
if (drawBtn) drawBtn.addEventListener('click', handleDraw);

const resetBtn = document.getElementById('reset-btn');
if (resetBtn) resetBtn.addEventListener('click', UI.resetUI);

const randomBtn = document.getElementById('random-btn');
if (randomBtn) randomBtn.addEventListener('click', handleRandomQuestion);

const saveBtn = document.getElementById('save-btn');
if (saveBtn) saveBtn.addEventListener('click', handleSave);

// Modal Close Events
const modalBtn = document.querySelector('#custom-alert button');
if (modalBtn) modalBtn.addEventListener('click', UI.closeCustomAlert);

const customAlert = document.getElementById('custom-alert');
if (customAlert) {
    customAlert.addEventListener('click', (e) => {
        if (e.target.id === 'custom-alert') UI.closeCustomAlert();
    });
}

// --- MAIN LOGIC FLOW (Sisanya tetap sama) ---
async function handleDraw() {

    const questionInput = document.getElementById('user-question');
    const userQuestion = questionInput.value.trim();

    if (!userQuestion) {
        UI.showAlert("Energi kartu terkunci. Harap tuliskan pertanyaanmu terlebih dahulu.");
        return;     
    }

    UI.startBGM();
    UI.toggleLoading(true);
    document.getElementById('ai-response').innerText = ''; 
    document.getElementById('reading-area').innerHTML = '<p>Mengocok kartu...</p>';

    try {
        const response = await fetch(JSON_URL);
        const data = await response.json();
        const fullDeck = shuffleDeck(data.cards);
        const selectedCards = drawCards(fullDeck);
        UI.renderCardsToScreen(selectedCards);
        const aiText = await fetchAIReading(userQuestion, selectedCards);
        
        const aiResponseElement = document.getElementById('ai-response');
        aiResponseElement.innerHTML = marked.parse(aiText);
        
        UI.toggleLoading(false); 
        document.getElementById('reset-container').style.display = 'flex'; 
        aiResponseElement.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error(error);
        UI.showAlert("Terjadi kesalahan: " + error.message);
        UI.toggleLoading(false);
        UI.resetUI(); 
    }
}

function handleRandomQuestion() {
    const input = document.getElementById('user-question');
    const randomIndex = Math.floor(Math.random() * sampleQuestions.length);
    input.style.background = "rgba(255, 215, 0, 0.2)";
    setTimeout(() => input.style.background = "rgba(255, 255, 255, 0.1)", 200);
    input.value = sampleQuestions[randomIndex];
    input.focus();
}

function handleSave() {
   
    UI.showAlert("Sedang mengabadikan energi semesta...");
    const elementsToHide = [
        document.querySelector('.input-section'),
        document.getElementById('reset-container'),
        document.getElementById('sound-toggle'),
        document.getElementById('random-btn')
    ];
    elementsToHide.forEach(el => { if(el) el.style.visibility = 'hidden'; });
    window.scrollTo(0,0);

    html2canvas(document.body, {
        backgroundColor: "#1a0b2e",
        scale: 2,
        useCORS: true,
        ignoreElements: (element) => element.id === 'custom-alert' || element.id === 'welcome-screen'
    }).then(canvas => {
        elementsToHide.forEach(el => { if(el) el.style.visibility = 'visible'; });
        const link = document.createElement('a');
        link.download = `Tarot-Reading-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        setTimeout(() => UI.showAlert("Ramalan berhasil disimpan!"), 1000);
    }).catch(err => {
        elementsToHide.forEach(el => { if(el) el.style.visibility = 'visible'; });
        UI.showAlert("Gagal menyimpan gambar.");
    });
}