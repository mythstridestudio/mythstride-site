import type { PublicLocale } from "@/lib/locales";

export const pageSlugs = [
  "features", "how-it-works", "aethron", "wear-os", "events", "community",
  "closed-beta", "faq", "support", "privacy", "terms", "delete-account",
  "community-guidelines", "purchases", "ai-transparency", "third-party-services",
] as const;

export const publicPageSlugs = pageSlugs;
export type PageSlug = (typeof pageSlugs)[number];
export const catchAllPageSlugs = pageSlugs.filter(
  (slug): slug is Exclude<PageSlug, "delete-account"> => slug !== "delete-account",
);
export type CatchAllPageSlug = (typeof catchAllPageSlugs)[number];

export type ContentSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LocalizedPageContent = {
  eyebrow: string;
  title: string;
  summary: string;
  seoTitle?: string;
  sections: ContentSection[];
};

export function isCatchAllPageSlug(value: string): value is CatchAllPageSlug {
  return (catchAllPageSlugs as readonly string[]).includes(value);
}

export function isPageSlug(value: string): value is PageSlug {
  return (pageSlugs as readonly string[]).includes(value);
}

export function getPageContent(slug: PageSlug, locale: PublicLocale) {
  return pages[locale][slug];
}

const pages: Record<PublicLocale, Record<PageSlug, LocalizedPageContent>> = {
  "pt-BR": {
    features: {
      eyebrow: "MYTHSTRIDE", title: "Corrida, progressão e fantasia no mesmo caminho.",
      seoTitle: "Recursos do MythStride | Corrida e progressão de RPG",
      summary: "Descubra como atividade real se transforma em evolução, batalhas e identidade dentro de Elyndor.",
      sections: [
        { title: "Corridas viram progresso", paragraphs: ["Registre atividades e transforme distância elegível em progresso dentro do MythStride."], bullets: ["Registro de atividade", "Distância, duração e ritmo", "Progressão baseada em atividades elegíveis", "Proteções de integridade"] },
        { title: "Enfrente chefes", paragraphs: ["Sua distância contribui diretamente para batalhas contra criaturas de Elyndor e conecta cada corrida à progressão do RPG."] },
        { title: "Construa seu inventário", paragraphs: ["Itens, equipamentos, ouro, diamantes e relíquias registram o que você conquistou ao longo da jornada."] },
        { title: "Crie sua identidade", paragraphs: ["Conquistas, perfil, relações e participação na comunidade transformam consistência em uma história que pertence ao jogador."] },
      ],
    },
    "how-it-works": {
      eyebrow: "COMO FUNCIONA", title: "Da rua a Elyndor em quatro passos.", summary: "Entenda como uma atividade elegível se transforma em progresso dentro do MythStride.",
      sections: [
        { title: "1. Registre sua corrida", paragraphs: ["Inicie uma atividade e acompanhe os principais dados da sua corrida."] },
        { title: "2. Valide seu progresso", paragraphs: ["O MythStride avalia a atividade e determina o progresso elegível para os sistemas do jogo."] },
        { title: "3. Avance em Elyndor", paragraphs: ["Distância elegível alimenta progressão, missões e batalhas contra chefes."] },
        { title: "4. Construa sua história", paragraphs: ["Colecione equipamentos, desbloqueie conquistas, participe da comunidade e acompanhe tudo o que sua consistência construiu."] },
      ],
    },
    aethron: {
      eyebrow: "GUARDIÃO DA CHAMA", title: "O Guardião da Chama", seoTitle: "Aethron | Companheiro narrativo do MythStride",
      summary: "Aethron acompanha a jornada do jogador e conecta acontecimentos do mundo real à narrativa de Elyndor.",
      sections: [
        { title: "Contexto da jornada", paragraphs: ["Progresso, corridas, missões e acontecimentos relevantes podem ser utilizados para produzir mensagens coerentes com a experiência do jogador."] },
        { title: "Conteúdo gerado por IA", paragraphs: ["As respostas de Aethron são geradas automaticamente e podem conter imprecisões. Elas devem ser interpretadas como parte da experiência narrativa do MythStride."] },
        { title: "Saúde", paragraphs: ["Aethron não é médico, treinador ou serviço de emergência. Suas mensagens não substituem avaliação, diagnóstico, tratamento ou orientação de profissionais qualificados."] },
      ],
    },
    "wear-os": {
      eyebrow: "MYTHSTRIDE NO PULSO", title: "Corrida e RPG no seu pulso.", seoTitle: "MythStride para Wear OS | Corrida e RPG no pulso",
      summary: "A experiência para Wear OS complementa o aplicativo Android durante a atividade.",
      sections: [
        { title: "Informações essenciais", paragraphs: ["Acompanhe dados essenciais da corrida diretamente no pulso enquanto o aplicativo Android mantém sua jornada conectada a Elyndor."] },
        { title: "Uma única jornada", paragraphs: ["Celular e relógio trabalham como partes da mesma experiência de atividade e progressão."] },
      ],
    },
    events: {
      eyebrow: "EVENTOS", title: "Quando a comunidade corre, Elyndor responde.", summary: "Eventos conectam objetivos, batalhas, recompensas e participação em experiências compartilhadas.",
      sections: [
        { title: "Eventos", paragraphs: ["Participe de desafios com objetivos e recompensas definidos dentro do MythStride."] },
        { title: "Chefes", paragraphs: ["Contribua com atividades elegíveis e avance encontros que transformam esforço individual em batalha."] },
        { title: "Objetivos", paragraphs: ["Acompanhe metas do evento e descubra novas razões para voltar ao caminho."] },
        { title: "Recompensas", paragraphs: ["Conquistas e recompensas registram sua participação nos momentos que marcaram Elyndor."] },
      ],
    },
    community: {
      eyebrow: "COMUNIDADE", title: "A jornada fica maior quando é compartilhada.", summary: "Amigos, grupos, eventos e rankings conectam Striders dentro do MythStride.",
      sections: [
        { title: "Amigos", paragraphs: ["Crie conexões e acompanhe outros jogadores ao longo da jornada."] },
        { title: "Grupos", paragraphs: ["Reúna sua comunidade e compartilhe objetivos dentro do MythStride."] },
        { title: "Ranking semanal", paragraphs: ["Atividades elegíveis alimentam uma disputa renovada a cada semana."] },
        { title: "Jogo limpo", paragraphs: ["Manipulação de localização, automação indevida, exploração de falhas e outras formas de trapaça prejudicam a experiência e podem resultar em restrições de conta."] },
      ],
    },
    "closed-beta": {
      eyebrow: "BETA FECHADO PARA ANDROID", title: "Entre no início da jornada.", summary: "O beta fechado reúne os primeiros jogadores que terão acesso ao MythStride para Android.",
      sections: [
        { title: "O que você encontrará", paragraphs: ["Uma experiência que conecta atividade real e fantasia."], bullets: ["Corridas e progressão", "Missões", "Batalhas contra chefes", "Inventário e equipamentos", "Conquistas", "Eventos", "Amigos e comunidade", "Aethron"] },
        { title: "Convites", paragraphs: ["Os convites são enviados por email de acordo com a disponibilidade de vagas e compatibilidade do dispositivo Android."] },
        { title: "Participação", paragraphs: ["A participação no beta fechado é destinada a pessoas com 18 anos ou mais."] },
        { title: "Espada do Fundador", paragraphs: ["Participantes elegíveis convidados para esta fase recebem a Espada do Fundador, uma relíquia exclusiva vinculada à jornada no MythStride."] },
        { title: "Monetização", paragraphs: ["Compras com dinheiro real não fazem parte do beta fechado atual."] },
      ],
    },
    faq: {
      eyebrow: "PERGUNTAS FREQUENTES", title: "Tudo sobre o MythStride e o beta fechado.", summary: "Respostas diretas sobre acesso, progressão, Aethron, compras e conta.",
      sections: [
        { title: "O MythStride já está disponível?", paragraphs: ["O MythStride está em beta fechado para Android. O acesso é liberado por convite para participantes selecionados da lista do beta."] },
        { title: "Como minhas corridas viram progresso?", paragraphs: ["Atividades elegíveis são processadas pelo MythStride e utilizadas para alimentar progressão, missões, batalhas e outros sistemas do jogo."] },
        { title: "Aethron é um treinador?", paragraphs: ["Não. Aethron é um companheiro narrativo baseado em inteligência artificial. Ele não oferece diagnóstico, tratamento ou orientação profissional de saúde."] },
        { title: "Existem compras com dinheiro real?", paragraphs: ["Compras com dinheiro real não fazem parte do beta fechado atual. Diamantes existentes no jogo são moeda virtual e não possuem valor monetário fora do MythStride."] },
        { title: "Posso excluir minha conta?", paragraphs: ["Sim. O MythStride disponibiliza um fluxo público de solicitação de exclusão com verificação do email associado à conta."] },
      ],
    },
    support: {
      eyebrow: "SUPORTE", title: "Como podemos ajudar?", seoTitle: "Suporte | MythStride", summary: "Encontre ajuda sobre conta, acesso ao beta, corridas, privacidade, comunidade e exclusão de dados.",
      sections: [
        { title: "Conta e acesso", paragraphs: ["Para questões relacionadas à conta ou ao acesso ao beta, entre em contato informando o email associado à sua conta e uma descrição do problema. Nunca envie sua senha."] },
        { title: "Corridas e progressão", paragraphs: ["Se uma atividade não aparecer como esperado, informe data aproximada, dispositivo utilizado e uma descrição do ocorrido. Evite enviar dados pessoais desnecessários."] },
        { title: "Privacidade e conta", paragraphs: ["Você pode consultar a Política de Privacidade e utilizar o fluxo de exclusão de conta a qualquer momento."] },
        { title: "Contato", paragraphs: ["contato@playmythstride.com"] },
        { title: "Emergências", paragraphs: ["MythStride não é um serviço médico ou de emergência. Em situações urgentes, procure os serviços de emergência disponíveis na sua região."] },
      ],
    },
    privacy: {
      eyebrow: "PRIVACIDADE", title: "Política de Privacidade", seoTitle: "Política de Privacidade | MythStride", summary: "Saiba como o MythStride trata informações utilizadas no site, na lista do beta e nos serviços do jogo. Vigente desde 14 de setembro de 2026.",
      sections: [
        { title: "Sobre esta política", paragraphs: ["Esta Política de Privacidade explica como o MythStride coleta, utiliza, protege e trata informações relacionadas ao site, à lista do beta e aos serviços MythStride."] },
        { title: "Informações tratadas", paragraphs: ["Dependendo dos recursos utilizados, o MythStride pode tratar as seguintes categorias de dados."], bullets: ["Dados de conta, autenticação, perfil e nome de exibição", "Dados de corrida, como distância, duração, ritmo e percurso", "Localização necessária para registrar ou validar atividades", "Informações de dispositivo e sinais de segurança e prevenção de fraude", "Integrações autorizadas, comunidade, amizades, grupos e rankings", "Solicitações de suporte, progresso, inventário e conquistas", "Contexto necessário aos recursos de Aethron", "Email, idioma e dados técnicos necessários à lista do beta"] },
        { title: "Finalidades", paragraphs: ["Utilizamos informações para operar o serviço, fornecer funcionalidades, calcular progressão, prevenir fraude, proteger contas, oferecer suporte e manter a estabilidade e a segurança do MythStride."] },
        { title: "Localização", paragraphs: ["Dados de localização podem ser utilizados quando necessários para registrar ou validar uma atividade. O MythStride não utiliza a localização para publicidade comportamental."] },
        { title: "Aethron", paragraphs: ["Contexto selecionado da jornada pode ser utilizado para produzir conteúdo narrativo. O conteúdo pode conter erros e não substitui diagnóstico, tratamento, orientação médica, treinamento profissional ou serviços de emergência."] },
        { title: "Prestadores e integrações", paragraphs: ["O MythStride pode utilizar prestadores necessários para infraestrutura, comunicação, autenticação, segurança e integrações. Eles recebem apenas as informações necessárias para suas funções."] },
        { title: "Venda de dados", paragraphs: ["Não vendemos dados pessoais."] },
        { title: "Retenção", paragraphs: ["Mantemos dados apenas pelo período necessário às finalidades do serviço, ao cumprimento de obrigações legais, à segurança e ao exercício regular de direitos."] },
        { title: "Segurança", paragraphs: ["Adotamos medidas técnicas e organizacionais destinadas a proteger informações, embora nenhum sistema conectado à internet possa garantir segurança absoluta."] },
        { title: "Seus direitos", paragraphs: ["Dependendo da legislação aplicável, você pode solicitar confirmação de tratamento, acesso, correção, informações sobre compartilhamento, oposição, portabilidade quando aplicável e exclusão de dados pessoais."] },
        { title: "Exclusão", paragraphs: ["Você pode utilizar o fluxo público de solicitação de exclusão da conta disponível nesta página."] },
        { title: "Idade", paragraphs: ["O MythStride é destinado a pessoas com 18 anos ou mais."] },
        { title: "Contato", paragraphs: ["contato@playmythstride.com"] },
        { title: "Atualizações", paragraphs: ["Esta política poderá ser atualizada para refletir alterações no serviço ou requisitos legais. A data de vigência aparecerá nesta página."] },
      ],
    },
    terms: {
      eyebrow: "MYTHSTRIDE", title: "Termos de Uso", seoTitle: "Termos de Uso | MythStride", summary: "Vigentes desde 14 de setembro de 2026. Estes termos regem o uso do beta e dos serviços MythStride.",
      sections: [
        { title: "Aceitação e elegibilidade", paragraphs: ["Ao criar uma conta, participar do beta ou utilizar os serviços MythStride, você concorda com estes Termos e com as políticas aplicáveis. O beta fechado é destinado a usuários com 18 anos ou mais e o acesso pode depender de convite, região, compatibilidade técnica e vagas."] },
        { title: "Conta", paragraphs: ["Você é responsável por manter suas credenciais seguras e pelas atividades realizadas por meio da sua conta. Não compartilhe senhas ou códigos de autenticação."] },
        { title: "Atividade física", paragraphs: ["Você é responsável por avaliar suas condições pessoais, o ambiente e a segurança da atividade. MythStride não substitui orientação médica ou profissional e não garante resultados físicos ou de desempenho."] },
        { title: "Integridade e comunidade", paragraphs: ["É proibido manipular localização, automatizar atividades, explorar falhas, alterar dados, fraudar recompensas ou interferir no serviço. Conteúdo, nomes, imagens e interações devem respeitar as Diretrizes da Comunidade."] },
        { title: "Conteúdo e propriedade intelectual", paragraphs: ["MythStride, Elyndor, Aethron, personagens, elementos visuais, textos, software e demais conteúdos protegidos permanecem de propriedade de seus respectivos titulares."] },
        { title: "Itens, moedas e beta", paragraphs: ["Itens, ouro, diamantes e demais elementos virtuais existem exclusivamente dentro do MythStride e não representam dinheiro, investimento ou ativo resgatável. Recursos, regras de balanceamento e conteúdo podem mudar durante o beta para preservar estabilidade, integridade e qualidade."] },
        { title: "Aethron e encerramento", paragraphs: ["Conteúdo gerado automaticamente pode conter erros e não substitui orientação profissional, médica ou de emergência. Podemos restringir ou encerrar contas por violação destes Termos, fraude, risco de segurança ou abuso."] },
        { title: "Legislação e contato", paragraphs: ["Estes Termos são interpretados de acordo com as leis da República Federativa do Brasil, sem afastar direitos obrigatórios do usuário.", "Contato: contato@playmythstride.com"] },
      ],
    },
    "delete-account": {
      eyebrow: "CONTROLE DA CONTA", title: "Exclusão de conta", summary: "Você pode solicitar a exclusão da sua conta MythStride utilizando o email associado a ela.",
      sections: [
        { title: "Verificação", paragraphs: ["Após a solicitação, enviaremos um link de verificação para confirmar a titularidade da conta. A resposta da página não revela se determinado email está cadastrado."] },
        { title: "Processamento", paragraphs: ["Depois da confirmação, a solicitação será processada de acordo com a Política de Privacidade."] },
        { title: "Retenção aplicável", paragraphs: ["Determinados registros podem ser preservados quando exigidos ou permitidos por lei, segurança, prevenção de fraude ou exercício regular de direitos."] },
      ],
    },
    "community-guidelines": {
      eyebrow: "COMUNIDADE", title: "Diretrizes da Comunidade", summary: "MythStride foi criado para transformar disciplina em aventura. A comunidade deve tornar essa jornada melhor, não hostil.",
      sections: [
        { title: "Respeite outros jogadores", paragraphs: ["Não são permitidos assédio, ameaças, perseguição, discurso de ódio, discriminação ou abuso direcionado."] },
        { title: "Seja quem você diz ser", paragraphs: ["Não utilize nomes, imagens ou identidades para enganar, personificar terceiros ou representar falsamente pessoas ou organizações."] },
        { title: "Jogue limpo", paragraphs: ["GPS falso, automação de atividades, manipulação de dados, exploração deliberada de falhas e tentativas de obter progressão indevida violam estas diretrizes."] },
        { title: "Proteja a comunidade", paragraphs: ["Conteúdos ou comportamentos que coloquem outros jogadores em risco podem ser analisados e resultar em restrições."] },
        { title: "Medidas e contato", paragraphs: ["Violações podem resultar em advertência, remoção de conteúdo, limitação de recursos, suspensão ou encerramento da conta, conforme gravidade e recorrência.", "Contato: contato@playmythstride.com"] },
      ],
    },
    purchases: {
      eyebrow: "ECONOMIA DO JOGO", title: "Itens e moedas virtuais", summary: "O MythStride utiliza itens e moedas virtuais como parte da progressão do jogo.",
      sections: [
        { title: "Diamantes", paragraphs: ["Diamantes são moeda virtual utilizada exclusivamente dentro do MythStride. Não possuem valor monetário fora do serviço, não são investimento e não podem ser convertidos diretamente em dinheiro."] },
        { title: "Beta fechado", paragraphs: ["Compras com dinheiro real não estão disponíveis no beta fechado atual."] },
      ],
    },
    "ai-transparency": {
      eyebrow: "AETHRON", title: "Aethron e inteligência artificial", summary: "Aethron utiliza inteligência artificial para criar conteúdo narrativo conectado à jornada do jogador.",
      sections: [
        { title: "O que Aethron faz", paragraphs: ["Aethron utiliza contexto selecionado da experiência para gerar mensagens, reações e elementos narrativos relacionados ao progresso do jogador."] },
        { title: "Limitações", paragraphs: ["Conteúdo gerado automaticamente pode ser impreciso, incompleto ou inadequado ao contexto."] },
        { title: "Saúde", paragraphs: ["Aethron não realiza diagnóstico, não prescreve tratamento e não substitui profissionais de saúde, treinamento ou serviços de emergência."] },
        { title: "Dados e controle", paragraphs: ["Somente o contexto necessário à funcionalidade deve ser utilizado. O tratamento segue a Política de Privacidade. Questões podem ser encaminhadas para contato@playmythstride.com."] },
      ],
    },
    "third-party-services": {
      eyebrow: "INTEGRAÇÕES", title: "Serviços e integrações", summary: "Alguns recursos do MythStride utilizam serviços externos necessários para autenticação, infraestrutura, comunicação e integrações escolhidas pelo jogador.",
      sections: [
        { title: "Integrações", paragraphs: ["Quando você conecta um serviço externo ao MythStride, o acesso aos dados depende da sua autorização e das permissões oferecidas pelo respectivo serviço."] },
        { title: "Desconexão", paragraphs: ["Integrações podem ser desconectadas pelos meios disponibilizados pelo MythStride ou pelo próprio serviço externo, quando aplicável."] },
        { title: "Prestadores", paragraphs: ["Prestadores de infraestrutura, email, autenticação, segurança e processamento podem tratar informações estritamente necessárias para fornecer suas funções."] },
        { title: "Privacidade", paragraphs: ["O tratamento realizado diretamente pelo MythStride segue nossa Política de Privacidade. Serviços externos também podem possuir termos e políticas próprios."] },
      ],
    },
  },
  en: {
    features: { eyebrow: "MYTHSTRIDE", title: "Running, progression, and fantasy on the same path.", seoTitle: "MythStride features | Running and RPG progression", summary: "Discover how real activity becomes growth, battles, and identity in Elyndor.", sections: [
      { title: "Runs become progress", paragraphs: ["Track activities and turn eligible distance into progress within MythStride."], bullets: ["Activity tracking", "Distance, duration, and pace", "Progression based on eligible activities", "Integrity safeguards"] },
      { title: "Face bosses", paragraphs: ["Your distance contributes directly to battles against Elyndor's creatures and connects every run to RPG progression."] },
      { title: "Build your inventory", paragraphs: ["Items, equipment, gold, diamonds, and relics record what you earn throughout the journey."] },
      { title: "Create your identity", paragraphs: ["Achievements, profiles, relationships, and community participation turn consistency into a story that belongs to you."] },
    ] },
    "how-it-works": { eyebrow: "HOW IT WORKS", title: "From the road to Elyndor in four steps.", summary: "See how an eligible activity becomes progress in MythStride.", sections: [
      { title: "1. Track your run", paragraphs: ["Start an activity and follow the essential details of your run."] },
      { title: "2. Validate your progress", paragraphs: ["MythStride evaluates the activity and determines the progress eligible for game systems."] },
      { title: "3. Advance through Elyndor", paragraphs: ["Eligible distance fuels progression, quests, and boss battles."] },
      { title: "4. Build your story", paragraphs: ["Collect equipment, unlock achievements, join the community, and follow everything your consistency has built."] },
    ] },
    aethron: { eyebrow: "KEEPER OF THE FLAME", title: "The Keeper of the Flame", seoTitle: "Aethron | MythStride's narrative companion", summary: "Aethron follows the player's journey and connects real-world events to the story of Elyndor.", sections: [
      { title: "Journey context", paragraphs: ["Progress, runs, quests, and relevant events may be used to create messages consistent with the player's experience."] },
      { title: "AI-generated content", paragraphs: ["Aethron's responses are generated automatically and may contain inaccuracies. They should be understood as part of MythStride's narrative experience."] },
      { title: "Health", paragraphs: ["Aethron is not a doctor, coach, or emergency service. Its messages do not replace evaluation, diagnosis, treatment, or advice from qualified professionals."] },
    ] },
    "wear-os": { eyebrow: "MYTHSTRIDE ON YOUR WRIST", title: "Running and RPG on your wrist.", seoTitle: "MythStride for Wear OS | Running and RPG on your wrist", summary: "The Wear OS experience complements the Android app during activity.", sections: [
      { title: "Essential information", paragraphs: ["Keep essential run information accessible on your wrist while the Android app connects your journey to Elyndor."] },
      { title: "One journey", paragraphs: ["Phone and watch work as parts of the same activity and progression experience."] },
    ] },
    events: { eyebrow: "EVENTS", title: "When the community runs, Elyndor responds.", summary: "Events connect goals, battles, rewards, and participation through shared experiences.", sections: [
      { title: "Events", paragraphs: ["Take part in challenges with defined goals and rewards inside MythStride."] }, { title: "Bosses", paragraphs: ["Contribute eligible activities and advance encounters that turn individual effort into battle."] }, { title: "Goals", paragraphs: ["Follow event objectives and find new reasons to return to the path."] }, { title: "Rewards", paragraphs: ["Achievements and rewards record your part in the moments that shaped Elyndor."] },
    ] },
    community: { eyebrow: "COMMUNITY", title: "The journey grows when it is shared.", summary: "Friends, groups, events, and rankings connect Striders inside MythStride.", sections: [
      { title: "Friends", paragraphs: ["Build connections and follow other players through the journey."] }, { title: "Groups", paragraphs: ["Bring your community together and share goals within MythStride."] }, { title: "Weekly ranking", paragraphs: ["Eligible activities fuel a competition renewed every week."] }, { title: "Fair play", paragraphs: ["Location manipulation, improper automation, exploit abuse, and other forms of cheating harm the experience and may result in account restrictions."] },
    ] },
    "closed-beta": { eyebrow: "ANDROID CLOSED BETA", title: "Join at the beginning of the journey.", summary: "The closed beta brings together the first players who will receive access to MythStride for Android.", sections: [
      { title: "What you will find", paragraphs: ["An experience connecting real activity and fantasy."], bullets: ["Runs and progression", "Quests", "Boss battles", "Inventory and equipment", "Achievements", "Events", "Friends and community", "Aethron"] },
      { title: "Invitations", paragraphs: ["Invitations are sent by email according to available places and Android device compatibility."] }, { title: "Participation", paragraphs: ["The closed beta is intended for people aged 18 or older."] }, { title: "Founder Sword", paragraphs: ["Eligible participants invited to this phase receive the Founder Sword, an exclusive relic tied to their MythStride journey."] }, { title: "Monetization", paragraphs: ["Real-money purchases are not part of the current closed beta."] },
    ] },
    faq: { eyebrow: "FREQUENTLY ASKED QUESTIONS", title: "Everything about MythStride and the closed beta.", summary: "Straight answers about access, progression, Aethron, purchases, and accounts.", sections: [
      { title: "Is MythStride available?", paragraphs: ["MythStride is in closed beta for Android. Access is invite-only for participants selected from the beta list."] }, { title: "How do my runs become progress?", paragraphs: ["MythStride processes eligible activities and uses them to fuel progression, quests, battles, and other game systems."] }, { title: "Is Aethron a coach?", paragraphs: ["No. Aethron is an AI-powered narrative companion. It does not provide diagnosis, treatment, or professional health advice."] }, { title: "Are there real-money purchases?", paragraphs: ["Real-money purchases are not part of the current closed beta. Diamonds are virtual game currency and have no monetary value outside MythStride."] }, { title: "Can I delete my account?", paragraphs: ["Yes. MythStride provides a public deletion request flow that verifies the email associated with the account."] },
    ] },
    support: { eyebrow: "SUPPORT", title: "How can we help?", seoTitle: "Support | MythStride", summary: "Find help with accounts, beta access, runs, privacy, community, and data deletion.", sections: [
      { title: "Account and access", paragraphs: ["For account or beta-access questions, contact us with the email linked to your account and a description of the issue. Never send your password."] }, { title: "Runs and progression", paragraphs: ["If an activity does not appear as expected, include the approximate date, device used, and a description. Avoid unnecessary personal data."] }, { title: "Privacy and accounts", paragraphs: ["You can read the Privacy Policy and use the account deletion flow at any time."] }, { title: "Contact", paragraphs: ["contato@playmythstride.com"] }, { title: "Emergencies", paragraphs: ["MythStride is not a medical or emergency service. In urgent situations, contact the emergency services available in your region."] },
    ] },
    privacy: { eyebrow: "PRIVACY", title: "Privacy Policy", seoTitle: "Privacy Policy | MythStride", summary: "Learn how MythStride handles information used on the website, beta list, and game services. Effective September 14, 2026.", sections: [
      { title: "About this policy", paragraphs: ["This Privacy Policy explains how MythStride collects, uses, protects, and handles information related to the website, beta list, and MythStride services."] },
      { title: "Information we handle", paragraphs: ["Depending on the features you use, MythStride may handle the following categories."], bullets: ["Account, authentication, profile, and display-name data", "Run data such as distance, duration, pace, and route", "Location needed to record or validate activities", "Device information and security and fraud-prevention signals", "Authorized integrations, community, friendships, groups, and rankings", "Support requests, progression, inventory, and achievements", "Context required for Aethron", "Email, language, and technical data needed for the beta list"] },
      { title: "Purposes", paragraphs: ["We use information to operate the service, provide features, calculate progression, prevent fraud, protect accounts, provide support, and maintain stability and security."] },
      { title: "Location", paragraphs: ["Location data may be used when needed to record or validate an activity. MythStride does not use location for behavioral advertising."] },
      { title: "Aethron", paragraphs: ["Selected context from the player's journey may be used to produce narrative content. The content may contain errors and does not replace diagnosis, treatment, medical advice, professional coaching, or emergency services."] },
      { title: "Service providers and integrations", paragraphs: ["MythStride may use providers needed for infrastructure, communication, authentication, security, and integrations. They receive only the information needed for their functions."] },
      { title: "Sale of data", paragraphs: ["We do not sell personal data."] },
      { title: "Retention", paragraphs: ["We keep data only as long as needed for service purposes, legal obligations, security, and the exercise of legal rights."] },
      { title: "Security", paragraphs: ["We use technical and organizational measures intended to protect information, although no internet-connected system can guarantee absolute security."] },
      { title: "Your rights", paragraphs: ["Depending on applicable law, you may request confirmation of processing, access, correction, sharing information, objection, portability where applicable, and deletion of personal data."] },
      { title: "Deletion", paragraphs: ["You can use the public account deletion request flow linked on this page."] },
      { title: "Age", paragraphs: ["MythStride is intended for people aged 18 or older."] },
      { title: "Contact", paragraphs: ["contato@playmythstride.com"] },
      { title: "Updates", paragraphs: ["We may update this policy to reflect service or legal changes. The effective date will appear on this page."] },
    ] },
    terms: { eyebrow: "MYTHSTRIDE", title: "Terms of Use", seoTitle: "Terms of Use | MythStride", summary: "Effective September 14, 2026. These terms govern the use of the MythStride beta and services.", sections: [
      { title: "Acceptance and eligibility", paragraphs: ["By creating an account, joining the beta, or using MythStride services, you agree to these Terms and applicable policies. The closed beta is for users aged 18 or older, and access may depend on invitation, region, technical compatibility, and capacity."] }, { title: "Account", paragraphs: ["You are responsible for protecting your credentials and for activity through your account. Never share passwords or authentication codes."] }, { title: "Physical activity", paragraphs: ["You are responsible for assessing your personal condition, surroundings, and activity safety. MythStride does not replace medical or professional advice and does not guarantee fitness or performance outcomes."] }, { title: "Integrity and community", paragraphs: ["You may not manipulate location, automate activities, exploit faults, alter data, defraud rewards, or interfere with the service. Content, names, images, and interactions must follow the Community Guidelines."] }, { title: "Content and intellectual property", paragraphs: ["MythStride, Elyndor, Aethron, characters, visuals, text, software, and other protected content remain the property of their respective owners."] }, { title: "Items, currency, and beta", paragraphs: ["Items, gold, diamonds, and other virtual elements exist only within MythStride and are not money, investments, or redeemable assets. Features, balance rules, and content may change during beta to preserve stability, integrity, and quality."] }, { title: "Aethron and termination", paragraphs: ["Automatically generated content may contain errors and does not replace professional, medical, or emergency advice. We may restrict or terminate accounts for violations, fraud, security risks, or abuse."] }, { title: "Law and contact", paragraphs: ["These Terms are interpreted under the applicable laws of the Federative Republic of Brazil without limiting mandatory user rights.", "Contact: contato@playmythstride.com"] },
    ] },
    "delete-account": { eyebrow: "ACCOUNT CONTROL", title: "Account deletion", summary: "You can request deletion of your MythStride account using its associated email.", sections: [
      { title: "Verification", paragraphs: ["After the request, we will send a verification link to confirm account ownership. The page response does not reveal whether an email is registered."] }, { title: "Processing", paragraphs: ["After confirmation, the request will be processed in accordance with the Privacy Policy."] }, { title: "Applicable retention", paragraphs: ["Certain records may be preserved when required or permitted by law, security, fraud prevention, or the exercise of legal rights."] },
    ] },
    "community-guidelines": { eyebrow: "COMMUNITY", title: "Community Guidelines", summary: "MythStride turns discipline into adventure. The community should make that journey better, not hostile.", sections: [
      { title: "Respect other players", paragraphs: ["Harassment, threats, stalking, hate speech, discrimination, and targeted abuse are not allowed."] }, { title: "Be who you say you are", paragraphs: ["Do not use names, images, or identities to deceive, impersonate others, or misrepresent people or organizations."] }, { title: "Play fair", paragraphs: ["Fake GPS, activity automation, data manipulation, deliberate exploitation, and attempts to gain improper progression violate these guidelines."] }, { title: "Protect the community", paragraphs: ["Content or behavior that puts other players at risk may be reviewed and lead to restrictions."] }, { title: "Actions and contact", paragraphs: ["Violations may result in warnings, content removal, feature limitations, suspension, or account termination depending on severity and recurrence.", "Contact: contato@playmythstride.com"] },
    ] },
    purchases: { eyebrow: "GAME ECONOMY", title: "Items and virtual currency", summary: "MythStride uses items and virtual currency as part of game progression.", sections: [
      { title: "Diamonds", paragraphs: ["Diamonds are virtual currency used only within MythStride. They have no monetary value outside the service, are not an investment, and cannot be converted directly into money."] }, { title: "Closed beta", paragraphs: ["Real-money purchases are not available in the current closed beta."] },
    ] },
    "ai-transparency": { eyebrow: "AETHRON", title: "Aethron and artificial intelligence", summary: "Aethron uses artificial intelligence to create narrative content connected to the player's journey.", sections: [
      { title: "What Aethron does", paragraphs: ["Aethron uses selected context from the experience to generate messages, reactions, and narrative elements related to player progress."] }, { title: "Limitations", paragraphs: ["Automatically generated content may be inaccurate, incomplete, or unsuitable for the context."] }, { title: "Health", paragraphs: ["Aethron does not diagnose, prescribe treatment, or replace health professionals, coaches, or emergency services."] }, { title: "Data and control", paragraphs: ["Only context needed for the feature should be used. Processing follows the Privacy Policy. Questions can be sent to contato@playmythstride.com."] },
    ] },
    "third-party-services": { eyebrow: "INTEGRATIONS", title: "Services and integrations", summary: "Some MythStride features use external services needed for authentication, infrastructure, communication, and integrations chosen by the player.", sections: [
      { title: "Integrations", paragraphs: ["When you connect an external service to MythStride, data access depends on your authorization and the permissions offered by that service."] }, { title: "Disconnecting", paragraphs: ["Integrations can be disconnected through MythStride or the external service where applicable."] }, { title: "Providers", paragraphs: ["Infrastructure, email, authentication, security, and processing providers may handle information strictly necessary to perform their functions."] }, { title: "Privacy", paragraphs: ["Processing carried out by MythStride follows our Privacy Policy. External services may also have their own terms and policies."] },
    ] },
  },
  es: {
    features: { eyebrow: "MYTHSTRIDE", title: "Carrera, progreso y fantasía en un mismo camino.", seoTitle: "Funciones de MythStride | Carrera y progreso de RPG", summary: "Descubre cómo la actividad real se convierte en evolución, batallas e identidad dentro de Elyndor.", sections: [
      { title: "Las carreras se convierten en progreso", paragraphs: ["Registra actividades y convierte la distancia elegible en progreso dentro de MythStride."], bullets: ["Registro de actividad", "Distancia, duración y ritmo", "Progreso basado en actividades elegibles", "Protecciones de integridad"] }, { title: "Enfréntate a jefes", paragraphs: ["Tu distancia contribuye directamente a las batallas contra criaturas de Elyndor y conecta cada carrera con el progreso del RPG."] }, { title: "Construye tu inventario", paragraphs: ["Los objetos, el equipo, el oro, los diamantes y las reliquias registran lo que consigues durante el viaje."] }, { title: "Crea tu identidad", paragraphs: ["Los logros, el perfil, las relaciones y la comunidad convierten la constancia en una historia que te pertenece."] },
    ] },
    "how-it-works": { eyebrow: "CÓMO FUNCIONA", title: "De la calle a Elyndor en cuatro pasos.", summary: "Descubre cómo una actividad elegible se convierte en progreso en MythStride.", sections: [
      { title: "1. Registra tu carrera", paragraphs: ["Inicia una actividad y sigue los datos principales de tu carrera."] }, { title: "2. Valida tu progreso", paragraphs: ["MythStride evalúa la actividad y determina el progreso elegible para los sistemas del juego."] }, { title: "3. Avanza en Elyndor", paragraphs: ["La distancia elegible impulsa el progreso, las misiones y las batallas contra jefes."] }, { title: "4. Construye tu historia", paragraphs: ["Colecciona equipo, desbloquea logros, participa en la comunidad y contempla todo lo que ha construido tu constancia."] },
    ] },
    aethron: { eyebrow: "GUARDIÁN DE LA LLAMA", title: "El Guardián de la Llama", seoTitle: "Aethron | Compañero narrativo de MythStride", summary: "Aethron acompaña el viaje del jugador y conecta acontecimientos del mundo real con la narrativa de Elyndor.", sections: [
      { title: "Contexto del viaje", paragraphs: ["El progreso, las carreras, las misiones y los acontecimientos relevantes pueden utilizarse para producir mensajes coherentes con la experiencia del jugador."] }, { title: "Contenido generado por IA", paragraphs: ["Las respuestas de Aethron se generan automáticamente y pueden contener imprecisiones. Deben interpretarse como parte de la experiencia narrativa de MythStride."] }, { title: "Salud", paragraphs: ["Aethron no es médico, entrenador ni servicio de emergencia. Sus mensajes no sustituyen la evaluación, el diagnóstico, el tratamiento ni la orientación de profesionales cualificados."] },
    ] },
    "wear-os": { eyebrow: "MYTHSTRIDE EN TU MUÑECA", title: "Carrera y RPG en tu muñeca.", seoTitle: "MythStride para Wear OS | Carrera y RPG en tu muñeca", summary: "La experiencia para Wear OS complementa la aplicación Android durante la actividad.", sections: [
      { title: "Información esencial", paragraphs: ["Mantén accesibles los datos esenciales de la carrera en tu muñeca mientras la aplicación Android conecta tu viaje con Elyndor."] }, { title: "Un solo viaje", paragraphs: ["El móvil y el reloj funcionan como partes de la misma experiencia de actividad y progreso."] },
    ] },
    events: { eyebrow: "EVENTOS", title: "Cuando la comunidad corre, Elyndor responde.", summary: "Los eventos conectan objetivos, batallas, recompensas y participación en experiencias compartidas.", sections: [
      { title: "Eventos", paragraphs: ["Participa en desafíos con objetivos y recompensas definidos dentro de MythStride."] }, { title: "Jefes", paragraphs: ["Contribuye con actividades elegibles y avanza en encuentros que convierten el esfuerzo individual en batalla."] }, { title: "Objetivos", paragraphs: ["Sigue las metas del evento y descubre nuevas razones para volver al camino."] }, { title: "Recompensas", paragraphs: ["Los logros y las recompensas registran tu participación en los momentos que marcaron Elyndor."] },
    ] },
    community: { eyebrow: "COMUNIDAD", title: "El viaje crece cuando se comparte.", summary: "Amigos, grupos, eventos y clasificaciones conectan a los Striders dentro de MythStride.", sections: [
      { title: "Amigos", paragraphs: ["Crea conexiones y sigue a otros jugadores a lo largo del viaje."] }, { title: "Grupos", paragraphs: ["Reúne a tu comunidad y comparte objetivos dentro de MythStride."] }, { title: "Clasificación semanal", paragraphs: ["Las actividades elegibles alimentan una competición renovada cada semana."] }, { title: "Juego limpio", paragraphs: ["La manipulación de ubicación, la automatización indebida, la explotación de fallos y otras trampas perjudican la experiencia y pueden causar restricciones de cuenta."] },
    ] },
    "closed-beta": { eyebrow: "BETA CERRADA PARA ANDROID", title: "Únete al comienzo del viaje.", summary: "La beta cerrada reúne a los primeros jugadores que tendrán acceso a MythStride para Android.", sections: [
      { title: "Lo que encontrarás", paragraphs: ["Una experiencia que conecta actividad real y fantasía."], bullets: ["Carreras y progreso", "Misiones", "Batallas contra jefes", "Inventario y equipo", "Logros", "Eventos", "Amigos y comunidad", "Aethron"] }, { title: "Invitaciones", paragraphs: ["Las invitaciones se envían por email según las plazas disponibles y la compatibilidad del dispositivo Android."] }, { title: "Participación", paragraphs: ["La beta cerrada está destinada a personas de 18 años o más."] }, { title: "Espada del Fundador", paragraphs: ["Los participantes elegibles invitados a esta fase reciben la Espada del Fundador, una reliquia exclusiva vinculada a su viaje en MythStride."] }, { title: "Monetización", paragraphs: ["Las compras con dinero real no forman parte de la beta cerrada actual."] },
    ] },
    faq: { eyebrow: "PREGUNTAS FRECUENTES", title: "Todo sobre MythStride y la beta cerrada.", summary: "Respuestas directas sobre acceso, progreso, Aethron, compras y cuentas.", sections: [
      { title: "¿MythStride ya está disponible?", paragraphs: ["MythStride está en beta cerrada para Android. El acceso se realiza por invitación para participantes seleccionados de la lista."] }, { title: "¿Cómo se convierten mis carreras en progreso?", paragraphs: ["MythStride procesa las actividades elegibles y las utiliza para impulsar el progreso, las misiones, las batallas y otros sistemas del juego."] }, { title: "¿Aethron es un entrenador?", paragraphs: ["No. Aethron es un compañero narrativo basado en inteligencia artificial. No ofrece diagnóstico, tratamiento ni orientación profesional de salud."] }, { title: "¿Hay compras con dinero real?", paragraphs: ["Las compras con dinero real no forman parte de la beta cerrada actual. Los diamantes son moneda virtual y no tienen valor monetario fuera de MythStride."] }, { title: "¿Puedo eliminar mi cuenta?", paragraphs: ["Sí. MythStride ofrece un flujo público de solicitud de eliminación que verifica el email asociado a la cuenta."] },
    ] },
    support: { eyebrow: "SOPORTE", title: "¿Cómo podemos ayudarte?", seoTitle: "Soporte | MythStride", summary: "Encuentra ayuda sobre cuentas, acceso a la beta, carreras, privacidad, comunidad y eliminación de datos.", sections: [
      { title: "Cuenta y acceso", paragraphs: ["Para cuestiones sobre tu cuenta o acceso a la beta, contacta indicando el email asociado y una descripción del problema. Nunca envíes tu contraseña."] }, { title: "Carreras y progreso", paragraphs: ["Si una actividad no aparece como esperabas, indica la fecha aproximada, el dispositivo utilizado y una descripción. Evita enviar datos personales innecesarios."] }, { title: "Privacidad y cuenta", paragraphs: ["Puedes consultar la Política de Privacidad y utilizar el flujo de eliminación de cuenta en cualquier momento."] }, { title: "Contacto", paragraphs: ["contato@playmythstride.com"] }, { title: "Emergencias", paragraphs: ["MythStride no es un servicio médico ni de emergencia. En situaciones urgentes, acude a los servicios de emergencia disponibles en tu región."] },
    ] },
    privacy: { eyebrow: "PRIVACIDAD", title: "Política de Privacidad", seoTitle: "Política de Privacidad | MythStride", summary: "Conoce cómo MythStride trata la información utilizada en el sitio, la lista de la beta y los servicios del juego. Vigente desde el 14 de septiembre de 2026.", sections: [
      { title: "Sobre esta política", paragraphs: ["Esta Política de Privacidad explica cómo MythStride recopila, utiliza, protege y trata la información relacionada con el sitio, la lista de la beta y los servicios MythStride."] },
      { title: "Información tratada", paragraphs: ["Según las funciones utilizadas, MythStride puede tratar las siguientes categorías."], bullets: ["Datos de cuenta, autenticación, perfil y nombre visible", "Datos de carrera como distancia, duración, ritmo y recorrido", "Ubicación necesaria para registrar o validar actividades", "Información del dispositivo y señales de seguridad y prevención del fraude", "Integraciones autorizadas, comunidad, amistades, grupos y clasificaciones", "Solicitudes de soporte, progreso, inventario y logros", "Contexto necesario para Aethron", "Email, idioma y datos técnicos necesarios para la lista de la beta"] },
      { title: "Finalidades", paragraphs: ["Utilizamos información para operar el servicio, ofrecer funciones, calcular el progreso, prevenir fraude, proteger cuentas, ofrecer soporte y mantener la estabilidad y la seguridad."] },
      { title: "Ubicación", paragraphs: ["Los datos de ubicación pueden utilizarse cuando sean necesarios para registrar o validar una actividad. MythStride no utiliza la ubicación para publicidad comportamental."] },
      { title: "Aethron", paragraphs: ["El contexto seleccionado del viaje puede utilizarse para producir contenido narrativo. El contenido puede contener errores y no sustituye diagnósticos, tratamientos, orientación médica, entrenamiento profesional ni servicios de emergencia."] },
      { title: "Proveedores e integraciones", paragraphs: ["MythStride puede utilizar proveedores necesarios para infraestructura, comunicación, autenticación, seguridad e integraciones. Solo reciben la información necesaria para sus funciones."] },
      { title: "Venta de datos", paragraphs: ["No vendemos datos personales."] },
      { title: "Conservación", paragraphs: ["Conservamos los datos únicamente durante el tiempo necesario para las finalidades del servicio, las obligaciones legales, la seguridad y el ejercicio de derechos."] },
      { title: "Seguridad", paragraphs: ["Aplicamos medidas técnicas y organizativas destinadas a proteger la información, aunque ningún sistema conectado a internet puede garantizar una seguridad absoluta."] },
      { title: "Tus derechos", paragraphs: ["Según la legislación aplicable, puedes solicitar confirmación del tratamiento, acceso, corrección, información sobre cesiones, oposición, portabilidad cuando proceda y eliminación de datos personales."] },
      { title: "Eliminación", paragraphs: ["Puedes utilizar el flujo público de solicitud de eliminación de cuenta enlazado en esta página."] },
      { title: "Edad", paragraphs: ["MythStride está destinado a personas de 18 años o más."] },
      { title: "Contacto", paragraphs: ["contato@playmythstride.com"] },
      { title: "Actualizaciones", paragraphs: ["Podemos actualizar esta política para reflejar cambios del servicio o requisitos legales. La fecha de vigencia aparecerá en esta página."] },
    ] },
    terms: { eyebrow: "MYTHSTRIDE", title: "Términos de Uso", seoTitle: "Términos de Uso | MythStride", summary: "Vigentes desde el 14 de septiembre de 2026. Estos términos regulan el uso de la beta y de los servicios MythStride.", sections: [
      { title: "Aceptación y elegibilidad", paragraphs: ["Al crear una cuenta, participar en la beta o utilizar los servicios MythStride, aceptas estos Términos y las políticas aplicables. La beta cerrada está destinada a mayores de 18 años y el acceso puede depender de invitación, región, compatibilidad técnica y plazas."] }, { title: "Cuenta", paragraphs: ["Eres responsable de mantener seguras tus credenciales y de la actividad realizada a través de tu cuenta. No compartas contraseñas ni códigos de autenticación."] }, { title: "Actividad física", paragraphs: ["Eres responsable de evaluar tus condiciones personales, el entorno y la seguridad de la actividad. MythStride no sustituye orientación médica o profesional ni garantiza resultados físicos o de rendimiento."] }, { title: "Integridad y comunidad", paragraphs: ["Está prohibido manipular la ubicación, automatizar actividades, explotar fallos, alterar datos, defraudar recompensas o interferir en el servicio. El contenido, los nombres, las imágenes y las interacciones deben respetar las Directrices de la Comunidad."] }, { title: "Contenido y propiedad intelectual", paragraphs: ["MythStride, Elyndor, Aethron, personajes, elementos visuales, textos, software y otros contenidos protegidos siguen perteneciendo a sus respectivos titulares."] }, { title: "Objetos, monedas y beta", paragraphs: ["Los objetos, el oro, los diamantes y otros elementos virtuales existen exclusivamente dentro de MythStride y no son dinero, inversiones ni activos rescatables. Las funciones, el equilibrio y el contenido pueden cambiar durante la beta para preservar estabilidad, integridad y calidad."] }, { title: "Aethron y finalización", paragraphs: ["El contenido generado automáticamente puede contener errores y no sustituye orientación profesional, médica o de emergencia. Podemos restringir o cerrar cuentas por infracciones, fraude, riesgos de seguridad o abuso."] }, { title: "Legislación y contacto", paragraphs: ["Estos Términos se interpretan conforme a las leyes aplicables de la República Federativa de Brasil, sin limitar derechos obligatorios del usuario.", "Contacto: contato@playmythstride.com"] },
    ] },
    "delete-account": { eyebrow: "CONTROL DE LA CUENTA", title: "Eliminación de cuenta", summary: "Puedes solicitar la eliminación de tu cuenta MythStride mediante el email asociado.", sections: [
      { title: "Verificación", paragraphs: ["Tras la solicitud, enviaremos un enlace de verificación para confirmar la titularidad. La respuesta de la página no revela si un email está registrado."] }, { title: "Procesamiento", paragraphs: ["Después de la confirmación, la solicitud se procesará de acuerdo con la Política de Privacidad."] }, { title: "Conservación aplicable", paragraphs: ["Determinados registros pueden conservarse cuando lo exijan o permitan la ley, la seguridad, la prevención del fraude o el ejercicio de derechos."] },
    ] },
    "community-guidelines": { eyebrow: "COMUNIDAD", title: "Directrices de la Comunidad", summary: "MythStride fue creado para convertir la disciplina en aventura. La comunidad debe mejorar ese viaje, no volverlo hostil.", sections: [
      { title: "Respeta a otros jugadores", paragraphs: ["No se permiten el acoso, las amenazas, la persecución, el discurso de odio, la discriminación ni el abuso dirigido."] }, { title: "Sé quien dices ser", paragraphs: ["No utilices nombres, imágenes o identidades para engañar, suplantar a terceros o representar falsamente a personas u organizaciones."] }, { title: "Juega limpio", paragraphs: ["El GPS falso, la automatización de actividades, la manipulación de datos, la explotación deliberada de fallos y los intentos de obtener progreso indebido infringen estas directrices."] }, { title: "Protege a la comunidad", paragraphs: ["Los contenidos o comportamientos que pongan en riesgo a otros jugadores pueden analizarse y dar lugar a restricciones."] }, { title: "Medidas y contacto", paragraphs: ["Las infracciones pueden resultar en advertencias, retirada de contenido, limitación de funciones, suspensión o cierre de cuenta según su gravedad y reincidencia.", "Contacto: contato@playmythstride.com"] },
    ] },
    purchases: { eyebrow: "ECONOMÍA DEL JUEGO", title: "Objetos y monedas virtuales", summary: "MythStride utiliza objetos y monedas virtuales como parte del progreso del juego.", sections: [
      { title: "Diamantes", paragraphs: ["Los diamantes son moneda virtual utilizada exclusivamente dentro de MythStride. No tienen valor monetario fuera del servicio, no son una inversión y no pueden convertirse directamente en dinero."] }, { title: "Beta cerrada", paragraphs: ["Las compras con dinero real no están disponibles en la beta cerrada actual."] },
    ] },
    "ai-transparency": { eyebrow: "AETHRON", title: "Aethron e inteligencia artificial", summary: "Aethron utiliza inteligencia artificial para crear contenido narrativo conectado con el viaje del jugador.", sections: [
      { title: "Qué hace Aethron", paragraphs: ["Aethron utiliza contexto seleccionado de la experiencia para generar mensajes, reacciones y elementos narrativos relacionados con el progreso del jugador."] }, { title: "Limitaciones", paragraphs: ["El contenido generado automáticamente puede ser impreciso, incompleto o inadecuado para el contexto."] }, { title: "Salud", paragraphs: ["Aethron no realiza diagnósticos, no prescribe tratamientos y no sustituye a profesionales de salud, entrenamiento o servicios de emergencia."] }, { title: "Datos y control", paragraphs: ["Solo debe utilizarse el contexto necesario para la función. El tratamiento sigue la Política de Privacidad. Las consultas pueden enviarse a contato@playmythstride.com."] },
    ] },
    "third-party-services": { eyebrow: "INTEGRACIONES", title: "Servicios e integraciones", summary: "Algunas funciones de MythStride utilizan servicios externos necesarios para autenticación, infraestructura, comunicación e integraciones elegidas por el jugador.", sections: [
      { title: "Integraciones", paragraphs: ["Cuando conectas un servicio externo a MythStride, el acceso a los datos depende de tu autorización y de los permisos ofrecidos por ese servicio."] }, { title: "Desconexión", paragraphs: ["Las integraciones pueden desconectarse mediante MythStride o el propio servicio externo cuando corresponda."] }, { title: "Proveedores", paragraphs: ["Los proveedores de infraestructura, email, autenticación, seguridad y procesamiento pueden tratar información estrictamente necesaria para sus funciones."] }, { title: "Privacidad", paragraphs: ["El tratamiento realizado por MythStride sigue nuestra Política de Privacidad. Los servicios externos también pueden tener sus propios términos y políticas."] },
    ] },
  },
};
