# Visual QA — MythStrideSite

Data: 18 de setembro de 2026
Origem: export estático local em `http://127.0.0.1:4173`
Captura: Google Chrome headless, controlado pelo Chrome DevTools Protocol (sem dependências adicionais)
Escopo: rodada 1 — redesenho completo da HOME; rodada 2 — QA final de lançamento; rodada 3 — ajuste estratégico de eventos, comunidade e chefes. As páginas institucionais foram recapturadas nas duas para confirmar que o novo cabeçalho e o novo rodapé não as afetaram.

## Resultado

**PASS** — as 11 capturas passaram na validação automática e na inspeção visual.

| Arquivo | URL | Viewport | Captura | Resultado |
| --- | --- | --- | --- | --- |
| `home-pt-desktop.png` | `http://127.0.0.1:4173/pt-BR/` | 1440 × 1200 | topo | PASS |
| `home-pt-desktop-full.png` | `http://127.0.0.1:4173/pt-BR/` | 1440 × 1200 | full page (1440 × 14357) | PASS |
| `home-pt-mobile.png` | `http://127.0.0.1:4173/pt-BR/` | 390 × 844 | topo | PASS |
| `home-pt-mobile-full.png` | `http://127.0.0.1:4173/pt-BR/` | 390 × 844 | full page (390 × 19346) | PASS |
| `home-en-desktop.png` | `http://127.0.0.1:4173/en/` | 1440 × 1200 | topo | PASS |
| `home-es-desktop.png` | `http://127.0.0.1:4173/es/` | 1440 × 1200 | topo | PASS |
| `privacy-pt.png` | `http://127.0.0.1:4173/pt-BR/privacy/` | 1440 × 1200 | topo | PASS |
| `terms-pt.png` | `http://127.0.0.1:4173/pt-BR/terms/` | 1440 × 1200 | topo | PASS |
| `closed-beta-pt.png` | `http://127.0.0.1:4173/pt-BR/closed-beta/` | 1440 × 1200 | topo | PASS |
| `support-pt.png` | `http://127.0.0.1:4173/pt-BR/support/` | 1440 × 1200 | topo | PASS |
| `delete-account-pt.png` | `http://127.0.0.1:4173/pt-BR/delete-account/` | 1440 × 1200 | topo | PASS |

## Verificações automáticas

Cada página foi carregada, percorrida de cima a baixo — para acionar todas as imagens lazy e todas as entradas de seção — e então auditada.

- Erros de console JavaScript/React: **0** em todas as páginas.
- Exceções não tratadas: **0**.
- Requests HTTP 4xx/5xx: **0**.
- Requests de rede com falha: **0**.
- Overflow horizontal (`scrollWidth − clientWidth`): **0** em todos os viewports.
- Imagens quebradas: **0**.
- Imagens com proporção deformada: **0**.
- Elementos de entrada (`.reveal`) que permaneceram invisíveis após o scroll: **0**.
- Imagens sem atributo `alt`: **0**.
- Links sem texto e sem `aria-label`: **0**.
- Links com destino `#`: **0**.
- Um único `<h1>` por página.

Larguras verificadas separadamente na HOME, todas sem overflow: 320, 375, 390, 430, 768, 1024, 1440 e 1920 px.

## Inspeção visual da HOME

- Hero: cabeçalho transparente sobre a arte, H1 em duas linhas com a segunda em ouro, dashboard real do aplicativo e HUD flutuante que executa uma vez a sequência corrida → XP → ataque → queda de HP. A legenda declara, em texto, que se trata de um exemplo de corrida e explica a conversão.
- Ciclo: cinco etapas numeradas com métrica própria, conferindo com os valores reais do cálculo de recompensa.
- Batalhas: Medusa em tamanho cinematográfico sobre a barra de vida, e a campanha completa de dez chefes com nível e vida reais.
- Recompensas: onze peças reais do catálogo, cada uma sob a sua raridade, nas cores de raridade do próprio aplicativo. Nenhum atributo numérico é exibido.
- Personagem: ficha com nível, barra de XP e seis slots equipados, ao lado da captura real do inventário.
- Elyndor: cena em largura total com a arte do Strider, seguida dos três pilares (Névoa, Chama, Striders).
- Crônicas: três cartas expansíveis em `<details>`, funcionais sem JavaScript.
- Aethron: personagem em primeiro plano, conversa de exemplo e aviso de IA/saúde legível, no mesmo corpo de texto da seção.
- Comunidade e Eventos: capturas reais de grupos e eventos, com a natureza do calendário (provas reais e desafios do jogo) descrita em texto.
- Espada do Fundador: relíquia ciano correta, com os dois critérios reais declarados lado a lado — quem recebe, e que o cadastro não garante convite.
- Plataformas: Android, Wear OS e Strava, com o estado real de cada um. Nenhuma outra plataforma é prometida.
- Formulário: campos, confirmação de 18+, aviso de uso de dados, nota de capacidade e link para a Política de Privacidade, todos preservados.
- Rodapé: Produto, Universo, Suporte, Legal e Social, com o login de testador acessível e as três línguas.
- Mobile: nenhuma seção cortada; menu em tela cheia com o CTA e todas as páginas do site; formulário utilizável.

