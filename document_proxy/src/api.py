import json

from flask import Flask, request
from enricher import fetch_article


app = Flask(__name__)


@app.route('/api', methods=['GET'])
def root():
    return 'API is running'


@app.route('/api/doc', methods=['POST'])
def document():
    doc = fetch_article(request.get_json(), "othermedia")
    return json.dumps(doc)


if __name__ == '__main__':
    app.run(debug=True)
