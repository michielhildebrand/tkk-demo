import json, urllib, urllib2
from urlparse import urlparse

documentproxy = "http://pip.ia.cwi.nl/doc"
irapi_thd = "http://ir.lmcloud.vse.cz/irapi/media-server/thd"

def documentData(url):
    data = fetchDocumentData(url)

    if "text" in data:
        thd = fetchTHD(url)

        source = urlparse(url).hostname

        document = {
            "url": url,
            "micropostUrl": url, #we keep this for personalization
            "title": data["title"],
            "html":data["text"],
            "source":source
        }
        if "summary"  in data:
            document["summary"] = data["summary"]
        if "media" in data:
            document["media"] = data["media"]
        if "author" in data:
            document["author"] = data["author"]
        if "annotation" in thd:
            document["annotation"] = thd["annotation"]

        return document

def fetchDocumentData(url):
    print("document proxy: "+url)
    params = {
        "url":url
    }
    request = urllib2.Request(documentproxy + '?' + urllib.urlencode(params))
    response = urllib2.urlopen(request)
    results = json.load(response)
    return results 

def fetchTHD(url):
    print("thd: "+url)
    params = {
        "url":url
    }
    request = urllib2.Request(irapi_thd + '?' + urllib.urlencode(params))
    response = urllib2.urlopen(request)
    results = json.load(response)
    return results

#print(documentData("http://www.groningermuseum.nl/tentoonstelling/gronings-zilver-uit-de-collectie-hofman-westerhof"))