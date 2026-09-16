# MythStride — Google Play Data safety disclosure matrix

Internal working document. **Not published on the website.**

Status date: 2026-09-15. Built for filling in **Play Console → App content →
Data safety** for `com.playmythstride.mythstride`.

Evidence is cited by file. Where a cell would require a decision that no
repository records, it says so and points at `PLAY_STORE_OWNER_ACTIONS.md`
rather than guessing.

Conventions used below:

- **Coletado** = leaves the device to MythStride servers.
- **Compartilhado** = transferred to a third party for their own processing.
  Infrastructure processors acting on our instructions (Cloudflare, Resend) are
  marked *Processador*, which Play generally does not count as "shared" — the
  distinction is called out per row so it can be answered deliberately.
- **Obrigatório** = the feature cannot work without it; **Opcional** = the
  player turns it on.

---

## 1. Personal information

| DADO | COLETADO? | COMPARTILHADO? | FINALIDADE | OBRIGATÓRIO/OPCIONAL | ORIGEM | ARMAZENAMENTO/DESTINO | SERVIÇO TERCEIRO | EXCLUSÃO DISPONÍVEL? | EVIDÊNCIA |
|---|---|---|---|---|---|---|---|---|---|
| Nome / nome de exibição | Sim | Não | Identificação no jogo, comunidade, rankings | Obrigatório (criado no cadastro) | Informado pelo jogador | Banco de dados MythStride | — | Sim | `Models/Jogador.cs`; `account_data.player_name` |
| E-mail | Sim | Processador | Login, verificação, recuperação de senha, links de exclusão, avisos do beta | Obrigatório | Informado pelo jogador | Banco MythStride; enviado ao provedor de e-mail no envio | Resend (`Services/EmailService.cs`, `Email:Provider=Resend`) | Sim | `Models/Usuario.cs` `Email`; `appsettings.json` |
| Senha | Sim (apenas hash) | Não | Autenticação | Obrigatório quando o login é por e-mail | Informada pelo jogador | Banco MythStride, somente como hash | — | Sim | `Models/Usuario.cs` `SenhaHash` |
| Identificador de conta Google | Sim | Sim (Google) | Login com conta Google | Opcional (método de login alternativo) | Google Sign-In | Banco MythStride (`GoogleSubject`) | Google (`GoogleAuth:ValidAudiences`, `google_sign_in`) | Sim | `Models/Usuario.cs`; `providers/auth_provider.dart` |
| Imagem de perfil | Sim | Não | Avatar do jogador | Opcional | Enviada pelo jogador (`image_picker`) | Disco do servidor MythStride (`avatars/`) | — | Sim | `Services/MediaStorageService.cs` |
| Idioma preferido | Sim | Não | Localização da interface e dos e-mails | Obrigatório (padrão `en`) | Dispositivo/escolha | Banco MythStride | — | Sim | `Models/Usuario.cs` `PreferredLocale` |

**Play mapping:** Personal info → Name, Email address, User IDs, Photos (perfil).

---

## 2. Authentication and security

| DADO | COLETADO? | COMPARTILHADO? | FINALIDADE | OBRIGATÓRIO/OPCIONAL | ORIGEM | ARMAZENAMENTO/DESTINO | SERVIÇO TERCEIRO | EXCLUSÃO DISPONÍVEL? | EVIDÊNCIA |
|---|---|---|---|---|---|---|---|---|---|
| Tokens de sessão / refresh | Sim | Não | Manter a sessão autenticada | Obrigatório | Gerado no login | Banco MythStride + `flutter_secure_storage` no aparelho | — | Sim | `Models/UsuarioRefreshToken.cs`; `services/auth_storage_service.dart` |
| Códigos de verificação / reset (hash) | Sim | Processador (envio) | Verificar e-mail, redefinir senha | Obrigatório no fluxo | Gerado no servidor | Banco MythStride, como hash | Resend (entrega) | Sim | `Models/Usuario.cs` |
| Registros de auditoria de segurança | Sim | Não | Prevenção a fraude e abuso, rastreio de incidentes | Obrigatório | Gerado no servidor | Banco MythStride | — | **Anonimizado**, não apagado de imediato | `Services/Privacy/AccountDataEraser.cs` `AnonymizeSecurityAuditAsync`; `AccountDeletion:PreserveSecurityAuditDays` |
| Endereço IP | Sim | Processador | Rate limiting, prevenção a abuso, entrega do tráfego | Obrigatório | Requisição HTTP | Registros do servidor; trânsito pela CDN | Cloudflare (`deploy/ubuntu/cloudflared-config.yml`) | Indireta (expira com os registros) | `RateLimiting` em `appsettings.json` |

