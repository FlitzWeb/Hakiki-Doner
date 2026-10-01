"""Bouwt assets/map-woensel.jpg: een statische kaart van OpenStreetMap,
zodat de site geen Google Maps-iframe (en dus geen Google-cookies) nodig heeft.
Eenmalig draaien; opnieuw alleen als het adres verandert.
    python3 tools/build-map.py
Tegels: © OpenStreetMap-bijdragers (ODbL); vermelding staat bij de kaart.
"""
import io, math, urllib.request
from PIL import Image, ImageEnhance

LAT, LON = 51.4694062, 5.4748195   # Hakiki, Winkelcentrum Woensel 414 (OSM node 2751970386)
Z, W, H = 17, 760, 640
UA = "FlitzWeb-static-map/1.0 (info@flitzweb.nl)"

def px(lat, lon, z):
    n = 256 * 2 ** z
    x = (lon + 180) / 360 * n
    y = (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
    return x, y

cx, cy = px(LAT, LON, Z)
left, top = cx - W / 2, cy - H / 2
canvas = Image.new("RGB", (W, H))
for tx in range(int(left // 256), int((left + W) // 256) + 1):
    for ty in range(int(top // 256), int((top + H) // 256) + 1):
        req = urllib.request.Request(f"https://tile.openstreetmap.org/{Z}/{tx}/{ty}.png", headers={"User-Agent": UA})
        tile = Image.open(io.BytesIO(urllib.request.urlopen(req).read())).convert("RGB")
        canvas.paste(tile, (int(tx * 256 - left), int(ty * 256 - top)))

# rustiger, warm getint, zodat de rode pin en de site-kleuren de aandacht krijgen
canvas = ImageEnhance.Color(canvas).enhance(0.45)
warm = Image.new("RGB", canvas.size, (250, 238, 222))
canvas = Image.blend(canvas, warm, 0.12)
canvas.save("assets/map-woensel.jpg", quality=84, optimize=True, progressive=True)
print("assets/map-woensel.jpg", canvas.size)
