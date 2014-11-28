def cardData(item):
    if "label" in item:

        print("information card: "+ item["label"])

        card = {
            "title": item["label"],
            "attributes": {}
        }
        if "poster" in item:
            card["image"] = item["poster"]
        if "comment" in item:
            card["description"] = item["comment"]
        if "type" in "item":
            card["types"] = [ item["type"] ]
        
        if "template" in item:
            for o in item["template"]["properties"]:
                key = o["key"]
                if "value" in o:
                    value = o["value"]
                    if not(key in ['label','thumb','comment','type','poster']):
                        if "uri" in value:
                            card["attributes"][key] = [{
                                "uri": value["uri"],
                                "value": value["label"]
                            }]
                        else:
                            card["attributes"][key] = [value]

        return card