## Rodada 1 — problemas encontrados e corrigidos

1. **Entrada de seção podia ficar invisível para sempre.** O observador usava um *threshold* fracionário, que uma seção mais alta que a viewport nunca alcança — 16% de um bloco de 6.000 px é mais do que um celular mostra. Corrigido para *threshold* zero, com a margem inferior negativa segurando a entrada.
2. **Salto de scroll podia pular uma seção.** Um observador só reporta *mudança* de interseção, então um elemento que vai de "abaixo da dobra" para "acima da dobra" sem quadro intermediário — âncora, gesto rápido, posição de scroll restaurada — nunca disparava. A raiz do observador foi estendida para cima, de modo que tudo que esteja na viewport ou acima dela conte como visível.
3. **Ornamento do topo sobre a hero.** O quadro do topbar era pintado com `border-image-slice: fill`, o que deixava uma barra opaca sobre a primeira dobra. Passou a valer apenas no estado rolado.
4. **Chefe divergente na primeira dobra.** O card flutuante nomeava um chefe vindo do catálogo enquanto a captura atrás dele mostrava outro. O card passou a ler o ataque, não o chefe; a tela atrás continua sendo quem nomeia o encontro.
5. **Medalhas de chefe superdimensionadas.** As medalhas são autoradas em 384 px e apareciam a 56 px na campanha. Foi gerado um corte de 128 px para o tamanho pequeno, reduzindo o conjunto de ~430 KB para ~75 KB sem perda visível.
6. **Glifos superdimensionados.** Os glifos autorados vão de 96 px a 384 px e apareciam a 36–44 px. O troféu de campeão sozinho pesava 106 KB. Foi gerado um corte de 128 px em WebP para slots de até 64 px: o conjunto caiu de 359 KB para 52 KB. O PNG autorado continua sendo a fonte para qualquer slot maior.
7. **Favicon de 180 KB.** O `.ico` continha entradas de 128 px e 256 px, que o navegador baixa junto. Como `icon.png` (512 px) já cobre os tamanhos grandes, as duas entradas foram removidas: 179,7 KB → 18,5 KB, sem alterar a arte.

Peso da HOME após as correções, medido sem compressão no servidor local: **1.487 KB** na primeira visualização (27 requests) e **2.440 KB** com a página inteira percorrida (59 requests). HTML, CSS e JavaScript somam cerca de 665 KB desse total e são servidos comprimidos em produção.

Artefato de ferramenta, não do site: o script de captura usava `window.scrollTo` sem `behavior: 'instant'`, e o `scroll-behavior: smooth` do documento fazia cada passo interromper o anterior — a página nunca chegava ao fim e as seções finais apareciam como não reveladas. O script foi corrigido e todas as capturas foram refeitas.

## Rodada 2 — QA final de lançamento

Varredura de 10 viewports (1920×1080, 1440×900, 1366×768, 1280×720, 768×1024, 430×932, 390×844, 375×812, 360×800, 320×568) nas três línguas — 30 combinações — mais caminhada real de teclado, árvore de acessibilidade, contraste calculado, rastreamento de links no export e teste funcional do formulário.

### Resultado das 30 combinações

Overflow horizontal **0**; elementos extrapolando **0**; imagens quebradas **0**; imagens sem `width`/`height` **0**; seções que ficam invisíveis **0**; `alt` ausente **0**; `h1` por página **1**; saltos de hierarquia de heading **0**; âncoras inexistentes **0**; links sem nome acessível **0**; `href="#"` **0**; erros de console **0**; requests falhos **0**. O CTA principal aparece dentro da primeira dobra em todos os 30 casos.

Rastreamento do export: **62 páginas, 2.125 links internos únicos, 0 quebrados** (incluindo âncoras entre páginas).

### Problemas encontrados e corrigidos

