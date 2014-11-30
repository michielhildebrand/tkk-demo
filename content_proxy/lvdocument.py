import json, urllib, urllib2
from urlparse import urlparse
import re

documentproxy = "http://pip.ia.cwi.nl/doc"
irapi_thd = "http://ir.lmcloud.vse.cz/irapi/media-server/thd"

def documentData(item):
    url = item["url"]
    data = fetchDocumentData(url)

    if "text" in data:
        thd = fetchTHD(url)

        source = urlparse(url).hostname
        title = item.get('label', data['title'])
        image = item.get('poster', favicon(source))

        #hack to get xhtml out
        html = re.sub('<xhtml.*>|&lt;xhtml.*&gt;','', data["text"])

        document = {
            "url": url,
            "micropostUrl": url, #we keep this for personalization
            "title": title,
            "image": image,
            "html":html,
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
    try:
        response = urllib2.urlopen(request)
    except Exception:
        print 'url error'
        return {}
    else:
        results = json.load(response)
        return results

def fetchTHD(url):
    print("thd: "+url)
    params = {
        "url":url
    }
    request = urllib2.Request(irapi_thd + '?' + urllib.urlencode(params))
    try:
        response = urllib2.urlopen(request)
    except Exception:
        print 'url error'
        return {}
    else:
        results = json.load(response)
        return results

def favicon(hostname):
    return "http://www.google.com/s2/favicons?"+urllib.urlencode({"domain":hostname})


#print(documentData("http://www.groningermuseum.nl/tentoonstelling/gronings-zilver-uit-de-collectie-hofman-westerhof"))