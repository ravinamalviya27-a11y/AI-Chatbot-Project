import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai

app = Flask(__name__)

# Allow the GitHub Pages frontend to call this backend
CORS(app)

# Get Gemini API key from environment variable
API_KEY = os.environ.get("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not configured.")

# Create Gemini client
client = genai.Client(api_key=API_KEY)

# Gemini model
MODEL = "gemini-3.8-flash"


@app.route("/")
def home():
    return "AI Chatbot Backend is running."


@app.route("/chat", methods=["POST"])
def chat():

    try:
        data = request.get_json()

        user_message = data.get("message", "").strip()

        if not user_message:
            return jsonify({
                "reply": "Please enter a message."
            }), 400

        # Send user message to Gemini
        response = client.models.generate_content(
            model=MODEL,
            contents=user_message
        )

        return jsonify({
            "reply": response.text
        })

    except Exception as error:

        print("Error:", error)

        return jsonify({
            "reply": "Sorry, something went wrong. Please try again."
        }), 500


if __name__ == "__main__":

    port = int(os.environ.get("PORT", 10000))

    app.run(
        host="0.0.0.0",
        port=port
    )
