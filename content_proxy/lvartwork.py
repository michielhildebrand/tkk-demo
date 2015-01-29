import json, urllib, urllib2
from urlparse import urlparse
from collections import OrderedDict

europeana_api = "http://europeana.eu/api/v2"
wskey = "hb8sGDBPe"

def artworkData(item):
    if "url" in item:
        url = item["url"]
        print("europeana record: "+url)
        ids = europeanaId(url)
        if ids:
            data = getEuropeana(ids)
            if data and "object" in data:
                return europeanaItem(item, data)


def getEuropeana(ids):
    params = {
        "profile":"rich",
        "wskey":wskey
    }
    request = urllib2.Request(europeana_api + '/record/'+ids[0]+'/'+ids[1]+'.json' + '?' + urllib.urlencode(params))
    response = urllib2.urlopen(request)
    results = json.load(response)
    return results 

def europeanaId(url):
    path = urlparse(url).path
    if path.find("portal/record") >= 0:
        splitted = path.split('/')
        if len(splitted) > 3:
            id0 = splitted[3]
            id1 = splitted[4].split('.')[0]
            return [id0,id1]

def europeanaItem(seed, data):
    aggregation = data["object"]["europeanaAggregation"]
    proxy = {}
    for p in reversed(data["object"]["proxies"]):
        for k,v in p.iteritems():
            proxy[k] = v

    item = {
        "url": aggregation["edmLandingPage"],
        "attributes": {}
    }

    if "edmPreview" in aggregation:
        item["image"] = aggregation["edmPreview"]

    #if "label" in seed:
    #    item["title"] = seed["label"]
    if europeanaKeyValue("dcTitle",proxy):
        item["title"] = europeanaKeyValue("dcTitle", proxy)[0]

    if europeanaKeyValue("dcDescription", proxy):
        item["description"] = europeanaKeyValue("dcDescription", proxy)[0]

    if europeanaKeyValue("dcSource", proxy):
        item["source"] = europeanaKeyValue("dcSource", proxy)[0]
    elif europeanaKeyValue("dcPublisher", proxy):
        item["source"] = europeanaKeyValue("dcPublisher", proxy)[0]

    for key,value in proxy.iteritems():
        if not( key in ['dcTitle','dcSource','dcPublisher','dcDescription','dctermsProvenance','dcIdentifier','dcLanguage'] ):
            if not("dcterms" in key):
                if europeanaValue(value):
                    if "dc" in key:
                        key = key[2:]
                    values = list(OrderedDict.fromkeys(europeanaValue(value)))
                    item["attributes"][key] = values

    print(item)

    return item


def europeanaKeyValue(key, source):
    if key in source:
        return europeanaValue(source[key])

def europeanaValue(v):
    if v:
        if isinstance(v, basestring):
            return v
        elif "def" in v:
            return  v["def"]
        elif "nl" in v:
            return v["nl"]


#artworkData("http://www.europeana.eu/portal/record/2021608/dispatcher_aspx_action_search_database_ChoiceCollect_search_priref_10581.html")