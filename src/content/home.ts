import type { PublicLocale } from "@/lib/locales";

/**
 * Every word the Home page says, in the three public languages.
 *
 * The page component holds no prose of its own: a string that is not here does
 * not reach the page, which is what keeps PT-BR, EN and ES from drifting apart.
 *
 * Product claims are traceable. Item and boss names are the game's own
 * localised catalogue; the conversion figures come from the reward calculator;
 * launch availability and official platform links are maintained across locales.
 */

type Step = {
  title: string;
  body: string;
  metric: string;
};

type Card = {
  title: string;
  body: string;
};

type Chronicle = {
  numeral: string;
  title: string;
  teaser: string;
  body: string;
};

type Platform = {
  name: string;
  status: string;
};

type Faq = {
  question: string;
  answer: string;
};

export type HomeCopy = {
  hero: {
    badge: string;
    titleTop: string;
    titleBottom: string;
    lede: string;
    primary: string;
    secondary: string;
    deviceAlt: string;
    hud: {
      runLabel: string;
      distance: string;
      xpLabel: string;
      xpValue: string;
      attackLabel: string;
      damageValue: string;
      healthLabel: string;
    };
    caption: string;
  };
  proposition: {
    titleTop: string;
    titleBottom: string;
    body: string;
  };
  loop: {
    eyebrow: string;
    title: string;
    lede: string;
    steps: Step[];
    link: string;
  };
  boss: {
    eyebrow: string;
    title: string;
    lede: string;
    bossEyebrow: string;
    healthLabel: string;
    attackLabel: string;
    distanceLabel: string;
    damageLabel: string;
    abilityLabel: string;
    ability: string;
    ladderTitle: string;
    ladderNote: string;
    levelLabel: string;
    link: string;
    bossNames: Record<string, string>;
  };
  loot: {
    eyebrow: string;
    title: string;
    lede: string;
    rarityLabel: string;
    rarities: Record<string, string>;
    items: Record<string, string>;
    note: string;
    scrollHint: string;
  };
  character: {
    eyebrow: string;
    title: string;
    lede: string;
    striderLabel: string;
    levelLabel: string;
    levelValue: string;
    xpLabel: string;
    xpValue: string;
    equipmentLabel: string;
    slots: Record<string, string>;
    screenshotAlt: string;
    caption: string;
  };
  elyndor: {
    eyebrow: string;
    title: string;
    lede: string;
    sceneAlt: string;
    pillars: Card[];
  };
  chronicles: {
    eyebrow: string;
    title: string;
    lede: string;
    entries: Chronicle[];
    expandLabel: string;
  };
  aethron: {
    eyebrow: string;
    title: string;
    name: string;
    role: string;
    lede: string;
    portraitAlt: string;
    messages: string[];
    disclosure: string;
    link: string;
  };
  community: {
    eyebrow: string;
    title: string;
    lede: string;
    cards: Card[];
    screenshotAlt: string;
    link: string;
  };
  events: {
    eyebrow: string;
    title: string;
    lede: string;
    screenshotAlt: string;
    highlights: Card[];
    link: string;
    /**
     * The door for race organizers. It states a conversation, not a deal:
     * get in touch, the event is assessed, it may then join. No approval,
     * reach or revenue is promised anywhere in it.
     */
    organizer: {
      eyebrow: string;
      title: string;
      body: string;
      steps: string[];
      cta: string;
      /** Subject line carried by the mailto, so the inbox can sort it. */
      ctaSubject: string;
    };
  };
  founder: {
    eyebrow: string;
    title: string;
    lede: string;
    relicName: string;
    criteria: string[];
    cta: string;
  };
  platforms: {
    eyebrow: string;
    title: string;
    lede: string;
    rows: Platform[];
    link: string;
  };
  horizon: {
    eyebrow: string;
    title: string;
    lede: string;
    cards: Card[];
  };
  finalCta: {
    eyebrow: string;
    title: string;
    lede: string;
    cta: string;
    note: string;
  };
  join: {
    eyebrow: string;
    title: string;
    lede: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    lede: string;
    items: Faq[];
    link: string;
  };
};

