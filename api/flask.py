from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Flask running on Vercel 🎉"})

# Vercel entry point
def handler(request):
    return app(request.environ, request.start_response)
