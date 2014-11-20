import json
import traceback
import urllib2

from lxml.html import clean
from newspaper import Article


def fetch_article(data, dimension):
    n = len(data)
    new_data = []

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

            a.nlp();
            if a.summary:
                article_data["summary"] = a.summary

    return new_data
