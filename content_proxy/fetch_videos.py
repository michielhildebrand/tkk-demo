#!/usr/bin/python

import argparse
import json, urllib, urllib2
import base64

url="http://api.linkedtv.eu/mediaresource"
username = 'admin'
password = 'linkedtv'
shotsURL = 'http://images1.noterik.com/domain/linkedtv/user/avro/video/'

def main():
    parser = argparse.ArgumentParser(description='Fetch LinkedTV videos')
    parser.add_argument('-p','--publisher', help='Publisher',required=True)
    parser.add_argument('-o', '--output', help='Output file',required=True)
    args = parser.parse_args()
        
    publisher = args.publisher
    output = args.output
    
    params = {
        "status":4,
        "publisher":publisher
    }

    videos = fetchVideos(params)

    cleanVideos = [videoData(v) for v in videos["mediaResources"]["mediaResources"] ]

    # with open(output, 'w') as out:
    #     json.dump(cleanVideos, out, indent=2, separators=(',', ': '))

def fetchVideos(params):
    base64string = base64.encodestring('%s:%s' % (username, password))[:-1]
    request = urllib2.Request(url + '?' + urllib.urlencode(params))
    request.add_header("Authorization", "Basic %s" % base64string)
    request.add_header("Accept", "application/json")
    response = urllib2.urlopen(request)
    results = json.load(response)
    return results 

def videoData(v):
    if "locator" in v:
        videoId = v["locator"].split("/")[-2]
        print(videoId)
        src = v["locator"]+"rawvideo/4/raw.mp4"
        shots = shotsURL+videoId+'shots/1'
        video = {
            "id":v["id"],
            "title":v['titleName'],
            "shots":shots,
            "src":src,
            "poster":shots+'/h/0/m/0/sec10.jpg'
        }
        return video

main()
