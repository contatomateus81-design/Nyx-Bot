# Nyx — Assistente virtual Android

Nyx é uma assistente Android em Kotlin + Jetpack Compose, com voz, texto, personalidade configurável e arquitetura de provedores substituíveis.

## Estado

A branch `android-nyx-v0.1` contém a fundação Android da Nyx:
- Kotlin + Jetpack Compose + Material 3
- MVVM + Hilt + Coroutines/Flow
- Room + DataStore
- SpeechRecognizer e TextToSpeech nativos
- Foreground Service de microfone
- Notificação persistente com ação de parada
- AccessibilityService opcional e transparente
- executor inicial de ações por Intent
- testes unitários iniciais

O nome canônico é **Nyx**. O termo "Lumi" apareceu em um rascunho de requisitos e foi normalizado para Nyx.

## APIs gratuitas/nativas

A base prioriza APIs públicas do Android:
- STT: `android.speech.SpeechRecognizer`
- TTS: `android.speech.tts.TextToSpeech`
- ações: Intents e APIs do Android
- persistência: Room e DataStore
- voz em segundo plano: Foreground Service de tipo microphone

A IA generativa é deliberadamente uma interface. Um modelo remoto de qualidade normalmente exige um serviço/backend e pode ter custo ou limites próprios; nenhuma chave é embutida no aplicativo. O `LocalAiProvider` permite desenvolver e testar sem credenciais.

## Android moderno

O serviço de microfone declara `FOREGROUND_SERVICE_MICROPHONE` e só deve ser iniciado após uma ação visível do usuário e a concessão de `RECORD_AUDIO`. Android 14+ impõe essas pré-condições e restrições de inicialização em segundo plano.

## Compilar

1. Abra o repositório no Android Studio.
2. Use JDK 17.
3. Aguarde o Gradle Sync.
4. Execute o módulo `app`.
5. Para APK debug: Build > Build APK(s).
6. Para AAB: Build > Generate Signed Bundle / APK > Android App Bundle.

## Próximas etapas

1. onboarding e tela de permissões dedicada
2. streaming real de IA via provedor configurável
3. conversa contínua com detecção de turnos
4. histórico Room ligado à UI
5. comandos e confirmações
6. widget, atalho e Quick Settings
7. personalização de voz/persona
8. testes instrumentados e CI

## Segurança

A Nyx não deve usar AccessibilityService para espionagem. O serviço é opcional, explicitamente ativado pelo usuário e limitado às ações autorizadas. Ações externas importantes devem exigir confirmação clara.

Nenhum segredo, senha, token bancário ou chave de API deve ser armazenado no código-fonte.
