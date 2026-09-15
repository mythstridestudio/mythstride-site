# MYTHSTRIDE WEBSITE FINALIZATION HANDOFF

**Data da auditoria:** 2026-09-14
**Branch:** `main`
**Commit (HEAD):** `5fa9cfe71e239233d646b1924d68d294e7dd352a`
**Worktree:** `D:\projetos\MythstrideSite` — **SUJO.** `src/content/site.ts` tem alteração não commitada (104 inserções / 550 deleções)
**Framework:** Next.js 16.3.5 · React 19.2.8 · TypeScript 5 · Tailwind 4 · framer-motion ^12.40.0 · `output: "export"` (site 100% estático)
**Domínio:** https://playmythstride.com (GitHub Pages, `public/CNAME` = `playmythstride.com`)
**Deploy:** `.github/workflows/deploy.yml` em push para `main`

---

## ⛔ ACHADO CRÍTICO — LEIA ANTES DE QUALQUER COISA

**O projeto local NÃO COMPILA. `npm run build` falha com 13 erros de TypeScript.**

O arquivo `src/content/site.ts` foi reescrito no worktree (não commitado) para uma versão de marketing limpa — **a copy nova é boa e deve ser aproveitada** — mas o schema de chaves mudou e os componentes não foram atualizados junto.

### Chaves REMOVIDAS que o código ainda consome

| Chave removida | Consumida em | Erro |
|---|---|---|
| `section.vision` | `ModernHomePage.tsx:157,158,159` | TS2339 |
| `section.safety` | `ModernHomePage.tsx:586,587,588` | TS2339 |
| `section.roadmap` | `ModernHomePage.tsx:631,632,633` | TS2339 |
| `footer.comingSoon` | `LocalizedFooter.tsx:79,82,85` | TS2339 |
| `footer.draftNote` | `LocalizedFooter.tsx:93` | TS2339 |

### Chaves NOVAS que ninguém consome ainda

`section.privacy`, `section.beta` — existem no `site.ts` novo, nenhum componente lê.

### Observações

- O `site.ts` novo também **removeu os tipos** `SiteCopy` e o import de `PublicLocale`, passando a `as const`. Isso é o que faz o TS inferir literais e acusar as chaves ausentes.
- O commit `5fa9cfe` (que está no ar) **compila normalmente**. O site em produção está íntegro. **O que está quebrado é só a árvore local.**
- Reproduzir: `npm run typecheck`

**Consequência prática:** nada pode ser publicado até isso ser resolvido. Ou completa-se a migração das 5 chaves, ou reverte-se `site.ts`. A copy nova é melhor que a antiga para campanha paga — recomenda-se **completar a migração**, não reverter.

---

## 1. OBJETIVO DA V1 PÚBLICA — CONFRONTO COM O ESTADO ATUAL

As decisões fechadas foram usadas como critério. Resumo do desalinhamento:

| Decisão fechada | Estado atual | Gravidade |
|---|---|---|
| Não parecer roadmap/documentação | 5 status públicos incl. "Planejado"/"Em desenvolvimento"; seção Roadmap na Home; "Relatório de campo" no Hero | **P0** |
| Sem "rascunho/draft" público | 8 páginas legais com banner "Rascunho técnico — não é política aprovada"; 3 links de rodapé rotulados "— rascunho" | **P0** |
| Sem "decisão pendente" | 15 campos legais não configurados renderizam "Decisão do responsável pendente" | **P0** |
| Sem "espaço reservado/captura futura" | 2 slots de screenshot com "Espaço reservado para captura validada" | **P0** |
| Site para tráfego pago | `/` é um seletor de idioma sem produto nem CTA | **P0** |
| 18+ | `minimumAge` não configurado; nenhum texto de idade no site | **P0** |
| Beta fechado é estágio comercial normal | Comunicado hoje como limitação ("Sem download público ou data prometida") | P1 |
| Não prometer iOS/Apple Watch | Cards presentes com status "Planejado" — não promete disponibilidade, mas expõe roadmap | P1 |
| Aethron não substitui saúde | **JÁ CORRETO** — texto explícito na Home e página dedicada | ✅ |
| Sem inventar números/parceiros | **JÁ CORRETO** — nenhum número inventado encontrado | ✅ |

---

## 2. MAPA COMPLETO DAS ROTAS

Locales: `pt-BR`, `en`, `es` (`src/lib/locales.ts`). Default `pt-BR`. Padrão de URL: `/{locale}/{slug}/` com `trailingSlash: true`.

### 2.1 MARKETING

**ROTA:** `/`
**TIPO:** Página estática (seletor de idioma)
**INDEXÁVEL:** Sim (allow em `robots.ts`)
**IDIOMAS:** N/A (é a escolha)
**COMPONENTE/ARQUIVO:** `src/app/(default)/page.tsx` + `src/app/(default)/layout.tsx`
**FONTE DOS TEXTOS:** Hardcoded no JSX
**STATUS ATUAL:** Funcional
**PROBLEMAS:** **P0 para campanha.** É um interstício: logo, "Escolha seu idioma", 3 botões. Nenhuma proposta de valor, nenhum CTA de waitlist. Todo clique de anúncio que cair em `/` perde o usuário antes da mensagem. Textos: `"Escolha seu idioma"`, `"Entre em Elyndor."`, `"Choose your path."`, `"Elige tu camino."`

**ROTA:** `/pt-BR/`, `/en/`, `/es/`
**TIPO:** SSG (Home)
**INDEXÁVEL:** Sim
**IDIOMAS:** 3
**COMPONENTE/ARQUIVO:** `src/app/[locale]/page.tsx` → `src/components/site/ModernHomePage.tsx` (≈820 linhas)
**FONTE DOS TEXTOS:** `src/content/site.ts` (estrutura) + **63 triplas `text(pt,en,es)` inline no JSX** + `src/config/product-status.ts` (badges)
**STATUS ATUAL:** Quebrada no local (usa `section.vision/safety/roadmap`)
**PROBLEMAS:** ver §3, §4, §16

### 2.2 PRODUTO (`publicPageSlugs` — indexáveis, no sitemap)

Arquivo único: `src/app/[locale]/[page]/page.tsx` → `LocalizedContentPage`. Conteúdo: `src/content/pages.ts`.

| ROTA | INDEXÁVEL | STATUS | PROBLEMAS |
|---|---|---|---|
| `/{locale}/features/` | Sim | OK | Summary diz "veja o estado real de cada parte da experiência" — linguagem de status |
| `/{locale}/how-it-works/` | Sim | OK | "passa por validação" no summary |
| `/{locale}/aethron/` | Sim | OK | "em validação" no summary |
| `/{locale}/wear-os/` | Sim | OK | **Título contém "— ainda em validação"** |
| `/{locale}/events/` | Sim | OK | — |
| `/{locale}/community/` | Sim | OK | "segurança e moderação continuam evoluindo" |
| `/{locale}/closed-beta/` | Sim | OK | "O beta fechado **será** uma etapa de aprendizado" (futuro) |
| `/{locale}/faq/` | Sim | OK | Summary cita "roadmap" explicitamente |

### 2.3 SUPORTE / LEGAL (`draftPageSlugs` — **noindex + disallow**)

Todas passam por `LegalPageShell`, que injeta `LegalDraftNotice` no topo.
`noIndex: isDraftPageSlug(page)` em `[page]/page.tsx:37`. `robots.ts` faz `disallow` de todas.

| ROTA | INDEXÁVEL | PROBLEMAS |
|---|---|---|
| `/{locale}/support/` | **Não** | Banner de rascunho; "Nenhum endereço de contato foi inventado" |
| `/{locale}/privacy/` | **Não** | **P0** — eyebrow "Privacidade — rascunho"; "Não é uma política aprovada ou vigente". Plataformas de anúncio exigem política acessível e indexável |
| `/{locale}/terms/` | **Não** | eyebrow "Termos — rascunho" |
| `/{locale}/community-guidelines/` | **Não** | eyebrow "Diretrizes — rascunho" |
| `/{locale}/purchases/` | **Não** | eyebrow "Monetização futura — rascunho" |
| `/{locale}/ai-transparency/` | **Não** | eyebrow "Aethron — rascunho de transparência". Home linka para cá ("Ler a transparência de IA") → link para página noindex |
| `/{locale}/third-party-services/` | **Não** | eyebrow "Terceiros — rascunho" |
| `/{locale}/delete-account/` | **Não** (`noIndex: true` explícito) | **P0** — Google Play exige URL de exclusão de conta **publicamente acessível**. Rota própria: `src/app/[locale]/delete-account/page.tsx` |
| `/{locale}/delete-account/confirm/` | **Não** | Renderiza `LegalDraftNotice` |

### 2.4 AUTENTICAÇÃO / ADMIN / PERFIS (internos)

`robots.ts` faz disallow de `/login/`, `/dashboard/`, `/admin/`, `/player/`.

| ROTA | ARQUIVO | OBSERVAÇÃO |
|---|---|---|
| `/login/` | `src/app/(internal)/login/page.tsx` | Login de testador; linkado no nav público (`copy.nav.tester`) |
| `/dashboard/` | `src/app/(internal)/dashboard/page.tsx` + `dashboard-shell.tsx` | Requer auth |
| `/admin/events/` | `src/app/(internal)/admin/events/page.tsx` + `admin-events-page.tsx` | **72 ocorrências de termos de status** — é ferramenta interna, não afeta marketing, mas está no bundle público |
| `/player/` | `src/app/(internal)/player/page.tsx` | Busca de jogador |
| `/player/[username]/` | `public-player-profile-page.tsx` | Único gerado: `/player/profile-preview-disabled` |

### 2.5 OUTRAS

| ROTA | ARQUIVO |
|---|---|
| `/sitemap.xml` | `src/app/sitemap.ts` — só `publicPageSlugs` × 3 locales |
| `/robots.txt` | `src/app/robots.ts` |
| `/manifest.webmanifest` | `src/app/manifest.ts` |
| `/404`, not-found | `src/app/global-not-found.tsx` |

---

## 3. COPY COMPLETA DA HOME

**Ordem visual real conforme `ModernHomePage.tsx`.** Fonte: `S` = `src/content/site.ts`, `J` = inline no JSX.

### NAV — `LocalizedNavigation.tsx` · fonte `S` (`nav`)

| Chave | PT-BR | EN | ES |
|---|---|---|---|
| product | Recursos | Features | Funciones |
| how | Como funciona | How it works | Cómo funciona |
| events | Eventos | Events | Eventos |
| community | Comunidade | Community | Comunidad |
| aethron | Aethron | Aethron | Aethron |
| integrations | Integrações | Integrations | Integraciones |
| beta | Beta fechado | Closed beta | Beta cerrada |
| faq | Perguntas frequentes | FAQ | Preguntas frecuentes |
| join | Entrar na lista do beta | Join the beta list | Unirme a la lista de la beta |
| tester | Login de testador | Beta tester login | Acceso para participantes |
| skip | Pular para o conteúdo | Skip to content | Saltar al contenido |

### HERO — `PageHero.tsx` · fonte `S` (`hero`)

- **eyebrow** — PT: `BETA FECHADO PARA ANDROID` · EN: `ANDROID CLOSED BETA` · ES: `BETA CERRADA PARA ANDROID`
- **H1** — PT: `Corra no mundo real. Progrida em outro.` · EN: `Run in the real world. Progress in another.` · ES: `Corre en el mundo real. Progresa en otro.`
- **body** — PT: `MythStride transforma suas corridas em progresso de RPG. Complete missões, enfrente chefes, conquiste recompensas e construa sua jornada em Elyndor — movida pela distância que você percorre no mundo real.` · EN: `MythStride turns your runs into RPG progression. Complete quests, face bosses, earn rewards, and build your journey through Elyndor — powered by the distance you cover in the real world.` · ES: `MythStride convierte tus carreras en progreso de RPG. Completa misiones, enfréntate a jefes, consigue recompensas y construye tu viaje por Elyndor, impulsado por la distancia que recorres en el mundo real.`
- **CTA primário** — PT: `Entrar na lista do beta` → `#join`
- **CTA secundário** — PT: `Descobrir o MythStride` → `#how`
- **note** — PT: `O acesso ao beta é realizado por convite para dispositivos Android compatíveis.`

**HERO ASIDE — `HeroFieldReport` (`ModernHomePage.tsx:782-815`) · fonte `J`** ⛔ **P0**

- aria-label: `Estado do beta` / `Beta status` / `Estado de la beta`
- topo: `Relatório de campo` / `Field report` / `Informe de campo`
- `Android primeiro` / `Android first` / `Android primero`
- 4 `FeatureStatusBadge`: `bossBattles`, `runTracking`, `aethron`, `wearOs`
- rodapé: `Sem download público ou data prometida.` / `No public download or promised release date.` / `Sin descarga pública ni fecha de lanzamiento prometida.`

### SEÇÃO 1 · VISÃO / STATUS LEDGER ⛔ **P0 — usa `section.vision`, chave REMOVIDA**

`ModernHomePage.tsx:156-177`. Renderiza `status-ledger` com 5 `FeatureStatusBadge detailed`: `bossBattles`, `strava`, `raids`, `ios`, `diamondPurchases`. É literalmente um quadro de status de desenvolvimento.

### SEÇÃO 2 · FLOW — "Da corrida ao RPG" · `S` (`section.flow`) + `J`

- eyebrow PT `CORRIDA ENCONTRA RPG` · title PT `Cada quilômetro faz a sua história avançar.` · body PT `No MythStride, correr não termina quando a atividade é salva. Sua distância alimenta missões, progressão, batalhas e conquistas dentro de Elyndor.`
- EN: `RUNNING MEETS RPG` / `Every kilometer moves your story forward.` / `In MythStride, a run does not end when the activity is saved. Your distance fuels quests, progression, battles, and achievements across Elyndor.`
- ES: `CARRERA Y RPG` / `Cada kilómetro hace avanzar tu historia.` / `En MythStride, la carrera no termina al guardar la actividad. Tu distancia impulsa misiones, progreso, batallas y logros dentro de Elyndor.`

**JourneySteps (`J`):**

