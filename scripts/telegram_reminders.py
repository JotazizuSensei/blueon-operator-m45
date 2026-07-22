import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import datetime
from zoneinfo import ZoneInfo

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

SCHEDULE = {
    "05:35": ("Pré-treino", "Banana + 20 g whey + água. Prepara o treino sem pesar o estômago.", {0, 1, 2, 3, 4}),
    "07:30": ("Pequeno-almoço / pós-treino", "Proteína + hidratos + água. Regista como correu o treino e o nível de energia.", set(range(7))),
    "10:30": ("Lanche da manhã", "Evita chegar ao almoço com fome excessiva. Confirma proteína e fruta.", set(range(7))),
    "12:00": ("Controlo de água", "Objetivo intermédio: cerca de 1,2 L de água acumulados.", set(range(7))),
    "14:00": ("Suplementação", "Creatina 5 g + ómega-3 com a refeição.", set(range(7))),
    "15:30": ("Lanche da tarde", "Garante proteína e energia suficiente para o final do dia.", set(range(7))),
    "18:00": ("Controlo de água", "Objetivo intermédio: cerca de 2,2 L de água acumulados.", set(range(7))),
    "20:30": ("ZMB6", "Tomar conforme o plano e evitar acumular cafeína ao final do dia.", set(range(7))),
    "21:45": ("Ceia e preparação", "Prepara o dia seguinte: pequeno-almoço, suplementos, água e pré-treino.", set(range(7))),
}


def send_message(text: str) -> None:
    if not TOKEN or not CHAT_ID:
        raise RuntimeError("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID")

    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    data = urllib.parse.urlencode({
        "chat_id": CHAT_ID,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": "true",
    }).encode("utf-8")

    request = urllib.request.Request(url, data=data, method="POST")
    with urllib.request.urlopen(request, timeout=20) as response:
        payload = json.loads(response.read().decode("utf-8"))
        if not payload.get("ok"):
            raise RuntimeError(f"Telegram error: {payload}")


def main() -> int:
    now = datetime.now(ZoneInfo("Europe/Lisbon"))

    if "--test" in sys.argv:
        message = (
            "<b>BLUE ON Operator M45</b>\n"
            "<b>Teste Telegram concluído</b>\n\n"
            f"Ligação ativa em {now.strftime('%d/%m/%Y às %H:%M')} · Europe/Lisbon.\n"
            "Os lembretes de nutrição e suplementação estão configurados."
        )
        send_message(message)
        print("Test message sent")
        return 0

    current = now.strftime("%H:%M")
    item = SCHEDULE.get(current)

    if not item:
        print(f"No reminder scheduled for {current} Europe/Lisbon")
        return 0

    title, body, weekdays = item
    if now.weekday() not in weekdays:
        print(f"Reminder {title} disabled for weekday {now.weekday()}")
        return 0

    message = (
        f"<b>BLUE ON Operator M45</b>\n"
        f"<b>{title}</b> · {current}\n\n"
        f"{body}"
    )
    send_message(message)
    print(f"Sent: {title}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        raise
