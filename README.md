# Nyx-Bot

Um bot de WhatsApp MD completo, construído com Node.js e Baileys.

## Estrutura

Os comandos são separados por nível de acesso:

- **membro** — comandos disponíveis para usuários comuns.
- **admin** — comandos de administração de grupos.
- **dono** — comandos exclusivos do proprietário do bot.

## Requisitos

- Node.js 20 ou superior.
- Uma conta do WhatsApp para vincular ao bot.

## Instalação

```bash
npm install
```

Copie `.env.example` para `.env` e configure:

```env
PHONE_NUMBER=5511999999999
PREFIX=!
OWNER_NUMBERS=5511999999999
```

O número deve estar em formato internacional, somente números e sem o sinal `+`.

Depois:

```bash
npm start
```

O primeiro vínculo pode usar o **pairing code** exibido no terminal. A sessão fica armazenada em `sessions/nyx` e não deve ser enviada ao GitHub.

## Comandos iniciais

- `!ping`
- `!menu`
- `!grupo` — admin
- `!status` — dono

## Próximas etapas

- Sistema completo de permissões.
- Comandos de membro.
- Ferramentas de administração.
- Comandos do dono.
- Sistema de plugins.
- Configurações persistentes.
- Logs e tratamento de erros.
- Recursos de mídia e utilidades.

> Baileys é uma biblioteca não oficial e não é afiliada ao WhatsApp. Use o bot de forma responsável.
