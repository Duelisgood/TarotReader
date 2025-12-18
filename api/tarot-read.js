export default async function handler(request, response) {

    const { messages } = request.body;

    const apiKey = process.env.GROQ_API_KEY; 

    if (!apiKey) {
        return response.status(500).json({ error: "API Key server belum disetting!" });
    }

    try {
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b", 
                messages: messages,
                temperature: 0.7
            })
        });

        const data = await groqResponse.json();

        return response.status(200).json(data);

    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
}