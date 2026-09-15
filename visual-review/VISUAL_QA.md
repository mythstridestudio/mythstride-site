# Visual QA final — MythStrideSite

Data: 14 de setembro de 2026  
Origem: export estático local em `http://127.0.0.1:4173`  
Captura: Google Chrome 152 em modo headless, controlado pelo Chrome DevTools Protocol (sem dependências adicionais)

## Resultado

**PASS** — as 11 páginas/capturas solicitadas passaram na validação automática e na inspeção visual.

| Arquivo | URL | Viewport | Captura | Resultado |
| --- | --- | --- | --- | --- |
| `home-pt-desktop.png` | `http://127.0.0.1:4173/pt-BR/` | 1440 × 1200 | topo | PASS |
| `home-pt-desktop-full.png` | `http://127.0.0.1:4173/pt-BR/` | 1440 × 1200 | full page (1440 × 14021) | PASS |
| `home-pt-mobile.png` | `http://127.0.0.1:4173/pt-BR/` | 390 × 844 | topo | PASS |
| `home-pt-mobile-full.png` | `http://127.0.0.1:4173/pt-BR/` | 390 × 844 | full page (390 × 16291) | PASS |
| `home-en-desktop.png` | `http://127.0.0.1:4173/en/` | 1440 × 1200 | topo | PASS |
| `home-es-desktop.png` | `http://127.0.0.1:4173/es/` | 1440 × 1200 | topo | PASS |
| `privacy-pt.png` | `http://127.0.0.1:4173/pt-BR/privacy/` | 1440 × 1200 | topo | PASS |
| `terms-pt.png` | `http://127.0.0.1:4173/pt-BR/terms/` | 1440 × 1200 | topo | PASS |
| `closed-beta-pt.png` | `http://127.0.0.1:4173/pt-BR/closed-beta/` | 1440 × 1200 | topo | PASS |
| `support-pt.png` | `http://127.0.0.1:4173/pt-BR/support/` | 1440 × 1200 | topo | PASS |
| `delete-account-pt.png` | `http://127.0.0.1:4173/pt-BR/delete-account/` | 1440 × 1200 | topo | PASS |

## Verificações automáticas

- Erros de console React/JavaScript: **0** em todas as páginas.
- Hydration errors: **0**.
- Requests HTTP 4xx/5xx após as correções: **0**.
- Requests de rede com falha: **0**.
- Overflow horizontal: **0** em todos os viewports (`scrollWidth === clientWidth`).
- Elementos extrapolando horizontalmente: **0**.
- Imagens quebradas: **0**.
- Imagens com proporção deformada: **0**.
- CTA principal da HOME: visível no primeiro viewport em desktop e mobile.
- Menu mobile: abre dentro do viewport, contém o CTA, atualiza `aria-expanded` e fecha corretamente.

## Inspeção visual da HOME

- Hero: H1 legível, dashboard real presente, CTA de beta evidente; sem “Relatório de Campo” e sem badge de desenvolvimento.
- Produto: Dashboard, Inventário, Eventos e Aethron aparecem em proporção correta, com aparência de interface real e captions legíveis.
- Batalhas: medalhas visíveis e a seção comunica chefes/batalhas imediatamente.
- Founder Sword: espada ciano correta, sem espada flamejante, sem pixelização inaceitável e com aura controlada.
- Aethron: screenshot e sigilo mantêm hierarquia clara; aviso de IA/saúde permanece legível.
- Waitlist: Founder Sword próxima, email e checkbox 18+ evidentes, CTA forte e Política de Privacidade acessível.
- Footer: Instagram, YouTube e X presentes; Discord, “coming soon” e “rascunho” ausentes.
- Mobile: nenhuma seção cortada horizontalmente; cards, screenshots, menu e formulário utilizáveis; Founder Sword não domina a tela.

## Problemas funcionais encontrados e corrigidos

1. O prefetch especulativo dos links internos do Next.js solicitava URLs RSC incompatíveis com o servidor do export estático, gerando respostas 404 no navegador. O prefetch foi desativado somente nos links públicos internos; a navegação permanece funcional.
2. Na HOME em espanhol a largura dos rótulos da navegação comprimida fazia a marca sair parcialmente do viewport em 1440 px. A largura máxima do container interno do cabeçalho foi ajustada para acomodar o conteúdo, sem alterar textos ou a direção visual.

Durante a produção das capturas, o método inicial de ativação de imagens lazy-load deslocava o cabeçalho sticky dentro da imagem full-page. O processo de captura foi ajustado para carregar as imagens sem scroll e todas as capturas afetadas foram refeitas. Isso era um artefato da ferramenta, não um defeito do site.

Nenhuma alteração estética subjetiva foi feita.

## Decisões visuais para revisão humana

Nenhum problema objetivo pendente. As 11 imagens permanecem disponíveis para a decisão editorial final antes da publicação.

## Validações após as correções

- `npm run typecheck` — PASS
- `npm run lint` — PASS
- `npm test` — PASS (12/12)
- `npm run build` — PASS (66 páginas estáticas)
- `npm run validate:content` — PASS (72 arquivos)
- `npm run validate:build` — PASS (64 artefatos)
- `npm run validate:links` — PASS

Nenhum commit, push ou deploy foi realizado.
