import json

from flask import Flask, request
from enrich_video import update_seed
from enricher import fetch_article

app = Flask(__name__)

@app.route('/', methods=['GET'])
def document():
    doc = fetch_article(request.args.get('url', ''))
    return json.dumps(doc)

@app.route('/news/update', methods=['GET'])
def update():
    seed = '../client/seeds/news-videos.json'
    #video = 'adb65e0a-642b-432f-aa86-c296dab0375a'
    output_dir = '../client/video'
    publisher = 'rbb'

    update_seed(seed, output_dir, publisher)
    return 'seed is updated'

@app.route('/culture/update', methods=['GET'])
def update():
    seed = '../client/seeds/culture-videos.json'
    output_dir = '../client/video'
    publisher = 'tkk'

    update_seed(seed, output_dir, publisher)
    return 'seed is updated'

if __name__ == '__main__':
    app.run(debug=True)