| # | PT | EN | ES |
|---|---|---|---|
| 01 título | Registre a corrida | Record the run | Registra la carrera |
| 01 corpo | Acompanhe uma atividade no Android ou traga dados de uma integração compatível. | Track an activity on Android or bring data from a compatible integration. | Registra una actividad en Android o incorpora datos de una integración compatible. |
| 02 título | Converta em progresso | Convert it into progress | Conviértela en progreso |
| 02 corpo | Distância elegível alimenta missões, chefes e o avanço do personagem. | Eligible distance fuels quests, bosses and character progression. | La distancia elegible impulsa misiones, jefes y el progreso del personaje. |
| 03 título | Construa sua lenda | Build your legend | Construye tu leyenda |
| 03 corpo | Recompensas, conquistas e relações registram uma identidade compartilhável. | Rewards, achievements and relationships create a shareable identity. | Las recompensas, los logros y las relaciones crean una identidad que puedes compartir. |

CTA: `Entender o ciclo completo` / `Explore the complete loop` / `Explorar el ciclo completo`

### SEÇÃO 3 · INTERFACE — galeria de screenshots · `S` (`section.interface`) + `J`

- eyebrow PT `SUA JORNADA` · title PT `Seu progresso ganha forma.` · body PT `Acompanhe corridas, evolução, batalhas, equipamentos e conquistas em uma experiência criada para conectar performance real e fantasia.`
- EN: `YOUR JOURNEY` / `Your progress takes shape.` · ES: `TU VIAJE` / `Tu progreso cobra forma.`

**3 slots (`ScreenshotGallery` → `ScreenshotFrame`):**

| Slot | feature | Imagem | Caption PT | ⛔ |
|---|---|---|---|---|
| `Registro da atividade` / `Activity tracking` / `Registro de actividad` | runTracking | **VAZIO** | `A captura final será publicada após a validação da build.` | **P0** |
| `Inventário do herói` / `Hero inventory` / `Inventario del héroe` | inventory | `inventory-{locale}.webp` | `Sem números de teste, preços fictícios ou promessas de loja.` | P1 |
| `Ranking da semana` / `Weekly ranking` / `Clasificación semanal` | weeklyRanking | **VAZIO** | `Apenas dados aprovados serão usados na apresentação pública.` | **P0** |

Label dos vazios (`ModernHomePage.tsx:42`): `Espaço reservado para captura validada` / `Reserved for a validated product capture` / `Espacio reservado para una captura validada`

alt do inventário: `Inventário do MythStride mostrando equipamentos obtidos, com raridade e estado de conservação.`

### SEÇÃO 4 · BATTLE — "Conflitos de Elyndor" · `S` (`section.battle`) + `J`

- eyebrow PT `BATALHAS DE ELYNDOR` · title PT `Sua distância se transforma em poder.` · body PT `As corridas elegíveis contribuem para o dano contra chefes. Cada encontro conecta o esforço realizado no mundo real ao avanço da sua jornada em Elyndor.`

| Card | feature | PT título | PT corpo |
|---|---|---|---|
| 1 | bossBattles | Chefes mundiais | Converta movimento validado em dano e avance encontros do beta. |
| 2 | raids | Raids | Desafios coletivos de maior escala permanecem no desenvolvimento do universo. |
| 3 | sagas | Sagas sazonais | Arcos narrativos conectarão eventos, chefes e consequências futuras. |

EN: `World bosses` / `Turn validated movement into damage and advance beta encounters.` · `Raids` / `Larger collective challenges remain in active universe development.` · `Seasonal sagas` / `Narrative arcs will connect events, bosses and future consequences.`
ES: `Jefes mundiales` / `Convierte el movimiento validado en daño y avanza en los encuentros de la beta.` · `Los desafíos colectivos de mayor escala siguen en desarrollo dentro del universo.` · `Sagas de temporada` / `Los arcos narrativos conectarán eventos, jefes y consecuencias futuras.`

### SEÇÃO 5 · REWARDS — "Recompensas e identidade" · `S` (`section.rewards`) + `J`

- eyebrow PT `PROGRESSÃO` · title PT `Construa uma jornada que é só sua.` · body PT `Equipamentos, itens, conquistas, ouro e relíquias registram sua evolução. Cada recompensa conquistada se torna parte da identidade do seu personagem.`

| Card | feature | PT | corpo PT |
|---|---|---|---|
| 1 | inventory | Inventário | Equipamentos e itens obtidos pelo ciclo de progressão do beta. |
| 2 | achievements | Conquistas | Marcos reconhecem consistência, exploração e participação. |
| 3 | founderSword | Espada de Fundador | **Uma relíquia de identidade ainda em validação para participantes elegíveis.** ⛔ |
| 4 | diamondPurchases | Diamantes | Moeda virtual sem valor monetário real. Compras não estarão ativas no beta. (link → `/purchases`) |

EN card 3: `An identity relic still under validation for eligible participants.`
ES card 3: `Una reliquia de identidad aún en validación para participantes elegibles.`

### SEÇÃO 6 · COMMUNITY · `S` (`section.community`) + `J`

- eyebrow PT `AVANCE JUNTO` · title PT `Toda jornada pode ser pessoal. Nenhuma precisa ser solitária.` · body PT `Conecte-se com outros jogadores, acompanhe rankings, participe de grupos e compartilhe conquistas dentro do universo MythStride.`

| Card | feature | PT | corpo PT |
|---|---|---|---|
| 1 | friends | Amigos | Convites e conexões aproximam pessoas sem expor dados de treino por padrão. |
| 2 | groups | Grupos e governança | Papéis e administração apoiam comunidades pequenas no beta. |
| 3 | weeklyRanking | Ranking semanal | Uma cadência compartilhada mede participação dentro das regras do beta. (link → `/community`) |

### SEÇÃO 7 · AETHRON · `S` (`section.aethron`) + `J`

- eyebrow PT `GUARDIÃO DA CHAMA` · title PT `Aethron transforma progresso em narrativa.` · body PT `Aethron é o companheiro narrativo do MythStride. Ele utiliza contexto da sua jornada para conectar corridas, progresso e acontecimentos de Elyndor em uma experiência mais pessoal.`
- Painel (`J`): badge `aethron` detailed + H3 `Companheiro narrativo, não profissional de saúde` / `Narrative companion, not a health professional` / `Compañero narrativo, no profesional de la salud`
- corpo ⛔: `Aethron usa contexto selecionado do produto para gerar mensagens. O escopo do provedor, a retenção e o uso de dados para treinamento ainda exigem decisões formais.` (EN/ES equivalentes)
- CTA: `Ler a transparência de IA` → `/ai-transparency` (**página noindex**)

### SEÇÃO 8 · INTEGRATIONS · `S` (`section.integrations`) + `J`

- eyebrow PT `CORRA DO SEU JEITO` · title PT `Do celular ao pulso.` · body PT `MythStride foi criado para acompanhar a corrida onde ela acontece. No Android, a experiência conecta registro de atividade, progressão e o universo de Elyndor.`

| Card | feature | corpo PT |
|---|---|---|
| Strava | strava | Importação e reconciliação de atividades passam por validação. |
| Wear OS | wearOs | A experiência no relógio depende de testes em aparelhos físicos. |
| iOS | ios | Uma plataforma planejada para uma fase posterior ao beta Android. |
| Apple Watch | appleWatch | A experiência de relógio da Apple permanece no roadmap. |

### SEÇÃO 9 · SAFETY ⛔ **P0 — usa `section.safety`, chave REMOVIDA** (`ModernHomePage.tsx:586`)

| Card | feature | PT | corpo PT |
|---|---|---|---|
| 1 | accountDeletion | Controle de conta | **`O fluxo de exclusão está em implementação. A página atual é apenas informativa e não recebe solicitações.`** ⛔ **FALSO** — ver §8 |
| 2 | communitySafety | Denúncia e bloqueio | Ferramentas e critérios de moderação ainda estão sendo concluídos. |

### SEÇÃO 10 · ROADMAP ⛔ **P0 — usa `section.roadmap`, chave REMOVIDA** (`ModernHomePage.tsx:631`)

`RoadmapCard` × 3, cada um com `FeatureStatusBadge`:

| # | feature | PT | corpo PT |
|---|---|---|---|
| 01 | runTracking | Preparar a build Android | Configuração final, integridade do registro e testes físicos. |
| 02 | wearOs | Validar integrações | Wear OS e Strava com dados reais de teste autorizados. |
| 03 | ios | Expandir plataformas | iOS e Apple Watch depois dos aprendizados do beta. |

CTA: `Ver o plano do beta` / `View the beta plan` / `Ver el plan de la beta`

**Esta seção inteira é o "diário de desenvolvimento" que a V1 quer eliminar.**

### SEÇÃO 11 · LORE — "Crônicas de Elyndor" · `S` (`section.lore`) + `J`

- eyebrow PT `CRÔNICAS DE ELYNDOR` · title PT `Aethron despertou quando a Chama quase se apagou.` · body PT `Elyndor não caiu em uma única guerra. Sob a Névoa, propósito e memória começaram a desaparecer. Cada Strider que retorna ao caminho fortalece a resistência e mantém a Chama acesa.`

| # | PT | corpo PT |
|---|---|---|
| I | A Névoa | Ela cresce onde o caminho é abandonado e a vontade perde forma. |
| II | Aethron | Guardião desperto para lembrar que cada retorno alimenta a Chama. |
| III | Os Striders | Corredores que transformam disciplina real em resistência para Elyndor. |

EN: `The Mist` / `It grows where the path is abandoned and purpose loses its shape.` · `A keeper awakened to remind us that every return feeds the Flame.` · `The Striders` / `Runners who turn real discipline into resistance for Elyndor.`
ES: `La Niebla` / `Crece donde se abandona el camino y la voluntad pierde su forma.` · `Un guardián despierto para recordar que cada regreso alimenta la Llama.` · `Los Striders` / `Corredores que convierten la disciplina real en resistencia para Elyndor.`

### SEÇÃO 12 · FAQ · `S` (`section.faq`) + `FaqAccordion`

- eyebrow PT `MYTHSTRIDE` · title PT `Perguntas frequentes` · body PT `Tudo o que você precisa saber sobre o MythStride e o beta fechado.`
- 5 perguntas hardcoded em `ModernHomePage.tsx:52-134`:

| # | PT pergunta | PT resposta |
|---|---|---|
| 1 | O MythStride já está disponível para download? | Ainda não. O primeiro acesso será um beta fechado para Android, distribuído conforme a capacidade de testes e a compatibilidade dos aparelhos. |
| 2 | Toda corrida vira uma batalha? | A proposta é validar a atividade e converter distância elegível em progresso de RPG. As regras e integrações ainda passam por validação antes da abertura do beta. |
| 3 | Aethron oferece orientação médica ou de treino? | Não. Aethron é um companheiro narrativo e motivacional. O conteúdo pode conter erros e não substitui profissionais de saúde, diagnóstico, tratamento ou plano de treinamento. |
| 4 | Haverá compras ou anúncios no beta? | Compras com dinheiro real e anúncios recompensados não estarão ativos nesta fase. Diamantes existem como elemento de progressão, sem valor monetário real. |
| 5 | iPhone e Apple Watch serão compatíveis? | iOS e Apple Watch estão planejados, mas não fazem parte da primeira fase. Android, Wear OS e a validação com Strava vêm antes. |

(EN e ES completos em `ModernHomePage.tsx:80-133`)
CTA: `Abrir todas as respostas` → `/faq`

### SEÇÃO 13 · WAITLIST (`id="join"`) · `S` (`section.waitlist` + `waitlist`)

- eyebrow PT `ENTRE PARA A PRIMEIRA GERAÇÃO` · title PT `Sua jornada pode começar aqui.` · body PT `Entre na lista do beta fechado e tenha a oportunidade de explorar Elyndor entre os primeiros jogadores do MythStride.`
- EN: `JOIN THE FIRST GENERATION` / `Your journey can begin here.` · ES: `ÚNETE A LA PRIMERA GENERACIÓN` / `Tu viaje puede comenzar aquí.`
- Copy completa do formulário em §9.

### FOOTER · `LocalizedFooter.tsx` — ver §17

---

## 4. TEXTO DE BASTIDOR QUE CHEGA AO USUÁRIO

285 ocorrências dos termos buscados em arquivos que renderizam. Distribuição: `pages.ts` 94 · `admin-events-page.tsx` 72 (interno) · `ModernHomePage.tsx` 26 · `product-status.ts` 12 · `LocalizedFooter.tsx` 8 · `LegalDraftNotice.tsx` 7 · `ScreenshotGallery.tsx` 5 · `RoadmapCard.tsx` 5 · `LocalizedContentPage.tsx` 5 · `LegalPageShell.tsx` 5 · `delete-account/confirm/page.tsx` 4 · `legal.ts` 3 · `robots.ts` 3 · `ScreenshotFrame.tsx` 2 · `[page]/page.tsx` 2.

### As que mais importam

**ARQUIVO:** `src/components/site/LegalDraftNotice.tsx` · **LINHA:** 6-17
**ROTA/SEÇÃO:** Topo das 8 páginas legais + `/delete-account/confirm`
**TEXTO:** PT `Rascunho técnico — não é política aprovada` / `Este conteúdo registra a estrutura prevista e as decisões ainda pendentes. Ele precisa de revisão jurídica e aprovação do responsável antes de entrar em vigor.` · EN `Technical draft — not an approved policy` / `This content records the intended structure and decisions that are still pending. It requires legal review and owner approval before taking effect.` · ES `Borrador técnico — no es una política aprobada` / `Este contenido registra la estructura prevista y las decisiones aún pendientes. Requiere revisión jurídica y aprobación del responsable antes de entrar en vigor.`
**COMO CHEGA:** `LegalPageShell.tsx:24` renderiza incondicionalmente; `delete-account/confirm/page.tsx:86` também.

**ARQUIVO:** `src/config/legal.ts` · **LINHA:** 131-139 (`getLegalDisplayValue`)
**ROTA/SEÇÃO:** `<dl class="pending-fields">` em todas as seções com `pendingFields`
**TEXTO:** PT `Decisão do responsável pendente` · EN `Owner decision pending` · ES `Decisión pendiente del responsable`
**COMO CHEGA:** `LegalPageShell.tsx:69`. **Como nenhuma env legal está definida, os 15 campos caem no fallback.** 22 blocos `pendingFields` nas 3 línguas.

**ARQUIVO:** `src/config/product-status.ts` · **LINHA:** 10-100
**ROTA/SEÇÃO:** Todo `FeatureStatusBadge` — Home (≈20), todas as páginas de conteúdo, galeria, roadmap
**TEXTO:** ver §5 (tabela completa dos 5 status × 3 idiomas)
**COMO CHEGA:** `FeatureStatusBadge.tsx:33-38`

