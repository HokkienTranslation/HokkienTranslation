from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/fetch_phrase', methods=['POST'])
def fetch_phrase():
    content = request.json
    phrase = content['phrase']

    # TODO: Change this output to interact with backend logic of the model
    output = phrase

    if output:
        return jsonify({'output_phrase': output})
    else:
        return jsonify({'output_phrase': 'Phrase not found in database'})


if __name__ == '__main__':
    app.run(debug=True)