1. **CTA principal fora da primeira dobra em telas baixas.** A altura da hero é definida pelo celular ao lado da copy, não pelo `min-height`: um aparelho de 20,5 rem tem 711 px, então a seção ficava com ~1.000 px em qualquer janela. Em 1366×768 e 1280×720 o botão "Torne-se um Strider" caía inteiramente abaixo da dobra. Uma regra para janelas de até 820 px de altura reduz o respiro e o aparelho; acima disso o layout aprovado não muda em um pixel.
2. **Contraste insuficiente em dois numerais.** `.loop-step__number` (12 px) e `.chronicle-card__numeral` (32 px) estavam em `--color-gold-dim`, a 2,3:1 — abaixo dos 4,5:1 exigidos para texto normal e dos 3:1 para texto grande. Passaram a usar `--color-gold-muted`, que já existe na paleta e cumpre os dois limites. Nenhuma cor nova entrou no sistema.
3. **Menu mobile declarava `aria-modal` sem prender o foco.** Depois do último link do painel, a tecla Tab entrava na página atrás do overlay. Foi adicionado um ciclo de foco dentro do diálogo: a caminhada de teclado agora dá 22 paradas sem sair do painel (antes, 9 escapavam).
4. **Trilhas roláveis sem nome acessível.** O navegador dá foco de teclado a uma caixa rolável para permitir rolagem pelas setas, e a trilha de recompensas e a da campanha eram anunciadas em silêncio. Receberam `aria-label` a partir de textos que já existiam ("Recompensas" e "A campanha"); nenhuma string nova foi criada.
5. **Logo do cabeçalho em `lazy`.** A marca fica na primeira dobra de todas as páginas e era a única imagem lazy acima da dobra. Passou a `eager` — não a `priority`, porque 9 KB e 36 px não justificam um preload.
6. **Alto contraste do Windows apagaria a segunda linha do H1.** `.hero__title-accent` é um degradê recortado no texto com `color: transparent`; em `forced-colors` o navegador descarta a imagem de fundo e a linha sumiria. Foi adicionado um bloco `@media (forced-colors: active)` com cor sólida.

### Regressão visual

Comparação pixel a pixel das 11 capturas contra o conjunto aprovado: **9 idênticas**. As duas capturas de página inteira em PT-BR diferem em 1.437 pixels (0,007% e 0,019%), que são exatamente os numerais do item 2. A primeira dobra em 1440×1200 é idêntica nas três línguas.

### Verificado sem alteração necessária

- `prefers-reduced-motion`: 0 elementos animados, 0 animações infinitas, 0 elementos invisíveis, `scroll-behavior: auto`.
- Reveals: fail-safe confirmado — sem JavaScript ou antes da hidratação o servidor não emite `data-revealed` e o CSS deixa tudo visível.
- Foco: 20 de 20 paradas de teclado com anel visível de 2 px; `:focus-visible` ativo em todas.
- Formulário: validação de email, confirmação de 18+, honeypot (dispara sucesso silencioso sem enviar request), estado de carregamento com campos e botão desabilitados, mensagem de erro com `role="alert"` e botão reabilitado depois da falha.
- Landmarks, `aria-label` e `alt` traduzidos nas três línguas; nenhum texto português vazando para EN ou ES.
- Âncoras: todas as oito pousam abaixo do cabeçalho fixo, em desktop e mobile.
- Structured data: JSON válido, e as 7 perguntas do `FAQPage` existem na página nas três línguas.
- Rotas de login, exclusão de conta, confirmação e as seis páginas legais: renderizam, mantêm seus formulários e não têm overflow.
- Trilhas roláveis: as 21 imagens carregam quando a trilha é rolada na horizontal.
- Peso: inalterado pela rodada (1.488 KB na primeira visualização, 2.441 KB com a página inteira percorrida).

### Observação registrada, sem ação

O rótulo "Como funciona" aparece em dois destinos: o item do cabeçalho leva à página `/how-it-works/` e o CTA secundário da hero rola até a seção do ciclo. Ambos respondem à mesma pergunta em profundidades diferentes, e nenhum leva a uma ação diferente da que descreve. Alterar qualquer um dos dois mudaria copy aprovada ou o comportamento de conversão, então fica registrado para decisão editorial.

## Rodada 3 — ajuste estratégico (eventos, comunidade, chefes)

Ajuste de comunicação, não de arquitetura. Nenhuma seção criada, removida ou reordenada; nenhum componente aprovado trocado.

### Chefes

A copy dizia "São dez chefes de campanha" / "Ten campaign bosses" / "Son diez jefes", e o rótulo da trilha era "A campanha" com a nota "Dez encontros, do nível 1 ao nível 10". Um visitante leria isso como o tamanho do jogo, não como o conteúdo do beta. Passou a "Os primeiros chefes", e a nota descreve o conjunto como conteúdo inicial do beta fechado, registrando que Elyndor foi construído para receber novos inimigos, equipamentos e histórias. As dez medalhas, níveis e vidas continuam sendo os dados reais de `ChefeFactory` — nada foi escondido, apenas deixou de ser apresentado como limite.

