class Chatbot {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
        this.questions = [
            {
                question: "¿Con qué frecuencia te has sentido nervioso/a, ansioso/a o con los nervios de punta?",
                options: [
                    "Nunca",
                    "Algunos días",
                    "Más de la mitad de los días",
                    "Casi todos los días"
                ]
            },
            {
                question: "¿Con qué frecuencia te has sentido incapaz de controlar tus preocupaciones?",
                options: [
                    "Nunca",
                    "Algunos días",
                    "Más de la mitad de los días",
                    "Casi todos los días"
                ]
            },
            {
                question: "¿Con qué frecuencia te has sentido con poco interés o placer en hacer cosas?",
                options: [
                    "Nunca",
                    "Algunos días",
                    "Más de la mitad de los días",
                    "Casi todos los días"
                ]
            },
            {
                question: "¿Con qué frecuencia te has sentido decaído/a, deprimido/a o sin esperanza?",
                options: [
                    "Nunca",
                    "Algunos días",
                    "Más de la mitad de los días",
                    "Casi todos los días"
                ]
            }
        ];
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestion];
    }

    submitAnswer(answer) {
        this.answers.push(answer);
        this.currentQuestion++;
        return this.currentQuestion < this.questions.length;
    }

    getResults() {
        const score = this.answers.reduce((sum, answer) => sum + answer, 0);
        let result = {
            level: "",
            message: "",
            recommendation: ""
        };

        if (score <= 4) {
            result = {
                level: "Bajo",
                message: "Tus respuestas indican un nivel bajo de ansiedad y depresión.",
                recommendation: "Continúa manteniendo hábitos saludables y actividades que te ayuden a mantener tu bienestar mental."
            };
        } else if (score <= 8) {
            result = {
                level: "Moderado",
                message: "Tus respuestas sugieren un nivel moderado de ansiedad y/o depresión.",
                recommendation: "Te recomendamos hablar con un profesional de la salud mental para una evaluación más detallada."
            };
        } else {
            result = {
                level: "Alto",
                message: "Tus respuestas indican un nivel alto de ansiedad y/o depresión.",
                recommendation: "Es importante que consultes con un profesional de la salud mental lo antes posible."
            };
        }

        return result;
    }
}

// Función para inicializar el chatbot
function initChatbot() {
    const chatbot = new Chatbot();
    const chatContainer = document.getElementById('chatContainer');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');

    function displayMessage(message, isBot = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isBot ? 'bot' : 'user'}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                ${isBot ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>'}
                <p>${message}</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function displayOptions(options) {
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'chat-options';
        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option;
            button.onclick = () => handleOptionClick(index);
            optionsDiv.appendChild(button);
        });
        chatMessages.appendChild(optionsDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleOptionClick(optionIndex) {
        const currentQuestion = chatbot.getCurrentQuestion();
        displayMessage(currentQuestion.options[optionIndex], false);
        
        const hasMoreQuestions = chatbot.submitAnswer(optionIndex);
        if (hasMoreQuestions) {
            setTimeout(() => {
                const nextQuestion = chatbot.getCurrentQuestion();
                displayMessage(nextQuestion.question);
                displayOptions(nextQuestion.options);
            }, 1000);
        } else {
            setTimeout(() => {
                const results = chatbot.getResults();
                displayMessage(`Basado en tus respuestas, el nivel de ansiedad/depresión es: ${results.level}`);
                displayMessage(results.message);
                displayMessage(`Recomendación: ${results.recommendation}`);
            }, 1000);
        }
    }

    // Iniciar el chat
    displayMessage("¡Hola! Soy tu asistente virtual de PsyCare. Voy a hacerte algunas preguntas para evaluar tu estado de ánimo. ¿Estás listo/a para comenzar?");
    displayMessage("Por favor, responde con sinceridad para obtener los mejores resultados.");
    
    setTimeout(() => {
        const firstQuestion = chatbot.getCurrentQuestion();
        displayMessage(firstQuestion.question);
        displayOptions(firstQuestion.options);
    }, 2000);
}

// Exportar la función de inicialización
window.initChatbot = initChatbot; 