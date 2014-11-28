#!/usr/bin/python

import argparse
import json, urllib, urllib2
import editor_tool_data
import linkedtv_platform

curated_videos = {}

def main():
    parser = argparse.ArgumentParser(description='Fetch LinkedTV videos')
    parser.add_argument('-v', '--video', help='Video identifier',required=False)
    parser.add_argument('-s', '--seed', help='Seed video list',required=True)
    parser.add_argument('-o', '--output', help='Output file',required=True)
    args = parser.parse_args()
    
    seed = args.seed
    video = args.video
    output = args.output

    seed_data = open(seed)
    seed_videos = json.load(seed_data)
    # first get all chapter, as we need them later for related videos
    print('\n===PASS 1: fetch chapters for seed videos===\n')
    for v in seed_videos:
        print('\nvideo '+v["id"])
        v["chapters"] = getChapters(v["id"])

    # now get the dimension data for the chapters
    print('\n\n====PASS 2: fetch chapter dimension data===\n')
    if video:
        chapters = getChapterDimensions(video, seed_videos)
        with open(output, 'w') as out:
                json.dump(chapters, out, indent=2, separators=(',', ': '))
    else:
        for v in seed_videos:
            videoId = v["id"]
            print('\nvideo '+videoId)
            chapters = getChapterDimensions(videoId, seed_videos)
            if chapters:
                v["chapters"] = chapters

            fileName = output + '/' + videoId+'.json'
            with open(fileName, 'w') as out:
                json.dump(v, out, indent=2, separators=(',', ': '))


def getChapters(videoId):
    curated = editor_tool_data.fetchCuratedData(videoId)
    if "chapters" in curated:
        curated_videos[videoId] = curated
        chapters = [editor_tool_data.chapterData(c) for c in curated["chapters"] ]
    else:
        chapters = linkedtv_platform.fetchChapters(videoId)
    sorted(chapters, key=lambda c: c["startTime"]) 
    return chapters


def getChapterDimensions(videoId, seed_videos):
    if videoId in curated_videos:
        curated = curated_videos[videoId]
        chapters = [editor_tool_data.chapterDimensionData(c, seed_videos) for c in curated["chapters"] ]
        sorted(chapters, key=lambda c: c["startTime"]) 
        return chapters
    # TODO fetch automatic enrichments


main()