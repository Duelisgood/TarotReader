export async function fetchAIReading(question, cards) {

    const positions = ["Masa Lalu", "Masa Kini", "Masa Depan"];

let cardDetails = cards.map((card, index) => {

        const status = card.isReversed ? "POSISI: TERBALIK (Reversed)" : "POSISI: TEGAK (Upright)";
        
        const activeMeaning = card.isReversed 
            ? card.meanings.shadow.join(", ") 
            : card.meanings.light.join(", ");

        return `
        Kartu ${index + 1} (${positions[index]}): ${card.name}
        ${status}
        Kata Kunci: ${card.keywords.join(", ")}
        Makna Utama: "${activeMeaning}"
        --------------------------------`; 
    }).join("\n");

    const systemPrompt = `Kamu adalah pembaca Tarot profesional. 
    Tugasmu adalah menafsirkan arti kartu sesuai dengan makna yang diberikan.
    JANGAN memberikan makna terbalik jika kartu dalam posisi TEGAK.
    JANGAN memberikan makna positif jika kartu dalam posisi TERBALIK (kecuali memang relevan sebagai solusi).`;

    const userPrompt = `
    Pertanyaan user: "${question}"
    
    Tebaran Kartu:
    ${cardDetails}
    
    Berikan tafsir lengkap yang menyambungkan ketiga kartu tersebut menjadi sebuah cerita naratif yang menjawab pertanyaan user.`;

    const requestBody = {
        model: MODEL_ID, 
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        temperature: 0.7 
    };

    const response = await fetch('/api/tarot-read', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ]
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server Error: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}