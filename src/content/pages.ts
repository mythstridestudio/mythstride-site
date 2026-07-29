import type { ProductFeature } from "@/config/product-status";
import type { LegalField } from "@/config/legal";
import type { PublicLocale } from "@/lib/locales";

export const publicPageSlugs = [
  "features",
  "how-it-works",
  "aethron",
  "wear-os",
  "events",
  "community",
  "closed-beta",
  "faq",
] as const;

export const draftPageSlugs = [
  "support",
  "privacy",
  "terms",
  "delete-account",
  "community-guidelines",
  "purchases",
  "ai-transparency",
  "third-party-services",
] as const;

export const pageSlugs = [...publicPageSlugs, ...draftPageSlugs] as const;

export type PublicPageSlug = (typeof publicPageSlugs)[number];
export type DraftPageSlug = (typeof draftPageSlugs)[number];
export type PageSlug = (typeof pageSlugs)[number];

export type ContentSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  feature?: ProductFeature;
  pendingFields?: LegalField[];
};

export type LocalizedPageContent = {
  eyebrow: string;
  title: string;
  summary: string;
  sections: ContentSection[];
};

export function isPageSlug(value: string): value is PageSlug {
  return pageSlugs.includes(value as PageSlug);
}

export function isDraftPageSlug(value: string): value is DraftPageSlug {
  return draftPageSlugs.includes(value as DraftPageSlug);
}

export function getPageContent(
  slug: PageSlug,
  locale: PublicLocale,
): LocalizedPageContent {
  return locale === "pt-BR" ? ptBR[slug] : en[slug];
}

