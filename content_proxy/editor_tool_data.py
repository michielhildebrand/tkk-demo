import json, urllib, urllib2
from copy import deepcopy
import lvdocument, lvcard, lvartwork, lvrelatedchapter, lvfragment

editor_tool_url="http://editortoolv2.linkedtv.eu/load_curated_et"

dimensionConfig = {}
dimensionConfig["sv"] = [
    {"id":"maintopic",
     "title":"About"
    },
    {"id":"tve_1",
     "title":"Background"
    },
    {"id":"tve_2",
     "title":"Related Works"
    },
    {"id":"tve_3",
     "title":"Related Chapters"
    }
]
dimensionConfig["rbb"] = [
    {"id":"maintopic",
     "title":"Mehr zu"
    },
    {"id":"tve_2",
     "title":"Aktuell"
    },
    {"id":"tvne_2",
     "title":"Hintergrund"
    }
]

dimensionTypes = {
    "ArtObject":"entity",
    "Background":"article",
    "RelatedChapter":"chapter",
    "RelatedArtWork":"europeana",
    "InDepth":"entity",
    "History":"article",
    "CurrentEvents":"article"
}

def fetchCuratedData(id):
    params = {
        "id":id
    }
    request = urllib2.Request(editor_tool_url + '?' + urllib.urlencode(params))
    response = urllib2.urlopen(request)
    results = json.load(response)
    return results 

def chapterData(v):
    if "bodyURI" in v:
        id = v["bodyURI"].split('/')[-1]
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
    if "bodyURI" in v:
        id = v["bodyURI"].split('/')[-1]
    else:
        id = v["guid"]

    dimensions = []
    for d in dimensionConfig[publisher]:
        if d["id"] in v["dimensions"]:
            data = v["dimensions"][d["id"]]
            if "linkedtvDimension" in data and data["linkedtvDimension"] in dimensionTypes:
                type = dimensionTypes[data["linkedtvDimension"]]
                items = dimensionData(type,data,seed_videos)

                dimensions.append({
                    "id":d["id"],
                    "title":d["title"],
                    "type":type,
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


def dimensionData(dimensionType,data,seed_videos):
    items = []
    if "annotations" in data:
        for item in data["annotations"]:
            itemData = dimensionItem(item, dimensionType, seed_videos)
            print(itemData)
            if itemData:
                items.append(itemData)
    return items

def dimensionItem(item, dimensionType, seed_videos):
    if dimensionType == 'article':
         return lvdocument.documentData(item["url"])
    elif dimensionType == 'entity':
        return lvcard.cardData(item)
    elif dimensionType == 'europeana':
        return lvartwork.artworkData(item["url"])
    elif dimensionType == 'chapter':
        return lvrelatedchapter.chapterData(item, seed_videos)