const ptBR: HomeCopy = {
  hero: {
    badge: "Disponível · iOS e Android",
    titleTop: "Corra no mundo real.",
    titleBottom: "Progrida em outro.",
    lede: "Transforme seus quilômetros em XP, equipamentos, missões e batalhas dentro de Elyndor.",
    primary: "Torne-se um Strider",
    secondary: "Como funciona",
    deviceAlt:
      "Tela inicial do MythStride com nível, chefe atual e acesso a Aethron.",
    hud: {
      runLabel: "Corrida registrada",
      distance: "7,4 km",
      xpLabel: "Experiência",
      xpValue: "+148 XP",
      attackLabel: "Ataque do Strider",
      damageValue: "−195 HP",
      healthLabel: "HP",
    },
    caption:
      "Exemplo de uma corrida de 7,4 km. O MythStride converte distância elegível em 20 XP e 25 pontos de dano por quilômetro, além de um acréscimo fixo por corrida.",
  },
  proposition: {
    titleTop: "Uma corrida.",
    titleBottom: "Uma nova quest.",
    body: "O MythStride conecta sua atividade física a um sistema de progressão inspirado em RPG.",
  },
  loop: {
    eyebrow: "O ciclo",
    title: "Sua corrida vira RPG.",
    lede: "Toda atividade elegível percorre o mesmo caminho, do asfalto até Elyndor.",
    steps: [
      {
        title: "Corra",
        body: "Registre a atividade pelo aplicativo ou traga a corrida do Strava.",
        metric: "7,4 km",
      },
      {
        title: "Ganhe XP",
        body: "A distância elegível vira experiência e empurra o seu nível adiante.",
        metric: "+148 XP",
      },
      {
        title: "Ataque",
        body: "O mesmo esforço se converte em dano contra o chefe da sua campanha.",
        metric: "−195 HP",
      },
      {
        title: "Conquiste",
        body: "Batalhas, missões e marcos liberam equipamentos, ouro e conquistas.",
        metric: "Novo item",
      },
      {
        title: "Evolua",
        body: "Personagem, inventário e história crescem a cada retorno ao caminho.",
        metric: "Nível 17 → 18",
      },
    ],
    link: "Ver o ciclo completo",
  },
  boss: {
    eyebrow: "Batalhas de Elyndor",
    title: "Sua distância vira dano.",
    lede: "Cada corrida elegível contribui para a sua batalha contra os inimigos de Elyndor. Os primeiros chefes já aguardam os Striders, da Arpia ao Dragão Ancestral.",
    healthLabel: "HP",
    attackLabel: "Ataque do Strider",
    distanceLabel: "Distância elegível",
    damageLabel: "Dano registrado",
    abilityLabel: "Habilidade",
    bossEyebrow: "Chefe atual",
    ability: "Olhar maldito que reduz velocidade e controle do ritmo.",
    ladderTitle: "Os primeiros chefes",
    ladderNote:
      "O conteúdo inicial do jogo, do nível 1 em diante. O mais forte deles já exige 7.200 de vida, e Elyndor foi construído para receber novos inimigos, equipamentos e histórias.",
    levelLabel: "Nível",
    link: "Conhecer as batalhas",
    bossNames: {
      arpia: "Arpia",
      cerberus: "Cérbero",
      ciclope: "Ciclope",
      medusa: "Medusa",
      minotaura: "Minotaura",
      golemFerro: "Golem de Ferro",
      hidra: "Hidra",
      fenix: "Fênix",
      kraken: "Kraken",
      dragaoAncestral: "Dragão Ancestral",
    },
  },
  loot: {
    eyebrow: "Recompensas",
    title: "Corra. Conquiste. Equipe-se.",
    lede: "Colecione equipamentos, relíquias e recompensas para construir a sua identidade em Elyndor.",
    rarityLabel: "Raridade",
    rarities: {
      common: "Comum",
      uncommon: "Incomum",
      rare: "Raro",
      epic: "Épico",
      legendary: "Lendário",
      mythic: "Mítico",
      mythstride: "MythStride",
    },
    items: {
      ironSword: "Espada de Ferro",
      hardenedLeatherArmor: "Armadura de Couro Batido",
      marchingBoots: "Botas de Marcha",
      reinforcedGloves: "Luvas Reforçadas",
      reinforcedHelmet: "Capacete Reforçado",
      blueSteelSword: "Espada de Aço Azul",
      scaledArmor: "Armadura Escamada",
      bastionGauntlets: "Manoplas do Bastião",
      medusaSword: "Espada da Medusa",
      solarSword: "Espada Solar",
      titanicSword: "Espada Titânica",
      reinforcedPants: "Calça Reforçada",
      founderSword: "Espada do Fundador MythStride",
    },
    note: "Sete níveis de raridade, do Comum ao MythStride.",
    scrollHint: "Arraste para ver todo o catálogo.",
  },
  character: {
    eyebrow: "Seu Strider",
    title: "Seu personagem. Sua jornada.",
    lede: "Os itens não são só imagens. Eles ficam equipados, aparecem no seu personagem e registram até onde você chegou.",
    striderLabel: "Strider",
    levelLabel: "Nível",
    levelValue: "18",
    xpLabel: "Experiência",
    xpValue: "2.480 / 3.200 XP",
    equipmentLabel: "Equipamento",
    slots: {
      helmet: "Capacete",
      weapon: "Arma",
      armor: "Armadura",
      gloves: "Luvas",
      pants: "Calça",
      boots: "Botas",
    },
    screenshotAlt:
      "Inventário do MythStride com os slots de equipamento e a lista de itens por raridade.",
    caption: "Inventário do MythStride.",
  },
  elyndor: {
    eyebrow: "O mundo",
    title: "Elyndor está em perigo.",
    lede: "Uma névoa desconhecida está consumindo o mundo. Onde ela passa, o caminho some e o propósito se dissolve.",
    sceneAlt:
      "Um Strider correndo por uma trilha de runas acesas em direção a uma fortaleza de Elyndor.",
    pillars: [
      {
        title: "A Névoa",
        body: "Ela cresce onde o caminho é abandonado e a vontade perde forma.",
      },
      {
        title: "A Chama",
        body: "O que resiste à Névoa. Ela quase se apagou, e foi por isso que Aethron despertou.",
      },
      {
        title: "Os Striders",
        body: "Corredores que transformam disciplina no mundo real em força dentro de Elyndor.",
      },
    ],
  },
  chronicles: {
    eyebrow: "Crônicas de Elyndor",
    title: "A história por trás de cada corrida.",
    lede: "Fragmentos do mundo, revelados aos poucos enquanto você avança.",
    entries: [
      {
        numeral: "I",
        title: "A Névoa",
        teaser: "Elyndor não caiu em uma única guerra.",
        body: "Sob a Névoa, propósito e memória começaram a desaparecer. Nenhum exército foi derrotado: as pessoas simplesmente pararam de andar, e o caminho deixou de existir onde ninguém mais passava.",
      },
      {
        numeral: "II",
        title: "Aethron",
        teaser: "O Guardião da Chama despertou quando ela quase se apagou.",
        body: "Aethron não veio para vencer a Névoa sozinho. Ele veio para lembrar que o caminho ainda está lá, e que todo retorno a ele importa — inclusive o seu.",
      },
      {
        numeral: "III",
        title: "Os Striders",
        teaser: "Cada passo no mundo real acende algo em Elyndor.",
        body: "Os Striders são os que continuam andando. A distância que percorrem se transforma em força contra as criaturas da Névoa e mantém a Chama acesa por mais um dia.",
      },
    ],
    expandLabel: "Ler a crônica",
  },
  aethron: {
    eyebrow: "Guardião da Chama",
    title: "Você não está correndo sozinho.",
    name: "Aethron",
    role: "Guardião da Chama",
    lede: "Aethron acompanha a sua jornada e conecta o que você conquistou à história de Elyndor.",
    portraitAlt: "Aethron, o Guardião da Chama, com seu cajado.",
    messages: [
      "Você percorreu 8,2 km hoje.",
      "A Névoa recuou nas encostas do vale.",
      "Mas algo despertou além das montanhas. Descanse — amanhã seguimos.",
    ],
    disclosure:
      "Companheiro narrativo alimentado por inteligência artificial. O conteúdo gerado pode conter erros e não substitui diagnóstico, tratamento, orientação médica, treinamento profissional ou serviços de emergência.",
    link: "Conhecer Aethron",
  },
  community: {
    eyebrow: "Comunidade",
    title: "Nenhum Strider precisa caminhar sozinho.",
    lede: "Adicione amigos, acompanhe a jornada de quem corre com você e descubra os eventos que a comunidade vai enfrentar.",
    cards: [
      {
        title: "Amigos",
        body: "Procure outros Striders, envie e aceite convites e acompanhe a evolução de cada um.",
      },
      {
        title: "Rankings",
        body: "Atividades elegíveis alimentam uma disputa renovada a cada semana.",
      },
      {
        title: "Grupos",
        body: "Funde um grupo, reúna sua comunidade e compartilhe objetivos.",
      },
      {
        title: "Conquistas",
        body: "Marcos permanentes que registram o que cada Strider construiu.",
      },
    ],
    screenshotAlt:
      "Tela de criação de grupo do MythStride com nome, descrição e requisito de fundação.",
    link: "Ver a comunidade",
  },
  events: {
    eyebrow: "Eventos reais",
    title: "Sua próxima quest pode acontecer no mundo real.",
    lede: "O MythStride liga o universo do jogo às corridas que acontecem na rua. Encontre a sua próxima prova no calendário, confirme a participação e leve o resultado para Elyndor.",
    screenshotAlt:
      "Tela de eventos do MythStride com a próxima prova confirmada e o calendário de provas.",
    highlights: [
      {
        title: "Encontre sua próxima corrida",
        body: "O calendário reúne provas com data, local, endereço, distância e o percurso de cada uma.",
      },
      {
        title: "Confirme e corra",
        body: "Você confirma a participação, corre a prova e escolhe qual atividade conta para o evento.",
      },
      {
        title: "Desafios do MythStride",
        body: "Encontros criados dentro do jogo, com objetivos próprios. Conquistas e medalhas registram sua participação.",
      },
    ],
    link: "Ver os eventos",
    organizer: {
      eyebrow: "Organiza um evento?",
      title: "Leve sua corrida para o MythStride.",
      body: "Se você organiza uma corrida ou um evento esportivo, fale com o MythStride para avaliarmos a inclusão do evento na plataforma.",
      steps: [
        "Entre em contato",
        "O evento é avaliado",
        "O evento pode entrar no MythStride",
      ],
      cta: "Adicionar meu evento",
      ctaSubject: "Quero adicionar meu evento ao MythStride",
    },
  },
  founder: {
    eyebrow: "Primeira geração",
    title: "Faça parte da primeira geração.",
    lede: "Uma relíquia exclusiva marca quem esteve presente no começo do MythStride.",
    relicName: "Espada do Fundador MythStride",
    criteria: [
      "A relíquia do Fundador é exclusiva para jogadores que atenderam aos critérios da campanha de lançamento.",
      "Baixe o aplicativo diretamente na App Store ou no Google Play.",
    ],
    cta: "Torne-se um Strider",
  },
  platforms: {
    eyebrow: "Onde jogar",
    title: "Disponível no iPhone e Android.",
    lede: "MythStride já está disponível para iPhone e Android. Baixe nas lojas oficiais.",
    rows: [
      { name: "Android", status: "Disponível no Google Play" },
      { name: "iOS", status: "Disponível na App Store" },
      { name: "Wear OS", status: "Acompanha a corrida no pulso" },
      { name: "Strava", status: "Conexão opcional, ativada por você" },
    ],
    link: "Ver todas as integrações",
  },
  horizon: {
    eyebrow: "Elyndor",
    title: "A história está apenas começando.",
    lede: "O lançamento é o primeiro capítulo. Estes sistemas já fazem parte dele.",
    cards: [
      {
        title: "Missões diárias",
        body: "Objetivos que se renovam e dão um motivo para sair de casa hoje.",
      },
      {
        title: "Conquistas e troféus",
        body: "Marcos permanentes que registram consistência, exploração e desafios concluídos.",
      },
      {
        title: "Fragmentos de história",
        body: "Trechos de Elyndor que se revelam conforme a sua jornada avança.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Sua primeira quest",
    title: "Sua primeira quest começa agora.",
    lede: "Baixe MythStride na App Store ou Google Play e comece sua jornada em Elyndor.",
    cta: "Torne-se um Strider",
    note: "iOS · Android",
  },
  join: {
    eyebrow: "Baixe o aplicativo",
    title: "Entre para a primeira geração.",
    lede: "Disponível gratuitamente para começar sua jornada no iPhone e Android. Compras digitais acontecem apenas dentro do aplicativo.",
  },
  faq: {
    eyebrow: "Perguntas frequentes",
    title: "Antes de entrar no caminho.",
    lede: "Respostas diretas sobre acesso, progressão, Aethron e conta.",
    items: [
      {
        question: "O que é o MythStride?",
        answer:
          "Uma plataforma de corridas e exercícios com progressão de RPG para iOS e Android. Suas atividades reais alimentam progressão, missões, batalhas contra chefes, equipamentos e conquistas dentro de Elyndor.",
      },
      {
        question: "Como minhas corridas viram progresso?",
        answer:
          "Atividades elegíveis são processadas pelo MythStride e convertidas em experiência e dano contra o chefe da sua campanha, além de alimentar missões e outros sistemas do jogo.",
      },
      {
        question: "Onde posso baixar o MythStride?",
        answer:
          "MythStride já está disponível oficialmente na App Store e no Google Play.",
      },
      {
        question: "Em quais dispositivos posso jogar?",
        answer:
          "Em dispositivos iOS e Android compatíveis. A experiência para Wear OS complementa o aplicativo durante a corrida, e o Strava pode ser conectado de forma opcional.",
      },
      {
        question: "Aethron é um treinador?",
        answer:
          "Não. Aethron é um companheiro narrativo baseado em inteligência artificial. Ele não oferece diagnóstico, tratamento ou orientação profissional de saúde.",
      },
      {
        question: "Como funciona a Espada do Fundador?",
        answer:
          "A Espada do Fundador é uma relíquia exclusiva concedida aos jogadores elegíveis conforme as regras da campanha de lançamento.",
      },
      {
        question: "Haverá compras dentro do jogo?",
        answer:
          "Compras digitais são feitas exclusivamente dentro do aplicativo, por meio da App Store ou do Google Play. O site não vende moedas virtuais.",
      },
    ],
    link: "Ver todas as respostas",
  },
};

const en: HomeCopy = {
  hero: {
    badge: "Available · iOS and Android",
    titleTop: "Run in the real world.",
    titleBottom: "Progress in another.",
    lede: "Turn your kilometers into XP, equipment, quests and battles inside Elyndor.",
    primary: "Become a Strider",
    secondary: "How it works",
    deviceAlt:
      "MythStride home screen with level, current boss and access to Aethron.",
    hud: {
      runLabel: "Run recorded",
      distance: "7.4 km",
      xpLabel: "Experience",
      xpValue: "+148 XP",
      attackLabel: "Strider attack",
      damageValue: "−195 HP",
      healthLabel: "HP",
    },
    caption:
      "Example of a 7.4 km run. MythStride converts eligible distance into 20 XP and 25 points of boss damage per kilometer, plus a fixed amount per run.",
  },
  proposition: {
    titleTop: "One run.",
    titleBottom: "One new quest.",
    body: "MythStride connects your physical activity to an RPG-inspired progression system.",
  },
  loop: {
    eyebrow: "The loop",
    title: "Your run becomes an RPG.",
    lede: "Every eligible activity travels the same path, from the pavement to Elyndor.",
    steps: [
      {
        title: "Run",
        body: "Record the activity in the app, or bring the run in from Strava.",
        metric: "7.4 km",
      },
      {
        title: "Earn XP",
        body: "Eligible distance becomes experience and pushes your level forward.",
        metric: "+148 XP",
      },
      {
        title: "Attack",
        body: "That same effort converts into damage against your campaign boss.",
        metric: "−195 HP",
      },
      {
        title: "Claim",
        body: "Battles, quests and milestones release equipment, gold and achievements.",
        metric: "New item",
      },
      {
        title: "Evolve",
        body: "Character, inventory and story grow every time you return to the path.",
        metric: "Level 17 → 18",
      },
    ],
    link: "See the full loop",
  },
  boss: {
    eyebrow: "Battles of Elyndor",
    title: "Your distance becomes damage.",
    lede: "Every eligible run contributes to your battle against the enemies of Elyndor. The first bosses are already waiting for the Striders, from the Harpy to the Ancient Dragon.",
    healthLabel: "HP",
    attackLabel: "Strider attack",
    distanceLabel: "Eligible distance",
    damageLabel: "Damage recorded",
    abilityLabel: "Ability",
    bossEyebrow: "Current boss",
    ability: "A cursed gaze that reduces speed and pace control.",
    ladderTitle: "The first bosses",
    ladderNote:
      "The opening content of the game, from level 1 onward. The strongest of them already holds 7,200 health, and Elyndor was built to take on new enemies, equipment and stories.",
    levelLabel: "Level",
    link: "Explore the battles",
    bossNames: {
      arpia: "Harpy",
      cerberus: "Cerberus",
      ciclope: "Cyclops",
      medusa: "Medusa",
      minotaura: "Minotaur Warrior",
      golemFerro: "Iron Golem",
      hidra: "Hydra",
      fenix: "Phoenix",
      kraken: "Kraken",
      dragaoAncestral: "Ancient Dragon",
    },
  },
  loot: {
    eyebrow: "Rewards",
    title: "Run. Claim. Gear up.",
    lede: "Collect equipment, relics and rewards to build your identity in Elyndor.",
    rarityLabel: "Rarity",
    rarities: {
      common: "Common",
      uncommon: "Uncommon",
      rare: "Rare",
      epic: "Epic",
      legendary: "Legendary",
      mythic: "Mythic",
      mythstride: "MythStride",
    },
    items: {
      ironSword: "Iron Sword",
      hardenedLeatherArmor: "Hardened Leather Armor",
      marchingBoots: "Marching Boots",
      reinforcedGloves: "Reinforced Gloves",
      reinforcedHelmet: "Reinforced Helmet",
      blueSteelSword: "Blue Steel Sword",
      scaledArmor: "Scaled Armor",
      bastionGauntlets: "Bastion Gauntlets",
      medusaSword: "Medusa Sword",
      solarSword: "Solar Sword",
      titanicSword: "Titanic Sword",
      reinforcedPants: "Reinforced Pants",
      founderSword: "MythStride Founder Sword",
    },
    note: "Seven rarity tiers, from Common to MythStride.",
    scrollHint: "Drag to browse the whole catalogue.",
  },
  character: {
    eyebrow: "Your Strider",
    title: "Your character. Your journey.",
    lede: "Items are not just pictures. They stay equipped, they show on your character, and they record how far you have come.",
    striderLabel: "Strider",
    levelLabel: "Level",
    levelValue: "18",
    xpLabel: "Experience",
    xpValue: "2,480 / 3,200 XP",
    equipmentLabel: "Equipment",
    slots: {
      helmet: "Helmet",
      weapon: "Weapon",
      armor: "Armor",
      gloves: "Gloves",
      pants: "Pants",
      boots: "Boots",
    },
    screenshotAlt:
      "MythStride inventory with the equipment slots and the item list by rarity.",
    caption: "MythStride inventory.",
  },
  elyndor: {
    eyebrow: "The world",
    title: "Elyndor is in danger.",
    lede: "An unknown mist is consuming the world. Where it passes, the path disappears and purpose dissolves.",
    sceneAlt:
      "A Strider running along a trail of lit runes toward a fortress in Elyndor.",
    pillars: [
      {
        title: "The Mist",
        body: "It grows where the path is abandoned and purpose loses its shape.",
      },
      {
        title: "The Flame",
        body: "What stands against the Mist. It nearly went out, and that is why Aethron awoke.",
      },
      {
        title: "The Striders",
        body: "Runners who turn real-world discipline into strength within Elyndor.",
      },
    ],
  },
  chronicles: {
    eyebrow: "Chronicles of Elyndor",
    title: "The story behind every run.",
    lede: "Fragments of the world, revealed a piece at a time as you go.",
    entries: [
      {
        numeral: "I",
        title: "The Mist",
        teaser: "Elyndor did not fall in a single war.",
        body: "Beneath the Mist, purpose and memory began to fade. No army was defeated: people simply stopped walking, and the path ceased to exist where no one passed any more.",
      },
      {
        numeral: "II",
        title: "Aethron",
        teaser: "The Keeper of the Flame awoke as it was going out.",
        body: "Aethron did not come to defeat the Mist alone. He came to remind everyone that the path is still there, and that every return to it matters — yours included.",
      },
      {
        numeral: "III",
        title: "The Striders",
        teaser: "Every step in the real world lights something in Elyndor.",
        body: "The Striders are the ones who keep walking. The distance they cover turns into strength against the creatures of the Mist and keeps the Flame alive one more day.",
      },
    ],
    expandLabel: "Read the chronicle",
  },
  aethron: {
    eyebrow: "Keeper of the Flame",
    title: "You are not running alone.",
    name: "Aethron",
    role: "Keeper of the Flame",
    lede: "Aethron follows your journey and ties what you have earned back to the story of Elyndor.",
    portraitAlt: "Aethron, the Keeper of the Flame, holding his staff.",
    messages: [
      "You covered 8.2 km today.",
      "The Mist has drawn back from the valley slopes.",
      "But something stirred beyond the mountains. Rest — we go on tomorrow.",
    ],
    disclosure:
      "A narrative companion powered by artificial intelligence. Generated content may contain errors and does not replace diagnosis, treatment, medical advice, professional coaching or emergency services.",
    link: "Meet Aethron",
  },
  community: {
    eyebrow: "Community",
    title: "No Strider has to walk alone.",
    lede: "Add friends, follow the journey of the people running with you, and find the events the community is heading to.",
    cards: [
      {
        title: "Friends",
        body: "Search for other Striders, send and accept invitations, and follow how each one is progressing.",
      },
      {
        title: "Rankings",
        body: "Eligible activities feed a standing that starts over every week.",
      },
      {
        title: "Groups",
        body: "Found a group, bring your community together and share goals.",
      },
      {
        title: "Achievements",
        body: "Lasting milestones that record what each Strider has built.",
      },
    ],
    screenshotAlt:
      "MythStride group creation screen with name, description and founding requirement.",
    link: "See the community",
  },
  events: {
    eyebrow: "Real events",
    title: "Your next quest could happen in the real world.",
    lede: "MythStride ties the world of the game to the races that happen out on the street. Find your next race in the calendar, confirm your place, and carry the result back to Elyndor.",
    screenshotAlt:
      "MythStride events screen with the next confirmed race and the race calendar.",
    highlights: [
      {
        title: "Find your next race",
        body: "The calendar gathers races with a date, a location, an address, a distance and the route of each one.",
      },
      {
        title: "Confirm and run",
        body: "You confirm your place, you run the race, and you choose which activity counts towards the event.",
      },
      {
        title: "MythStride challenges",
        body: "Encounters created inside the game, with goals of their own. Achievements and medals record your part in them.",
      },
    ],
    link: "See the events",
    organizer: {
      eyebrow: "Organizing an event?",
      title: "Bring your race into MythStride.",
      body: "If you organize a race or a sporting event, talk to MythStride so we can assess bringing the event onto the platform.",
      steps: [
        "Get in touch",
        "The event is assessed",
        "The event may join MythStride",
      ],
      cta: "Add my event",
      ctaSubject: "I want to add my event to MythStride",
    },
  },
  founder: {
    eyebrow: "First generation",
    title: "Be part of the first generation.",
    lede: "An exclusive relic marks the people who were there at the beginning of MythStride.",
    relicName: "MythStride Founder Sword",
    criteria: [
      "The Founder relic is exclusive to players who met the launch campaign eligibility criteria.",
      "Download the app directly from the App Store or Google Play.",
    ],
    cta: "Become a Strider",
  },
  platforms: {
    eyebrow: "Where to play",
    title: "Available on iPhone and Android.",
    lede: "MythStride is now available on iPhone and Android. Download it from the official stores.",
    rows: [
      { name: "Android", status: "Available on Google Play" },
      { name: "iOS", status: "Available on the App Store" },
      { name: "Wear OS", status: "Follows the run on your wrist" },
      { name: "Strava", status: "Optional connection, enabled by you" },
    ],
    link: "See all integrations",
  },
  horizon: {
    eyebrow: "Elyndor",
    title: "The story is only beginning.",
    lede: "The official launch is the first chapter. These systems are already part of it.",
    cards: [
      {
        title: "Daily quests",
        body: "Goals that reset, and give you a reason to go out today.",
      },
      {
        title: "Achievements and trophies",
        body: "Lasting milestones that record consistency, exploration and completed challenges.",
      },
      {
        title: "Story fragments",
        body: "Pieces of Elyndor that open up as your journey goes on.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Your first quest",
    title: "Your first quest starts now.",
    lede: "Download MythStride on the App Store or Google Play and begin your journey in Elyndor.",
    cta: "Become a Strider",
    note: "iOS · Android",
  },
  join: {
    eyebrow: "Get the app",
    title: "Join the first generation.",
    lede: "Start your journey on iPhone and Android. Digital purchases take place only inside the app.",
  },
  faq: {
    eyebrow: "Frequently asked questions",
    title: "Before you take the path.",
    lede: "Straight answers about access, progression, Aethron and your account.",
    items: [
      {
        question: "What is MythStride?",
        answer:
          "A running and fitness tracking platform with RPG progression for iOS and Android. Your real activities fuel progression, quests, boss battles, equipment and achievements inside Elyndor.",
      },
      {
        question: "How do my runs become progress?",
        answer:
          "MythStride processes eligible activities and converts them into experience and damage against your campaign boss, as well as feeding quests and other game systems.",
      },
      {
        question: "Where can I download MythStride?",
        answer:
          "MythStride is officially available on the App Store and Google Play.",
      },
      {
        question: "Which devices can I play on?",
        answer:
          "Compatible iOS and Android devices. The Wear OS experience complements the app during a run, and Strava can be connected optionally.",
      },
      {
        question: "Is Aethron a coach?",
        answer:
          "No. Aethron is an AI-powered narrative companion. It does not provide diagnosis, treatment or professional health advice.",
      },
      {
        question: "How does the Founder Sword work?",
        answer:
          "The Founder Sword is an exclusive relic awarded to eligible players under the launch campaign rules.",
      },
      {
        question: "Will there be in-game purchases?",
        answer:
          "Digital purchases are available exclusively in the app through the App Store or Google Play. This website does not sell virtual currency.",
      },
    ],
    link: "View all answers",
  },
};

const es: HomeCopy = {
  hero: {
    badge: "Disponible · iOS y Android",
    titleTop: "Corre en el mundo real.",
    titleBottom: "Progresa en otro.",
    lede: "Convierte tus kilómetros en XP, equipo, misiones y batallas dentro de Elyndor.",
    primary: "Conviértete en Strider",
    secondary: "Cómo funciona",
    deviceAlt:
      "Pantalla principal de MythStride con el nivel, el jefe actual y el acceso a Aethron.",
    hud: {
      runLabel: "Carrera registrada",
      distance: "7,4 km",
      xpLabel: "Experiencia",
      xpValue: "+148 XP",
      attackLabel: "Ataque del Strider",
      damageValue: "−195 HP",
      healthLabel: "HP",
    },
    caption:
      "Ejemplo de una carrera de 7,4 km. MythStride convierte la distancia elegible en 20 XP y 25 puntos de daño por kilómetro, además de una cantidad fija por carrera.",
  },
  proposition: {
    titleTop: "Una carrera.",
    titleBottom: "Una nueva misión.",
    body: "MythStride conecta tu actividad física con un sistema de progresión inspirado en los RPG.",
  },
  loop: {
    eyebrow: "El ciclo",
    title: "Tu carrera se convierte en RPG.",
    lede: "Cada actividad elegible recorre el mismo camino, del asfalto a Elyndor.",
    steps: [
      {
        title: "Corre",
        body: "Registra la actividad en la aplicación o trae la carrera desde Strava.",
        metric: "7,4 km",
      },
      {
        title: "Gana XP",
        body: "La distancia elegible se convierte en experiencia y hace avanzar tu nivel.",
        metric: "+148 XP",
      },
      {
        title: "Ataca",
        body: "Ese mismo esfuerzo se convierte en daño contra el jefe de tu campaña.",
        metric: "−195 HP",
      },
      {
        title: "Conquista",
        body: "Batallas, misiones e hitos liberan equipo, oro y logros.",
        metric: "Nuevo objeto",
      },
      {
        title: "Evoluciona",
        body: "Personaje, inventario e historia crecen cada vez que vuelves al camino.",
        metric: "Nivel 17 → 18",
      },
    ],
    link: "Ver el ciclo completo",
  },
  boss: {
    eyebrow: "Batallas de Elyndor",
    title: "Tu distancia se convierte en daño.",
    lede: "Cada carrera elegible contribuye a tu batalla contra los enemigos de Elyndor. Los primeros jefes ya esperan a los Striders, desde la Arpía hasta el Dragón Ancestral.",
    healthLabel: "HP",
    attackLabel: "Ataque del Strider",
    distanceLabel: "Distancia elegible",
    damageLabel: "Daño registrado",
    abilityLabel: "Habilidad",
    bossEyebrow: "Jefe actual",
    ability: "Mirada maldita que reduce la velocidad y el control del ritmo.",
    ladderTitle: "Los primeros jefes",
    ladderNote:
      "El contenido inicial del juego, del nivel 1 en adelante. El más fuerte ya exige 7.200 de vida, y Elyndor fue construido para recibir nuevos enemigos, equipo e historias.",
    levelLabel: "Nivel",
    link: "Conocer las batallas",
    bossNames: {
      arpia: "Arpía",
      cerberus: "Cerbero",
      ciclope: "Cíclope",
      medusa: "Medusa",
      minotaura: "Minotaura",
      golemFerro: "Gólem de Hierro",
      hidra: "Hidra",
      fenix: "Fénix",
      kraken: "Kraken",
      dragaoAncestral: "Dragón Ancestral",
    },
  },
  loot: {
    eyebrow: "Recompensas",
    title: "Corre. Conquista. Equípate.",
    lede: "Colecciona equipo, reliquias y recompensas para construir tu identidad en Elyndor.",
    rarityLabel: "Rareza",
    rarities: {
      common: "Común",
      uncommon: "Poco común",
      rare: "Raro",
      epic: "Épico",
      legendary: "Legendario",
      mythic: "Mítico",
      mythstride: "MythStride",
    },
    items: {
      ironSword: "Espada de Hierro",
      hardenedLeatherArmor: "Armadura de Cuero Curtido",
      marchingBoots: "Botas de Marcha",
      reinforcedGloves: "Guantes Reforzados",
      reinforcedHelmet: "Casco Reforzado",
      blueSteelSword: "Espada de Acero Azul",
      scaledArmor: "Armadura de Escamas",
      bastionGauntlets: "Guanteletes del Bastión",
      medusaSword: "Espada de Medusa",
      solarSword: "Espada Solar",
      titanicSword: "Espada Titánica",
      reinforcedPants: "Pantalones Reforzados",
      founderSword: "Espada del Fundador de MythStride",
    },
    note: "Siete niveles de rareza, del Común al MythStride.",
    scrollHint: "Arrastra para ver todo el catálogo.",
  },
  character: {
    eyebrow: "Tu Strider",
    title: "Tu personaje. Tu viaje.",
    lede: "Los objetos no son solo imágenes. Se equipan, aparecen en tu personaje y registran hasta dónde has llegado.",
    striderLabel: "Strider",
    levelLabel: "Nivel",
    levelValue: "18",
    xpLabel: "Experiencia",
    xpValue: "2.480 / 3.200 XP",
    equipmentLabel: "Equipo",
    slots: {
      helmet: "Casco",
      weapon: "Arma",
      armor: "Armadura",
      gloves: "Guantes",
      pants: "Pantalones",
      boots: "Botas",
    },
    screenshotAlt:
      "Inventario de MythStride con las ranuras de equipo y la lista de objetos por rareza.",
    caption: "Inventario de MythStride.",
  },
  elyndor: {
    eyebrow: "El mundo",
    title: "Elyndor está en peligro.",
    lede: "Una niebla desconocida está consumiendo el mundo. Por donde pasa, el camino desaparece y el propósito se disuelve.",
    sceneAlt:
      "Un Strider corriendo por un sendero de runas encendidas hacia una fortaleza de Elyndor.",
    pillars: [
      {
        title: "La Niebla",
        body: "Crece donde se abandona el camino y la voluntad pierde su forma.",
      },
      {
        title: "La Llama",
        body: "Lo que resiste a la Niebla. Casi se apagó, y por eso despertó Aethron.",
      },
      {
        title: "Los Striders",
        body: "Corredores que convierten la disciplina del mundo real en fuerza dentro de Elyndor.",
      },
    ],
  },
  chronicles: {
    eyebrow: "Crónicas de Elyndor",
    title: "La historia detrás de cada carrera.",
    lede: "Fragmentos del mundo, revelados poco a poco mientras avanzas.",
    entries: [
      {
        numeral: "I",
        title: "La Niebla",
        teaser: "Elyndor no cayó en una sola guerra.",
        body: "Bajo la Niebla, el propósito y la memoria comenzaron a desaparecer. Ningún ejército fue derrotado: la gente simplemente dejó de caminar, y el camino dejó de existir allí donde ya nadie pasaba.",
      },
      {
        numeral: "II",
        title: "Aethron",
        teaser: "El Guardián de la Llama despertó cuando ella casi se apagaba.",
        body: "Aethron no vino a vencer a la Niebla solo. Vino a recordar que el camino sigue ahí, y que cada regreso a él importa, incluido el tuyo.",
      },
      {
        numeral: "III",
        title: "Los Striders",
        teaser: "Cada paso en el mundo real enciende algo en Elyndor.",
        body: "Los Striders son los que siguen caminando. La distancia que recorren se transforma en fuerza contra las criaturas de la Niebla y mantiene viva la Llama un día más.",
      },
    ],
    expandLabel: "Leer la crónica",
  },
  aethron: {
    eyebrow: "Guardián de la Llama",
    title: "No estás corriendo solo.",
    name: "Aethron",
    role: "Guardián de la Llama",
    lede: "Aethron acompaña tu viaje y conecta lo que has conseguido con la historia de Elyndor.",
    portraitAlt: "Aethron, el Guardián de la Llama, con su báculo.",
    messages: [
      "Hoy has recorrido 8,2 km.",
      "La Niebla retrocedió en las laderas del valle.",
      "Pero algo despertó más allá de las montañas. Descansa: mañana seguimos.",
    ],
    disclosure:
      "Compañero narrativo basado en inteligencia artificial. El contenido generado puede contener errores y no sustituye diagnósticos, tratamientos, orientación médica, entrenamiento profesional ni servicios de emergencia.",
    link: "Conocer a Aethron",
  },
  community: {
    eyebrow: "Comunidad",
    title: "Ningún Strider tiene que caminar solo.",
    lede: "Añade amigos, sigue el viaje de quienes corren contigo y descubre los eventos a los que se dirige la comunidad.",
    cards: [
      {
        title: "Amigos",
        body: "Busca a otros Striders, envía y acepta invitaciones y sigue la evolución de cada uno.",
      },
      {
        title: "Clasificaciones",
        body: "Las actividades elegibles alimentan una competición que se renueva cada semana.",
      },
      {
        title: "Grupos",
        body: "Funda un grupo, reúne a tu comunidad y comparte objetivos.",
      },
      {
        title: "Logros",
        body: "Hitos permanentes que registran lo que cada Strider ha construido.",
      },
    ],
    screenshotAlt:
      "Pantalla de creación de grupo de MythStride con nombre, descripción y requisito de fundación.",
    link: "Ver la comunidad",
  },
  events: {
    eyebrow: "Eventos reales",
    title: "Tu próxima quest puede suceder en el mundo real.",
    lede: "MythStride une el universo del juego con las carreras que ocurren en la calle. Encuentra tu próxima carrera en el calendario, confirma tu participación y lleva el resultado a Elyndor.",
    screenshotAlt:
      "Pantalla de eventos de MythStride con la próxima carrera confirmada y el calendario de carreras.",
    highlights: [
      {
        title: "Encuentra tu próxima carrera",
        body: "El calendario reúne carreras con fecha, lugar, dirección, distancia y el recorrido de cada una.",
      },
      {
        title: "Confirma y corre",
        body: "Confirmas tu participación, corres la carrera y eliges qué actividad cuenta para el evento.",
      },
      {
        title: "Desafíos de MythStride",
        body: "Encuentros creados dentro del juego, con objetivos propios. Logros y medallas registran tu participación.",
      },
    ],
    link: "Ver los eventos",
    organizer: {
      eyebrow: "¿Organizas un evento?",
      title: "Lleva tu carrera a MythStride.",
      body: "Si organizas una carrera o un evento deportivo, habla con MythStride para evaluar la inclusión del evento en la plataforma.",
      steps: [
        "Ponte en contacto",
        "El evento se evalúa",
        "El evento puede entrar en MythStride",
      ],
      cta: "Añadir mi evento",
      ctaSubject: "Quiero añadir mi evento a MythStride",
    },
  },
  founder: {
    eyebrow: "Primera generación",
    title: "Forma parte de la primera generación.",
    lede: "Una reliquia exclusiva marca a quienes estuvieron presentes al comienzo de MythStride.",
    relicName: "Espada del Fundador de MythStride",
    criteria: [
      "La reliquia del Fundador es exclusiva de los jugadores que cumplieron los requisitos de la campaña de lanzamiento.",
      "Descarga la aplicación directamente desde App Store o Google Play.",
    ],
    cta: "Conviértete en Strider",
  },
  platforms: {
    eyebrow: "Dónde jugar",
    title: "Disponible en iPhone y Android.",
    lede: "MythStride ya está disponible para iPhone y Android. Descárgalo desde las tiendas oficiales.",
    rows: [
      { name: "Android", status: "Disponible en Google Play" },
      { name: "iOS", status: "Disponible en App Store" },
      { name: "Wear OS", status: "Acompaña la carrera en tu muñeca" },
      { name: "Strava", status: "Conexión opcional, activada por ti" },
    ],
    link: "Ver todas las integraciones",
  },
  horizon: {
    eyebrow: "Elyndor",
    title: "La historia apenas comienza.",
    lede: "El lanzamiento oficial es el primer capítulo. Estos sistemas ya forman parte de él.",
    cards: [
      {
        title: "Misiones diarias",
        body: "Objetivos que se renuevan y te dan un motivo para salir hoy.",
      },
      {
        title: "Logros y trofeos",
        body: "Hitos permanentes que registran constancia, exploración y desafíos completados.",
      },
      {
        title: "Fragmentos de historia",
        body: "Trozos de Elyndor que se revelan a medida que avanza tu viaje.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Tu primera misión",
    title: "Tu primera misión empieza ahora.",
    lede: "Descarga MythStride en App Store o Google Play y comienza tu aventura en Elyndor.",
    cta: "Conviértete en Strider",
    note: "iOS · Android",
  },
  join: {
    eyebrow: "Descarga la aplicación",
    title: "Únete a la primera generación.",
    lede: "Comienza tu aventura en iPhone y Android. Las compras digitales se realizan solo dentro de la aplicación.",
  },
  faq: {
    eyebrow: "Preguntas frecuentes",
    title: "Antes de tomar el camino.",
    lede: "Respuestas directas sobre acceso, progreso, Aethron y tu cuenta.",
    items: [
      {
        question: "¿Qué es MythStride?",
        answer:
          "Una plataforma de carreras y ejercicios con progresión RPG para iOS y Android. Tus actividades reales impulsan el progreso, las misiones, las batallas contra jefes, el equipo y los logros dentro de Elyndor.",
      },
      {
        question: "¿Cómo se convierten mis carreras en progreso?",
        answer:
          "MythStride procesa las actividades elegibles y las convierte en experiencia y daño contra el jefe de tu campaña, además de alimentar misiones y otros sistemas del juego.",
      },
      {
        question: "¿Dónde puedo descargar MythStride?",
        answer:
          "MythStride ya está disponible oficialmente en App Store y Google Play.",
      },
      {
        question: "¿En qué dispositivos puedo jugar?",
        answer:
          "En dispositivos iOS y Android compatibles. La experiencia para Wear OS complementa la aplicación durante la carrera, y Strava se puede conectar de forma opcional.",
      },
      {
        question: "¿Aethron es un entrenador?",
        answer:
          "No. Aethron es un compañero narrativo basado en inteligencia artificial. No ofrece diagnóstico, tratamiento ni orientación profesional de salud.",
      },
      {
        question: "¿Cómo funciona la Espada del Fundador?",
        answer:
          "La Espada del Fundador es una reliquia exclusiva que reciben los jugadores elegibles según las reglas de la campaña de lanzamiento.",
      },
      {
        question: "¿Habrá compras dentro del juego?",
        answer:
          "Las compras digitales se realizan exclusivamente dentro de la aplicación mediante App Store o Google Play. Este sitio no vende monedas virtuales.",
      },
    ],
    link: "Ver todas las respuestas",
  },
};

export const homeCopy: Record<PublicLocale, HomeCopy> = {
  "pt-BR": ptBR,
  en,
  es,
};
