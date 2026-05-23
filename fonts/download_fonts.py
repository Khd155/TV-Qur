import urllib.request, os, sys

os.chdir(os.path.dirname(os.path.abspath(__file__)))

fonts = [
    ('Amiri-400.ttf',   'https://fonts.gstatic.com/s/amiri/v30/J7aRnpd8CGxBHqUp.ttf'),
    ('Amiri-700.ttf',   'https://fonts.gstatic.com/s/amiri/v30/J7acnpd8CGxBHp2VkZY4.ttf'),
    ('Cairo-400.ttf',   'https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hOA-W1Q.ttf'),
    ('Cairo-600.ttf',   'https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hD45W1Q.ttf'),
    ('Cairo-700.ttf',   'https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hAc5W1Q.ttf'),
    ('Cairo-800.ttf',   'https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hGA5W1Q.ttf'),
    ('Cairo-900.ttf',   'https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hEk5W1Q.ttf'),
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0'}

for name, url in fonts:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        with open(name, 'wb') as f:
            f.write(data)
        print(f'OK  {name:28s}  {len(data)//1024} KB')
    except Exception as e:
        print(f'ERR {name}: {e}', file=sys.stderr)

print('Done.')
