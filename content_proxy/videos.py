#!/usr/bin/python

import argparse
import json, urllib, urllib2
import base64
import fetch_videos

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

    videos = fetch_videos.fetchVideos(params)
    cleanVideos = [fetch_videos.videoData(v) for v in videos["mediaResources"]["mediaResources"] ]

    with open(output, 'w') as out:
         json.dump(cleanVideos, out, indent=2, separators=(',', ': '))

main()