**ARQUIVO:** `src/components/site/ModernHomePage.tsx` · **LINHA:** 42
**TEXTO:** `Espaço reservado para captura validada` / `Reserved for a validated product capture` / `Espacio reservado para una captura validada`
**COMO CHEGA:** `ScreenshotFrame` quando `image` é undefined → 2 dos 3 slots.

**ARQUIVO:** `src/components/site/ModernHomePage.tsx` · **LINHA:** 266, 302
**TEXTO:** `A captura final será publicada após a validação da build.` · `Apenas dados aprovados serão usados na apresentação pública.`
**COMO CHEGA:** `figcaption` dos slots vazios.

**ARQUIVO:** `src/components/site/ModernHomePage.tsx` · **LINHA:** 600
**TEXTO:** `O fluxo de exclusão está em implementação. A página atual é apenas informativa e não recebe solicitações.`
**COMO CHEGA:** Card "Controle de conta" na seção Safety. **Contradiz o comportamento real** (§8).

**ARQUIVO:** `src/components/site/ModernHomePage.tsx` · **LINHA:** 789, 793, 809
**TEXTO:** `Estado do beta` (aria-label) · `Relatório de campo` · `Sem download público ou data prometida.`
**COMO CHEGA:** `HeroFieldReport`, aside do Hero — primeira dobra.

**ARQUIVO:** `src/components/site/LocalizedFooter.tsx` · **LINHA:** 33-56
**TEXTO:** `Privacidade — rascunho`, `Termos — rascunho`, `Diretrizes — rascunho`, `Compras futuras`
**COMO CHEGA:** Coluna Legal do rodapé, em todas as páginas.

**ARQUIVO:** `src/components/site/LocalizedFooter.tsx` · **LINHA:** 79-86, 93
**TEXTO:** `Instagram · {comingSoon}`, `Discord · {comingSoon}`, `YouTube · {comingSoon}`, `{draftNote}`
**COMO CHEGA:** Coluna Social + base do rodapé. **As chaves não existem mais → erro de build.**

**ARQUIVO:** `src/content/pages.ts` — eyebrows com "rascunho": linhas dos blocos `privacy`, `terms`, `community-guidelines`, `purchases`, `ai-transparency`, `third-party-services` (× 3 idiomas).
**ARQUIVO:** `src/content/pages.ts` — `wear-os` **título**: `Wear OS acompanha o caminho — ainda em validação.`

---

## 5. SISTEMA DE FEATURE STATUS

### 5.1 Os 5 status (`src/config/product-status.ts`)

| Status | PT label | PT description |
|---|---|---|
| `beta` | Disponível no beta | A funcionalidade está presente na build do beta e continua sujeita a ajustes. |
| `validation` | Em validação | A implementação existe, mas ainda depende de testes, configuração ou aceite antes da disponibilidade ampla. |
| `development` | Em desenvolvimento | A funcionalidade faz parte da visão do produto e ainda está sendo completada. |
| `planned` | Planejado | A funcionalidade está no roadmap e ainda não está disponível no beta atual. |
| `future` | Disponível futuramente | A funcionalidade será considerada em uma fase posterior e não está ativa agora. |

EN: `Available in beta` · `Under validation` · `In development` · `Planned` · `Coming later`
ES: `Disponible en la beta` · `En validación` · `En desarrollo` · `Planificado` · `Disponible más adelante`

### 5.2 Os 20 recursos cadastrados

| Feature | Status | Feature | Status |
|---|---|---|---|
| runTracking | validation | aethron | validation |
| bossBattles | beta | strava | validation |
| inventory | beta | wearOs | validation |
| achievements | beta | founderSword | **validation** |
| events | beta | accountDeletion | validation |
| friends | beta | raids | development |
| groups | beta | sagas | development |
| weeklyRanking | beta | communitySafety | development |
| ios | planned | rewardedAds | future |
| appleWatch | planned | diamondPurchases | future |

### 5.3 Onde os badges aparecem

- **`FeatureCard.tsx:32`** — badge **obrigatório**, prop `feature` é required. Todos os cards da Home.
- **`RoadmapCard.tsx:21`** — badge obrigatório.
- **`ScreenshotFrame.tsx:57`** — badge obrigatório no `figcaption`.
- **`LegalPageShell.tsx:46-52`** — badge quando `section.feature` existe (18 features distintas × 3 idiomas em `pages.ts`).
- **`ModernHomePage.tsx:163-179`** — `status-ledger`, 5 badges `detailed`.
- **`ModernHomePage.tsx:803-808`** — `HeroFieldReport`, 4 badges.
- **`ModernHomePage.tsx`** — `JourneyStep` (3), painel Aethron (1).

### 5.4 Componentes que ASSUMEM badge obrigatório

`FeatureCard`, `RoadmapCard`, `ScreenshotFrame` — todos com `feature: ProductFeature` **required**. Remover o badge do marketing exige mexer nas assinaturas ou tornar a prop opcional. `IntegrationCard.tsx` — verificar assinatura antes de alterar.

**Contagem estimada de badges numa única carga de `/pt-BR/`: ~20.**

---

## 6. PÁGINAS DE CONTEÚDO — CABEÇALHOS PT-BR

Estrutura por página: `eyebrow`, `title`, `summary`, `sections[]` (cada seção: `title`, `paragraphs[]`, `bullets?`, `feature?`, `pendingFields?`).
Dicionários: `ptBR` linhas 84-786 · `en` 787-1489 · `es` 1490-2191 de `src/content/pages.ts`.

| Rota | EYEBROW | TÍTULO | SUMMARY |
|---|---|---|---|
| features | O universo do produto | Corrida, progressão e fantasia no mesmo caminho. | Conheça o ciclo completo do MythStride e veja o estado real de cada parte da experiência. |
| how-it-works | Da rua a Elyndor | Um ciclo simples para uma aventura profunda. | O movimento começa no mundo real, passa por validação e ganha significado dentro do RPG. |
| aethron | Guardião da Chama | Aethron dá voz à jornada, com limites claros. | Um companheiro narrativo e motivacional **em validação**, inspirado pela disciplina do jogador e pelo mundo de Elyndor. |
| wear-os | Integrações e plataformas | **Wear OS acompanha o caminho — ainda em validação.** | A experiência de relógio começa como extensão do Android e depende de testes físicos antes do beta. |
| events | Ritmo compartilhado | Eventos transformam semanas em capítulos. | Desafios do beta conectam atividade, chefes, recompensas e participação comunitária. |
| community | Jornada coletiva | Amigos e grupos tornam a constância compartilhável. | Conexões, governança, eventos e rankings fazem parte do beta; segurança e moderação continuam evoluindo. |
| closed-beta | Android primeiro | O beta fechado **será** uma etapa de aprendizado. | Entrar na lista registra interesse; não garante convite, data de acesso ou compatibilidade. |
| faq | Respostas diretas | O que saber antes de entrar na lista. | Disponibilidade, dados, Aethron, integrações e **roadmap** sem transformar planos em promessas ativas. |
| support | Estrutura de suporte | Ajuda **em preparação** para o beta. | Esta página registra os canais e processos que **precisam existir antes** do atendimento público. Nenhum endereço de contato foi inventado. |
| privacy | **Privacidade — rascunho** | Estrutura de tratamento de dados **em preparação**. | Este **documento técnico** organiza categorias, finalidades, direitos e **decisões pendentes**. **Não é uma política aprovada ou vigente.** |
| terms | **Termos — rascunho** | Regras de uso ainda **dependentes de aprovação**. | Esta estrutura descreve o contrato pretendido **sem afirmar que os termos já estão vigentes**. |
| delete-account | Controle de conta | Solicite a exclusão da sua conta por email. | Esta página envia um link de verificação por email para confirmar a titularidade da conta. Após a confirmação, a exclusão é agendada para 30 dias depois... |
| community-guidelines | **Diretrizes — rascunho** | Uma comunidade de fantasia ainda precisa de regras reais. | Esta estrutura registra comportamentos esperados, ferramentas futuras e **decisões de moderação ainda não aprovadas**. |
| purchases | **Monetização futura — rascunho** | Diamantes continuam no universo, sem compras reais no beta. | Diamantes são uma moeda virtual do MythStride. Compras com dinheiro real não estarão ativas durante esta fase do beta. |
| ai-transparency | **Aethron — rascunho de transparência** | Conteúdo gerado com propósito narrativo e limites explícitos. | Esta página organiza as divulgações **necessárias antes da validação pública** de Aethron. |
| third-party-services | **Terceiros — rascunho** | Integrações exigem transparência antes da ativação ampla. | Esta estrutura identifica categorias de terceiros **sem inventar fornecedores, hospedagem ou termos ainda não aprovados**. |

**BADGES/STATUS:** 18 features distintas referenciadas em `pages.ts` — mais usadas: `aethron` (21×), `runTracking` (15×), `diamondPurchases` (12×), `wearOs`/`communitySafety`/`bossBattles` (9× cada).

**PENDING FIELDS — blocos por idioma (linhas do dicionário pt-BR):**
`404` → `[supportEmail, legalEntityName]` · `437` → (lista) · `482` → (lista) · `492` → `[minimumAge, privacyEmail]` · `507` → (lista) · `575` → `[supportEmail, privacyEmail]` · `623` → `[supportEmail]` · `651` → `[purchaseRetentionPolicy]` · `658` → `[diamondDeletionPolicy, purchaseRetentionPolicy]` · `723` → (lista) · `770` → (lista). Espelhados em `en` (1107+) e `es` (1810+). **Total: 33 blocos.**

**METADATA/SEO:** `title: "${content.title} | MythStride"`, `description: content.summary`. As 8 páginas draft recebem `noIndex: true`. **Logo, os títulos com "rascunho" viram `<title>` e `og:title`.**

---

## 7. LEGAL E EMPRESA

### 7.1 Dados configurados — evidência

Todos os 15 campos de `src/config/legal.ts` vêm de `process.env`. **Envs presentes no projeto:** `.env.example`, `.env.local`, `.env.production` contêm **exclusivamente** `NEXT_PUBLIC_API_BASE_URL`. `deploy.yml` injeta apenas `NEXT_PUBLIC_API_BASE_URL` e `NEXT_PUBLIC_BASE_PATH`.

| Dado | Campo | Situação |
|---|---|---|
| Razão social | `legalEntityName` / `MYTHSTRIDE_LEGAL_ENTITY_NAME` | **NÃO CONFIRMADO NO PROJETO** |
| Nome fantasia | — | **NÃO CONFIRMADO NO PROJETO** (só a marca "MythStride" em textos) |
| CNPJ | `cnpj` / `MYTHSTRIDE_CNPJ` | **NÃO CONFIRMADO NO PROJETO** |
| País | — | **NÃO CONFIRMADO NO PROJETO** |
| Cidade/UF | — | **NÃO CONFIRMADO NO PROJETO** |
| Endereço comercial | `businessAddress` | **NÃO CONFIRMADO NO PROJETO** |
| Email geral | — | **NÃO CONFIRMADO NO PROJETO** |
| Email de suporte | `supportEmail` | **NÃO CONFIRMADO NO PROJETO** |
| Email de privacidade | `privacyEmail` | **NÃO CONFIRMADO NO PROJETO** |
| Email jurídico | — | **NÃO CONFIRMADO NO PROJETO** |
| Responsável/controlador | `privacyContact` | **NÃO CONFIRMADO NO PROJETO** |
| Data de vigência | `effectiveDate` | **NÃO CONFIRMADO NO PROJETO** |
| Idade mínima | `minimumAge` | **NÃO CONFIRMADO NO PROJETO** |
| Jurisdição | — | **NÃO CONFIRMADO NO PROJETO** |
| Prazo de exclusão | `accountDeletionPeriod` | **NÃO CONFIRMADO NO PROJETO** como env — **mas "30 dias" está hardcoded** em `site.ts` (`confirmScheduled`) e em `pages.ts` (summary de delete-account) |
| Retenção | `dataRetentionSchedule` | **NÃO CONFIRMADO NO PROJETO** |
| Provedor de IA | `aiProviderStatement` | **NÃO CONFIRMADO NO PROJETO** |
| Uso de dados p/ treino | `aiDataTrainingStatement` | **NÃO CONFIRMADO NO PROJETO** |
| Retenção de compras | `purchaseRetentionPolicy` | **NÃO CONFIRMADO NO PROJETO** |
| Diamantes após exclusão | `diamondDeletionPolicy` | **NÃO CONFIRMADO NO PROJETO** |

**Único domínio de serviço confirmado:** `https://api.mythstride.app` (API). **Único domínio do site:** `playmythstride.com`.

### 7.2 Decisão 18+ — onde aplicar

Hoje **não existe nenhum texto de idade renderizado**. O único ponto é o campo `minimumAge`, vazio, exibido como "Decisão do responsável pendente".

Pontos onde 18+ precisará entrar:
1. `src/config/legal.ts` → `minimumAge` (via env `MYTHSTRIDE_MINIMUM_AGE`, ou passar a constante no código)
2. `src/content/pages.ts` → bloco `pendingFields: ["minimumAge", "privacyEmail"]` (pt-BR linha ~492, en ~1195, es ~1898) — hoje é a única menção
3. `src/content/pages.ts` → `terms` (elegibilidade) e `privacy` (base legal / dados de menores)
4. `src/components/WaitlistForm.tsx` → declaração 18+ no disclosure antes do submit
5. `src/content/site.ts` → `waitlist.disclosure` (3 idiomas)
6. `src/content/pages.ts` → `closed-beta` (requisito de participação)

---

## 8. EXCLUSÃO DE CONTA — COMPORTAMENTO REAL

**A página ACEITA solicitações hoje.** Isto contradiz o texto da Home.

### Arquivos

| Arquivo | Papel |
|---|---|
| `src/app/[locale]/delete-account/page.tsx` | Rota; `noIndex: true`; renderiza `LocalizedContentPage` + `AccountDeletionRequestForm` |
| `src/app/[locale]/delete-account/confirm/page.tsx` | Rota de confirmação; renderiza `LegalDraftNotice` + `AccountDeletionConfirmClient` |
| `src/components/site/AccountDeletionRequestForm.tsx` | Formulário (email + honeypot) |
| `src/components/site/AccountDeletionConfirmClient.tsx` | Lê token e confirma |
| `src/lib/api/account-deletion.ts` | Cliente HTTP real |
| `src/lib/api/endpoints.ts` | `requestLink: "/api/account-deletion/request-link"`, `confirmLink: "/api/account-deletion/confirm-link"` |
| `src/lib/account-deletion-contract.ts` | **Contrato legado, `active: false`, sem implementação** — não é o caminho usado |

