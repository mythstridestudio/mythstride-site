# Inscrições e correção de medalhas no Admin

Admin → Eventos → selecionar evento → Participantes do app:
buscar contas por nome/e-mail, adicionar até 100 à seleção, justificar e confirmar evento gratuito/apenas virtual. A confirmação final mostra os destinatários. Inscrições existentes não são duplicadas. Esta seção inscreve pessoas com personagem existente; não cria contas.

Admin → Medalhas → Gerenciar medalhas de um jogador:
buscar e selecionar pessoa, preencher justificativa, usar Remover medalha de teste na lista e confirmar. A API impede apagar medalhas com evidência de corrida, progresso, conclusão ou entrega. O jogador poderá ganhar novamente cumprindo as regras normais. Não basta remover uma medalha para reabrir um evento encerrado.

## Integração e validação
Depende dos novos endpoints /api/admin/event-support da API. Publicar a API primeiro. Em backend antigo a remoção permanece desabilitada pela ausência de awardId.
Não depende da inscrição automática em massa proposta em outro PR.
Executado: node --test tests/admin-event-support.test.mjs tests/admin-medal-delivery.test.mjs.
Pendente: npm run lint, npm run typecheck, npm run build e teste visual/fluxo autenticado com backend. As dependências Next/React/TypeScript não estão instaladas neste ambiente.
A referência skills/frontend-design é um gitlink sem .gitmodules no repositório; seu SKILL.md não pôde ser lido. Foram reutilizados componentes/classes existentes e lidas as orientações web-quality.
Nenhuma operação de produção foi executada.
