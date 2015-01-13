import json
import redis

from flask import Flask, request
from enrich_video import update_seed_videos
from enricher import fetch_article
from fetch_videos import fetchVideoData

app = Flask(__name__)

r = redis.StrictRedis(host='localhost', port=6379, db=0)

@app.route('/', methods=['GET'])
def document():
     doc = fetch_article(request.args.get('url', ''))
     return json.dumps(doc)

@app.route('/<key>/videos', methods=['GET'])
def list_videos(key):
    return json.dumps(r.lrange(key,0,-1))

@app.route('/<key>/videos/full', methods=['GET'])
def list_full_videos(key):
    seed = seed_list(key)
    return json.dumps(seed)

@app.route('/<key>/add/<videoId>', methods=['GET'])
def add_video(key,videoId):
    r.lpush(key, videoId)
    return json.dumps(fetchVideoData(videoId))

@app.route('/<key>/remove/<videoId>', methods=['GET'])
def remove_video(key, videoId):
    r.lrem(key, 1, videoId)
    return json.dumps(r.lrange(key,0,-1))

@app.route('/<videoId>', methods=['GET'])
def video_data(videoId):
    return json.dumps(fetchVideoData(videoId))

@app.route('/<key>/update', methods=['GET'])
def update_videos(key):
    output_dir = '../client/video'
    videos = seed_list(key)
    update_seed_videos(videos, output_dir, key)
    return 'seed is updated'

# create the seed file from the video Ids and video Data from the LinkedTV platform
def seed_list(key):
    seed = []
    videos = r.lrange(key,0,-1)
    for videoId in videos:
        data = fetchVideoData(videoId)
        if data:
            seed.append(data)
    return seed

if __name__ == '__main__':
    app.run(debug=True)
