from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

# Set your OpenAI API key
openai.api_key = "-------"

@app.route('/analyze', methods=['POST'])
def analyze_policy():
    # Receive the JSON body from the Chrome extension
    data = request.get_json()
    if not data or 'policyText' not in data:
        return jsonify({'error': 'No policy text received'}), 400

    policy_text = data['policyText']

    # Use the new API call format for completions
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes privacy policies."},
                {"role": "user", "content": f"Summarize the following privacy policy:\n\n{policy_text}"}
            ]
        )
        summary = response['choices'][0]['message']['content'].strip()
        return jsonify({'summary': summary})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
