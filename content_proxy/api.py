import json
import redis
import time

from flask import Flask, request
from enrich_video import update_seed_videos, update_seed_video
from enricher import fetch_article
from fetch_videos import fetchVideoData

app = Flask(__name__)

r = redis.StrictRedis(host='localhost', port=6379, db=0)

@app.route('/', methods=['GET'])
def document():
     doc = fetch_article(request.args.get('url', ''))
     return json.dumps(doc)

@app.route('/<key>/videos/ids', methods=['GET'])
def list_videos(key):
    return json.dumps(r.lrange(key,0,-1))

@app.route('/<key>/videos', methods=['GET'])
def list_full_videos(key):
    return json.dumps(video_data(key))

@app.route('/<videoId>', methods=['GET'])
def video_data(videoId):
    video_data = r.hgetall(videoId)
    return json.dumps(video_data)

@app.route('/<key>/<videoId>/add', methods=['GET'])
def add_video(key,videoId):
    r.lpush(key, videoId)
    data = fetchVideoData(videoId)
    r.hmset(videoId, data)
    return json.dumps(data)

@app.route('/<key>/<videoId>/remove', methods=['GET'])
def remove_video(key, videoId):
    r.lrem(key, 1, videoId)
    return json.dumps(r.lrange(key,0,-1))

@app.route('/<key>/<videoId>/update', methods=['GET'])
def update_video(key, videoId):
    output_dir = '../client/video'
    video = r.hgetall(videoId)
    videos = video_data(key)
    update_seed_video(video, videos, output_dir, key)
    update_video_modification_date(videoId, time.strftime("%c"))
    return json.dumps(r.hgetall(videoId))

@app.route('/<key>/update', methods=['GET'])
def update_videos(key):
    output_dir = '../client/video'
    videos = video_data(key)
    update_seed_videos(videos, output_dir, key)
    update_modification_date(key)
    return json.dumps(video_data(key))


def video_data(key):
    data = []
    videos = r.lrange(key,0,-1)
    for videoId in videos:
        video_data = r.hgetall(videoId)
        if video_data is not None:
            data.append(video_data)
    return data

def update_modification_date(key):
    now = time.strftime("%c")
    videos = r.lrange(key,0,-1)
    for videoId in videos:
        update_video_modification_date(videoId, now)

def update_video_modification_date(videoId, timestamp):
    r.hset(videoId, "modified", timestamp)

if __name__ == '__main__':
    app.run(debug=True)
