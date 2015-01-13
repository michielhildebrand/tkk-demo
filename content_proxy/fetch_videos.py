import argparse
import json, urllib, urllib2
import base64

url="http://api.linkedtv.eu/mediaresource"
auth = "YWRtaW46bGlua2VkdHY="
shotsURL = 'http://images1.noterik.com/domain/linkedtv/user/avro/video/'

def fetchVideoData(id):
    print id
    request = urllib2.Request(url + '/' + id)
    request.add_header("Authorization", "Basic %s" % auth)
    request.add_header("Accept", "application/json")
    try:
        response = urllib2.urlopen(request)
    except Exception:
         print 'url error'
         return {}
    else:
        data = json.load(response)
        if "mediaResource" in data:
            return videoData(data["mediaResource"])

def fetchVideos(params):
    request = urllib2.Request(url + '?' + urllib.urlencode(params))
    request.add_header("Authorization", "Basic %s" % auth)
    request.add_header("Accept", "application/json")
    response = urllib2.urlopen(request)
    results = json.load(response)
    return results 

def videoData(v):
    if "locator" in v:
        videoId = v["locator"].split("/")[-2]
        print(videoId)
        src = v["locator"]+"rawvideo/2/raw.mp4"
        shots = shotsURL+videoId+'/shots/1'
        video = {
            "id":v["id"],
            "title":v['titleName'],
            "shots":shots,
            "src":src,
            "poster":shots+'/h/0/m/0/sec10.jpg'
        }
        return video