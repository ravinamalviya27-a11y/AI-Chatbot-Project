import os
import requests

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Allow GitHub Pages to call this backend
CORS(app)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

MODEL = "gemini-3.8-flash"

@app.route("/", methods=["GET"])
def home():
    return "AI Chatbot Backend is running."


@app.route("/chat", methods=["POST"])
def chat():

    try:
        data = request.get_json()

        message = data.get("message", "").strip()

        if not message:
            return jsonify({
                "reply": "Please enter a message."
            }), 400

        if not GEMINI_API_KEY:
            return jsonify({
                "reply": "Gemini API key is not configured on the server."
            }), 500

        url = (
            f"https://generativelanguage.googleapis.com/"
            f"v1beta/models/{MODEL}:generateContent"
        )

        headers = {
            "x-goog-api-key": GEMINI_API_KEY,
            "Content-Type": "application/json"
        }

        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": message
                        }
                    ]
                }
            ]
        }

        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=60
        )

        result = response.json()

        if response.status_code != 200:
            print("Gemini Error:", result)

            return jsonify({
                "reply": "Gemini API error. Please check the server logs."
            }), 500

        reply = (
            result["candidates"][0]
            ["content"]["parts"][0]["text"]
        )

        return jsonify({
            "reply": reply
        })

    except Exception as e:

        print("Server Error:", str(e))

        return jsonify({
            "reply": "Server error: " + str(e)
        }), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000))
    )