### Respostas objetivas

- **Aceita solicitação hoje?** **SIM.** `AccountDeletionRequestForm` chama `requestAccountDeletionLink(email)`.
- **Endpoint?** `POST {NEXT_PUBLIC_API_BASE_URL}/api/account-deletion/request-link` e `POST .../confirm-link`. Base: `https://api.mythstride.app`.
- **Verificação por email?** **SIM** — envia link de verificação; resposta não-enumerante ("Caso exista uma conta associada a esse email...").
- **Confirmação por token?** **SIM.** Documentado em `api/account-deletion.ts`: *"The confirmation token travels only in the URL fragment (never sent to a server on navigation) and this module never logs or persists it."*
- **Cancelamento?** **NÃO IMPLEMENTADO NO SITE.** Nenhum endpoint ou UI de cancelamento.
- **Status?** **NÃO IMPLEMENTADO NO SITE.** Não há consulta de status.
- **Prazo implementado/configurado?** **30 dias, hardcoded** em `site.ts` (`confirmScheduled` e `confirmAwaitingRetention`, 3 idiomas) e no summary de `pages.ts`. **O env `accountDeletionPeriod` está vazio** → nas páginas legais o mesmo prazo aparece como "Decisão do responsável pendente". **Contradição interna.**
- **Exclusão definitiva?** O site diz "agendada para 30 dias". Não afirma definitividade. Comportamento do backend **NÃO CONFIRMADO NO PROJETO**.
- **Retenção?** `dataRetentionSchedule` vazio → "Decisão do responsável pendente".
- **Rate limit?** O cliente trata **HTTP 429** → `rateLimited` ("Muitas tentativas. Aguarde alguns minutos e tente novamente."). O limite em si é do backend, **NÃO CONFIRMADO NO PROJETO**.

### Mensagens (pt-BR, de `site.ts.accountDeletion`)

`formTitle` Solicitar exclusão de conta · `formIntro` Informe o email da conta. Se existir uma conta associada, enviaremos um link de verificação. · `emailLabel` Email da conta · `submit` Solicitar exclusão · `loading` Enviando... · `requested` Caso exista uma conta associada a esse email, enviaremos as próximas instruções. · `invalidEmail` Informe um email válido. · `rateLimited` Muitas tentativas. Aguarde alguns minutos e tente novamente. · `unavailable` Não foi possível processar a solicitação agora. Tente novamente mais tarde. · `confirmChecking` Verificando o link de confirmação... · `confirmMissingToken` Este link de confirmação está incompleto. Solicite um novo link de exclusão. · `confirmScheduled` **Verificação concluída. A exclusão foi agendada para 30 dias.** · `confirmAwaitingRetention` (idêntico) · `confirmGenericSuccess` Verificação concluída. · `confirmInvalid` Este link é inválido ou já expirou. Solicite um novo link de exclusão. · `confirmRateLimited` Muitas tentativas... · `confirmUnavailable` Não foi possível confirmar agora. Tente novamente mais tarde. · `backToRequest` Solicitar novo link

(EN e ES completos em `src/content/site.ts`.)

### ⛔ CONTRADIÇÕES CONFIRMADAS

1. **Home × realidade** — `ModernHomePage.tsx:600` afirma *"O fluxo de exclusão está em implementação. A página atual é apenas informativa e não recebe solicitações."* **É falso.** O formulário funciona e chama a API.
2. **Prazo** — "30 dias" afirmado em Home/delete-account × "Decisão do responsável pendente" nas páginas legais para o mesmo campo.
3. **Acessibilidade** — `noIndex: true` + `disallow` em robots. **Google Play exige URL de exclusão publicamente acessível.**
4. **FAQ** — não cobre exclusão de conta. Sem contradição, mas é lacuna.

---

## 9. WAITLIST / LISTA DO BETA

**Arquivos:** `src/components/WaitlistForm.tsx`, `src/lib/api/waitlist.ts`, `src/lib/api/endpoints.ts`, `src/lib/api/client.ts`.

- **Campos:** `name` (opcional, maxLength 120, `autoComplete="name"`), `email` (required, maxLength 320, `type=email`, `inputMode=email`), `website` (**honeypot**, `tabIndex={-1}`, `aria-hidden`).
- **Validações (cliente):** regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`; email ≤ 320; nome ≤ 120; email normalizado (`trim().toLowerCase()`). `noValidate` no form — validação é só a própria.
- **Anti-spam:** honeypot. Se `website` preenchido → **finge sucesso** (`setStatus("success")`) sem chamar a API.
- **Endpoint:** `POST {NEXT_PUBLIC_API_BASE_URL}/api/waitlist` → `https://api.mythstride.app/api/waitlist`
- **Payload:** `{ email, name?, language: "pt"|"en"|"es", source: "website" }`
- **Idiomas:** mapa `pt-BR→pt`, `en→en`, `es→es`. **`source` é fixo `"website"`** — não há distinção de campanha.
- **Rate limit:** **NÃO CONFIRMADO NO PROJETO** (nada tratado no cliente; só 409 → duplicado).
- **Duplicidade:** HTTP 409 **ou** mensagem contendo `already|duplicate|exists|inscrito|cadastrado` → `alreadyJoined`.
- **Privacidade:** `<Link href={localePath(locale, "/privacy")}>` — **aponta para página noindex/disallow marcada como rascunho**.
- **Depois do cadastro:** apenas troca de mensagem inline. **Sem página de obrigado, sem evento de conversão, sem próximo passo.**

### Copy atual (`site.ts.waitlist`)

| Chave | PT-BR | EN | ES |
|---|---|---|---|
| name | Nome (opcional) | Name (optional) | Nombre (opcional) |
| email | Email | Email | Email |
| submit | Entrar na lista do beta | Join the beta list | Unirme a la lista de la beta |
| loading | Enviando... | Sending... | Enviando... |
| disclosure | Usaremos seu email e informações técnicas necessárias para administrar a lista, prevenir abuso e entrar em contato sobre o beta. | We will use your email and the technical information needed to manage the list, prevent abuse, and contact you about the beta. | Usaremos tu email y la información técnica necesaria para administrar la lista, prevenir abusos y contactarte sobre la beta. |
| capacity | O cadastro na lista não garante convite imediato. As vagas são liberadas de acordo com a capacidade do beta e a compatibilidade do dispositivo. | Joining the list does not guarantee an immediate invitation. Places are released according to beta capacity and device compatibility. | Registrarte no garantiza una invitación inmediata. Las plazas se liberan según la capacidad de la beta y la compatibilidad del dispositivo. |
| privacyLink | Consulte nossa Política de Privacidade | Read our Privacy Policy | Consulta nuestra Política de Privacidad |
| success | Você está na lista. Avisaremos por email quando houver uma oportunidade de participar do beta. | You are on the list. We will email you when there is an opportunity to join the beta. | Ya estás en la lista. Te avisaremos por email cuando haya una oportunidad de participar en la beta. |
| duplicate | Este email já está na lista do beta. | This email is already on the beta list. | Este email ya está en la lista de la beta. |
| invalid | Informe um email válido. | Enter a valid email address. | Introduce un email válido. |
| failure | Não foi possível acessar a lista agora. Tente novamente. | The list is unavailable right now. Please try again. | No se pudo acceder a la lista. Inténtalo de nuevo. |
| honeypot | Não preencha este campo | Leave this field empty | Deja este campo vacío |

### O que precisa mudar para campanha paga

1. **`source` fixo** — não dá para atribuir origem/campanha. Precisa aceitar UTM.
2. **Sem evento de conversão** — nenhum pixel/GA4/Meta no projeto (nenhum script de analytics encontrado).
3. **Privacidade linkada é "rascunho" e noindex** — reprovável na revisão de anúncio.
4. **Sem 18+** no disclosure.
5. **Sem menção à Espada do Fundador** como benefício — hoje o formulário não dá motivo para entrar.
6. **`capacity`** reforça que não garante nada, imediatamente antes do submit — texto defensivo em ponto de conversão.
7. **Sem página/estado de obrigado** com próximo passo.

### Espada do Fundador — ocorrências

| Arquivo:linha | Conteúdo |
|---|---|
| `ModernHomePage.tsx:396` | `feature="founderSword"` |
| `ModernHomePage.tsx:397` | `icon={<MythGlyph glyph="founderSword" />}` |
| `ModernHomePage.tsx:399-401` | Títulos `Espada de Fundador` / `Founder Sword` / `Espada de Fundador` |
| `ModernHomePage.tsx:403` | `Uma relíquia de identidade ainda em validação para participantes elegíveis.` |
| `product-status.ts:115` | `founderSword: "validation"` |
| `pages.ts:116 / 819 / 1522` | `...enquanto a Espada de Fundador segue em validação.` |
| `lib/relic-frames.ts:170-176` | Glyph `founderSword` → `/assets/mythstride/icons/founder_sword.png` |
| `lib/api/public-player.ts:42` | `iconUrl: "/images/optimized/founder-sword.webp"` ⚠️ **arte diferente** |

**Existe asset real? SIM** — ver §14.
**Aparece perto do CTA? NÃO** — está na seção 5, o formulário na 13.

---

## 10. INVENTÁRIO VISUAL COMPLETO

73 arquivos de imagem em `public/`. Categorias:

### LOGO / BRANDING / ICONS
| CAMINHO | FORMATO | DIM | USO | TIPO |
|---|---|---|---|---|
| `public/icon.png` | PNG | 512×512 | `manifest.ts` | ÍCONE — **402KB, pesado** |
| `public/apple-icon.png` | PNG | 180×180 | `manifest.ts` | ÍCONE |
| `public/favicon.ico` | ICO | — | favicon | ÍCONE — **180KB, pesado** |
| `public/images/optimized/app-icon.webp` | WebP | 192×192 | `LocalizedFooter.tsx:64`, `(default)/page.tsx` | ÍCONE |

### OG/SEO
| CAMINHO | FORMATO | DIM | USO | TIPO |
|---|---|---|---|---|
| `public/images/social/mythstride-og.jpg` | JPG | 1200×630 | `metadata.ts` — OG + Twitter, **todas as rotas** | ARTE — **inspecionada: boa.** Logo MythStride em ouro/brasa, corredor silhuetado, fundo de câmara de fantasia. On-brand. Composição é um card quadrado centralizado com sangria lateral |

### HERO / BACKGROUNDS
| CAMINHO | DIM | USO | TIPO |
|---|---|---|---|
| `public/images/optimized/hero-desktop.webp` | 1536×1024 | CSS (background do hero) | ARTE |
| `public/images/optimized/hero-mobile.webp` | 900×1200 | CSS | ARTE |
| `public/images/optimized/aethron-scroll-bg.webp` | 1200×900 | CSS | ARTE |

### BOSSES
| CAMINHO | DIM | USO | TIPO |
|---|---|---|---|
| `public/images/boss-medals/*.webp` (18 arquivos) | 384×384 | `MythBossMedal` via `lib/boss-medals.ts`; Home usa `dragao_ancestral` | ARTE — Ciclope, aranha_rainha, arpia, cavaleiro_caido, cerberus, colosso_de_pedra, dragao_ancestral, fenix, golem_ferro, guardiao_da_forja, hidra, kraken, lich_do_abismo, medusa, minotaura, minotauro_de_guerra, rei_do_vazio, serpe_tempestuosa |
| `public/images/optimized/boss-arpia.webp` | 720×720 | **não referenciado em `src/`** | ARTE |
| `public/images/optimized/boss-dragao.webp` | 720×720 | **não referenciado em `src/`** | ARTE |
| `public/images/optimized/boss-lich.webp` | 720×720 | **não referenciado em `src/`** | ARTE |

### FOUNDER SWORD
| CAMINHO | DIM | USO | TIPO |
|---|---|---|---|
| `public/assets/mythstride/icons/founder_sword.png` | 256×256 | Home card, via `MYTH_GLYPHS.founderSword` | ARTE — **lâmina ciano homologada** (do pack do app) |
| `public/images/optimized/founder-sword.webp` | 640×640 | `lib/api/public-player.ts:42` | ARTE — **espada flamejante laranja, weapon DIFERENTE** ⚠️ |

### GLYPHS / ÍCONES DO PACK (`public/assets/mythstride/icons/`)
| CAMINHO | DIM | ONDE | TIPO |
|---|---|---|---|
| `achievements.png` | 384×384 | Home "Conquistas" | ARTE (tile opaco, emoldurado) |
| `aethron_sigil.png` | 256×256 | Home painel Aethron | ARTE (recorte) |
| `diamonds.png` | 96×96 | Home "Diamantes" | ARTE (recorte) |
| `founder_sword.png` | 256×256 | Home "Espada de Fundador" | ARTE (recorte) |
| `inventory_backpack.png` | 96×96 | Home "Inventário" | ARTE (recorte) |
| `raid_active.png` | 256×256 | Home "Raids" | ARTE (recorte) |
| `run_outdoor.png` | 256×256 | Home passo 01 | ARTE (recorte) |
| `saga_threat.png` | 256×256 | Home "Sagas sazonais" | ARTE (recorte) |
| `season_champion.png` | 256×256 | Home passo 03 + "Ranking semanal" | ARTE (tile opaco, emoldurado) |
| `social.png` | 96×96 | Home "Amigos" | ARTE (recorte) |

### MOLDURAS RELIC (`public/assets/mythstride/relic/`)
7 arquivos nine-slice @2x: `buttons/primary_frame` (600×154), `buttons/secondary_frame` (236×64), `cards/card_frame_clean_landscape` (600×120), `energy/hp_hud_frame` (600×16), `medallions/boss_seat` (150×146), `surfaces/panel_standard` (480×208), `topbar/top_bar_frame` (600×76). Consumidos por `lib/relic-frames.ts` + `RelicFrame.tsx`.

### LIXO DO TEMPLATE (remover)
`public/next.svg` (394×80), `public/vercel.svg`, `public/window.svg`, `public/globe.svg`, `public/file.svg` — **sobras do template Next.js, não referenciadas.**

### ELYNDOR / LORE / RUNNING / WEAR OS / STRAVA / SHOP / RANKING
**NÃO EXISTE ASSET DEDICADO.** Lore usa ícones SVG desenhados (`MapIcon`, `MagicWandIcon`, `CrownIcon`); Strava/Wear OS/iOS/Apple Watch usam `SyncIcon`/`WatchIcon`/`StarIcon`.

