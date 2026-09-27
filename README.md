# Nyx-Bot

Um bot de WhatsApp MD construído com Node.js e Baileys, com comandos para membros, administradores e dono.

## Estrutura

- **membro** — comandos para usuários comuns e recursos de assistente.
- **admin** — ferramentas de administração de grupos.
- **dono** — comandos exclusivos do proprietário do bot.

## Requisitos

- Node.js 20 ou superior.
- Uma conta do WhatsApp para vincular ao bot.
- Uma chave da OpenAI somente se quiser ativar os recursos de IA.

## Instalação

```bash
npm install
```

Copie `.env.example` para `.env` e configure:

```env
PHONE_NUMBER=5511999999999
PREFIX=!
OWNER_NUMBERS=5511999999999

OPENAI_API_KEY=sua_chave_aqui
OPENAI_MODEL=gpt-5.6-luna
```

**Nunca publique o arquivo `.env` nem a chave da API no GitHub.**

Depois:

```bash
npm start
```

O primeiro vínculo pode usar o **pairing code** exibido no terminal. A sessão fica armazenada em `sessions/nyx` e não deve ser enviada ao GitHub.

## Comandos

### Membro

- `!ping` — verifica se o bot está online.
- `!menu` — mostra os comandos.
- `!ia <mensagem>` — conversa com a IA e mantém contexto recente.
- `!resumir` — resume o contexto recente da conversa.
- `!memoria` — mostra o estado da memória.
- `!memoria limpar` — apaga a memória da conversa.
- `!lembrar YYYY-MM-DD HH:MM <texto>` — cria um lembrete.
- `!lembrar listar` — lista lembretes pendentes.
- `!lembrar cancelar <ID>` — cancela um lembrete.

### Admin

- `!grupo` — mostra informações básicas do grupo.

### Dono

- `!status` — mostra o status do Nyx.

## Recursos de IA

A integração de IA é opcional. Quando `OPENAI_API_KEY` não estiver configurada, o bot continua funcionando normalmente e apenas os comandos que dependem de IA ficam desativados.

A memória e os lembretes são salvos em `sessions/nyx`, que já está no `.gitignore`.

## Próximas etapas

- Transcrição de áudios.
- Análise de imagens e documentos.
- Pesquisa na internet.
- Modo de conversa automática.
- Mais ferramentas de grupo.
- Sistema de plugins.
- Configurações persistentes e preferências por usuário.

> Baileys é uma biblioteca não oficial e não é afiliada ao WhatsApp. Use o bot de forma responsável.
