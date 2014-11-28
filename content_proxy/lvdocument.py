import json, urllib, urllib2
from urlparse import urlparse

documentproxy = "http://pip.ia.cwi.nl/doc"

def documentData(url):
    data = fetchDocumentData(url)

    if "text" in data:
        source = urlparse(url).hostname

        document = {
            "url": url,
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

#documentData("http://www.groningermuseum.nl/tentoonstelling/gronings-zilver-uit-de-collectie-hofman-westerhof")