---

## 11. SCREENSHOTS REAIS DISPONÍVEIS

**7 famílias × 3 idiomas = 21 arquivos**, todos `720×1560` WebP em `public/images/product/`.

| Família | pt-BR | en | es | Usada no site? | Tamanho |
|---|---|---|---|---|---|
| `aethron` | ✅ 97KB | ✅ 94KB | ✅ 96KB | **NÃO** | 720×1560 |
| `dashboard` | ✅ 136KB | ✅ 136KB | ✅ 136KB | **NÃO** | 720×1560 |
| `events` | ✅ 99KB | ✅ 97KB | ✅ 99KB | **NÃO** | 720×1560 |
| `friends` | ✅ 87KB | ✅ 83KB | ✅ 86KB | **NÃO** | 720×1560 |
| `groups` | ✅ 47KB | ✅ 44KB | ✅ 46KB | **NÃO** | 720×1560 |
| `inventory` | ✅ 68KB | ✅ 67KB | ✅ 68KB | **SIM** — `ModernHomePage.tsx:287` | 720×1560 |
| `shop-future` | ✅ 70KB | ✅ 71KB | ✅ 70KB | **NÃO** | 720×1560 |

**Todas as 7 famílias têm os 3 idiomas completos.** Origem: commit `40fa6cd` *"real device captures of MythStride"* — são capturas reais de dispositivo (1440×3120 reduzidas pela metade, razão do próprio aparelho).

**Dados de teste / informação pessoal:** **NÃO VERIFICADO VISUALMENTE NESTA AUDITORIA.** Sabe-se do histórico do projeto que a conta de demonstração precisa exibir o nome de usuário `MythStride` e não um nome pessoal. **Requer revisão visual humana antes de uso em anúncio.**

### SCREENSHOTS APROVÁVEIS AGORA
Sujeito à revisão visual de nome de usuário/dados:
- `inventory-{pt-BR,en,es}` — já em uso
- `dashboard-{pt-BR,en,es}` — 3 idiomas, maior peso (mais conteúdo)
- `events-{pt-BR,en,es}`
- `friends-{pt-BR,en,es}`
- `aethron-{pt-BR,en,es}`
- `groups-{pt-BR,en,es}`

### SCREENSHOTS QUE PRECISAM SER RECAPTURADOS
- Qualquer família cuja revisão visual encontre nome pessoal em vez de `MythStride`, ou métricas de teste.
- `shop-future-*` — nome sugere loja futura; com compras fora do beta, usar pode contradizer "compras não estarão ativas".

### SCREENSHOTS FALTANTES
- **Tela de registro/acompanhamento de atividade** — slot "Registro da atividade" vazio na Home. `[PRECISA SCREENSHOT REAL]`
- **Tela de ranking semanal** — slot "Ranking da semana" vazio na Home. `[PRECISA SCREENSHOT REAL]`

---

## 12. SLOTS VISUAIS SEM ASSET

### SLOT 1 — Registro da atividade
**ROTA:** `/{locale}/` · **SEÇÃO:** 3 (Interface) · **COMPONENTE:** `ScreenshotFrame` via `ScreenshotGallery` · **ARQUIVO:** `ModernHomePage.tsx:256-270`
**ASSET ATUAL:** nenhum — `EyeIcon` + texto "Espaço reservado para captura validada"
**PROBLEMA:** buraco visual na seção de prova de produto + texto de bastidor
**TIPO NECESSÁRIO:** captura de tela real · **ASPECT RATIO:** 720:1560 (≈9:19.5) · **DIMENSÃO:** 720×1560 · **TRANSPARÊNCIA:** não
**TEXTO NA IMAGEM:** UI do app no idioma; usuário deve ser `MythStride`; sem métricas de teste
**CAMINHO FINAL:** `public/images/product/run-tracking-{pt-BR,en,es}.webp`
**`[PRECISA SCREENSHOT REAL]`**

### SLOT 2 — Ranking da semana
**ROTA:** `/{locale}/` · **SEÇÃO:** 3 · **ARQUIVO:** `ModernHomePage.tsx:292-306`
**ASSET ATUAL:** nenhum · mesmo placeholder
**TIPO:** captura real · **720×1560** · sem transparência
**TEXTO NA IMAGEM:** ranking com nomes não pessoais
**CAMINHO FINAL:** `public/images/product/weekly-ranking-{pt-BR,en,es}.webp`
**`[PRECISA SCREENSHOT REAL]`**

### SLOT 3 — "Converta em progresso" (passo 02)
**ROTA:** `/{locale}/` · **SEÇÃO:** 2 · **ARQUIVO:** `ModernHomePage.tsx:201-209`
**ASSET ATUAL:** `<SwordsIcon className="icon-mock" />` · **comentário `// MOCK:` na linha 201**
**PROBLEMA:** ícone de linha genérico entre dois vizinhos com arte autorada
**TIPO:** glyph/ícone de arte · **1:1** · **256×256 PNG** · **transparência SIM**
**TEXTO NA IMAGEM:** nenhum
**CAMINHO FINAL:** `public/assets/mythstride/icons/progress_conversion.png`
**`[GERAR COM IA]`**

### SLOT 4 — "Grupos e governança"
**ROTA:** `/{locale}/` · **SEÇÃO:** 6 · **ARQUIVO:** `ModernHomePage.tsx:445-453`
**ASSET ATUAL:** `<ShieldIcon className="icon-mock" />` · **comentário `// MOCK:` na linha 445**
**PROBLEMA:** ícone genérico ao lado de `social.png` e `season_champion.png` reais
**TIPO:** glyph/ícone · **1:1** · **256×256 PNG** · **transparência SIM**
**CAMINHO FINAL:** `public/assets/mythstride/icons/guild.png`
**`[GERAR COM IA]`**

### SLOT 5 — Cards de integração (Strava, Wear OS, iOS, Apple Watch)
**ROTA:** `/{locale}/` · **SEÇÃO:** 8 · **ARQUIVO:** `ModernHomePage.tsx:528-580`
**ASSET ATUAL:** `SyncIcon`, `WatchIcon`, `StarIcon`, `WatchIcon`
**DECISÃO JÁ TOMADA:** marcas de plataforma permanecem genéricas. **NÃO GERAR.**

### SLOT 6 — Lore (A Névoa, Aethron, Os Striders)
**ROTA:** `/{locale}/` · **SEÇÃO:** 11 · **ARQUIVO:** `ModernHomePage.tsx` (bloco `lore-grid`)
**ASSET ATUAL:** `MapIcon`, `MagicWandIcon`, `CrownIcon` — tríptico esmeralda monocromático (há comentário no código explicando a decisão)
**PROBLEMA:** conceitos centrais do universo representados por ícones de UI
**TIPO:** 3 ilustrações do mesmo conjunto · **1:1** · **512×512** · transparência SIM
**CAMINHO FINAL:** `public/assets/mythstride/lore/{mist,aethron,striders}.png`
**`[GERAR COM IA]`** — P2 (o conjunto é coerente hoje; trocar 1 de 3 quebraria)

### SLOT 7 — Hero: `field-report__crest`
**ROTA:** `/{locale}/` · **SEÇÃO:** Hero aside · **ARQUIVO:** `ModernHomePage.tsx:800`
**ASSET ATUAL:** `<SwordsIcon />` genérico dentro do "Relatório de campo"
**PROBLEMA:** o bloco inteiro provavelmente sai (§16). Não gerar asset para ele antes da decisão de layout.

### SLOT 8 — `/` (seletor de idioma)
**ARQUIVO:** `src/app/(default)/page.tsx`
**ASSET ATUAL:** `app-icon.webp` 192×192 num painel vazio
**PROBLEMA:** primeira página que o tráfego pago vê, sem arte nem proposta
**TIPO:** composição promocional de fundo · **16:9** · **1920×1080 WebP** · sem transparência
**CAMINHO FINAL:** `public/images/optimized/gateway-bg.webp`
**`[GERAR COM IA]`** — só se a rota `/` for mantida como interstício

### SLOT 9 — Espada do Fundador junto ao CTA
**ROTA:** `/{locale}/` · **SEÇÃO:** 13 (waitlist) — **hoje inexistente**
**PROBLEMA:** o benefício da lista não é mostrado onde a conversão acontece
**TIPO:** arte promocional da espada · **1:1 ou 4:5** · **1024×1024** · transparência SIM
**CAMINHO FINAL:** `public/images/optimized/founder-sword-promo.webp`
**`[GERAR COM IA]`** — ver §14

---

## 13. MOCKS / TODOS NO CÓDIGO

Busca global por `MOCK|TODO|FIXME|placeholder|temporary|temp|fallback|revisit|revisar|future|later`. Ocorrências que afetam a apresentação pública:

| ARQUIVO:LINHA | Marcador | Conteúdo | Afeta público? |
|---|---|---|---|
| `ModernHomePage.tsx:201` | `// MOCK:` | `revisar quando existir asset dedicado para "progresso"` | **SIM** — ícone do passo 02 |
| `ModernHomePage.tsx:445` | `// MOCK:` | `revisar quando existir asset dedicado para "guilda"` | **SIM** — card Grupos |
| `lib/api/auth.ts:101` | `// TODO:` | `Revisit localStorage token storage if the backend later supports httpOnly website sessions.` | Não (rota interna `/login`) |
| `ScreenshotFrame.tsx:18-23` | comentário | referencia `WEBSITE_SCREENSHOT_REQUIREMENTS.md`; explica placeholder | **SIM (indireto)** — governa os 2 slots vazios |
| `lib/account-deletion-contract.ts` | `active: false` | contrato legado sem implementação | Não (código morto) |
| `globals.css` (bloco MOCK MARKS) | comentário | `.icon-mock` — tratamento visual dos 2 mocks | **SIM** — estilo |

**Os 2 mocks previstos (progresso e grupos/guilda) estão CONFIRMADOS.** Não há outros mocks visuais no caminho público.

---

## 14. FOUNDER SWORD — AUDITORIA

### Assets existentes

| Caminho | Dim | Descrição visual (inspecionada) | Usado em |
|---|---|---|---|
| `public/assets/mythstride/icons/founder_sword.png` | 256×256 | **Lâmina ciano/azul** de duas pontas, gema azul central, 90% transparente. Do pack homologado (`assets/itens/mythstride_founder_sword.png` do app) | Home card, 52px |
| `public/images/optimized/founder-sword.webp` | 640×640 | **Espada flamejante laranja/vermelha**, lâmina com núcleo em brasa, guarda dourada | `lib/api/public-player.ts:42` como `iconUrl` do troféu Founder |

### ⚠️ Inconsistência confirmada

São **duas armas diferentes**. `src/lib/relic-frames.ts:170-176` documenta explicitamente:
> *"Note it is not `images/optimized/founder-sword.webp`, which is a different, fiery sword: the Founder mark is light on a cool ground (V100 / L44), and the homologated blade is the cyan one."*

A Home mostra a ciano (correta); o perfil público mostra a flamejante (incorreta).

### Tratamento visual atual na Home

O card tem halo ciano (`.myth-glyph-aura--founder`, `globals.css`) com os stops exatos do `MythFounderBladeSweep` do app (`#55CFFF → #E8FBFF → #75DFFF`), respirando em 4200ms, parado sob `prefers-reduced-motion`. Renderizado a **52px**.

### Conclusão obrigatória

**FOUNDER SWORD ASSET:** `public/assets/mythstride/icons/founder_sword.png` (256×256, ciano, homologado)
**APROVÁVEL:** **NÃO** — para uso promocional de campanha
**MOTIVO:** O asset é correto e bonito, mas é um **ícone de inventário de 256px renderizado a 52px num card secundário**. Para vender a Espada do Fundador como *o benefício* da lista do beta, é preciso uma peça promocional de herói — grande, com contexto e presença — não um ícone de 52px na quinta seção. Além disso, há a **contradição de duas espadas diferentes** no mesmo site, que precisa ser resolvida antes de qualquer promoção.
**MELHOR ASSET EXISTENTE:** `public/assets/mythstride/icons/founder_sword.png` (é a lâmina canônica; a `.webp` de 640px é outra arma e **não deve ser usada** para representar a Espada do Fundador)
**SE NÃO, ASSET QUE DEVE SER GERADO:** arte promocional da lâmina **ciano** homologada, 1024×1024 PNG transparente, em `public/images/optimized/founder-sword-promo.webp`, mantendo a assinatura ciano (`#55CFFF`/`#7DDCFF`) sobre fundo frio — **e correção de `public-player.ts:42`** para apontar para a lâmina certa. `[GERAR COM IA]`

---

## 15. AETHRON — AUDITORIA

### Assets

| Caminho | Dim | Tipo | Onde |
|---|---|---|---|
| `public/assets/mythstride/icons/aethron_sigil.png` | 256×256 | Sigilo autorado (ouro envelhecido, sol nascente, volutas, 89,5% transparente). Origem: `assets/aethron/sig_aethron_01.png` do app | Home, painel Aethron, 8rem dentro de losango rotacionado |
| `public/images/optimized/aethron-scroll-bg.webp` | 1200×900 | Fundo | CSS |
| `public/images/product/aethron-{pt-BR,en,es}.webp` | 720×1560 | **Captura real de tela** | **NÃO USADA NO SITE** |

**Existe também `assets/aethron/aethron_presence.png` no repositório do app — não copiado para o site.**

### Onde Aethron aparece

- **Home seção 7** — painel com sigilo + badge `aethron` (status "Em validação") + H3 + CTA "Ler a transparência de IA"
- **Home seção 11 (lore)** — `LoreCard` II com `MagicWandIcon` genérico (decisão documentada no código: tríptico monocromático)
- **Nav + rodapé** — link `/aethron`
- **`/{locale}/aethron/`** — página dedicada, indexável, eyebrow "Guardião da Chama"
- **`/{locale}/ai-transparency/`** — página **noindex**, eyebrow "Aethron — rascunho de transparência"
- **`pages.ts`** — 21 referências a `feature: "aethron"` (a mais citada do site)

### Textos de saúde — ✅ CORRETOS

- Home: `Companheiro narrativo, não profissional de saúde`
- FAQ 3: `Não. Aethron é um companheiro narrativo e motivacional. O conteúdo pode conter erros e não substitui profissionais de saúde, diagnóstico, tratamento ou plano de treinamento.`

### Textos internos indevidamente públicos — ⛔

