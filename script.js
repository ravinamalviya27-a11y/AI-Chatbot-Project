const API_KEY = "YOUR_GEMINI_API_KEY";

const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
    API_KEY;


async function sendMessage() {

    const input = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    const userMessage = input.value.trim();

    if (userMessage === "") {
        return;
    }

    // Display user message
    addMessage(userMessage, "user");

    input.value = "";

    // Show typing message
    const typingMessage = document.createElement("div");

    typingMessage.className = "bot-message";
    typingMessage.id = "typing";

    typingMessage.innerHTML = `
        <span>🤖</span>
        <p class="typing">AI is typing...</p>
    `;

    chatBox.appendChild(typingMessage);

    chatBox.scrollTop = chatBox.scrollHeight;


    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                contents: [
                    {
                        parts: [
                            {
                                text: userMessage
                            }
                        ]
                    }
                ]

            })

        });


        const data = await response.json();


        document.getElementById("typing").remove();


        if (data.candidates && data.candidates.length > 0) {

            const botReply =
                data.candidates[0].content.parts[0].text;

            addMessage(botReply, "bot");

        } else {

            addMessage(
                "Sorry, I couldn't understand that.",
                "bot"
            );

        }

    } catch (error) {

        document.getElementById("typing").remove();

        addMessage(
            "Something went wrong. Please try again.",
            "bot"
        );

        console.error(error);
    }
}


// Function to display messages
function addMessage(message, sender) {

    const chatBox = document.getElementById("chat-box");

    const messageDiv = document.createElement("div");

    if (sender === "user") {

        messageDiv.className = "user-message";

        messageDiv.innerHTML = `
            <p>${message}</p>
        `;

    } else {

        messageDiv.className = "bot-message";

        messageDiv.innerHTML = `
            <span>🤖</span>
            <p>${message}</p>
        `;
    }

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}


// Send message using Enter key
document
    .getElementById("user-input")
    .addEventListener("keydown", function(event) {

        if (event.key === "Enter") {
            sendMessage();
        }

    });