**Play mapping:** App activity / Device or other IDs — and Play's *security
practices* questions ("data is encrypted in transit", "users can request data
deletion").

---

## 3. Location

| DADO | COLETADO? | COMPARTILHADO? | FINALIDADE | OBRIGATÓRIO/OPCIONAL | ORIGEM | ARMAZENAMENTO/DESTINO | SERVIÇO TERCEIRO | EXCLUSÃO DISPONÍVEL? | EVIDÊNCIA |
|---|---|---|---|---|---|---|---|---|---|
| Localização precisa (GPS) | **Sim** | Não | Medir distância, ritmo e rota; validar a corrida (anti-fraude) | Opcional, mas obrigatória para corridas por GPS | Sensor do aparelho | Amostras enviadas ao servidor ao fim da corrida e guardadas com a corrida | — | Sim (apagada com a conta) | `ACCESS_FINE_LOCATION` no manifest; `models/run_request.dart` (`samples`); `disclosure.location.body` |
| Localização aproximada | Sim | Não | Igual à acima (a permissão grosseira acompanha a precisa) | Opcional | Sensor do aparelho | Igual | — | Sim | `ACCESS_COARSE_LOCATION` no manifest |
| Localização em segundo plano | **Não** | — | — | — | — | — | — | — | Não existe `ACCESS_BACKGROUND_LOCATION`; a corrida usa `FOREGROUND_SERVICE_LOCATION` com notificação visível |
| Sinal de localização simulada | Sim | Não | Anti-fraude | Obrigatório durante a corrida | Sistema Android | Enviado com a corrida (`mockLocationDetected`) | — | Sim | `models/run_request.dart` |

**Play mapping:** Location → Approximate location, Precise location. Purpose:
*App functionality*, *Fraud prevention, security and compliance*. **Not**
advertising or analytics. Play also asks to justify precise location — the
justification is run measurement, and there is no background access to declare.

---

## 4. Health and fitness

| DADO | COLETADO? | COMPARTILHADO? | FINALIDADE | OBRIGATÓRIO/OPCIONAL | ORIGEM | ARMAZENAMENTO/DESTINO | SERVIÇO TERCEIRO | EXCLUSÃO DISPONÍVEL? | EVIDÊNCIA |
|---|---|---|---|---|---|---|---|---|---|
| Dados de corrida (distância, duração, ritmo, velocidade) | Sim | Não | Registrar a atividade e converter em progressão | Obrigatório para jogar | Calculados no aparelho a partir do GPS/sensores | Banco MythStride (`Corridas`) | — | Sim | `Controllers/CorridaController.cs`; `models/run_request.dart` |
| Frequência cardíaca média | Sim | Não | Completar o registro da atividade e alimentar o resumo de treino | Opcional (só com relógio Wear OS) | Sensor do relógio → celular → servidor | Banco MythStride (`AverageHeartRate`) | — | Sim | `CorridaController.cs` `AverageHeartRateBpm`; `WEAR_DATA_LAYER_PROTOCOL.md` `/bpm_update` |
| Frequência cardíaca instantânea | Não sai do par celular/relógio | Não | Exibir a corrida em andamento | Opcional | Sensor do relógio | Memória do aplicativo; só a média é enviada | — | n/a | `WEAR_DATA_LAYER_PROTOCOL.md`; `services/watch_sync_service.dart` |
| Passos / cadência | Sim | Não | Corroborar corridas em esteira, completar o registro | Opcional | `ACTIVITY_RECOGNITION` / contador de passos | Banco MythStride | — | Sim | `AndroidManifest.xml`; `services/step_counter_service.dart` |
| Health Connect | **Não usado** | — | — | — | — | — | — | — | Nenhuma permissão `android.permission.health.*` no manifest do celular; o pacote `health` só é chamado sob `Platform.isIOS` (`services/apple_health_service.dart`) |
| Apple Health | Fora de escopo no Android | — | Importar treinos de corrida no iOS | Opcional | HealthKit | — | — | — | `apple_health_service.dart` retorna `unsupported` fora do iOS; `AppleHealth:Enabled=false` |

**Play mapping:** Health and fitness → Fitness info (and Health info for heart
rate). Purpose: *App functionality*. **Must not** be marked as used for
advertising or marketing — Play's health data policy forbids it and the code
does not do it.

---

## 5. Wear OS companion

| DADO | COLETADO? | COMPARTILHADO? | FINALIDADE | OBRIGATÓRIO/OPCIONAL | ORIGEM | ARMAZENAMENTO/DESTINO | SERVIÇO TERCEIRO | EXCLUSÃO DISPONÍVEL? | EVIDÊNCIA |
|---|---|---|---|---|---|---|---|---|---|
| Métricas da sessão (bpm, distância, passos, duração, estado) | Trafegam para o celular pareado; chegam ao servidor apenas dentro do resultado da corrida | Não (canal local) | Executar a corrida nos dois aparelhos | Opcional (só com relógio) | Sensores do relógio | Data Layer local → celular → servidor | Google Play Services (transporte) | Sim (com a corrida) | `mythstride_watch/AndroidManifest.xml`; `WEAR_DATA_LAYER_PROTOCOL.md` |
| Permissões do relógio | n/a | — | Sensores corporais, frequência cardíaca, reconhecimento de atividade, localização, notificações | Opcional | — | — | — | — | `BODY_SENSORS`, `health.READ_HEART_RATE`, `ACTIVITY_RECOGNITION`, `ACCESS_*_LOCATION` no manifest do relógio |

O aplicativo do relógio é declarado **não autônomo**
(`com.google.android.wearable.standalone = false`) e não fala com o backend.

---

## 6. App activity, game content and community

| DADO | COLETADO? | COMPARTILHADO? | FINALIDADE | OBRIGATÓRIO/OPCIONAL | ORIGEM | ARMAZENAMENTO/DESTINO | SERVIÇO TERCEIRO | EXCLUSÃO DISPONÍVEL? | EVIDÊNCIA |
|---|---|---|---|---|---|---|---|---|---|
| Progressão (nível, XP, missões, conquistas, inventário, ouro, diamantes) | Sim | Não | Funcionamento do jogo | Obrigatório | Gerado no jogo | Banco MythStride | — | Sim | `Services/` (Achievement, Drop, DiamondLedger…) |
| Amizades, grupos, rankings, desafios | Sim | Visível a outros jogadores dentro do app | Recursos sociais | Opcional | Ações do jogador | Banco MythStride | — | Sim | `Services/GrupoService.cs`, `DesafioAmigoService.cs` |
| Denúncias e bloqueios | Sim | Não | Moderação e segurança da comunidade | Opcional | Enviados pelo jogador | Banco MythStride | — | Denúncias feitas são apagadas; as recebidas/resolvidas são anonimizadas | `AccountDataEraser.cs` (`ModerationReports`) |
| Contexto e mensagens do Aethron | Sim | Não | Gerar narrativa | Opcional | Conta + jogo | Banco MythStride; modelo executado na própria infraestrutura | — | Sim | `Services/Aethron/*`, `Ollama:BaseUrl=http://localhost:11434` |
| Conteúdo enviado ao suporte | Sim | Processador | Atendimento | Opcional | E-mail do jogador | Caixa de e-mail do MythStride Studio | Resend (entrega) | Mediante pedido | `Email:ReplyTo=contato@playmythstride.com` |
| Lista do beta (site) | Sim | Processador | Administrar a lista e convidar | Opcional | Formulário do site | Banco MythStride | Resend | Mediante pedido | `src/lib/api/waitlist.ts`; `POST /api/waitlist` |

**Play mapping:** App activity → App interactions, Other user-generated content
(perfil, denúncias, contexto do Aethron), Other actions.

---

## 7. Device identifiers, diagnostics and analytics

| DADO | COLETADO? | COMPARTILHADO? | FINALIDADE | OBRIGATÓRIO/OPCIONAL | ORIGEM | ARMAZENAMENTO/DESTINO | SERVIÇO TERCEIRO | EXCLUSÃO DISPONÍVEL? | EVIDÊNCIA |
|---|---|---|---|---|---|---|---|---|---|
| Informações técnicas do aparelho/app (versão, plataforma, bateria) | Sim | Não | Suporte, compatibilidade, diagnóstico | Obrigatório | `package_info_plus`, `battery_plus` | Banco/registros MythStride | — | Indireta | `pubspec.yaml` |
| Relatórios de falha (mensagem + stack trace) | Condicional — só com DSN definido no build | Sim (Sentry) | Diagnóstico de erros | Obrigatório quando ativo | Erro em execução | Sentry | Sentry (`sentry_flutter`) | Mediante pedido ao fornecedor | `lib/main.dart` `_initializeCrashReporting`; `sendDefaultPii=false`. **Decisão pendente do responsável: ver B8.** |
| Analytics de produto | **Não** | — | — | — | — | — | — | — | Nenhum SDK de analytics no `pubspec.yaml`; **sem Firebase Analytics, sem Crashlytics, sem `firebase_*`** (ausentes de `pubspec.lock`) |
| Identificador de publicidade (AAID) | **Não nesta versão** | — | — | — | — | — | AdMob (SDK presente, não inicializado) | — | `AdService.enabled` = `MYTHSTRIDE_ADS_ENABLED`, padrão `kDebugMode`; `MobileAds.instance.initialize()` só roda se ativo |

> `android/app/google-services.json` existe e o plugin `com.google.gms.google-services`
> é aplicado, mas **nenhum SDK do Firebase é compilado no aplicativo**. O arquivo
> fornece apenas a configuração de cliente OAuth usada pelo Google Sign-In. Isso
> foi verificado em `pubspec.lock`.

**Play mapping:** Device or other IDs → nothing to declare while ads are off.
Diagnostics (Crash logs) → depends on B8.

---

## 8. Purchases and advertising

| DADO | COLETADO? | COMPARTILHADO? | FINALIDADE | OBRIGATÓRIO/OPCIONAL | ORIGEM | ARMAZENAMENTO/DESTINO | SERVIÇO TERCEIRO | EXCLUSÃO DISPONÍVEL? | EVIDÊNCIA |
|---|---|---|---|---|---|---|---|---|---|
| Compras com dinheiro real | **Não nesta versão** | — | — | — | — | — | — | — | `kRealMoneyPurchasesEnabled = false` (`features/diamond_store/diamond_store_state.dart:108`); pacote `in_app_purchase` ausente; verificação de recibo lança `NotImplementedException` |
| Registros de compra (tabela existente) | Estrutura existe, sem fluxo ativo | Não | Histórico de transação, obrigações legais | — | — | Banco MythStride | — | **Anonimizado**, não apagado | `AccountDataEraser.AnonymizePurchaseRecordsAsync`; `AccountDeletion:PreservePurchaseRecordsDays` |
| Anúncios exibidos | **Não nesta versão** | — | — | — | — | — | AdMob (SDK incluído, desligado) | — | `lib/services/ad_service.dart`; `scripts/build_android_rehearsal.ps1` passa `MYTHSTRIDE_ADS_ENABLED=false` |
| Recompensa por anúncio | Recurso presente no código, inerte sem anúncios | — | Recompensa opcional | Opcional | — | Banco MythStride | AdMob | — | `RewardedAdService`, `AdRewardService.cs`. Verificação server-side ausente — ver R4 |

**Play mapping:** Financial info → nothing to declare while real-money
purchases are off. "Contains ads" → see B6 before answering.

---

## 9. Third-party recipients (consolidated)

| Serviço | Papel | Dados que recebe | Situação na versão atual | Política |
|---|---|---|---|---|
| Google (Sign-In, Play services, Wear Data Layer) | Terceiro | Identificador da conta Google, dados técnicos, mensagens celular↔relógio | Ativo | https://policies.google.com/privacy |
| Strava | Terceiro | Autorização da conta; devolve atividades de corrida | Opcional, ativado pelo jogador | https://www.strava.com/legal/privacy |
| Resend | Processador | E-mail e conteúdo da mensagem | Ativo | https://resend.com/legal/privacy-policy |
| Cloudflare | Processador | Dados de conexão (IP, metadados da requisição) | Ativo | https://www.cloudflare.com/privacypolicy/ |
| Sentry | Processador | Mensagem de erro e stack trace, sem PII por configuração | Condicional (B8) | https://sentry.io/privacy/ |
| Google AdMob | Terceiro | Nada nesta versão | SDK incluído, desligado | https://policies.google.com/technologies/ads |
| GitHub Pages | Processador | Dados de conexão de quem acessa o site | Ativo (site) | https://docs.github.com/pt/site-policy/privacy-policies/github-general-privacy-statement |
| Infraestrutura própria (API, banco, Ollama) | Controlador | Todos os dados descritos acima | Ativo | n/a — sem provedor externo de IA |

---

## 10. Deletion summary for the Data safety form

- **Users can request that their data be deleted:** yes — public web resource at
  `https://playmythstride.com/pt-BR/delete-account/` (plus `/en/` and `/es/`),
  with e-mail verification and no login required, and an in-app path under
  *Legal, privacidade e conta*.
- **Users can request that their account be deleted:** yes — same flow.
- **Data that survives deletion:** security-audit records and purchase records,
  both anonymized, plus support correspondence and aggregated event results.
- **Blocking condition:** a player who leads a guild must transfer or close it
  first (`AccountDeletionService.ResolveBlockedReasonAsync`).
- **Caveat:** erasure only actually runs when
  `AccountDeletion:ExecuteIrreversibleDeletion` is `true` — see **B1** in
  `PLAY_STORE_OWNER_ACTIONS.md`.
