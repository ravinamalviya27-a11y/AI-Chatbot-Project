const BACKEND_URL = "https://ai-chatbot-backend-07gk.onrender.com";

const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const sendButton = document.getElementById("send-button");


async function sendMessage() {

    const message = userInput.value.trim();

    if (!message) {
        return;
    }

    // Show user's message
    const userMessage = document.createElement("div");
    userMessage.className = "user-message";
    userMessage.textContent = message;

    chatBox.appendChild(userMessage);

    userInput.value = "";

    chatBox.scrollTop = chatBox.scrollHeight;


    // Show loading message
    const loadingMessage = document.createElement("div");
    loadingMessage.className = "bot-message";
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


        // Show Gemini response
        const botMessage = document.createElement("div");

        botMessage.className = "bot-message";

        botMessage.textContent =
            "🤖 " + (data.reply || "No response received.");

        chatBox.appendChild(botMessage);

        chatBox.scrollTop = chatBox.scrollHeight;


    } catch (error) {

        console.error("Connection error:", error);

        loadingMessage.textContent =
            "❌ Unable to connect to Gemini server.";

    }
}


// Send button
sendButton.addEventListener("click", sendMessage);


// Enter key
userInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});
