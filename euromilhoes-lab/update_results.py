#!/usr/bin/env python3
"""Atualiza latest-result.json a partir do resultado oficial dos Jogos Santa Casa."""
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
SOURCE_URL = "https://www.jogossantacasa.pt/web/SCCartazResult/euroMilhoes"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; EuromilhoesLab/1.0; +https://github.com/JotazizuSensei/blueon-operator-m45)",
    "Accept-Language": "pt-PT,pt;q=0.9,en;q=0.7",
    "Cache-Control": "no-cache",
}


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8", errors="replace")


def text_content(raw_html: str) -> str:
    raw_html = re.sub(r"<script.*?</script>|<style.*?</style>", " ", raw_html, flags=re.I | re.S)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", raw_html))).strip()


def parse_latest() -> dict | None:
    try:
        text = text_content(fetch(SOURCE_URL))
    except Exception as exc:
        print(f"Falha ao consultar Jogos Santa Casa: {exc}")
        return None

    pattern = re.compile(
        r"Data do Sorteio\s*-\s*(\d{2})/(\d{2})/(\d{4})"
        r".{0,600}?\b(\d{1,2})\s+(\d{1,2})\s+(\d{1,2})\s+(\d{1,2})\s+(\d{1,2})"
        r"\s*\+\s*(\d{1,2})\s+(\d{1,2})\b",
        re.I,
    )
    match = pattern.search(text)
    if not match:
        print("Não foi possível reconhecer a chave oficial na página.")
        return None

    day, month, year = map(int, match.groups()[:3])
    values = [int(value) for value in match.groups()[3:]]
    numbers, stars = sorted(values[:5]), sorted(values[5:])
    if len(set(numbers)) != 5 or len(set(stars)) != 2:
        print("Resultado inválido ou duplicado; ficheiro mantido.")
        return None

    return {
        "date": dt.date(year, month, day).isoformat(),
        "numbers": numbers,
        "stars": stars,
        "m1": "",
        "source": "Jogos Santa Casa — resultado oficial",
        "sourceUrl": SOURCE_URL,
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
    found = parse_latest()
    if not found:
        return 0
    if current.get("date") and current["date"] > found["date"]:
        print("A fonte devolveu um resultado mais antigo; ficheiro mantido.")
        return 0
    if current.get("date") == found["date"] and current.get("m1"):
        found["m1"] = current["m1"]
    comparable = ("date", "numbers", "stars", "m1")
    if all(current.get(key) == found.get(key) for key in comparable):
        print(f"Resultado {found['date']} já está atualizado.")
        return 0
    OUTPUT.write_text(json.dumps(found, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Atualizado para {found['date']}: {found['numbers']} + {found['stars']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