- Home: `O escopo do provedor, a retenção e o uso de dados para treinamento ainda exigem decisões formais.` — expõe pendência interna
- `/ai-transparency` summary: `Esta página organiza as divulgações necessárias antes da validação pública de Aethron.`
- `legal.ts`: `aiProviderStatement` e `aiDataTrainingStatement` **não configurados** → "Decisão do responsável pendente"

### Conclusão

**AETHRON VISUAL:** **APROVÁVEL: SIM**
O sigilo autorado é forte, on-brand (ouro envelhecido), em resolução adequada (256px renderizado a 128px) e já está no lugar certo da página.
**O QUE FALTA:**
1. Usar as capturas `aethron-{locale}.webp` que já existem e estão paradas — prova visual gratuita.
2. Remover o badge "Em validação" e a frase sobre "decisões formais" do painel da Home.
3. Resolver o link para `/ai-transparency`: hoje a Home manda o usuário para uma página noindex rotulada "rascunho".
4. Definir `aiProviderStatement` / `aiDataTrainingStatement` — ou remover os campos da exibição pública.
5. Opcional (P2): copiar `aethron_presence.png` do app para uma peça de herói.

---

## 16. HERO — COMPOSIÇÃO ATUAL

**Arquivos:** `src/components/site/PageHero.tsx` + `ModernHomePage.tsx:145-158` (chamada) + `HeroFieldReport` em `ModernHomePage.tsx:782-815` + `globals.css`.

| Elemento | Conteúdo atual | Fonte |
|---|---|---|
| **background** | `hero-desktop.webp` (1536×1024) / `hero-mobile.webp` (900×1200) via CSS | `globals.css` |
| **artwork** | Nenhum artwork em primeiro plano | — |
| **eyebrow** | `BETA FECHADO PARA ANDROID` | `site.ts` |
| **H1** | `Corra no mundo real. Progrida em outro.` | `site.ts` |
| **descrição** | `MythStride transforma suas corridas em progresso de RPG...` | `site.ts` |
| **CTA primário** | `Entrar na lista do beta` → `#join` | `site.ts` |
| **CTA secundário** | `Descobrir o MythStride` → `#how` | `site.ts` |
| **nota** | `O acesso ao beta é realizado por convite para dispositivos Android compatíveis.` | `site.ts` (`hero.note`) |
| **aside** | `HeroFieldReport` | `J` |
| **Field Report** | rótulo `Relatório de campo`, `Android primeiro`, `SwordsIcon`, **4 badges**, `Sem download público ou data prometida.` | `J` |
| **FeatureStatusBadges** | `bossBattles`, `runTracking`, `aethron`, `wearOs` | `product-status.ts` |
| **mobile** | `aside` empilha abaixo do texto (grid → coluna única); background troca para `hero-mobile.webp` | `globals.css` |

### Para parecer LANDING DE RPG DE CORRIDA e não PAINEL DE STATUS

**Remover:**
1. **Todo o `HeroFieldReport`** (`ModernHomePage.tsx:782-815` + a prop `aside` na linha 155) — é o item que mais faz o Hero parecer dashboard interno. Rótulo "Relatório de campo" + aria-label "Estado do beta" + 4 badges de status.
2. **`Sem download público ou data prometida.`** — frase defensiva na primeira dobra.
3. **`hero.note`** (`O acesso ao beta é realizado por convite...`) — ou mover para perto do formulário, onde é uma condição e não uma ressalva de entrada.

**Substituir o aside por:** arte de produto (uma das capturas reais em moldura de aparelho) ou arte promocional de Elyndor/Espada do Fundador. As capturas `dashboard-{locale}.webp` existem e não são usadas.

**Manter:** eyebrow, H1, descrição, ambos os CTAs, os backgrounds.

**Nota:** o eyebrow `BETA FECHADO PARA ANDROID` **deve ficar** — beta fechado é o estágio comercial real e qualifica o tráfego.

---

## 17. FOOTER E REDES SOCIAIS

**Arquivo:** `src/components/site/LocalizedFooter.tsx`

### Marca
Logo `app-icon.webp` (48×48) + `MythStride` → `/{locale}/`
Tagline **hardcoded em inglês, em todas as línguas**: `Run in the real world. Progress in another.` ⚠️

### Coluna PRODUTO
| LABEL (PT / EN / ES) | URL | FUNCIONA | ROTA | IDIOMAS |
|---|---|---|---|---|
| Recursos / Features / Funciones | `/{locale}/features/` | ✅ | indexável | 3 |
| Como funciona / How it works / Cómo funciona | `/{locale}/how-it-works/` | ✅ | indexável | 3 |
| Eventos / Events / Eventos | `/{locale}/events/` | ✅ | indexável | 3 |
| Comunidade / Community / Comunidad | `/{locale}/community/` | ✅ | indexável | 3 |
| Aethron | `/{locale}/aethron/` | ✅ | indexável | 3 |
| Wear OS | `/{locale}/wear-os/` | ✅ | indexável | 3 |

### Coluna SUPORTE
| LABEL | URL | FUNCIONA | ROTA |
|---|---|---|---|
| Beta fechado / Closed beta / Beta cerrada | `/{locale}/closed-beta/` | ✅ | indexável |
| Dúvidas frequentes / FAQ / Preguntas frecuentes | `/{locale}/faq/` | ✅ | indexável |
| Suporte / Support / Soporte | `/{locale}/support/` | ✅ | **noindex + disallow** |
| Excluir conta / Delete account / Eliminar cuenta | `/{locale}/delete-account/` | ✅ | **noindex + disallow** |

### Coluna LEGAL ⛔
| LABEL | URL | FUNCIONA | ROTA |
|---|---|---|---|
| **Privacidade — rascunho** / Privacy — draft / Privacidad — borrador | `/{locale}/privacy/` | ✅ | **noindex + disallow** |
| **Termos — rascunho** / Terms — draft / Términos — borrador | `/{locale}/terms/` | ✅ | **noindex + disallow** |
| **Diretrizes — rascunho** / Guidelines — draft / Directrices — borrador | `/{locale}/community-guidelines/` | ✅ | **noindex + disallow** |
| Compras futuras / Future purchases / Compras futuras | `/{locale}/purchases/` | ✅ | **noindex + disallow** |
| Transparência de IA / AI transparency / Transparencia de IA | `/{locale}/ai-transparency/` | ✅ | **noindex + disallow** |
| Serviços de terceiros / Third-party services / Servicios de terceros | `/{locale}/third-party-services/` | ✅ | **noindex + disallow** |

### Coluna SOCIAL — REESCRITA EM `018abbd`

**A coluna Social foi REMOVIDA do rodapé.** O commit `018abbd` ("feat: launch institutional closed-beta website") apagou o bloco inteiro. Hoje o rodapé tem 4 filhos (marca + Produto + Suporte + Legal) e **o site não apresenta nenhuma presença social**.

O estado anterior (3 `<span class="footer-pending">` com "Disponível futuramente", sem link, e a classe `.footer-pending` **sem nenhuma regra CSS**) não existe mais.

#### Canais oficiais — decisão de produto

MythStride possui canais oficiais em **Instagram, YouTube e X**. Estado das URLs:

| PLATAFORMA | NOME | URL | ORIGEM | ÍCONE |
|---|---|---|---|---|
| **Instagram** | MythStride | `https://www.instagram.com/mythstride/` | **CONFIRMADA PELO PROPRIETÁRIO** (2026-09-14). Verificada: HTTP 200, canônica, sem redirecionamento | ❌ não existe |
| **YouTube** | MythStride | **URL NÃO CONFIRMADA NO PROJETO** | — | ❌ não existe |
| **X / Twitter** | MythStride | **URL NÃO CONFIRMADA NO PROJETO** | — | ❌ não existe |

**Regra a aplicar:** o rodapé final deve listar **apenas canais com URL confirmada**, como links reais (`target="_blank"` + `rel="noopener noreferrer"`) com `aria-label` próprio. **Proibido:** "Disponível futuramente", "Coming soon", "Próximamente", placeholder ou `href="#"`. Ordem pretendida: Instagram · YouTube · X.

**Com o estado atual, só o Instagram pode ser publicado.**

#### Resíduo morto a remover — `src/lib/translations/{pt,en,es}.json`

Linhas 581-592 dos três arquivos carregam um rodapé antigo que **nenhum componente renderiza** (`useTranslations` só é usado nas rotas `(internal)`; ninguém lê estas chaves), mas que **é importado por `src/lib/i18n.ts` e vai para o bundle**:

```json
"footerLinks": [
  { "label": "Privacidade", "href": "#" }, { "label": "Termos", "href": "#" },
  { "label": "Contato", "href": "#" }, { "label": "Kit de Imprensa", "href": "#" },
  { "label": "Suporte", "href": "#" }
],
"footerSocialLinks": [
  { "label": "Twitter / X", "href": "#" }, { "label": "Discord", "href": "#" },
  { "label": "Instagram", "href": "#" }, { "label": "TikTok", "href": "#" }
]
```

Contém **Discord e TikTok**, que estão fora da decisão atual, e 9 `href: "#"`. Remover os dois blocos nos 3 idiomas.

#### Impacto no layout ao reintroduzir a coluna

`.site-footer__grid` (`globals.css:2229`) é `1.35fr repeat(3, minmax(0, 1fr))` — **4 colunas para os 4 filhos atuais**. A cadeia responsiva é 4 → 3 (`:2467`) → 2 (`:2534`) → 1 (`:2570`). **Adicionar uma 5ª coluna exige alterar o CSS em todos os breakpoints**, senão o grid desalinha.

A chave `footer.social` (`"Social"` nos 3 idiomas) **ainda existe** em `src/content/site.ts:41,87,132` — está órfã e pronta para reuso como título da coluna.

#### Metadata social relacionada

- `src/lib/metadata.ts:80-85` — `twitter: { card, title, description, images }` **sem `site` nem `creator`**. Com o handle de X confirmado, adicionar `twitter.site`.
- `src/lib/structured-data.ts` — **sem `sameAs`**. É o campo canônico para declarar perfis oficiais ao Google. Candidato imediato: a URL do Instagram.
- ⚠️ Tanto `sameAs` quanto `twitter.site` **declaram publicamente que aqueles perfis são oficiais** — confirmar cada um antes de publicar.

#### Ícones

`src/components/Icons.tsx` tem 29 ícones, **nenhum de marca**. Serão necessários 3 SVGs (Instagram, YouTube, X). Precedente no projeto: `MythGlyph.tsx` documenta que ícone desenhado é legítimo onde o produto não tem arte autorada — é o caso, como já decidido para Strava/Wear OS.

### Base do rodapé
`© {ano} MythStride. {rights}` · `{draftNote}` ⛔ (chave inexistente) · `{language}: {localeLabels[locale]}`

### Links "#" / quebrados
Nenhum `href="#"`. Nenhum link quebrado. **O problema é o oposto: 3 redes sem URL nenhuma e 10 dos 16 links apontando para páginas noindex/disallow.**

---

## 18. SEO

### Global (`src/lib/metadata.ts`)
- `siteUrl`: `https://playmythstride.com`
- `metadataBase`: idem
- **canonical:** `localePath(locale, path)` — ex.: `/pt-BR/features/`
- **hreflang:** `pt-BR`, `en`, `es` + `x-default` → `/`
- **OG:** `type: website`, `siteName: MythStride`, locale mapeado (`pt_BR`/`en_US`/`es_ES`), `alternateLocale`, imagem `/images/social/mythstride-og.jpg` 1200×630 com alt localizado (`MythStride — corrida e progressão de RPG` / `— running and RPG progression` / `— carrera y progresión de RPG`)
- **Twitter:** `summary_large_image`, mesma imagem
- **robots:** `index/follow` ou, se `noIndex`, `index:false, follow:false, nocache:true`

### Por rota
| Rota | title | description | index |
|---|---|---|---|
| `/{locale}/` | de `site.ts` (via `[locale]/page.tsx`) | idem | ✅ |
| `/{locale}/{publicSlug}/` | `${content.title} \| MythStride` | `content.summary` | ✅ |
| `/{locale}/{draftSlug}/` | `${content.title} \| MythStride` | `content.summary` | ❌ noindex |
| `/{locale}/delete-account/` | idem | idem | ❌ `noIndex: true` |
| `/login`, `/dashboard`, `/admin`, `/player` | `createNoIndexMetadata` | — | ❌ |

### `robots.txt` (`src/app/robots.ts`)
```
allow:    /, /pt-BR/, /en/, /es/
disallow: /login/, /dashboard/, /admin/, /player/,
          + /{locale}/{support,privacy,terms,delete-account,
             community-guidelines,purchases,ai-transparency,
             third-party-services}/   (8 slugs × 3 locales = 24 paths)
sitemap:  https://playmythstride.com/sitemap.xml
host:     https://playmythstride.com
```

### `sitemap.xml` (`src/app/sitemap.ts`)
Só `publicPageSlugs`: `/` + 8 slugs × 3 locales = **27 URLs**. `changeFrequency` weekly (home) / monthly. `priority` 1.0 / 0.7. Com `alternates.languages`.

### `manifest.webmanifest`
`name: MythStride`, `short_name: MythStride`, `description: "Run in the real world. Progress in another."`, `start_url: /`, `display: standalone`, `background_color: #090706`, `theme_color: #17100c`, **`lang: "en"`** ⚠️ (site é pt-BR por padrão), ícones `/icon.png` 512 e `/apple-icon.png` 180.

### JSON-LD
`src/lib/structured-data.ts` → `getHomeStructuredData(locale)`, injetado em `ModernHomePage.tsx:134-143` via `dangerouslySetInnerHTML`. **Conteúdo não auditado em detalhe nesta passagem — revisar antes de publicar.**

### ⛔ Metadata contendo termos proibidos
| Rota | Fonte | Termo |
|---|---|---|
| `/{locale}/wear-os/` | `content.title` | **"ainda em validação"** no `<title>` e `og:title` — **página INDEXÁVEL** |
| `/{locale}/privacy/` | `content.eyebrow`/`title`/`summary` | "rascunho", "em preparação", "Não é uma política aprovada" (noindex, mas é o que o usuário lê) |
| `/{locale}/terms/` | idem | "rascunho", "dependentes de aprovação" |
| `/{locale}/community-guidelines/` | idem | "rascunho", "não aprovadas" |
| `/{locale}/purchases/` | idem | "Monetização futura — rascunho" |
| `/{locale}/ai-transparency/` | idem | "rascunho de transparência" |
| `/{locale}/third-party-services/` | idem | "Terceiros — rascunho" |
| `/{locale}/faq/` | `content.summary` | **"roadmap"** — **página INDEXÁVEL** |
| `/{locale}/features/` | `content.summary` | "estado real de cada parte" — **INDEXÁVEL** |

