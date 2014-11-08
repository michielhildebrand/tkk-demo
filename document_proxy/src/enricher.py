import json
import traceback
import urllib2

from lxml.html import clean
from newspaper import Article


def fetch_article(data, dimension):
    n = len(data)
    new_data = []
    sources = {}

    # loop through each article
    for article in data:
        url = article["url"]

        print str(n) + " " + url
        n -= 1

        a = Article(url=url, keep_article_html=True)
        a.download()
        try:
            a.parse()
        except Exception:
            exc = traceback.format_exc()
            print "Parse error: " + exc

        if a.article_html:
            # newspaper gives us some news stuff
            text = a.article_html
            title = a.title
            image = a.top_image
            movies = a.movies
            authors = a.authors

            article_data = {
                "url": url,
                "title": title,
                "text": text
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
                        image = fetch_image(dimension, article_data)
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
                    image = fetch_image(dimension, article_data)
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


def fetch_image(dimension, data):
    if dimension == "opinion":
        if "source" in data:
            q = urllib2.quote(data["author"]["name"] + " " + data["source"]["name"])
        else:
            q = urllib2.quote(data["author"]["name"])
    elif dimension == "othermedia" or dimension == "indepth":
        q = urllib2.quote(data["source"]["name"] + " logo") + "&imgsz=icon"

    url = ('https://ajax.googleapis.com/ajax/services/search/images?' + 'v=1.0&q=' + q)
    request = urllib2.Request(url)
    response = urllib2.urlopen(request)
    results = json.load(response)
    if "responseData" in results and results["responseData"]["results"][0]:
        print "image " + results["responseData"]["results"][0]["unescapedUrl"]
        return results["responseData"]["results"][0]["unescapedUrl"]
