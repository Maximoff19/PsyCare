// Lógica del chatbot para diagnosis.html

document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    let conversationHistory = [];

    function addMessage(message, isBot = true) {
        const div = document.createElement('div');
        div.className = 'chat-message ' + (isBot ? 'bot' : 'user');
        div.innerHTML = `<div class="message-content"><p>${message}</p></div>`;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage(initialPrompt) {
        let message = initialPrompt !== undefined ? initialPrompt : chatInput.value.trim();
        if (!message && conversationHistory && conversationHistory.length > 0) return;

        // Añadir el mensaje del usuario al historial y mostrarlo en el chat
        if (message) {
            conversationHistory.push({ role: "user", content: message });
            addMessage(message, false);
        }

        chatInput.value = '';
        addMessage('...', true);

        try {
            const response = await fetch('http://localhost:3001/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    history: conversationHistory
                })
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            chatMessages.lastChild.remove();

            if (data.error) {
                addMessage(`Error: ${data.error}`, true);
                console.error('Error del servidor:', data.details);
            } else if (data.text) {
                addMessage(data.text, true);
                conversationHistory.push({ role: "assistant", content: data.text });
            } else {
                addMessage('No se recibió una respuesta válida del asistente.', true);
            }
        } catch (e) {
            chatMessages.lastChild.remove();
            addMessage('Error al comunicarse con el asistente. Por favor, intenta de nuevo.', true);
            console.error('Error de conexión:', e);
        }
    }

    sendButton.onclick = () => sendMessage();
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && chatInput.value.trim() !== '') sendMessage();
    });

    // Mensaje de bienvenida
    addMessage('Hola, soy tu asistente virtual de salud mental. ¿Te gustaría responder algunas preguntas para evaluar tu bienestar emocional?');
}); 