import pysrt
import re

def parse_srt(file_path):
    subs = pysrt.open(file_path)
    parsed = []
    for i, sub in enumerate(subs):
        # replacing newline characters with a space
        clean_text = sub.text.replace('\n', ' ')
        # use a regular expression to remove all HTML tags
        clean_text = re.sub(r'<.*?>', '', clean_text)
        
        parsed.append({
            "id": i,
            "start_time": str(sub.start),
            "end_time": str(sub.end),
            "text": clean_text 
        })
    return parsed