### Ausências
- **Nenhum script de analytics/pixel** no projeto (sem GA4, sem Meta Pixel, sem GTM).
- **Favicon pesado:** `favicon.ico` 180KB, `icon.png` 402KB.

---

## 19. CAMPANHA / CONVERSÃO — ANÁLISE ESTRUTURAL

### Funil atual

```
ANÚNCIO
  → /  (SELETOR DE IDIOMA — sem produto, sem CTA)   ⛔ vazamento
  → /{locale}/  HERO (H1 + 2 CTAs + Relatório de campo)
  → 12 seções
  → #join (WAITLIST, seção 13 de 13)
  → mensagem inline
```

### CTAs que levam ao formulário

| # | Origem | Destino |
|---|---|---|
| 1 | Nav — `copy.nav.join` (`LocalizedNavigation`) | `#join` |
| 2 | Hero — CTA primário | `#join` |
| 3 | Páginas de conteúdo públicas — `PageHero` primary | `/{locale}/#join` |

**Na Home: 2 CTAs diretos.** O secundário do Hero leva a `#how` (para dentro da página, não para conversão).

### Âncoras/IDs
- `#join` — seção waitlist
- `#how` — seção flow
- `#main-content` — skip link

### Posição do formulário
**Seção 13 de 13 — o último bloco antes do rodapé.** O usuário atravessa 12 seções (incluindo Roadmap, Safety, Lore e FAQ) antes de encontrar o campo de email.

### Distrações fortes antes da conversão
1. **`/` seletor de idioma** — antes mesmo da mensagem
2. **Hero "Relatório de campo"** — 4 badges de status na primeira dobra
3. **Status ledger (seção 1)** — 5 badges "detailed", bloco inteiro de status
4. **Seção Roadmap (10)** — 3 cards de plano de desenvolvimento
5. **Seção Safety (9)** — "não recebe solicitações", "ainda estão sendo concluídos"
6. **~20 badges de status** espalhados, vários dizendo "Em desenvolvimento"/"Planejado"

### Founder Sword perto do CTA?
**NÃO.** Está na seção 5; o formulário na 13. O texto atual (`ainda em validação`) o descreve como incerto, não como benefício.

### O sucesso explica o próximo passo?
**NÃO.** `success` = `Você está na lista. Avisaremos por email quando houver uma oportunidade de participar do beta.` Sem próximo passo, sem confirmação de email prometida, sem compartilhamento, sem página de obrigado, **sem evento de conversão rastreável**.

### Caminho fácil para Privacidade?
**Sim, mas problemático.** Link direto no disclosure do formulário → `/{locale}/privacy/`, que é **noindex, disallow, rotulada "rascunho" e diz "não é uma política aprovada ou vigente"**. Para revisão de anúncio (Google Ads/Meta), isto é um risco de reprovação.

---

## 20. DADOS QUE NÃO PODEMOS INVENTAR

O próximo editor **NÃO** deve inventar nenhum destes. Evidência: todos ausentes ou explicitamente vazios no código.

| Categoria | O que não inventar | Evidência |
|---|---|---|
| **Empresa** | Razão social, nome fantasia, CNPJ, endereço, cidade/UF, país, jurisdição | `legal.ts` — todos via env, nenhuma env definida |
| **Contatos** | Email de suporte, privacidade, jurídico, geral; telefone | `legal.ts`; `pages.ts` support: *"Nenhum endereço de contato foi inventado"* |
| **Datas** | Data de vigência de políticas; data de lançamento; data de abertura do beta | `effectiveDate` vazio; `hero.note` não promete data |
| **Números** | Usuários, downloads, avaliações, membros na lista, km percorridos | Nenhum número de tração existe no projeto — **não introduzir** |
| **Lojas** | Presença na Google Play / App Store; links de loja; badges "Disponível no Google Play" | Nenhum link de loja no projeto |
| **Parceiros** | Strava como parceiro oficial; qualquer marca como parceira | `strava: "validation"` — integração não validada |
| **Compatibilidade** | Lista de aparelhos; versão mínima de Android; suporte a iOS/Apple Watch | `ios`/`appleWatch` = `planned`; `hero.note` diz só "dispositivos Android compatíveis" |
| **IA** | Nome do provedor de IA (OpenAI, Anthropic, Google…); modelo; se dados treinam modelos | `aiProviderStatement` e `aiDataTrainingStatement` **vazios**; Home admite "ainda exigem decisões formais" |
| **Prazos** | Prazo de exclusão diferente de 30 dias; cronograma de retenção | "30 dias" hardcoded no site; `dataRetentionSchedule` vazio |
| **Política** | Que a política de privacidade está aprovada/vigente; base legal; DPO | `LegalDraftNotice` afirma o contrário hoje |
| **Monetização** | Preços de diamantes; pacotes; que compras existirão | `diamondPurchases: "future"`; `purchases` diz "sem compras reais no beta" |
| **Segurança** | Certificações, criptografia específica, conformidade LGPD/GDPR declarada | Nada no projeto |
| **Redes sociais** | URL de **YouTube** e **X/Twitter**; qualquer perfil de Discord, TikTok, Facebook, LinkedIn | Instagram **confirmado**: `https://www.instagram.com/mythstride/`. As demais **não confirmadas** — nenhuma URL existe em nenhum dos 4 repositórios. Não derivar handle a partir do nome "MythStride" |
| **Infra** | Hospedagem, sub-processadores, país dos servidores | `third-party-services`: *"sem inventar fornecedores, hospedagem ou termos"* |
| **Idade** | Que já existe verificação de idade implementada | `minimumAge` vazio; nenhum texto de idade no site |

---

## 21. ARQUIVOS QUE PRECISARÃO SER ALTERADOS

### COPY
- `src/content/site.ts` — ⛔ **crítico**: restaurar `footer.comingSoon`/`footer.draftNote` (ou remover o uso) e decidir `vision`/`safety`/`roadmap` × `privacy`/`beta`
- `src/content/pages.ts` — 16 páginas × 3 idiomas; eyebrows/títulos com "rascunho"; título do `wear-os`; summary do `faq` ("roadmap"); 33 blocos `pendingFields`
- `src/components/site/ModernHomePage.tsx` — 63 triplas inline; seções 1/9/10; `HeroFieldReport`; FAQ; texto falso de exclusão (linha 600)
- `src/components/site/LocalizedFooter.tsx` — labels "— rascunho"; tagline hardcoded em inglês; coluna Social

### VISUAL
- `src/components/site/ModernHomePage.tsx` — 2 slots de screenshot; 2 mocks (linhas 201, 445)
- `src/components/site/ScreenshotFrame.tsx` / `ScreenshotGallery.tsx` — placeholder e badge obrigatório
- `src/app/(default)/page.tsx` — a rota `/`
- `src/app/globals.css` — `.icon-mock`, `.draft-notice`, `.footer-pending`, `.status-badge*`, `.field-report*`
- `src/lib/relic-frames.ts` — novos glyphs (progresso, guilda)
- `src/lib/api/public-player.ts:42` — `iconUrl` aponta para a espada errada

### LEGAL
- `src/config/legal.ts` — 15 campos; fallback "Decisão do responsável pendente"
- `src/components/site/LegalDraftNotice.tsx` — **provavelmente deletar**
- `src/components/site/LegalPageShell.tsx` — remove o `LegalDraftNotice` e o `<dl class="pending-fields">`
- `src/app/[locale]/delete-account/confirm/page.tsx:86` — remove `LegalDraftNotice`
- `.env.production` / `deploy.yml` — injetar as envs legais, **incluindo `MYTHSTRIDE_MINIMUM_AGE=18`**

### SEO
- `src/app/robots.ts` — liberar `/privacy`, `/terms`, `/delete-account`, `/community-guidelines`, `/ai-transparency`, `/third-party-services`
- `src/app/[locale]/[page]/page.tsx:37` — `noIndex: isDraftPageSlug(page)`
- `src/app/[locale]/delete-account/page.tsx:27` — `noIndex: true`
- `src/app/sitemap.ts` — incluir legais
- `src/app/manifest.ts` — `lang: "en"` → `pt-BR`
- `src/lib/metadata.ts` — OG por rota (hoje uma imagem só)
- `src/lib/structured-data.ts` — auditar
- `src/content/pages.ts` — títulos que viram `<title>`

### WAITLIST
- `src/components/WaitlistForm.tsx` — 18+, UTM, evento de conversão, estado de sucesso
- `src/lib/api/waitlist.ts` — payload `source` fixo
- `src/content/site.ts` — bloco `waitlist` × 3 idiomas

### COMPONENTES
- `src/components/product/FeatureStatusBadge.tsx` — decidir destino
- `src/config/product-status.ts` — 20 features / 5 status
- `src/components/site/FeatureCard.tsx` — `feature` obrigatório
- `src/components/site/RoadmapCard.tsx` — **provavelmente deletar**
- `src/components/site/IntegrationCard.tsx`
- `src/components/site/LocalizedContentPage.tsx` — `isDraft` esconde CTA
- `src/components/site/PageHero.tsx` — prop `aside`

### CONFIG
- `.github/workflows/deploy.yml` — envs legais
- `.env.production`, `.env.example`
- `next.config.ts` — só se mudar estratégia de imagem

### OUTROS
- `public/next.svg`, `vercel.svg`, `window.svg`, `globe.svg`, `file.svg` — remover sobras do template
- `public/favicon.ico` (180KB), `public/icon.png` (402KB) — otimizar

---

## 22. ASSETS QUE PRECISAMOS PRODUZIR

| Prioridade | Asset | Motivo | Tipo | Tamanho | Transparente | Caminho sugerido | IA? |
|---|---|---|---|---|---|---|---|
| **P0** | Captura "Registro da atividade" | Slot vazio na seção de prova; texto de placeholder público | Screenshot | 720×1560 ×3 idiomas | Não | `public/images/product/run-tracking-{pt-BR,en,es}.webp` | **NÃO — `[PRECISA SCREENSHOT REAL]`** |
| **P0** | Captura "Ranking da semana" | Slot vazio | Screenshot | 720×1560 ×3 | Não | `public/images/product/weekly-ranking-{pt-BR,en,es}.webp` | **NÃO — `[PRECISA SCREENSHOT REAL]`** |
| **P1** | Arte promocional Espada do Fundador | Benefício da lista precisa de peça de herói junto ao CTA; hoje é ícone de 52px | Ilustração | 1024×1024 | Sim | `public/images/optimized/founder-sword-promo.webp` | **SIM `[GERAR COM IA]`** |
| **P1** | Glyph "progresso/conversão" | MOCK em `ModernHomePage.tsx:201` | Glyph | 256×256 PNG | Sim | `public/assets/mythstride/icons/progress_conversion.png` | **SIM `[GERAR COM IA]`** |
| **P1** | Glyph "guilda/grupos" | MOCK em `ModernHomePage.tsx:445` | Glyph | 256×256 PNG | Sim | `public/assets/mythstride/icons/guild.png` | **SIM `[GERAR COM IA]`** |
| **P1** | Arte de herói para o aside | Substitui o "Relatório de campo" removido | Composição | 1200×1200 | Sim | `public/images/optimized/hero-aside.webp` | **SIM `[GERAR COM IA]`** — *ou usar `dashboard-{locale}.webp`, que já existe* |
| **P2** | Fundo do gateway `/` | Só se `/` permanecer como interstício | Fundo | 1920×1080 | Não | `public/images/optimized/gateway-bg.webp` | **SIM `[GERAR COM IA]`** |
| **P2** | Lore: A Névoa / Aethron / Os Striders | Tríptico com ícones de UI genéricos | Ilustração ×3 | 512×512 | Sim | `public/assets/mythstride/lore/{mist,aethron,striders}.png` | **SIM `[GERAR COM IA]`** |
| **P2** | OG por rota | Hoje uma única imagem para tudo | Composição | 1200×630 | Não | `public/images/social/og-{slug}.jpg` | **SIM `[GERAR COM IA]`** |

### NÃO PRECISAMOS GERAR

- **OG principal** — `mythstride-og.jpg` (1200×630) inspecionada: forte e on-brand. Serve para lançar.
- **Hero backgrounds** — `hero-desktop.webp` / `hero-mobile.webp` adequados.
- **Medalhas de chefe** — 18 medalhas 384×384 prontas e consistentes.
- **Ícones do pack** — os 10 glyphs em `assets/mythstride/icons/` são arte autorada real do app.
- **Molduras RELIC** — 7 nine-slice completos.
- **Sigilo do Aethron** — autorado, adequado (§15).
- **Capturas de dashboard/events/friends/groups/aethron/inventory** — **21 arquivos reais já existem**; 18 deles nem estão em uso. **Usar antes de produzir qualquer coisa nova.**

---

## 23. CHECKLIST DE LANÇAMENTO

> Pergunta-guia: *"O que realmente impede colocar tráfego pago na lista de espera do MythStride?"*

### P0 — BLOQUEIA ANÚNCIO

1. **Consertar o build.** `npm run build` falha com 13 erros TS. Nada é publicável. (`site.ts` × `ModernHomePage.tsx` × `LocalizedFooter.tsx`)
2. **Remover `LegalDraftNotice`** — "Rascunho técnico — não é política aprovada" no topo de 8 páginas legais. Política de privacidade que se autodeclara não-vigente é risco de reprovação em Google Ads/Meta.
3. **Preencher ou remover os 15 campos legais** — hoje renderizam "Decisão do responsável pendente" publicamente. No mínimo: razão social, email de privacidade, email de suporte, data de vigência, idade mínima (**18**).
4. **Tornar `/privacy` acessível e indexável** — hoje `noindex` + `disallow` em `robots.ts`. Plataformas de anúncio exigem política de privacidade acessível.
5. **Tornar `/delete-account` publicamente acessível** — hoje `noIndex: true` + disallow. Exigência do Google Play.
6. **Corrigir a afirmação falsa sobre exclusão de conta** (`ModernHomePage.tsx:600`) — diz que a página "não recebe solicitações"; ela recebe.
7. **Remover rótulos "— rascunho" do rodapé** (3 links legais).
8. **Resolver a rota `/`** — seletor de idioma puro mata a conversão do tráfego pago. Redirecionar por idioma do navegador, ou transformar em landing.
9. **Preencher os 2 slots de screenshot vazios** ou remover os slots — hoje exibem "Espaço reservado para captura validada".
10. **Aplicar 18+** — nenhum texto de idade existe no site hoje.
11. **Retirar do Hero o "Relatório de campo"** — 4 badges de status na primeira dobra é a cara de painel de desenvolvimento que a V1 quer eliminar.

