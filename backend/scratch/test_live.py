import urllib.request
import urllib.parse
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://ts.meeseva.telangana.gov.in/TSDeptPortal/UserInterface/Services.html',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9'
}

raw_url = "https://ts.meeseva.telangana.gov.in/TSDeptPortal/PhysicalForms/Application%20Forms%20New/New/Income%20General%20Application%20Form.pdf"

try:
    req = urllib.request.Request(raw_url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=8) as resp:
        b = resp.read()
        print(f"SUCCESS! Status: {resp.status}, Bytes: {len(b)}")
except Exception as e:
    print(f"Failed with headers: {e}")
