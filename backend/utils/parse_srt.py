# import pysrt

# def parse_srt(file_path):
#     subs = pysrt.open(file_path)
#     parsed = []
#     for i, sub in enumerate(subs):
#         parsed.append({
#             "id": i,
#             "start_time": str(sub.start),
#             "end_time": str(sub.end),
#             # This is the change: replace newlines with a space
#             "text": sub.text.replace('\n', ' ')
#         })
#     return parsed


import pysrt
import re # 1. Import the regular expression library

def parse_srt(file_path):
    subs = pysrt.open(file_path)
    parsed = []
    for i, sub in enumerate(subs):
        # 2. Clean the text in two steps
        # First, replace newline characters with a space
        clean_text = sub.text.replace('\n', ' ')
        # Second, use a regular expression to find and remove all HTML tags
        clean_text = re.sub(r'<.*?>', '', clean_text)
        
        parsed.append({
            "id": i,
            "start_time": str(sub.start),
            "end_time": str(sub.end),
            # 3. Use the fully cleaned text
            "text": clean_text 
        })
    return parsed