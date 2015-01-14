import json
import traceback
import urllib2

from lxml.html import clean
from newspaper import Article


def fetch_article(url):
  print 'fetch '+url

  a = Article(url=url, keep_article_html=True)
  a.download()

  try:
    a.parse()
  except Exception:
    exc = traceback.format_exc()
    print "Parse error: " + exc

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

  # try:
  #   a.nlp();
  # except Exception:
  #   exc = traceback.format_exc()
  #   print "NLP error: " + exc

  # if a.summary:
  #   article_data["summary"] = a.summary

  return article_data
