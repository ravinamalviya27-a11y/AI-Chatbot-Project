const BACKEND_URL = "https://ai-chatbot-backend-07gk.onrender.com";


const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const sendButton = document.getElementById("send-button");


async function sendMessage() {

    const message = userInput.value.trim();

    if (!message) {
        return;
    }


    // Display user message
    const userMessage = document.createElement("div");

    userMessage.className = "message user-message";

    userMessage.textContent = message;

    chatBox.appendChild(userMessage);

    userInput.value = "";

    chatBox.scrollTop = chatBox.scrollHeight;


    // Loading message
    const loadingMessage = document.createElement("div");

    loadingMessage.className = "message bot-message";

    loadingMessage.textContent = "🤖 Thinking...";

    chatBox.appendChild(loadingMessage);

    chatBox.scrollTop = chatBox.scrollHeight;


    try {

        const response = await fetch(BACKEND_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });


        const data = await response.json();

        loadingMessage.remove();


        // Display Gemini response
        const botMessage = document.createElement("div");

        botMessage.className = "message bot-message";

        botMessage.textContent =
            "🤖 " + (data.reply || "No response received.");

        chatBox.appendChild(botMessage);

        chatBox.scrollTop = chatBox.scrollHeight;


    } catch (error) {

        console.error(error);

        loadingMessage.textContent =
            "❌ Unable to connect to Gemini.";

    }
}


// Send button
sendButton.addEventListener(
    "click",
    sendMessage
);


// Enter key
userInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            sendMessage();

        }

    }
);
