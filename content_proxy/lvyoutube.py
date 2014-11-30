def videoData(item):

    url = item["url"]
    title = item.get("label", "Youtube")
    image = "https://www.youtube.com/yt/brand/media/image/YouTube-icon-full_color.png"
    #item.get("poster", "https://www.youtube.com/yt/brand/media/image/YouTube-icon-full_color.png")

    #videoId = url.split("?v=")[-1]

    data = {
        "url":url,
        "title":title,
        "image":image,
        "type":"youtube",
        "source":"www.youtube.com"
    }

    return data


#videoData({"url":'https://www.youtube.com/watch?v=AIb6zw-EcOA'})