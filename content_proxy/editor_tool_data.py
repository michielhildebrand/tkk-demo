import json, urllib, urllib2
from copy import deepcopy
import lvdocument, lvcard, lvartwork, lvrelatedchapter, lvfragment, lvyoutube

editor_tool_url="http://editortoolv2.linkedtv.eu/load_curated"

userConfig = {
    "sv":"rita",
    "rbb":"nina"
}

dimensionConfig = {}
dimensionConfig["sv"] = [
    {"id":"maintopic",
     "title":"About",
     "type":"entity"
    },
    {"id":"tve_1",
     "title":"Achtergrond",
     "type":"article"
    },
    {"id":"tve_2",
     "title":"Gerelateerde kunstwerken",
     "type":"europeana"
    },
    {"id":"tve_3",
     "title":"Gerelateerde afleveringen",
     "type":"chapter"
    }
]
dimensionConfig["rbb"] = [
    {"id":"maintopic",
     "title":"Mehr zu",
     "type":"entity"
    },
    {"id":"tvne_1",
     "title":"Aktuell",
     "type":"article"
    },
    {"id":"tvne_2",
     "title":"Hintergrund",
     "type":"article"
    }
]

def fetchCuratedData(id):
    params = {
        "id":id
    }
    request = urllib2.Request(editor_tool_url + '?' + urllib.urlencode(params))
    response = urllib2.urlopen(request)
    results = json.load(response)
    return results 

def chapterData(v):
    if "mediaFragmentId" in v:
        id = v["mediaFragmentId"]
    else:
        id = v["guid"]

    print('chapter '+id)
    chapter = {
        "id": id,
        "title": v["label"],
        "image": v["poster"],
        "startTime": v["start"],
        "endTime": v["end"],
        "duration": v["end"]-v["start"]
    }
    return chapter

def chapterDimensionData(v, seed_videos, publisher):
    if "mediaFragmentId" in v:
        id = v["mediaFragmentId"]
    else:
        id = v["guid"]

    user = userConfig[publisher]
    
    dimensions = []
    for d in dimensionConfig[publisher]:
        if d["id"] in v["dimensions"]:
            itemType = d["type"]
            data = v["dimensions"][d["id"]]
            items = dimensionData(itemType,data,seed_videos,user)

            dimensions.append({
                "id":d["id"],
                "title":d["title"],
                "type":itemType,
                "items":items
            })

    print('chapter '+id)
    chapter = {
        "id": id,
        "title": v["label"],
        "image": v["poster"],
        "startTime": v["start"],
        "endTime": v["end"],
        "duration": v["end"]-v["start"],
        "dimensions": dimensions
    }
    if(publisher=="rbb"):
        chapter["fragments"] = lvfragment.fragmentData(dimensions[0]["items"],chapter["startTime"],chapter["duration"])

    return chapter


def dimensionData(itemType,data,seed_videos, user):
    items = []
    if "annotations" in data:
        for item in data["annotations"]:
            itemData = dimensionItem(item, itemType, seed_videos, user)
            #print(itemData)
            if itemData:
                items.append(itemData)
    return items

def dimensionItem(item, itemType, seed_videos, user):
    #print(item)
    if "url" in item and "www.youtube.com" in item["url"]:
        return lvyoutube.videoData(item)
    elif itemType == 'article':
         return lvdocument.documentData(item, user)
    elif itemType == 'entity':
        return lvcard.cardData(item)
    elif itemType == 'europeana':
        return lvartwork.artworkData(item)
    elif itemType == 'chapter':
        return lvrelatedchapter.chapterData(item)
        #return lvrelatedchapter.chapterData(item, seed_videos)

