const BACKEND_URL = "https://ai-chatbot-backend-07gk.onrender.com";


async function sendMessage() {

    const input = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    const userMessage = input.value.trim();

    if (userMessage === "") {
        return;
    }


    // Display user message
    const userDiv = document.createElement("div");

    userDiv.className = "user-message";

    userDiv.innerHTML = `
        <p>${escapeHTML(userMessage)}</p>
    `;

    chatBox.appendChild(userDiv);

    input.value = "";

    chatBox.scrollTop = chatBox.scrollHeight;


    // Loading message
    const loadingDiv = document.createElement("div");

    loadingDiv.className = "bot-message";
    loadingDiv.id = "loading-message";

    loadingDiv.innerHTML = `
        <span>🤖</span>
        <p>Thinking...</p>
    `;

    chatBox.appendChild(loadingDiv);

    chatBox.scrollTop = chatBox.scrollHeight;


    try {

        const response = await fetch(BACKEND_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: userMessage
            })

        });


        const data = await response.json();


        // Remove loading message
        loadingDiv.remove();


        // Display AI response
        const botDiv = document.createElement("div");

        botDiv.className = "bot-message";

        botDiv.innerHTML = `
            <span>🤖</span>
            <p>${escapeHTML(data.reply)}</p>
        `;

        chatBox.appendChild(botDiv);

        chatBox.scrollTop = chatBox.scrollHeight;


    } catch (error) {

        loadingDiv.innerHTML = `
            <span>🤖</span>
            <p>❌ Unable to connect to AI server.</p>
        `;

        console.error("Error:", error);
    }
}


// Press Enter to send message
document
    .getElementById("user-input")
    .addEventListener("keydown", function(event) {

        if (event.key === "Enter") {
            sendMessage();
        }

    });


// Security helper
function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}
