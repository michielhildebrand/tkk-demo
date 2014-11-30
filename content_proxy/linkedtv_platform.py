import json, urllib, urllib2
import math

sparql_endpoint = "http://data.linkedtv.eu/sparql"
editor_tool_attribution = "<http://data.linkedtv.eu/organization/SV/EditorToolv2>"

def fetchChapters(id):
    query = chapterQuery(id, False)
    params = {
        "query": query,
        "format": 'json'
    }
    request = urllib2.Request(sparql_endpoint + '?' + urllib.urlencode(params))
    response = urllib2.urlopen(request)
    data = json.load(response)
    chapters = []
    if data["results"]["bindings"]:
        for chapter in data["results"]["bindings"]:
            chapters.append(chapterData(chapter))

    return chapters

def chapterData(data):
    url = data["chapter"]["value"]
    id = url.split('/')[-1]
    print('chapter '+id)
    startTime = float(data["start"]["value"]) * 1000
    if math.isnan(startTime): startTime = 0.0
    endTime = float(data["end"]["value"]) * 1000

    chapter = {
        "id": id,
        "startTime": startTime,
        "endTime": endTime,
        "duration": endTime - startTime,
        "title": data["label"]["value"]
    }
    if "poster" in data:
        chapter["image"] = data["poster"]["value"];
      
    return chapter

def chapterQuery(videoId, attribution):
    if not(attribution):
        attribution = '?attribution'

    query = """ PREFIX linkedtv: <http://data.linkedtv.eu/ontologies/core#>
                PREFIX ma: <http://www.w3.org/ns/ma-ont#>
                PREFIX nsa: <http://multimedialab.elis.ugent.be/organon/ontologies/ninsuna#>
                PREFIX oa: <http://www.w3.org/ns/oa#>
                PREFIX prov: <http://www.w3.org/ns/prov#>
                SELECT DISTINCT ?chapter ?start ?end ?label ?poster
                WHERE {
                    ?mediafragment ma:isFragmentOf <http://data.linkedtv.eu/media/%s> .
                    ?annotation oa:hasTarget ?mediafragment .
                    ?annotation oa:hasBody ?chapter .
                    ?chapter a linkedtv:Chapter .
                    ?mediafragment nsa:temporalStart ?start .
                    ?mediafragment nsa:temporalEnd ?end .
                    ?chapter rdfs:label ?label .
                    ?annotation prov:wasAttributedTo %s .
                    OPTIONAL {?chapter linkedtv:hasPoster ?poster }
                } ORDER BY ?start 
                """ % (videoId, attribution)

    return query

#fetchChapters('adb65e0a-642b-432f-aa86-c296dab0375a')