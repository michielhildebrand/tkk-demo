

def chapterData(item):
    url = item["url"]
    ids = parseChapterUrl(url)

    if ids:
        videoId = ids[0]
        chapterid = ids[1]
        print('related chapter '+chapterId)

    relatedchapter = {
        "video": {
            "id": videoId
        },
        "chapter": {
            "id": chapterId,
            "title": item["label"],
            "image": item["poster"]
        }
    }

    return relatedchapter

def parseChapterUrl(url):
    if '#t=' in url:
        chapterId = url.split('/')[-1]
        videoId = chapterId[ 0: chapterId.find('#') ]
        return [videoId,chapterId]

#parseChapterUrl("384b82ab-d50b-4f35-892b-8b91d99e774e#t=548.48,1147.04")