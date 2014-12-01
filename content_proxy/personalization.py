import editor_tool_data
import json, urllib, urllib2

content_filter_url = "http://multimedia.iti.gr/api/LinkedCulture/content_filtering"
seed_filter_url = "http://multimedia.iti.gr/api/LinkedCulture/seed_content_filtering"
#user = "nina"


def add_chapters_degree(chapters, user):
    print('personalizing chapters for user: '+user)
    simple = []
    for c in chapters:
        simple.append(c["id"])

    data = {"chapters":simple}

    filtered = filter(seed_filter_url, user, data)
    if "results" in filtered:
        for f_ch in filtered["results"]:
            chapterId = f_ch["chapter"]
            degree = f_ch["Degree"]
            for ch in chapters:
                if ch["id"] == chapterId:
                    ch["degree"] = degree
    #return filtered


def chapter_personalization(videoId):
    curated = editor_tool_data.fetchCuratedData(videoId)
    if "chapters" in curated:
        chapters = [editor_tool_data.chapterData(c) for c in curated["chapters"] ]

        simple = []
        for c in chapters:
            simple.append(c["id"])

        data = {"chapters":simple}

    filtered = filter(seed_filter_url, data)
    if "results" in filtered:
        for f_ch in filtered["results"]:
            chapterId = f_ch["chapter"]
            degree = f_ch["degree"]
            for ch in chapters:
                if ch["id"] == chapterId:
                    ch["degree"] = degree

        return chapters

    #with open('/Users/michiel/Desktop/json_chapters.json', 'w') as out:
    #            json.dump(data, out, indent=2, separators=(',', ': '))

def document_personalization():
	filtered = filter(content_filter_url, user, items)
	print(filtered)

def filter(url, user, data):
    params = {
        "uid":user
    }
    request = urllib2.Request(url + '?' + urllib.urlencode(params), json.dumps(data))
    request.add_header("Content-Type", "application/json")
    response = urllib2.urlopen(request)
    results = json.load(response)
    return results 

#curl -X POST ?uid=nina -H "Content-Type: application/json" -d @json_chapters.json


#chapter_personalization("adb65e0a-642b-432f-aa86-c296dab0375a")