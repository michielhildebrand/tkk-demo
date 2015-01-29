import json, urllib, urllib2
import editor_tool_data #, automatic_data
import linkedtv_platform
import personalization

curated_videos = {}

def update_seed(seed, output, publisher):
    seed_data = open(seed)
    videos = json.load(seed_data)
    update_seed_videos(videos, output, publisher)

def update_seed_video(video, seed_videos, output, publisher):
    # first get all chapter, as we need them later for related videos
    #print('\n===PASS 1: fetch chapters for seed videos===\n')
    #setAllChapters(seed_videos)   
    # now get the dimension data for the chapters
    #print('\n\n====PASS 2: fetch chapter dimension data===\n')
    setDimensions(video, seed_videos, publisher)
    saveVideo(video, output)

def update_seed_videos(seed_videos, output, publisher):
    # first get all chapter, as we need them later for related videos
    #print('\n===PASS 1: fetch chapters for seed videos===\n')
    #setAllChapters(seed_videos)
    # now get the dimension data for the chapters
    #print('\n\n====PASS 2: fetch chapter dimension data===\n')
    for video in seed_videos:
        setDimensions(video, seed_videos, publisher)
        saveVideo(video, output)

def setAllChapters(videos):
    for v in videos:
        print('\nvideo '+v["id"])
        v["chapters"] = getChapters(v["id"])
 
def setDimensions(video, seed_videos, publisher):
    videoId = video["id"]
    print('\nvideo '+videoId)
    chapters = getChapterDimensions(video, seed_videos, publisher)
    if chapters:
        video["chapters"] = chapters

def saveVideo(video, output_dir):
    videoId = video["id"]
    filename = output_dir + '/' + videoId+'.json'
    with open(filename, 'w') as out:
        json.dump(video, out, indent=2, separators=(',', ': '))
    print('written '+filename)

def getChapters(videoId):
    curated = editor_tool_data.fetchCuratedData(videoId)
    if "chapters" in curated:
        curated_videos[videoId] = curated
        chapters = [editor_tool_data.chapterData(c) for c in curated["chapters"] ]
    else:
        chapters = linkedtv_platform.fetchChapters(videoId)
    sorted(chapters, key=lambda c: c["startTime"]) 
    return chapters


def getChapterDimensions(video, seed_videos, publisher):
    videoId = video["id"]
    if videoId in curated_videos:
        curated = curated_videos[videoId]
        chapters = [editor_tool_data.chapterDimensionData(c, seed_videos, publisher) for c in curated["chapters"] ]

        # if publisher=="rbb" and publisher in editor_tool_data.userConfig:
        #     user = editor_tool_data.userConfig[publisher]
        #     personalization.add_chapters_degree(chapters, user)

        return chapters
    # else:
    #     chapters = [automatic_data.chapterDimensionData(c, videoId, seed_videos, publisher) for c in video["chapters"] ]
    # TODO fetch automatic enrichments
