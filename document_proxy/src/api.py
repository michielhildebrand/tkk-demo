import json

from flask import Flask, request
from enricher import fetch_article


app = Flask(__name__)

@app.route('/', methods=['GET'])
def document():
    doc = fetch_article(request.args.get('url', ''))
    return json.dumps(doc)


if __name__ == '__main__':
    app.run(debug=True)
