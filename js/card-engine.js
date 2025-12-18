// Mengocok Kartu (Fisher-Yates)
export function shuffleDeck(originalArray) {
    const array = [...originalArray]; 
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Mengambil 3 Kartu & Menentukan Posisi
export function drawCards(fullDeck) {
    const rawCards = fullDeck.slice(0, 3);
    return rawCards.map(card => {
        return {
            ...card,    
            isReversed: Math.random() < 0.5 
        };
    });
}