const ptBR: Record<PageSlug, LocalizedPageContent> = {
  features: {
    eyebrow: "O universo do produto",
    title: "Corrida, progressão e fantasia no mesmo caminho.",
    summary:
      "Conheça o ciclo completo do MythStride e veja o estado real de cada parte da experiência.",
    sections: [
      {
        title: "Corridas viram progresso",
        feature: "runTracking",
        paragraphs: [
          "O MythStride foi desenhado para registrar ou receber uma atividade elegível, validar seus dados e converter distância em avanço dentro de Elyndor.",
          "As regras de integridade, sincronização e elegibilidade ainda passam por validação antes da abertura do beta.",
        ],
        bullets: [
          "Registro de atividade no Android",
          "Progresso baseado em distância elegível",
          "Reconciliação de integrações compatíveis",
        ],
      },
      {
        title: "Batalhas e histórias",
        feature: "bossBattles",
        paragraphs: [
          "Chefes já fazem parte da experiência do beta. Cada encontro transforma movimento validado em contribuição para a batalha.",
          "Raids e sagas permanecem visíveis como partes em desenvolvimento do universo, sem serem apresentadas como disponíveis agora.",
        ],
      },
      {
        title: "Inventário, loot e conquistas",
        feature: "inventory",
        paragraphs: [
          "Itens, equipamentos e recompensas registram a jornada. Conquistas reconhecem consistência e participação, enquanto a Espada de Fundador segue em validação.",
          "Diamantes são moeda virtual do MythStride e não possuem valor monetário real.",
        ],
      },
      {
        title: "Uma identidade compartilhável",
        feature: "achievements",
        paragraphs: [
          "Perfil, conquistas, relações e participação comunitária formam uma identidade de jogador. Perfis públicos não são gerados no site de marketing por padrão.",
        ],
      },
    ],
  },
  "how-it-works": {
    eyebrow: "Da rua a Elyndor",
    title: "Um ciclo simples para uma aventura profunda.",
    summary:
      "O movimento começa no mundo real, passa por validação e ganha significado dentro do RPG.",
    sections: [
      {
        title: "1. Registre uma atividade",
        feature: "runTracking",
        paragraphs: [
          "A primeira fase prioriza Android. O registro e as integrações precisam produzir uma atividade elegível, sem depender de números fictícios ou dados públicos de testadores.",
        ],
      },
      {
        title: "2. Valide a distância",
        feature: "runTracking",
        paragraphs: [
          "O produto verifica o contexto disponível para reduzir abuso e determinar o que pode alimentar a progressão. Critérios podem mudar durante o beta.",
        ],
      },
      {
        title: "3. Avance missões e chefes",
        feature: "bossBattles",
        paragraphs: [
          "A distância elegível é convertida em avanço do personagem e dano em encontros. O resultado é progresso de RPG, não uma promessa de desempenho físico.",
        ],
      },
      {
        title: "4. Colecione e compartilhe",
        feature: "achievements",
        paragraphs: [
          "Loot, inventário, conquistas, eventos, amizades e grupos registram a história. O jogador controla onde a identidade é apresentada conforme os recursos forem validados.",
        ],
      },
    ],
  },
  aethron: {
    eyebrow: "Guardião da Chama",
    title: "Aethron dá voz à jornada, com limites claros.",
    summary:
      "Um companheiro narrativo e motivacional em validação, inspirado pela disciplina do jogador e pelo mundo de Elyndor.",
    sections: [
      {
        title: "O papel de Aethron",
        feature: "aethron",
        paragraphs: [
          "Aethron usa contexto selecionado do produto para gerar mensagens narrativas e motivacionais. Ele pode reconhecer momentos da jornada, sugerir reflexão e conectar progresso ao lore.",
          "Personalização mais profunda permanece uma visão em validação e desenvolvimento.",
        ],
      },
      {
        title: "Conteúdo gerado pode errar",
        feature: "aethron",
        paragraphs: [
          "Respostas podem ser imprecisas, incompletas ou inadequadas ao contexto. O jogador deve avaliar o conteúdo e não tratar Aethron como fonte de fatos garantidos.",
        ],
      },
      {
        title: "Não é orientação médica",
        feature: "aethron",
        paragraphs: [
          "Aethron não oferece diagnóstico, tratamento, aconselhamento profissional de saúde nem um plano de treinamento. Sintomas, dor, lesão ou dúvidas de saúde exigem orientação de um profissional qualificado.",
        ],
      },
      {
        title: "Uma presença mais sábia e acolhedora",
        paragraphs: [
          "A apresentação pública reserva espaço para arte futura aprovada: serena, protetora e consistente com a fantasia sombria, sem transformar Aethron em uma ameaça.",
        ],
      },
    ],
  },
  "wear-os": {
    eyebrow: "Integrações e plataformas",
    title: "Wear OS acompanha o caminho — ainda em validação.",
    summary:
      "A experiência de relógio começa como extensão do Android e depende de testes físicos antes do beta.",
    sections: [
      {
        title: "Telefone Android pareado",
        feature: "wearOs",
        paragraphs: [
          "A experiência planejada para esta fase exige um telefone Android compatível e pareado. O relógio não é apresentado como uma experiência totalmente independente.",
        ],
      },
      {
        title: "Validação em aparelhos físicos",
        feature: "wearOs",
        paragraphs: [
          "A validação com Galaxy S23 e Galaxy Watch ainda está pendente. Sincronização, consumo de energia, permissões e continuidade de atividade precisam ser confirmados fora de emuladores.",
        ],
      },
      {
        title: "Strava",
        feature: "strava",
        paragraphs: [
          "A integração com Strava também está em validação. Importação, duplicidade, reconciliação e tratamento de erros precisam funcionar de ponta a ponta.",
        ],
      },
      {
        title: "Plataformas futuras",
        feature: "ios",
        paragraphs: [
          "iOS está planejado para uma fase posterior. Apple Watch também permanece no roadmap e não é compatível nesta primeira fase.",
        ],
      },
    ],
  },
  events: {
    eyebrow: "Ritmo compartilhado",
    title: "Eventos transformam semanas em capítulos.",
    summary:
      "Desafios do beta conectam atividade, chefes, recompensas e participação comunitária.",
    sections: [
      {
        title: "Eventos do beta",
        feature: "events",
        paragraphs: [
          "Eventos podem definir janelas, objetivos e recompensas dentro da experiência de teste. Regras e resultados continuam sujeitos a ajustes.",
        ],
      },
      {
        title: "Chefes",
        feature: "bossBattles",
        paragraphs: [
          "Encontros com chefes já fazem parte do beta e usam progresso elegível. A participação não garante recompensas fora das regras apresentadas no produto.",
        ],
      },
      {
        title: "Raids cooperativas",
        feature: "raids",
        paragraphs: [
          "Raids ampliam a visão para desafios coletivos. Elas permanecem em desenvolvimento e ainda não têm data pública.",
        ],
      },
      {
        title: "Sagas de Elyndor",
        feature: "sagas",
        paragraphs: [
          "Sagas conectarão eventos, lore e consequências ao longo do tempo. Esta é uma promessa narrativa de produto em construção, não um recurso ativo.",
        ],
      },
    ],
  },
  community: {
    eyebrow: "Jornada coletiva",
    title: "Amigos e grupos tornam a constância compartilhável.",
    summary:
      "Conexões, governança, eventos e rankings fazem parte do beta; segurança e moderação continuam evoluindo.",
    sections: [
      {
        title: "Amigos e convites",
        feature: "friends",
        paragraphs: [
          "Convites permitem construir uma rede dentro do jogo. Dados sensíveis de atividade não devem ficar públicos por padrão.",
        ],
      },
      {
        title: "Grupos e governança",
        feature: "groups",
        paragraphs: [
          "Grupos têm papéis e administração para organizar comunidades pequenas. Nomes e imagens devem respeitar as diretrizes.",
        ],
      },
      {
        title: "Ranking semanal",
        feature: "weeklyRanking",
        paragraphs: [
          "O ranking dá uma cadência comum à semana e depende de atividades elegíveis. Trapaça, GPS falso e exploração podem levar a restrições.",
        ],
      },
      {
        title: "Denúncia, bloqueio e anti-cheat",
        feature: "communitySafety",
        paragraphs: [
          "Ferramentas de denúncia, bloqueio, análise de abuso e recurso ainda estão em desenvolvimento. As diretrizes atuais são rascunho e não uma política aprovada.",
        ],
      },
    ],
  },
  "closed-beta": {
    eyebrow: "Android primeiro",
    title: "O beta fechado será uma etapa de aprendizado.",
    summary:
      "Entrar na lista registra interesse; não garante convite, data de acesso ou compatibilidade.",
    sections: [
      {
        title: "O que está sendo preparado",
        feature: "runTracking",
        paragraphs: [
          "A build Android depende de configuração final, integridade de registro, testes físicos e capacidade de acompanhamento dos participantes.",
        ],
        bullets: [
          "Fluxo principal de corrida e progressão",
          "Chefes, inventário, conquistas e eventos",
          "Amigos, grupos e ranking semanal",
          "Aethron, Wear OS e Strava sob validação",
        ],
      },
      {
        title: "Como os convites funcionarão",
        paragraphs: [
          "Convites serão enviados em ondas compatíveis com a capacidade do teste. O cadastro não cria obrigação de convite nem reserva uma data.",
          "Compatibilidade de aparelho, região e necessidade de cobertura de teste podem influenciar a seleção.",
        ],
      },
      {
        title: "O que não estará ativo",
        feature: "diamondPurchases",
        paragraphs: [
          "Compras com dinheiro real e anúncios recompensados não estarão ativos nesta fase. Não há botão público de download ou loja oficial anunciado aqui.",
        ],
      },
      {
        title: "Depois do Android",
        feature: "ios",
        paragraphs: [
          "iOS e Apple Watch permanecem planejados. O roadmap pode mudar com os aprendizados do beta.",
        ],
      },
    ],
  },
  faq: {
    eyebrow: "Respostas diretas",
    title: "O que saber antes de entrar na lista.",
    summary:
      "Disponibilidade, dados, Aethron, integrações e roadmap sem transformar planos em promessas ativas.",
    sections: [
      {
        title: "Disponibilidade",
        paragraphs: [
          "MythStride ainda não tem download público. A primeira etapa é um beta fechado Android, sem data pública prometida.",
          "Entrar na lista registra interesse e não garante acesso.",
        ],
      },
      {
        title: "Corridas e integridade",
        feature: "runTracking",
        paragraphs: [
          "Atividades elegíveis alimentam a progressão. Regras de validação e anti-cheat podem mudar durante o beta.",
        ],
      },
      {
        title: "Dados e privacidade",
        paragraphs: [
          "As páginas de privacidade e termos são rascunhos técnicos. Entidade responsável, contatos, retenção e idade mínima ainda exigem decisões formais.",
        ],
      },
      {
        title: "Compras e anúncios",
        feature: "rewardedAds",
        paragraphs: [
          "Compras com dinheiro real e anúncios recompensados serão considerados apenas em fases futuras e não estarão ativos no beta inicial.",
        ],
      },
      {
        title: "Aethron e saúde",
        feature: "aethron",
        paragraphs: [
          "Aethron gera contexto narrativo e motivacional, pode errar e não oferece diagnóstico, tratamento ou orientação profissional de saúde.",
        ],
      },
    ],
  },
  support: {
    eyebrow: "Estrutura de suporte",
    title: "Ajuda em preparação para o beta.",
    summary:
      "Esta página registra os canais e processos que precisam existir antes do atendimento público. Nenhum endereço de contato foi inventado.",
    sections: [
      {
        title: "Canal de suporte",
        paragraphs: [
          "O canal oficial ainda precisa ser configurado e publicado pelo responsável. Até isso acontecer, o site não coleta chamados nem direciona usuários a um email não confirmado.",
        ],
        pendingFields: ["supportEmail", "legalEntityName"],
      },
      {
        title: "Escopo previsto",
        paragraphs: [
          "O atendimento futuro deverá cobrir acesso ao beta, compatibilidade, conta, privacidade, atividade, integrações, segurança comunitária e compras quando elas existirem.",
        ],
      },
      {
        title: "Emergências e saúde",
        paragraphs: [
          "MythStride não é um serviço de emergência nem de saúde. Aethron não substitui profissionais. Situações urgentes devem usar os serviços apropriados da região do usuário.",
        ],
      },
      {
        title: "Prazos de resposta",
        paragraphs: [
          "Nenhum prazo é prometido nesta fase. Níveis de serviço, responsáveis e horários dependem de decisão e capacidade operacional.",
        ],
      },
    ],
  },
  privacy: {
    eyebrow: "Privacidade — rascunho",
    title: "Estrutura de tratamento de dados em preparação.",
    summary:
      "Este documento técnico organiza categorias, finalidades, direitos e decisões pendentes. Não é uma política aprovada ou vigente.",
    sections: [
      {
        title: "Responsável e contato",
        paragraphs: [
          "A entidade responsável, o endereço e o canal de privacidade precisam ser confirmados antes da publicação oficial.",
        ],
        pendingFields: [
          "legalEntityName",
          "cnpj",
          "businessAddress",
          "privacyEmail",
          "privacyContact",
          "effectiveDate",
        ],
      },
      {
        title: "Categorias previstas",
        paragraphs: [
          "A arquitetura prevê dados de conta e autenticação, perfil, atividade e localização necessária ao registro, dispositivo, integrações, comunidade, suporte, segurança, preferências e lista do beta.",
          "Contextos sensíveis ligados a saúde exigem cautela adicional e não devem ser usados para diagnóstico.",
        ],
      },
      {
        title: "Finalidades previstas",
        bullets: [
          "Operar conta, corrida e progressão",
          "Sincronizar integrações autorizadas",
          "Prevenir fraude, abuso e GPS falso",
          "Administrar comunidade, eventos e suporte",
          "Gerar contexto narrativo por Aethron",
          "Administrar a lista do beta",
        ],
        paragraphs: [
          "Bases legais e detalhes por finalidade ainda dependem de revisão jurídica.",
        ],
      },
      {
        title: "Retenção e exclusão",
        feature: "accountDeletion",
        paragraphs: [
          "Períodos exatos não foram definidos. Certos registros podem precisar ser mantidos para segurança, fraude, compras ou obrigações legais.",
        ],
        pendingFields: [
          "accountDeletionPeriod",
          "dataRetentionSchedule",
          "purchaseRetentionPolicy",
        ],
      },
      {
        title: "Aethron e IA",
        feature: "aethron",
        paragraphs: [
          "O provedor, a retenção do contexto e eventual uso de dados para treinamento ainda não foram formalmente divulgados.",
        ],
        pendingFields: [
          "aiProviderStatement",
          "aiDataTrainingStatement",
        ],
      },
      {
        title: "Direitos e idade",
        paragraphs: [
          "O fluxo para solicitações de acesso, correção, oposição, portabilidade e exclusão ainda precisa ser operacionalizado. A idade mínima também depende de decisão e revisão.",
        ],
        pendingFields: ["minimumAge", "privacyEmail"],
      },
    ],
  },
  terms: {
    eyebrow: "Termos — rascunho",
    title: "Regras de uso ainda dependentes de aprovação.",
    summary:
      "Esta estrutura descreve o contrato pretendido sem afirmar que os termos já estão vigentes.",
    sections: [
      {
        title: "Partes e vigência",
        paragraphs: [
          "A entidade contratante, o registro, endereço e a data de vigência ainda precisam ser confirmados.",
        ],
        pendingFields: [
          "legalEntityName",
          "cnpj",
          "businessAddress",
          "effectiveDate",
          "minimumAge",
        ],
      },
      {
        title: "Contas e beta",
        paragraphs: [
          "O acesso ao beta será limitado, revogável e sujeito à capacidade de teste. Usuários deverão proteger credenciais e fornecer informações adequadas.",
        ],
      },
      {
        title: "Atividades e segurança",
        paragraphs: [
          "O usuário continua responsável por avaliar sua condição, ambiente, equipamento e segurança. O produto não garante desempenho, saúde ou ausência de riscos.",
        ],
      },
      {
        title: "Conduta e integridade",
        paragraphs: [
          "Assédio, ódio, personificação, fraude, GPS falso, exploração e interferência no serviço poderão levar a restrições conforme uma política aprovada.",
        ],
      },
      {
        title: "Conteúdo, Aethron e disponibilidade",
        paragraphs: [
          "Conteúdo gerado pode errar. Funcionalidades podem mudar, ficar indisponíveis ou ser removidas durante o beta sem transformar o roadmap em garantia.",
        ],
      },
      {
        title: "Compras futuras",
        feature: "diamondPurchases",
        paragraphs: [
          "Compras com dinheiro real não estarão ativas nesta fase. Regras de cobrança, reembolso, saldo e exclusão exigem aprovação antes de qualquer ativação.",
        ],
      },
    ],
  },
  "delete-account": {
    eyebrow: "Controle de conta — rascunho",
    title: "A exclusão será feita no aplicativo; o fluxo ainda está sendo concluído.",
    summary:
      "Esta página é informativa. Ela não contém formulário ativo, não recebe solicitações e não chama endpoints inacabados.",
    sections: [
      {
        title: "Estado da implementação",
        feature: "accountDeletion",
        paragraphs: [
          "O fluxo final de execução no backend e a experiência no aplicativo ainda estão sendo completados. Nenhuma exclusão pode ser solicitada por esta página.",
        ],
      },
      {
        title: "Fluxo planejado no aplicativo",
        paragraphs: [
          "A experiência prevista permitirá iniciar a exclusão dentro das configurações da conta, confirmar a intenção e acompanhar o resultado quando a implementação estiver pronta.",
        ],
      },
      {
        title: "Suporte futuro",
        paragraphs: [
          "Usuários poderão procurar suporte quando um canal real estiver configurado. O site não exibe email fictício.",
        ],
        pendingFields: ["supportEmail", "privacyEmail"],
      },
      {
        title: "Dados que podem exigir retenção",
        paragraphs: [
          "Algumas informações podem precisar ser preservadas para segurança, prevenção de fraude, histórico de compras ou obrigações legais. Os períodos exatos ainda não foram aprovados.",
        ],
        pendingFields: [
          "accountDeletionPeriod",
          "dataRetentionSchedule",
          "purchaseRetentionPolicy",
          "diamondDeletionPolicy",
        ],
      },
    ],
  },
  "community-guidelines": {
    eyebrow: "Diretrizes — rascunho",
    title: "Uma comunidade de fantasia ainda precisa de regras reais.",
    summary:
      "Esta estrutura registra comportamentos esperados, ferramentas futuras e decisões de moderação ainda não aprovadas.",
    sections: [
      {
        title: "Nomes, imagens e personificação",
        paragraphs: [
          "Nomes, avatares e grupos deverão ser respeitosos, não enganosos e não personificar pessoas, equipes ou organizações.",
        ],
      },
      {
        title: "Assédio, ódio e abuso",
        paragraphs: [
          "Assédio, ameaças, discurso de ódio, abuso direcionado e grupos ofensivos não serão aceitos na política final.",
        ],
      },
      {
        title: "Trapaça e GPS falso",
        paragraphs: [
          "Manipular localização, explorar falhas, automatizar atividade ou interferir em rankings prejudica a comunidade e poderá levar a restrições.",
        ],
      },
      {
        title: "Denúncia e bloqueio",
        feature: "communitySafety",
        paragraphs: [
          "Ferramentas de denúncia e bloqueio ainda estão em desenvolvimento. Elas não devem ser descritas como plenamente operacionais.",
        ],
      },
      {
        title: "Restrições, análise e recursos",
        paragraphs: [
          "Critérios, níveis de sanção, prazos, evidências, recursos e atendimento precisam de aprovação e capacidade operacional.",
        ],
        pendingFields: ["supportEmail"],
      },
    ],
  },
  purchases: {
    eyebrow: "Monetização futura — rascunho",
    title: "Diamantes continuam no universo, sem compras reais no beta.",
    summary:
      "Diamantes são uma moeda virtual do MythStride. Compras com dinheiro real não estarão ativas durante esta fase do beta.",
    sections: [
      {
        title: "Moeda virtual, sem valor em dinheiro",
        feature: "diamondPurchases",
        paragraphs: [
          "Diamantes não têm valor monetário real, não representam saldo bancário, não podem ser sacados e não devem ser negociados fora do produto.",
        ],
      },
      {
        title: "Cobrança pela plataforma",
        paragraphs: [
          "Se compras forem ativadas no futuro, a estrutura deverá explicar faturamento da plataforma, transações pendentes e proteção contra entrega duplicada. Nenhuma loja está ativa agora.",
        ],
      },
      {
        title: "Reembolsos e chargebacks",
        paragraphs: [
          "Regras de reembolso, contestação e efeito sobre itens ou saldo dependem da plataforma, da lei aplicável e de decisão formal. Não há promessa publicada nesta fase.",
        ],
        pendingFields: ["purchaseRetentionPolicy"],
      },
      {
        title: "Exclusão, saldo e expiração",
        paragraphs: [
          "Consequências da exclusão para diamantes, itens e histórico, assim como eventual expiração, ainda precisam ser definidas.",
        ],
        pendingFields: ["diamondDeletionPolicy", "purchaseRetentionPolicy"],
      },
      {
        title: "Recompensas aleatórias",
        paragraphs: [
          "Se recompensas aleatórias comercializadas forem adotadas, probabilidades e regras deverão ser divulgadas antes da ativação. Essa mecânica não é apresentada como ativa.",
        ],
      },
      {
        title: "Anúncios recompensados",
        feature: "rewardedAds",
        paragraphs: [
          "Anúncios recompensados são uma possibilidade futura. Não há integração ativa ou afirmação de uso do AdMob nesta fase.",
        ],
      },
    ],
  },
  "ai-transparency": {
    eyebrow: "Aethron — rascunho de transparência",
    title: "Conteúdo gerado com propósito narrativo e limites explícitos.",
    summary:
      "Esta página organiza as divulgações necessárias antes da validação pública de Aethron.",
    sections: [
      {
        title: "O que Aethron faz",
        feature: "aethron",
        paragraphs: [
          "Aethron gera mensagens narrativas e motivacionais a partir de categorias selecionadas de contexto do produto. Ele conecta a jornada do jogador ao mundo de Elyndor.",
        ],
      },
      {
        title: "O que Aethron não faz",
        paragraphs: [
          "Aethron não oferece diagnóstico, tratamento, aconselhamento profissional de saúde, garantia de desempenho, decisão automatizada com efeito legal ou atendimento de emergência.",
        ],
      },
      {
        title: "Categorias de contexto",
        bullets: [
          "Estado de progressão e conquistas",
          "Atividade e eventos selecionados",
          "Preferências de idioma e tom",
          "Contexto de produto estritamente necessário",
        ],
        paragraphs: [
          "A lista final, os controles e o consentimento ainda precisam de validação técnica e jurídica.",
        ],
      },
      {
        title: "Limitações do conteúdo gerado",
        paragraphs: [
          "Mensagens podem ser erradas, incompletas, repetitivas ou inadequadas. O produto deverá oferecer contexto e meios de feedback sem afirmar infalibilidade.",
        ],
      },
      {
        title: "Aviso sobre contexto sensível de saúde",
        paragraphs: [
          "Informações ligadas a dor, lesão, condição clínica ou saúde exigem cuidado especial. Aethron não deve interpretar esses dados como diagnóstico ou prescrever conduta.",
        ],
      },
      {
        title: "Provedor, retenção e treinamento",
        paragraphs: [
          "O provedor, a localização relevante, o período de retenção e o uso ou não de dados para treinamento ainda precisam de divulgação final.",
        ],
        pendingFields: [
          "aiProviderStatement",
          "aiDataTrainingStatement",
          "dataRetentionSchedule",
        ],
      },
      {
        title: "Mecanismo futuro de denúncia",
        feature: "communitySafety",
        paragraphs: [
          "Um mecanismo para sinalizar conteúdo inadequado está previsto, mas ainda não deve ser tratado como operacional.",
        ],
      },
    ],
  },
  "third-party-services": {
    eyebrow: "Terceiros — rascunho",
    title: "Integrações exigem transparência antes da ativação ampla.",
    summary:
      "Esta estrutura identifica categorias de terceiros sem inventar fornecedores, hospedagem ou termos ainda não aprovados.",
    sections: [
      {
        title: "Serviços de infraestrutura",
        paragraphs: [
          "Hospedagem, banco de dados, autenticação, monitoramento e entrega podem envolver prestadores. A lista oficial, finalidades e regiões precisam ser confirmadas.",
        ],
      },
      {
        title: "Strava",
        feature: "strava",
        paragraphs: [
          "A integração está em validação e dependerá de autorização do usuário e das regras aplicáveis do serviço. Escopo, sincronização e desconexão precisam ser documentados.",
        ],
      },
      {
        title: "Wear OS e plataformas",
        feature: "wearOs",
        paragraphs: [
          "O Android e Wear OS dependem de serviços da plataforma. iOS e Apple Watch permanecem planejados, sem suporte ativo anunciado.",
        ],
      },
      {
        title: "IA",
        feature: "aethron",
        paragraphs: [
          "O provedor de IA e as condições de tratamento não foram publicados porque ainda dependem de decisão e revisão.",
        ],
        pendingFields: [
          "aiProviderStatement",
          "aiDataTrainingStatement",
          "dataRetentionSchedule",
        ],
      },
      {
        title: "Cobrança e publicidade futuras",
        feature: "diamondPurchases",
        paragraphs: [
          "Serviços de faturamento ou publicidade só serão descritos quando houver configuração real e documentos aprovados. Nenhuma compra ou publicidade está ativa nesta fase.",
        ],
      },
    ],
  },
};

