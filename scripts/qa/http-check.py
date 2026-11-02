"""Smoke-check rendered HTML; excludes scripts and original media URLs from copy checks."""
import concurrent.futures
import json
import re
import sys
import time
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.skip = 0; self.text = []; self.h1 = 0; self.attrs = []; self.ids = set(); self.links = []; self.canonical = ''; self.lang = ''; self.videos = 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ('script','style'): self.skip += 1
        if tag == 'h1': self.h1 += 1
        if tag == 'html': self.lang = a.get('lang','')
        if tag == 'video': self.videos += 1
        if 'id' in a: self.ids.add(a['id'])
        if tag == 'a': self.links.append(a.get('href',''))
        if tag == 'link' and a.get('rel') == 'canonical': self.canonical = a.get('href','')
        for k in ('alt', 'aria-label', 'title'): self.attrs.append(a.get(k,''))
    def handle_endtag(self, tag):
        if tag in ('script','style'): self.skip -= 1
    def handle_data(self, text):
        if not self.skip: self.text.append(text)

base = (sys.argv[1] if len(sys.argv)>1 else 'http://localhost:3001').rstrip('/')
slugs = ['', '/product-builder','/pm','/fe','/ui','/design','/ai-art','/literature','/film','/photography']
def check(route):
    start = time.perf_counter()
    with urllib.request.urlopen(base+route,timeout=30) as response:
        status = response.status; source = response.read().decode()
    elapsed = round((time.perf_counter()-start)*1000)
    page = Page(); page.feed(source)
    errors = []
    if status != 200: errors.append(f'HTTP {status}')
    if page.h1 != 1: errors.append(f'h1 count={page.h1}')
    if page.lang != route.split('/')[1]: errors.append('Wrong language')
    if not page.canonical.endswith(route): errors.append('Wrong canonical: '+page.canonical)
    if 'contact' not in page.ids or 'main-content' not in page.ids: errors.append('Missing contact/main')
    if route.startswith('/en') and re.search(r'[\u3400-\u9fff]', ' '.join(page.text+page.attrs)): errors.append('CJK in English text or labels')
    if page.videos: errors.append('Video mounted before play')
    for href in page.links:
        if href.startswith('#') and href[1:] not in page.ids: errors.append('Broken anchor '+href)
    for slug in slugs[1:]:
        if f'/{page.lang}{slug}' not in page.links: errors.append('Missing discipline link '+slug)
    if errors: raise AssertionError(route+': '+str(errors))
    return {'route':route,'status':'PASS','http':status,'ms':elapsed,'h1':page.h1,'videosBeforePlay':page.videos,'canonical':page.canonical}
routes=[f'/{locale}{slug}' for locale in ['en','zh'] for slug in slugs]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: results=list(pool.map(check,routes))
out=Path('/tmp/portfolio-http-results.json');out.write_text(json.dumps({'base':base,'results':results},indent=2))
for result in results: print(f"PASS {result['route']:23} {result['ms']:4} ms")
print(f'PASS: {len(results)} routes. Single H1, localized text and labels, canonical URLs, all discipline links, valid anchors, no preloaded videos.')
