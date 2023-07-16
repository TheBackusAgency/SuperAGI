from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

@app.route('/api/generate-text', methods=['POST'])
def generate_text():
    wake_word, prompt = request.json['wake_word'], request.json['prompt']

    if wake_word == 'Hey GPT':
        response = requests.post('https://api.openai.com/v1/engines/davinci-codex/completions',
            headers={'Authorization': f'Bearer {os.getenv("OPENAI_API_KEY")}'},
            json={'prompt': prompt, 'max_tokens': 100})
    elif wake_word == 'Hey AGI':
        response = requests.post('http://localhost:5000/gpt-3',
            json={'prompt': prompt, 'max_tokens': 100})
    else:
        return jsonify({'error': 'Invalid wake word'}), 400

    return jsonify({'text': response.json()['choices'][0]['text'].strip()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000)