const en: Record<PageSlug, LocalizedPageContent> = {
  features: {
    eyebrow: "The product universe",
    title: "Running, progression and fantasy on the same path.",
    summary:
      "Explore MythStride's complete loop and the real status of each part of the experience.",
    sections: [
      {
        title: "Runs become progression",
        feature: "runTracking",
        paragraphs: [
          "MythStride is designed to record or receive an eligible activity, validate its data and convert distance into progress inside Elyndor.",
          "Integrity, synchronization and eligibility rules are still under validation before the beta opens.",
        ],
        bullets: [
          "Android activity tracking",
          "Progress based on eligible distance",
          "Reconciliation with compatible integrations",
        ],
      },
      {
        title: "Battles and stories",
        feature: "bossBattles",
        paragraphs: [
          "Bosses are already part of the beta experience. Each encounter turns validated movement into battle contribution.",
          "Raids and sagas remain visible as parts of the universe in development and are not presented as available now.",
        ],
      },
      {
        title: "Inventory, loot and achievements",
        feature: "inventory",
        paragraphs: [
          "Items, equipment and rewards record the journey. Achievements recognize consistency and participation while the Founder Sword remains under validation.",
          "Diamonds are MythStride virtual currency and have no real-world monetary value.",
        ],
      },
      {
        title: "A shareable identity",
        feature: "achievements",
        paragraphs: [
          "Profile, achievements, relationships and community participation form a player identity. Public profiles are not generated in the marketing site by default.",
        ],
      },
    ],
  },
  "how-it-works": {
    eyebrow: "From the street to Elyndor",
    title: "A simple loop for a deep adventure.",
    summary:
      "Movement begins in the real world, passes through validation and gains meaning inside the RPG.",
    sections: [
      {
        title: "1. Record an activity",
        feature: "runTracking",
        paragraphs: [
          "The first phase prioritizes Android. Tracking and integrations must produce an eligible activity without relying on fictional metrics or public tester data.",
        ],
      },
      {
        title: "2. Validate the distance",
        feature: "runTracking",
        paragraphs: [
          "The product checks available context to reduce abuse and determine what can feed progression. Criteria may change during beta.",
        ],
      },
      {
        title: "3. Advance quests and bosses",
        feature: "bossBattles",
        paragraphs: [
          "Eligible distance becomes character progress and damage in encounters. The result is RPG progression, not a promise of physical performance.",
        ],
      },
      {
        title: "4. Collect and share",
        feature: "achievements",
        paragraphs: [
          "Loot, inventory, achievements, events, friendships and groups record the story. Players control where their identity appears as features are validated.",
        ],
      },
    ],
  },
  aethron: {
    eyebrow: "Keeper of the Flame",
    title: "Aethron gives the journey a voice, with clear limits.",
    summary:
      "A narrative and motivational companion under validation, inspired by player discipline and the world of Elyndor.",
    sections: [
      {
        title: "Aethron's role",
        feature: "aethron",
        paragraphs: [
          "Aethron uses selected product context to generate narrative and motivational messages. It can recognize moments in the journey, suggest reflection and connect progress with lore.",
          "Deeper personalization remains a vision under validation and development.",
        ],
      },
      {
        title: "Generated content can be wrong",
        feature: "aethron",
        paragraphs: [
          "Responses may be inaccurate, incomplete or inappropriate for the context. Players should evaluate the content and not treat Aethron as a source of guaranteed facts.",
        ],
      },
      {
        title: "Not medical advice",
        feature: "aethron",
        paragraphs: [
          "Aethron does not provide diagnosis, treatment, professional health advice or a training plan. Symptoms, pain, injury or health concerns require guidance from a qualified professional.",
        ],
      },
      {
        title: "A wiser, more supportive presence",
        paragraphs: [
          "The public presentation reserves a slot for future approved art: calm, protective and consistent with dark fantasy, without turning Aethron into a threat.",
        ],
      },
    ],
  },
  "wear-os": {
    eyebrow: "Integrations and platforms",
    title: "Wear OS follows the path — still under validation.",
    summary:
      "The watch experience starts as an Android extension and depends on physical testing before beta.",
    sections: [
      {
        title: "Paired Android phone",
        feature: "wearOs",
        paragraphs: [
          "The experience planned for this phase requires a compatible paired Android phone. The watch is not presented as a fully standalone experience.",
        ],
      },
      {
        title: "Physical-device validation",
        feature: "wearOs",
        paragraphs: [
          "Validation with Galaxy S23 and Galaxy Watch is still pending. Synchronization, energy use, permissions and activity continuity must be confirmed outside emulators.",
        ],
      },
      {
        title: "Strava",
        feature: "strava",
        paragraphs: [
          "The Strava integration is also under validation. Import, duplicates, reconciliation and error handling must work end to end.",
        ],
      },
      {
        title: "Future platforms",
        feature: "ios",
        paragraphs: [
          "iOS is planned for a later phase. Apple Watch also remains on the roadmap and is not supported in this first phase.",
        ],
      },
    ],
  },
  events: {
    eyebrow: "Shared rhythm",
    title: "Events turn weeks into chapters.",
    summary:
      "Beta challenges connect activity, bosses, rewards and community participation.",
    sections: [
      {
        title: "Beta events",
        feature: "events",
        paragraphs: [
          "Events can define windows, objectives and rewards inside the test experience. Rules and results remain subject to change.",
        ],
      },
      {
        title: "Bosses",
        feature: "bossBattles",
        paragraphs: [
          "Boss encounters are part of beta and use eligible progress. Participation does not guarantee rewards outside the rules shown in product.",
        ],
      },
      {
        title: "Cooperative raids",
        feature: "raids",
        paragraphs: [
          "Raids expand the vision into collective challenges. They remain in development and have no public date.",
        ],
      },
      {
        title: "Sagas of Elyndor",
        feature: "sagas",
        paragraphs: [
          "Sagas will connect events, lore and consequences over time. This is a narrative product promise in development, not an active feature.",
        ],
      },
    ],
  },
  community: {
    eyebrow: "A collective journey",
    title: "Friends and groups make consistency shareable.",
    summary:
      "Connections, governance, events and rankings are part of beta; safety and moderation continue to evolve.",
    sections: [
      {
        title: "Friends and invitations",
        feature: "friends",
        paragraphs: [
          "Invitations make it possible to build an in-game network. Sensitive activity data should not be public by default.",
        ],
      },
      {
        title: "Groups and governance",
        feature: "groups",
        paragraphs: [
          "Groups have roles and administration for small communities. Names and images must follow the guidelines.",
        ],
      },
      {
        title: "Weekly ranking",
        feature: "weeklyRanking",
        paragraphs: [
          "The ranking gives the week a shared cadence and depends on eligible activities. Cheating, fake GPS and exploitation may lead to restrictions.",
        ],
      },
      {
        title: "Reporting, blocking and anti-cheat",
        feature: "communitySafety",
        paragraphs: [
          "Reporting, blocking, abuse review and appeal tools are still in development. Current guidelines are a draft, not an approved policy.",
        ],
      },
    ],
  },
  "closed-beta": {
    eyebrow: "Android first",
    title: "The closed beta will be a learning phase.",
    summary:
      "Joining the list records interest; it does not guarantee an invitation, access date or compatibility.",
    sections: [
      {
        title: "What is being prepared",
        feature: "runTracking",
        paragraphs: [
          "The Android build depends on final configuration, tracking integrity, physical testing and participant-support capacity.",
        ],
        bullets: [
          "Core running and progression loop",
          "Bosses, inventory, achievements and events",
          "Friends, groups and weekly ranking",
          "Aethron, Wear OS and Strava under validation",
        ],
      },
      {
        title: "How invitations will work",
        paragraphs: [
          "Invitations will be sent in waves that match testing capacity. Registration does not create an obligation to invite or reserve a date.",
          "Device compatibility, region and test-coverage needs may influence selection.",
        ],
      },
      {
        title: "What will not be active",
        feature: "diamondPurchases",
        paragraphs: [
          "Real-money purchases and rewarded ads will not be active in this phase. No public download button or official storefront is announced here.",
        ],
      },
      {
        title: "After Android",
        feature: "ios",
        paragraphs: [
          "iOS and Apple Watch remain planned. The roadmap may change with beta learnings.",
        ],
      },
    ],
  },
  faq: {
    eyebrow: "Direct answers",
    title: "What to know before joining the list.",
    summary:
      "Availability, data, Aethron, integrations and roadmap without turning plans into active promises.",
    sections: [
      {
        title: "Availability",
        paragraphs: [
          "MythStride has no public download yet. The first phase is an Android closed beta with no promised public date.",
          "Joining the list records interest and does not guarantee access.",
        ],
      },
      {
        title: "Runs and integrity",
        feature: "runTracking",
        paragraphs: [
          "Eligible activities feed progression. Validation and anti-cheat rules may change during beta.",
        ],
      },
      {
        title: "Data and privacy",
        paragraphs: [
          "Privacy and terms pages are technical drafts. Responsible entity, contacts, retention and minimum age still require formal decisions.",
        ],
      },
      {
        title: "Purchases and ads",
        feature: "rewardedAds",
        paragraphs: [
          "Real-money purchases and rewarded ads will only be considered in later phases and will not be active in the initial beta.",
        ],
      },
      {
        title: "Aethron and health",
        feature: "aethron",
        paragraphs: [
          "Aethron generates narrative and motivational context, can be wrong and does not provide diagnosis, treatment or professional health advice.",
        ],
      },
    ],
  },
  support: {
    eyebrow: "Support structure",
    title: "Help is being prepared for beta.",
    summary:
      "This page records the channels and processes needed before public support. No contact address has been invented.",
    sections: [
      {
        title: "Support channel",
        paragraphs: [
          "The official channel still needs to be configured and published by the owner. Until then, the site does not collect tickets or direct users to an unconfirmed email.",
        ],
        pendingFields: ["supportEmail", "legalEntityName"],
      },
      {
        title: "Intended scope",
        paragraphs: [
          "Future support should cover beta access, compatibility, accounts, privacy, activity, integrations, community safety and purchases if they exist.",
        ],
      },
      {
        title: "Emergencies and health",
        paragraphs: [
          "MythStride is not an emergency or health service. Aethron does not replace professionals. Urgent situations should use the appropriate services in the user's region.",
        ],
      },
      {
        title: "Response times",
        paragraphs: [
          "No response time is promised in this phase. Service levels, owners and schedules depend on operational decisions and capacity.",
        ],
      },
    ],
  },
  privacy: {
    eyebrow: "Privacy — draft",
    title: "Data-processing structure in preparation.",
    summary:
      "This technical document organizes categories, purposes, rights and pending decisions. It is not an approved or effective policy.",
    sections: [
      {
        title: "Controller and contact",
        paragraphs: [
          "The responsible entity, address and privacy channel must be confirmed before official publication.",
        ],
        pendingFields: [
          "legalEntityName",
          "cnpj",
          "businessAddress",
          "privacyEmail",
          "privacyContact",
          "effectiveDate",
        ],
      },
      {
        title: "Expected categories",
        paragraphs: [
          "The architecture anticipates account and authentication, profile, activity and location needed for tracking, device, integrations, community, support, safety, preferences and beta-list data.",
          "Sensitive health-related context requires additional care and must not be used for diagnosis.",
        ],
      },
      {
        title: "Expected purposes",
        bullets: [
          "Operate account, running and progression",
          "Synchronize authorized integrations",
          "Prevent fraud, abuse and fake GPS",
          "Administer community, events and support",
          "Generate narrative context through Aethron",
          "Administer the beta list",
        ],
        paragraphs: [
          "Legal bases and purpose-level details still require legal review.",
        ],
      },
      {
        title: "Retention and deletion",
        feature: "accountDeletion",
        paragraphs: [
          "Exact periods have not been defined. Certain records may need to be retained for security, fraud, purchases or legal obligations.",
        ],
        pendingFields: [
          "accountDeletionPeriod",
          "dataRetentionSchedule",
          "purchaseRetentionPolicy",
        ],
      },
      {
        title: "Aethron and AI",
        feature: "aethron",
        paragraphs: [
          "The provider, context retention and any data use for training have not been formally disclosed.",
        ],
        pendingFields: [
          "aiProviderStatement",
          "aiDataTrainingStatement",
        ],
      },
      {
        title: "Rights and age",
        paragraphs: [
          "The process for access, correction, objection, portability and deletion requests still needs to be operationalized. Minimum age also depends on decision and review.",
        ],
        pendingFields: ["minimumAge", "privacyEmail"],
      },
    ],
  },
  terms: {
    eyebrow: "Terms — draft",
    title: "Rules of use still awaiting approval.",
    summary:
      "This structure describes the intended agreement without claiming the terms are in effect.",
    sections: [
      {
        title: "Parties and effective date",
        paragraphs: [
          "The contracting entity, registration, address and effective date still need confirmation.",
        ],
        pendingFields: [
          "legalEntityName",
          "cnpj",
          "businessAddress",
          "effectiveDate",
          "minimumAge",
        ],
      },
      {
        title: "Accounts and beta",
        paragraphs: [
          "Beta access will be limited, revocable and subject to test capacity. Users must protect credentials and provide appropriate information.",
        ],
      },
      {
        title: "Activity and safety",
        paragraphs: [
          "Users remain responsible for evaluating their condition, surroundings, equipment and safety. The product does not guarantee performance, health or absence of risk.",
        ],
      },
      {
        title: "Conduct and integrity",
        paragraphs: [
          "Harassment, hate, impersonation, fraud, fake GPS, exploitation and interference may lead to restrictions under an approved policy.",
        ],
      },
      {
        title: "Content, Aethron and availability",
        paragraphs: [
          "Generated content can be wrong. Features may change, become unavailable or be removed during beta without turning the roadmap into a guarantee.",
        ],
      },
      {
        title: "Future purchases",
        feature: "diamondPurchases",
        paragraphs: [
          "Real-money purchases will not be active in this phase. Billing, refunds, balance and deletion rules require approval before activation.",
        ],
      },
    ],
  },
  "delete-account": {
    eyebrow: "Account control — draft",
    title: "Deletion will be available in the app; the flow is still being completed.",
    summary:
      "This page is informational. It has no active form, receives no requests and calls no unfinished endpoints.",
    sections: [
      {
        title: "Implementation status",
        feature: "accountDeletion",
        paragraphs: [
          "Final backend execution and the in-app experience are still being completed. No deletion can be requested through this page.",
        ],
      },
      {
        title: "Planned in-app flow",
        paragraphs: [
          "The intended experience will allow users to start deletion inside account settings, confirm intent and track the outcome once implementation is ready.",
        ],
      },
      {
        title: "Future support",
        paragraphs: [
          "Users will be able to contact support once a real channel is configured. The site does not display a fictional email.",
        ],
        pendingFields: ["supportEmail", "privacyEmail"],
      },
      {
        title: "Data that may require retention",
        paragraphs: [
          "Some information may need to be preserved for security, fraud prevention, purchase history or legal obligations. Exact periods are not approved.",
        ],
        pendingFields: [
          "accountDeletionPeriod",
          "dataRetentionSchedule",
          "purchaseRetentionPolicy",
          "diamondDeletionPolicy",
        ],
      },
    ],
  },
  "community-guidelines": {
    eyebrow: "Guidelines — draft",
    title: "A fantasy community still needs real rules.",
    summary:
      "This structure records expected behavior, future tools and moderation decisions that are not yet approved.",
    sections: [
      {
        title: "Names, images and impersonation",
        paragraphs: [
          "Names, avatars and groups should be respectful, not deceptive and should not impersonate people, teams or organizations.",
        ],
      },
      {
        title: "Harassment, hate and abuse",
        paragraphs: [
          "Harassment, threats, hate speech, targeted abuse and offensive groups will not be accepted in the final policy.",
        ],
      },
      {
        title: "Cheating and fake GPS",
        paragraphs: [
          "Location manipulation, exploit abuse, automated activity or ranking interference harms the community and may lead to restrictions.",
        ],
      },
      {
        title: "Reporting and blocking",
        feature: "communitySafety",
        paragraphs: [
          "Reporting and blocking tools are still in development. They must not be described as fully operational.",
        ],
      },
      {
        title: "Restrictions, review and appeals",
        paragraphs: [
          "Criteria, sanction levels, timing, evidence, appeals and support require approval and operational capacity.",
        ],
        pendingFields: ["supportEmail"],
      },
    ],
  },
  purchases: {
    eyebrow: "Future monetization — draft",
    title: "Diamonds remain in the universe, with no real purchases in beta.",
    summary:
      "Diamonds are MythStride virtual currency. Real-money purchases will not be active during this beta phase.",
    sections: [
      {
        title: "Virtual currency with no cash value",
        feature: "diamondPurchases",
        paragraphs: [
          "Diamonds have no real-world monetary value, do not represent a bank balance, cannot be withdrawn and should not be traded outside the product.",
        ],
      },
      {
        title: "Platform billing",
        paragraphs: [
          "If purchases are activated later, the structure must explain platform billing, pending transactions and duplicate-delivery protection. No storefront is active now.",
        ],
      },
      {
        title: "Refunds and chargebacks",
        paragraphs: [
          "Refund, dispute and item or balance consequences depend on platform rules, applicable law and formal decisions. No promise is published in this phase.",
        ],
        pendingFields: ["purchaseRetentionPolicy"],
      },
      {
        title: "Deletion, balance and expiry",
        paragraphs: [
          "The impact of deletion on diamonds, items and history, as well as any expiry, still needs to be defined.",
        ],
        pendingFields: ["diamondDeletionPolicy", "purchaseRetentionPolicy"],
      },
      {
        title: "Random rewards",
        paragraphs: [
          "If commercialized random rewards are adopted, probabilities and rules must be disclosed before activation. This mechanic is not presented as active.",
        ],
      },
      {
        title: "Rewarded ads",
        feature: "rewardedAds",
        paragraphs: [
          "Rewarded ads are a future possibility. There is no active integration or AdMob claim in this phase.",
        ],
      },
    ],
  },
  "ai-transparency": {
    eyebrow: "Aethron — transparency draft",
    title: "Generated content with narrative purpose and explicit limits.",
    summary:
      "This page organizes the disclosures required before public validation of Aethron.",
    sections: [
      {
        title: "What Aethron does",
        feature: "aethron",
        paragraphs: [
          "Aethron generates narrative and motivational messages from selected categories of product context. It connects the player's journey to the world of Elyndor.",
        ],
      },
      {
        title: "What Aethron does not do",
        paragraphs: [
          "Aethron does not provide diagnosis, treatment, professional health advice, performance guarantees, automated decisions with legal effect or emergency service.",
        ],
      },
      {
        title: "Context categories",
        bullets: [
          "Progress state and achievements",
          "Selected activity and events",
          "Language and tone preferences",
          "Strictly necessary product context",
        ],
        paragraphs: [
          "The final list, controls and consent still require technical and legal validation.",
        ],
      },
      {
        title: "Generated-content limitations",
        paragraphs: [
          "Messages may be wrong, incomplete, repetitive or unsuitable. The product should provide context and feedback methods without claiming infallibility.",
        ],
      },
      {
        title: "Sensitive health-context warning",
        paragraphs: [
          "Information about pain, injury, clinical conditions or health requires special care. Aethron must not interpret it as a diagnosis or prescribe action.",
        ],
      },
      {
        title: "Provider, retention and training",
        paragraphs: [
          "The provider, relevant location, retention period and whether data is used for training still require final disclosure.",
        ],
        pendingFields: [
          "aiProviderStatement",
          "aiDataTrainingStatement",
          "dataRetentionSchedule",
        ],
      },
      {
        title: "Future reporting mechanism",
        feature: "communitySafety",
        paragraphs: [
          "A way to flag inappropriate content is planned but must not be treated as operational yet.",
        ],
      },
    ],
  },
  "third-party-services": {
    eyebrow: "Third parties — draft",
    title: "Integrations require transparency before wider activation.",
    summary:
      "This structure identifies third-party categories without inventing providers, hosting or terms that are not approved.",
    sections: [
      {
        title: "Infrastructure services",
        paragraphs: [
          "Hosting, database, authentication, monitoring and delivery may involve providers. The official list, purposes and regions must be confirmed.",
        ],
      },
      {
        title: "Strava",
        feature: "strava",
        paragraphs: [
          "The integration is under validation and will depend on user authorization and applicable service rules. Scope, synchronization and disconnection must be documented.",
        ],
      },
      {
        title: "Wear OS and platforms",
        feature: "wearOs",
        paragraphs: [
          "Android and Wear OS depend on platform services. iOS and Apple Watch remain planned, with no active support announced.",
        ],
      },
      {
        title: "AI",
        feature: "aethron",
        paragraphs: [
          "The AI provider and processing terms are not published because they still depend on decision and review.",
        ],
        pendingFields: [
          "aiProviderStatement",
          "aiDataTrainingStatement",
          "dataRetentionSchedule",
        ],
      },
      {
        title: "Future billing and advertising",
        feature: "diamondPurchases",
        paragraphs: [
          "Billing or advertising services will only be described when there is real configuration and approved documentation. No purchases or advertising are active in this phase.",
        ],
      },
    ],
  },
};
