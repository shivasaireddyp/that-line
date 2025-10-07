import pysrt

def parse_srt(file_path):
    subs = pysrt.open(file_path)
    parsed = []
    for i, sub in enumerate(subs):
        parsed.append({
            "id": i,
            "start_time": str(sub.start),
            "end_time": str(sub.end),
            "text": sub.text
        })
    return parsed