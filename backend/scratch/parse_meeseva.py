import os
import re
import urllib.parse
from html.parser import HTMLParser

class MeeSevaParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_a = False
        self.current_href = ""
        self.current_text = ""
        self.entries = []
        self.current_dept = "General"

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag.lower() == 'a':
            self.in_a = True
            self.current_href = attrs_dict.get('href', '')
            self.current_text = ""

    def handle_data(self, data):
        if self.in_a:
            self.current_text += data

    def handle_endtag(self, tag):
        if tag.lower() == 'a' and self.in_a:
            text = self.current_text.strip()
            href = self.current_href.strip()
            if text or href:
                self.entries.append((text, href))
            self.in_a = False

path = r"C:\Users\Nalla Pavankumar\.gemini\antigravity\brain\5f53979c-960c-4f30-8ce6-587ce63b3e11\.system_generated\steps\902\content.md"

if os.path.exists(path):
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        html_content = f.read()

    parser = MeeSevaParser()
    parser.feed(html_content)

    print(f"Total links parsed from MeeSeva Applications page: {len(parser.entries)}")
    for text, href in parser.entries:
        if ".pdf" in href.lower() or "application" in text.lower() or "certificate" in text.lower() or "form" in text.lower():
            print(f"TEXT: {text:<50} | HREF: {href}")
else:
    print("Content file not found.")
