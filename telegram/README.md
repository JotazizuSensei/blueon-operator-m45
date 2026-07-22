# Lembretes de nutrição no Telegram

Este módulo envia os lembretes pessoais de nutrição e suplementação do João através de um bot do Telegram, mesmo com a aplicação fechada.

## O que é necessário

1. Criar um bot no Telegram através do **@BotFather**.
2. Guardar o token fornecido pelo BotFather.
3. Enviar uma mensagem ao bot criado.
4. Obter o `chat_id` pessoal.
5. Configurar as variáveis de ambiente:

```bash
TELEGRAM_BOT_TOKEN=token_do_bot
TELEGRAM_CHAT_ID=chat_id
TIMEZONE=Europe/Lisbon
```

## Executar no PC

Requer Node.js 20 ou superior.

### PowerShell

```powershell
$env:TELEGRAM_BOT_TOKEN="TOKEN"
$env:TELEGRAM_CHAT_ID="CHAT_ID"
$env:TIMEZONE="Europe/Lisbon"
node telegram/reminders.mjs
```

Enquanto esta janela estiver aberta e o PC estiver ligado, os lembretes são enviados.

## Funcionamento 24/7

Para funcionar com o PC desligado, este pequeno serviço deve ser colocado num alojamento permanente, por exemplo:

- Cloudflare Worker com Cron Trigger;
- Render Background Worker;
- Railway;
- servidor doméstico/NAS sempre ligado.

Nunca colocar o token diretamente num ficheiro público do GitHub. Usar sempre **Secrets** ou variáveis de ambiente privadas.

## Horários configurados

- 05h35 — pré-treino, de segunda a sexta;
- 07h30 — pequeno-almoço/pós-treino;
- 10h30 — lanche da manhã;
- 12h00 — controlo de água;
- 14h00 — creatina e ómega-3;
- 15h30 — lanche da tarde;
- 18h00 — controlo de água;
- 20h30 — ZMB6;
- 21h45 — ceia e preparação do dia seguinte.

O fuso horário está fixado em `Europe/Lisbon`, incluindo mudança entre hora de verão e inverno.
