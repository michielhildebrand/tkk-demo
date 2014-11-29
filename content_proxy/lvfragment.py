def fragmentData(items, start, duration):
	if items:
		fragmentTime = duration / len(items)
		for i,item in enumerate(items):
			item["startTime"] = start + fragmentTime*i

	return items