### P1 — DEVE ENTRAR NA V1

12. Retirar/reformular o **sistema de FeatureStatusBadge** no marketing (~20 badges, incluindo "Em desenvolvimento" e "Planejado").
13. Remover a **seção Roadmap** (10) e o **status ledger** (1).
14. **Usar as 18 capturas reais que já existem e estão paradas** — prova visual pronta, sem custo.
15. Revisar visualmente as 21 capturas: nome de usuário deve ser `MythStride`, sem dados pessoais ou métricas de teste.
16. Reescrever os **eyebrows/títulos com "rascunho"** em `pages.ts` (6 páginas × 3 idiomas).
17. Corrigir o **título indexável do `wear-os`** ("— ainda em validação" vai para o `<title>` e `og:title`).
18. Remover **"roadmap"** do summary indexável do `faq`.
19. **Espada do Fundador como benefício** perto do CTA — hoje "ainda em validação" na seção 5.
20. **Resolver a contradição das duas espadas** (`public-player.ts:42` usa a flamejante errada).
21. **Analytics/pixel de conversão** — não existe nenhum; sem isso não há como medir campanha.
22. **UTM/`source` na waitlist** — hoje `source: "website"` fixo.
23. **Estado de sucesso com próximo passo** no formulário.
24. Tagline do rodapé **hardcoded em inglês** em todas as línguas.
25. Coluna **Social** com 3 redes sem URL — remover ou publicar URLs reais.
26. `manifest.ts` `lang: "en"` → `pt-BR`.

### P2 — PODE VIR DEPOIS

27. Arte promocional dedicada da Espada do Fundador.
28. Glyphs para os 2 MOCKs (progresso, guilda).
29. Tríptico de lore ilustrado.
30. OG por rota.
31. Remover sobras do template (`next.svg`, `vercel.svg`, `window.svg`, `globe.svg`, `file.svg`).
32. Otimizar `favicon.ico` (180KB) e `icon.png` (402KB).
33. Auditar o JSON-LD.
34. 3 artes de chefe não referenciadas (`boss-arpia`, `boss-dragao`, `boss-lich`).

---

# FINAL HANDOFF

## 1. O que já está pronto

- **Infra e build pipeline** — Next 16.3.5, export estático, deploy automático para GitHub Pages, 0 vulnerabilidades (`npm audit --omit=dev`), CI rodando em push e PR + auditoria semanal agendada.
- **i18n completo** — 3 idiomas (pt-BR/en/es) em todas as rotas públicas, com hreflang, canonical e `x-default`.
- **Copy nova da Home** — o `site.ts` não commitado já é uma reescrita de marketing limpa, sem linguagem de bastidor. **É bom material e deve ser aproveitado.**
- **Identidade visual RELIC** — 10 glyphs autorados do app, 18 medalhas de chefe, 7 molduras nine-slice, sigilo do Aethron, hero backgrounds, OG forte.
- **21 capturas reais de dispositivo** em 3 idiomas (7 famílias).
- **Fluxo de exclusão de conta funcional** — com verificação por email, token em fragmento de URL, tratamento de rate-limit e resposta não-enumerante.
- **Waitlist funcional** — com honeypot, validação e tratamento de duplicidade.
- **Textos de segurança do Aethron corretos** — não substitui profissional de saúde, na Home e no FAQ.
- **Nenhum dado inventado** — nenhum número de tração, parceiro ou disponibilidade falsa.

## 2. O que precisa mudar em código

1. `src/content/site.ts` + `ModernHomePage.tsx` + `LocalizedFooter.tsx` — **reconciliar o schema quebrado** (5 chaves)
2. `LegalPageShell.tsx` / `LegalDraftNotice.tsx` — remover o banner de rascunho
3. `src/config/legal.ts` — eliminar o fallback "Decisão do responsável pendente"
4. `src/app/robots.ts` + `[page]/page.tsx:37` + `delete-account/page.tsx:27` — liberar legais
5. `src/app/sitemap.ts` — incluir legais
6. `src/app/(default)/page.tsx` — resolver a rota `/`
7. `ModernHomePage.tsx` — remover `HeroFieldReport`, status ledger, seção Roadmap
8. `FeatureCard.tsx` / `RoadmapCard.tsx` / `ScreenshotFrame.tsx` — `feature` obrigatório
9. `WaitlistForm.tsx` + `lib/api/waitlist.ts` — UTM, 18+, conversão
10. `src/lib/api/public-player.ts:42` — espada errada
11. `src/app/manifest.ts` — `lang`
12. Analytics/pixel — **não existe, precisa ser criado**

## 3. O que precisa mudar em texto

1. `pages.ts` — 6 eyebrows "rascunho" + título do `wear-os` + summary do `faq` + summary do `features`, **×3 idiomas**
2. `ModernHomePage.tsx` — texto falso de exclusão (linha 600), captions dos slots, "Relatório de campo", "Sem download público"
3. `product-status.ts` — 5 labels de status × 3 idiomas
4. `LocalizedFooter.tsx` — 3 labels "— rascunho", tagline em inglês, coluna Social
5. `site.ts` — `waitlist.capacity` e `waitlist.disclosure` (18+ e tom)
6. `pages.ts` — 33 blocos `pendingFields`
7. FAQ — adicionar exclusão de conta; revisar resposta 5 (iOS)

## 4. O que precisa de screenshot real

**2 itens, ambos P0:**
1. Tela de **registro/acompanhamento de atividade** → `run-tracking-{pt-BR,en,es}.webp`
2. Tela de **ranking semanal** → `weekly-ranking-{pt-BR,en,es}.webp`

Ambos 720×1560, 3 idiomas, usuário `MythStride`, sem métricas de teste.
**Antes disso: revisar visualmente as 21 capturas já existentes** — 18 estão prontas e sem uso.

## 5. O que pode ser gerado por IA

| # | Asset | Prioridade |
|---|---|---|
| 1 | Arte promocional da Espada do Fundador (ciano homologada) | P1 |
| 2 | Glyph "progresso/conversão" | P1 |
| 3 | Glyph "guilda/grupos" | P1 |
| 4 | Arte de herói para o aside | P1 |
| 5 | Fundo do gateway `/` | P2 |
| 6 | Lore: A Névoa | P2 |
| 7 | Lore: Aethron | P2 |
| 8 | Lore: Os Striders | P2 |
| 9 | OG por rota | P2 |

**Total: 9 assets `[GERAR COM IA]`** (contando o tríptico de lore como 3).

## 6. O que bloqueia tráfego pago

**Bloqueio absoluto:**
1. **Build quebrado** — não há o que publicar.
2. **Política de privacidade `noindex` + autodeclarada "não aprovada"** — risco de reprovação na revisão de anúncios.
3. **`/` é um seletor de idioma** — o clique pago morre antes da mensagem.

**Bloqueio de credibilidade:**
4. "Rascunho técnico" em 8 páginas; "Decisão do responsável pendente" em ~33 blocos.
5. "Espaço reservado para captura validada" na seção de prova de produto.
6. "Relatório de campo" com badges de status na primeira dobra.
7. Afirmação falsa sobre exclusão de conta.

**Bloqueio de conformidade:**
8. Sem 18+ em lugar nenhum.
9. `/delete-account` inacessível (exigência do Google Play).

**Bloqueio de mensuração:**
10. Nenhum pixel/analytics — impossível medir ou otimizar campanha.

## 7. Lista exata de arquivos para a próxima etapa

```
src/content/site.ts                                    ⛔ build
src/content/pages.ts                                   copy ×3 idiomas
src/components/site/ModernHomePage.tsx                 ⛔ build + copy + visual
src/components/site/LocalizedFooter.tsx                ⛔ build + copy
src/components/site/LegalDraftNotice.tsx               provavelmente deletar
src/components/site/LegalPageShell.tsx                 remover banner + pending-fields
src/components/site/RoadmapCard.tsx                    provavelmente deletar
src/components/site/FeatureCard.tsx                    feature obrigatório
src/components/site/ScreenshotFrame.tsx                placeholder + badge
src/components/site/ScreenshotGallery.tsx              slots
src/components/site/IntegrationCard.tsx                badge
src/components/site/LocalizedContentPage.tsx           isDraft esconde CTA
src/components/site/PageHero.tsx                       prop aside
src/components/product/FeatureStatusBadge.tsx          destino do sistema
src/components/WaitlistForm.tsx                        18+, UTM, conversão
src/config/product-status.ts                           20 features / 5 status
src/config/legal.ts                                    15 campos + fallback
src/app/(default)/page.tsx                             rota /
src/app/[locale]/[page]/page.tsx                       noIndex linha 37
src/app/[locale]/delete-account/page.tsx               noIndex linha 27
src/app/[locale]/delete-account/confirm/page.tsx       LegalDraftNotice linha 86
src/app/robots.ts                                      disallow legais
src/app/sitemap.ts                                     incluir legais
src/app/manifest.ts                                    lang: en -> pt-BR
src/app/globals.css                                    draft-notice, status-badge, field-report, icon-mock
src/lib/metadata.ts                                    OG por rota
src/lib/structured-data.ts                             auditar JSON-LD
src/lib/relic-frames.ts                                novos glyphs
src/lib/api/waitlist.ts                                source/UTM
src/lib/api/public-player.ts                           iconUrl linha 42
.github/workflows/deploy.yml                           envs legais
.env.production / .env.example                         envs legais
public/{next,vercel,window,globe,file}.svg             remover
```

## 8. Lista exata de assets necessários

**`[PRECISA SCREENSHOT REAL]` — 2:**
```
public/images/product/run-tracking-{pt-BR,en,es}.webp      720x1560  P0
public/images/product/weekly-ranking-{pt-BR,en,es}.webp    720x1560  P0
```

**`[GERAR COM IA]` — 9:**
```
public/images/optimized/founder-sword-promo.webp           1024x1024  P1  transp
public/assets/mythstride/icons/progress_conversion.png      256x256   P1  transp
public/assets/mythstride/icons/guild.png                    256x256   P1  transp
public/images/optimized/hero-aside.webp                    1200x1200  P1  transp
public/images/optimized/gateway-bg.webp                    1920x1080  P2  opaco
public/assets/mythstride/lore/mist.png                      512x512   P2  transp
public/assets/mythstride/lore/aethron.png                   512x512   P2  transp
public/assets/mythstride/lore/striders.png                  512x512   P2  transp
public/images/social/og-{slug}.jpg                         1200x630   P2  opaco
```

**JÁ EXISTEM — usar antes de produzir:** 18 capturas reais sem uso, 18 medalhas de chefe, 10 glyphs do pack, 7 molduras RELIC, OG principal, hero backgrounds, sigilo do Aethron.

## 9. Riscos de quebrar algo existente

1. **`site.ts` é consumido por 4 componentes** (`ModernHomePage`, `LocalizedFooter`, `LocalizedNavigation`, `WaitlistForm`, `LocalizedContentPage`). Mudar chaves quebra o build — **é exatamente o que aconteceu.** Alterar schema e consumidores no mesmo commit.
2. **`feature` é prop obrigatória** em `FeatureCard`, `RoadmapCard`, `ScreenshotFrame`. Remover badges exige mexer nas assinaturas — TypeScript vai acusar em cascata.
3. **`pages.ts` tem `Record<PageSlug, ...>` estrito** nos 3 idiomas. Remover um slug exige remover das 3 e de `publicPageSlugs`/`draftPageSlugs`; `sitemap.ts` e `robots.ts` derivam dessas listas.
4. **`robots.ts` e `[page]/page.tsx` derivam de `draftPageSlugs`.** Tirar uma página de "draft" muda indexação **e** o CTA (via `isDraft` em `LocalizedContentPage`) simultaneamente.
5. **`npm run validate:content`, `validate:build`, `validate:links`** rodam no CI e podem reprovar mudanças de conteúdo. Rodar localmente antes.
6. **`output: "export"`** — sem SSR, sem middleware, sem redirect de servidor. Redirecionar `/` por idioma exige JS no cliente ou meta refresh.
7. **`trailingSlash: true`** — toda URL termina em `/`. Links sem barra podem gerar redirect extra.
8. **`getAssetPath`** honra `NEXT_PUBLIC_BASE_PATH`. Referenciar assets direto por string quebra em base path diferente de `/`.
9. **Deploy dispara em push para `main`** — qualquer commit publica. Não existe staging.
10. **A alteração não commitada de `site.ts` pode ser perdida** se alguém fizer `git checkout`. **Preservar antes de qualquer operação git.**
11. **`.env.local` e `.env.production`** não estão no controle de versão com valores legais — se as envs forem adicionadas só localmente, o build do CI continuará mostrando "pendente".

## 10. Comandos de validação existentes no projeto

```bash
npm run lint              # eslint
npm run typecheck         # tsc --noEmit --incremental false   ⛔ FALHA HOJE (13 erros)
npm test                  # node --test tests/*.test.mjs        (12 testes)
npm run validate:content  # node scripts/validate-content.mjs    (76 arquivos)
npm run validate:build    # node scripts/validate-build.mjs      (64 artefatos)
npm run validate:links    # node scripts/validate-links.mjs
npm run build             # next build (export estático)          ⛔ FALHA HOJE
npm run preview:static    # serve ./out em http://127.0.0.1:4173
npm run assets:optimize   # node scripts/optimize-assets.mjs (usa sharp)
npm audit --omit=dev      # 0 vulnerabilidades
```

**CI:** `.github/workflows/website-pr-validation.yml` roda, em PR e em push para `main`: `npm ci` → `npm audit --omit=dev` → lint → typecheck → test → validate:content → build → validate:build → validate:links.
`.github/workflows/dependency-audit.yml` roda `npm audit --omit=dev` semanalmente (segundas 06:00 UTC) e sob demanda.
`.github/workflows/deploy.yml` publica em GitHub Pages a cada push em `main`.

**Ordem recomendada antes de publicar:**
```bash
npm run typecheck && npm run lint && npm test && npm run build \
  && npm run validate:content && npm run validate:build && npm run validate:links
```
