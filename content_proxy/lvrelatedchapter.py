

def chapterData(item, videos):
    url = item["url"]
    urlParts = parseChapterUrl(url)

    if len(urlParts) == 3:
        videoId = urlParts[0]
        start = float(urlParts[1]) * 1000
        end = float(urlParts[2]) * 1000
        print('related chapter '+videoId)
        print(start)
        print(end)

        video = videoData(videoId, videos)

        if video and "chapters" in video:
            chapter = videoChapter(video["chapters"], start, end)
            if chapter:
                relatedchapter = {
                    "video": {
                        "id": videoId,
                        "title": video["title"],
                        "shots": video["shots"]
                    },
                    "chapter": {
                        "id": chapter["id"],
                        "title": chapter["title"]
                    }
                }
                if "image" in chapter:
                    relatedchapter["chapter"]["image"] = chapter["image"]
                elif "poster" in item:
                    relatedchapter["chapter"]["image"] = item["poster"]
                if "label" in item:
                    relatedchapter["video"]["label"] = item["label"]

                return relatedchapter

def parseChapterUrl(url):
    videoId = url[ 0: url.find('#') ]
    start = url[ url.find('=')+1 : url.find(',') ]
    end = url[ url.find(',')+1 : ]
    return [videoId,start,end]

def videoData(id, videos):
    for v in videos:
        if v["id"] == id:
            return v

def videoChapter(chapters, start, end):
    for c in chapters:
        print(c["startTime"])
        print(c["endTime"])
        if abs(c["startTime"] - start) < 10000:
             return c
        elif abs(c["endTime"] - end) < 10000:
             return c


parseChapterUrl("384b82ab-d50b-4f35-892b-8b91d99e774e#t=548.48,1147.04")