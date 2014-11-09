import json

from flask import Flask, request
from enricher import fetch_article


app = Flask(__name__)


@app.route('/doc', methods=['GET'])
def root():
    return 'Document Proxy is running.'


@app.route('/doc', methods=['POST'])
def document():
    doc = fetch_article(request.get_json(), "othermedia")
    return json.dumps(doc)


if __name__ == '__main__':
    app.run(debug=True)
