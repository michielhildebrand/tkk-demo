#!/Library/Frameworks/Python.framework/Versions/2.7/bin/python

import argparse
import json, urllib, urllib2
from newspaper import Article

def main():
    parser = argparse.ArgumentParser(description='Convert related content')
    parser.add_argument('-i','--inputdir', help='Input directory',required=True)
    parser.add_argument('-o','--output',help='Output file name', required=True)
    args = parser.parse_args()
    
    inputdir = args.inputdir
    
    othermedia_links = json.load(open(inputdir+"/othermedia.json"))
    opinion_links = json.load(open(inputdir+"/opinions.json"))
    indepth_links = json.load(open(inputdir+"/indepth.json"))
    timeline_links = json.load(open(inputdir+"/timeline.json"))
    tweet_links = json.load(open(inputdir+"/tweets.json"))
    
    print "othermedia"
    othermedia_data = articleData(othermedia_links, "othermedia")
    print "opinions"
    opinion_data = articleData(opinion_links, "opinion")
    print "indepth"
    indepth_data = articleData(indepth_links, "indepth")
    print "timelinerrt"
    timeline_data = articleData(timeline_links, "timeline")
    tweet_data = tweet_links
    
    data = {
        "sources":othermedia_data,
        "opinions":opinion_data,
        "indepth":indepth_data,
        "timeline":timeline_data,
        "location":tweet_data
    }

    with open(args.output, 'w') as out:
        json.dump(data, out, indent=4, separators=(',', ': '))

    
def articleData(data, dimension):
    n = len(data)
    new_data = []
    sources = {}
    
    # loop through each article
    for article in data:
        url = article["url"]
        
        print str(n)+" "+url
        n=n-1
        
        a = Article(url=url, keep_article_html=True)
        a.download()
        try:
            a.parse()
        except Exception:
            print "parse error"
        
        if a.article_html:    
            # newspaper gives us some news stuff
            text = a.article_html
            title = a.title
            image = a.top_image
            movies = a.movies
            authors = a.authors

            article_data = {
                "url":url,
                "title":title,
                "text":text
            }  

            if authors:
                article_data["author"] = {
                    "name": authors[0]
                }

            if "source" in article and "name" in article["source"]:
                 name = article["source"]["name"]
                 article_data["source"] = {
                     "name": name
                 }
                      
            # media
            if movies:
                article_data["media"] = {
                    "url": movies[0],
                    "type": "video"
                }
            elif image:
                article_data["media"] = {
                    "url": image,
                    "type": "image"
                }

            # some stuff newspaper does not get, but we might already had in the original source
            if "date" in article:
                article_data["date"] = article["date"]

            if "text" in article_data and "title" in article_data:
                if (dimension == "othermedia" or dimension == "indepth") and "source" in article_data:
                    source = article_data["source"]["name"]
                    if not source in sources:
                        image = fetchImage(dimension, article_data)
                        if image:
                            article_data["source"]["thumb"] = image
                            print "added"
                            new_data.append(article_data)
                            sources[source] = True
                        else:
                            print "no image"
                    else:
                        print "skipped duplicate source"
                elif dimension == "opinion" and "author" in article_data:
                    image = fetchImage(dimension, article_data)
                    if image:
                        article_data["author"]["thumb"] = image
                        print "added"
                        new_data.append(article_data)
                    else:
                        print "no image"
                elif dimension == "timeline":
                    print "added"
                    new_data.append(article_data)
                else:
                    print "skipped no source or author"
            else:
                    print "skipped no title or text"

    return new_data


#def twitterData(data):
#    for tweet in data:


def fetchImage(dimension, data):
    if dimension=="opinion":
        if "source" in data:
            q = urllib2.quote(data["author"]["name"] + " " + data["source"]["name"])
        else:
            q = urllib2.quote(data["author"]["name"])
    elif dimension=="othermedia" or dimension=="indepth":
            q = urllib2.quote(data["source"]["name"]+" logo")+"&imgsz=icon"
            
    url = ('https://ajax.googleapis.com/ajax/services/search/images?' + 'v=1.0&q=' + q)
    request = urllib2.Request(url)
    response = urllib2.urlopen(request)
    results = json.load(response)
    if "responseData" in results and results["responseData"]["results"][0]:
        print "image "+results["responseData"]["results"][0]["unescapedUrl"]
        return results["responseData"]["results"][0]["unescapedUrl"]

main()