#!/usr/bin/env python3
"""Atualiza latest-result.json a partir de uma fonte oficial do Euromilhões."""
from __future__ import annotations

import datetime as dt
import html
import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "latest-result.json"
MONTHS_ES = {
    1: "enero", 2: "febrero", 3: "marzo", 4: "abril", 5: "mayo", 6: "junio",
    7: "julio", 8: "agosto", 9: "septiembre", 10: "octubre", 11: "noviembre", 12: "diciembre",
}
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; EuromilhoesLab/1.0; +https://github.com/JotazizuSensei/blueon-operator-m45)",
    "Accept-Language": "es-ES,es;q=0.9,pt-PT;q=0.8",
}


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8", errors="replace")


def text_content(raw_html: str) -> str:
    raw_html = re.sub(r"<script.*?</script>|<style.*?</style>", " ", raw_html, flags=re.I | re.S)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", raw_html))).strip()


def candidate_draw_dates(today: dt.date) -> list[dt.date]:
    dates: list[dt.date] = []
    for days_back in range(0, 15):
        candidate = today - dt.timedelta(days=days_back)
        if candidate.weekday() in (1, 4):
            dates.append(candidate)
    return dates


def parse_selae(date: dt.date) -> dict | None:
    url = (
        "https://www.loteriasyapuestas.es/es/euromillones/resultados/"
        f"euromillones-resultados-del-{date.day:02d}-de-{MONTHS_ES[date.month]}-de-{date.year}"
    )
    try:
        text = text_content(fetch(url))
    except Exception:
        return None
    pattern = re.compile(
        r"(\d{2})\s*-\s*(\d{2})\s*-\s*(\d{2})\s*-\s*(\d{2})\s*-\s*(\d{2})\s+Estrellas:\s*(\d{2})\s*-\s*(\d{2})",
        re.I,
    )
    match = pattern.search(text)
    if not match:
        return None
    values = [int(value) for value in match.groups()]
    numbers, stars = sorted(values[:5]), sorted(values[5:])
    if len(set(numbers)) != 5 or len(set(stars)) != 2:
        return None
    return {
        "date": date.isoformat(),
        "numbers": numbers,
        "stars": stars,
        "m1": "",
        "source": "Loterías y Apuestas del Estado — resultado oficial europeu",
        "sourceUrl": url,
        "official": True,
        "updatedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
    }


def load_current() -> dict:
    try:
        return json.loads(OUTPUT.read_text(encoding="utf-8"))
    except Exception:
        return {}


def main() -> int:
    current = load_current()
    today = dt.datetime.now(dt.timezone.utc).date()
    found = None
    for date in candidate_draw_dates(today):
        found = parse_selae(date)
        if found:
            break
    if not found:
        print("Nenhum novo resultado oficial encontrado; ficheiro mantido.")
        return 0
    if current.get("date") == found["date"] and current.get("numbers") == found["numbers"] and current.get("stars") == found["stars"]:
        print(f"Resultado {found['date']} já está atualizado.")
        return 0
    if current.get("date") and current["date"] > found["date"]:
        print("A fonte devolveu um resultado mais antigo; ficheiro mantido.")
        return 0
    if current.get("date") == found["date"] and current.get("m1"):
        found["m1"] = current["m1"]
    OUTPUT.write_text(json.dumps(found, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Atualizado para {found['date']}: {found['numbers']} + {found['stars']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
