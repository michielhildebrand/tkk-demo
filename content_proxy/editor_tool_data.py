import json, urllib, urllib2
import lvdocument, lvcard, lvartwork, lvrelatedchapter

editor_tool_url="http://editortoolv2.linkedtv.eu/load_curated_et"

dimensionTypes = {
    "ArtObject":"entity",
    "Background":"article",
    "RelatedChapter":"chapter",
    "RelatedArtWork":"europeana"
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
    if "annotationURI" in v:
        id = v["annotationURI"].split('/')[-1]
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

def chapterDimensionData(v, seed_videos):
    if "annotationURI" in v:
        id = v["annotationURI"].split('/')[-1]
    else:
        id = v["guid"]

    dimensions = []
    for key,dimension in v["dimensions"].iteritems(): 
        data = dimensionData(key,dimension,seed_videos)
        if data:
            dimensions.append( data )

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
    return chapter


def dimensionData(k,d,seed_videos):
    if "linkedtvDimension" in d and d["linkedtvDimension"] in dimensionTypes:
        dimensionType = dimensionTypes[d["linkedtvDimension"]]
        items = []
        if "annotations" in d:
            for item in d["annotations"]:
                itemData = dimensionItem(item, dimensionType, seed_videos)
                if itemData:
                    items.append(itemData)

        dimension = {
          "id": d["id"],
          "title": d["label"],
          "type": dimensionType,
          "items": items
        }
        return dimension

def dimensionItem(item, dimensionType, seed_videos):
    # if dimensionType == 'article':
    #      return lvdocument.documentData(item["url"])
    # elif dimensionType == 'entity':
    #     return lvcard.cardData(item)
    # elif dimensionType == 'europeana':
    #     return lvartwork.artworkData(item["url"])
    if dimensionType == 'chapter':
        return lvrelatedchapter.chapterData(item, seed_videos)