### Comunidade

A `lede` e o card de amigos foram reescritos para nomear as ações que existem de fato no aplicativo, verificadas em `lib/features/social/friends/`: buscar outros Striders, enviar e aceitar convites, acompanhar a evolução de cada um. Rankings, Grupos e Conquistas ficaram como estavam. A `lede` também passa a ligar comunidade e eventos.

### Eventos

A seção deixou de ser descrita como um calendário e passou a declarar a ponte que ela realmente é. Título novo: "Sua próxima quest pode acontecer no mundo real." Os três destaques passaram a descrever o que a tela de eventos faz — calendário com data, local, endereço, distância e percurso; confirmação de participação e escolha da atividade que conta; desafios criados dentro do jogo com conquistas e medalhas. Tudo verificado nas chaves `events.detail.*`, `events.activity.*` e `events.calendar.*` do aplicativo.

### Organizadores

Bloco novo no rodapé da seção de eventos — uma área dentro da seção existente, não uma seção a mais. Diz o fluxo real em três passos (entrar em contato → o evento é avaliado → o evento pode entrar) e nada além dele: nenhuma aprovação, alcance, número de participantes, preço, comissão ou receita é prometido.

O CTA reutiliza o canal que já existe, `legalConfig.contactEmail`, como um `mailto:` com assunto localizado. Nenhum formulário novo, nenhuma rota nova, nenhum backend inventado — a auditoria confirmou que o projeto não tem rota de submissão de eventos, e o e-mail do estúdio é o único canal publicado.

### Verificação

- 30 combinações (3 línguas × 10 viewports): overflow **0**, elementos extrapolando **0**, imagens quebradas **0**, reveals invisíveis **0**, `alt` ausente **0**, `h1` **1**, saltos de heading **0**, âncoras inválidas **0**, links sem nome **0**, erros de console **0**, requests falhos **0**. CTA principal dentro da primeira dobra em todos.
- CTA de organizador: `<a>` real com `mailto:`, 46 px de altura, dentro da viewport nas três línguas em 1440×900 e 390×844, `<h3>` sob o `<h2>` da seção.
- Checagem de copy: nenhuma contagem de chefes, frequência de eventos, métrica de público, promessa de alcance, garantia de aprovação ou modelo comercial no HTML gerado das três línguas.
- Regressão visual: as 9 capturas de primeira dobra e as páginas institucionais continuam **pixel-idênticas**. Só as duas capturas de página inteira em PT-BR mudaram de altura (14.357 → 14.823 no desktop; 19.346 → 19.999 no mobile), que é o bloco de organizadores mais a copy mais longa.

## Pendências para decisão humana

1. **Pendência principal, reconfirmada.** `dashboard-*.webp`, `events-*.webp`, `groups-*.webp` e `inventory-*.webp` são o mesmo arquivo nas três línguas, com a interface em português. Nas páginas em inglês e espanhol o celular mostra texto em português. É anterior ao redesenho e só se resolve com capturas reais do aplicativo em cada língua — nada foi editado, traduzido por cima ou fabricado.
2. A captura `dashboard-*.webp` mostra o chefe grafado "CERBERUS", enquanto a localização atual do jogo usa "Cérbero" em português. Não é mais visível na HOME — o card da hero passou a ler o ataque, não o nome — mas a mesma recaptura do item 1 alinharia os dois.
3. `assets/mythstride/relic/buttons/primary_frame@2x.png` pesa 132 KB e é carregado por todo CTA. Recodificá-lo para WebP nas mesmas dimensões reduziria bastante o peso sem mexer na tabela de fatias, mas `lib/relic-frames.ts` registra a decisão explícita de não recodificar o pacote autorado. Fica para decisão do responsável pela arte.
4. `images/optimized/boss-arpia.webp` e `boss-dragao.webp` (340 KB somados) não são referenciados por nenhuma página. São anteriores ao redesenho e foram mantidos.
5. Durante o teste funcional do formulário, uma submissão válida alcançou a API real e cadastrou `strider@example.com` na lista do beta. Os testes seguintes passaram a bloquear o domínio da API. Se quiser a lista limpa, remova esse endereço.

## Validações

- `npm run typecheck` — PASS
- `npm run lint` — PASS
- `npm test` — PASS (19/19)
- `npm run build` — PASS (62 páginas estáticas)
- `npm run validate:content` — PASS (80 arquivos)
- `npm run validate:build` — PASS (64 artefatos)
- `npm run validate:links` — PASS

Nenhum commit, push ou deploy foi realizado.
