import type { PublicLocale } from "@/lib/locales";

export type SiteCopy = {
  skip: string;
  nav: {
    product: string;
    how: string;
    events: string;
    community: string;
    aethron: string;
    integrations: string;
    beta: string;
    faq: string;
    join: string;
    tester: string;
    openMenu: string;
    closeMenu: string;
    language: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    primary: string;
    secondary: string;
    note: string;
  };
  section: {
    vision: { eyebrow: string; title: string; body: string };
    flow: { eyebrow: string; title: string; body: string };
    interface: { eyebrow: string; title: string; body: string };
    battle: { eyebrow: string; title: string; body: string };
    rewards: { eyebrow: string; title: string; body: string };
    community: { eyebrow: string; title: string; body: string };
    aethron: { eyebrow: string; title: string; body: string };
    integrations: { eyebrow: string; title: string; body: string };
    safety: { eyebrow: string; title: string; body: string };
    roadmap: { eyebrow: string; title: string; body: string };
    lore: { eyebrow: string; title: string; body: string };
    faq: { eyebrow: string; title: string; body: string };
    waitlist: { eyebrow: string; title: string; body: string };
  };
  waitlist: {
    name: string;
    email: string;
    submit: string;
    loading: string;
    disclosure: string;
    capacity: string;
    privacyLink: string;
    success: string;
    duplicate: string;
    invalid: string;
    failure: string;
    honeypot: string;
  };
  footer: {
    product: string;
    support: string;
    legal: string;
    roadmap: string;
    language: string;
    social: string;
    comingSoon: string;
    rights: string;
    draftNote: string;
  };
  accountDeletion: {
    formTitle: string;
    formIntro: string;
    emailLabel: string;
    submit: string;
    loading: string;
    honeypot: string;
    requested: string;
    invalidEmail: string;
    rateLimited: string;
    unavailable: string;
    confirmChecking: string;
    confirmMissingToken: string;
    confirmScheduled: string;
    confirmAwaitingRetention: string;
    confirmGenericSuccess: string;
    confirmInvalid: string;
    confirmRateLimited: string;
    confirmUnavailable: string;
    backToRequest: string;
  };
};

export const siteCopy: Record<PublicLocale, SiteCopy> = {
  "pt-BR": {
    skip: "Pular para o conteúdo",
    nav: {
      product: "Produto",
      how: "Como funciona",
      events: "Eventos",
      community: "Comunidade",
      aethron: "Aethron",
      integrations: "Integrações",
      beta: "Beta fechado",
      faq: "Dúvidas",
      join: "Entrar na lista do beta",
      tester: "Login de testador",
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",
      language: "Idioma",
    },
    hero: {
      eyebrow: "Beta fechado para Android",
      title: "Corra no mundo real. Progrida em outro.",
      body:
        "MythStride transforma corridas registradas em missões, chefes, recompensas e progresso de RPG. O universo completo continua evoluindo junto com o beta.",
      primary: "Entrar na lista do beta",
      secondary: "Conhecer o MythStride",
      note:
        "O acesso ainda não está disponível publicamente. Convites dependem da capacidade de testes e da compatibilidade do dispositivo.",
    },
    section: {
      vision: {
        eyebrow: "Estado do universo",
        title: "Uma visão completa, apresentada com clareza.",
        body:
          "O MythStride preserva a ambição de unir corrida, RPG, comunidade, inteligência narrativa e novas plataformas. Cada recurso abaixo mostra seu estado real.",
      },
      flow: {
        eyebrow: "Da corrida ao RPG",
        title: "Seu movimento avança a aventura.",
        body:
          "Registre a atividade, valide a distância e transforme o resultado em progresso dentro de Elyndor.",
      },
      interface: {
        eyebrow: "Interface real",
        title: "A próxima captura precisa ser tão confiável quanto o produto.",
        body:
          "Os espaços estão preparados para capturas finais da build de validação. As imagens antigas com métricas de teste não são exibidas.",
      },
      battle: {
        eyebrow: "Conflitos de Elyndor",
        title: "Chefes no beta. Raids e sagas em desenvolvimento.",
        body:
          "A distância validada já move batalhas contra chefes. Raids e sagas permanecem na visão do universo enquanto sua implementação evolui.",
      },
      rewards: {
        eyebrow: "Recompensas e identidade",
        title: "Inventário, conquistas e relíquias contam a jornada.",
        body:
          "Itens, equipamentos, ouro, diamantes, conquistas e a Espada de Fundador continuam no centro da progressão.",
      },
      community: {
        eyebrow: "Comunidade",
        title: "Amigos, grupos e rankings dão ritmo à semana.",
        body:
          "Convites, governança de grupos, eventos e ranking semanal já fazem parte do beta. Os controles de segurança continuam em desenvolvimento.",
      },
      aethron: {
        eyebrow: "Guardião da Chama",
        title: "Aethron dá contexto narrativo à disciplina.",
        body:
          "Aethron gera orientação narrativa e motivacional a partir de contexto selecionado. O conteúdo pode conter erros e não oferece diagnóstico, tratamento ou aconselhamento profissional de saúde.",
      },
      integrations: {
        eyebrow: "Integrações",
        title: "O caminho começa no Android e se expande.",
        body:
          "Wear OS e Strava estão em validação. iOS e Apple Watch permanecem planejados para fases futuras.",
      },
      safety: {
        eyebrow: "Privacidade e comunidade",
        title: "A evolução do produto inclui controle e segurança.",
        body:
          "As estruturas de privacidade, exclusão de conta, denúncia e bloqueio estão sendo completadas. Os documentos desta fase são rascunhos técnicos, não políticas aprovadas.",
      },
      roadmap: {
        eyebrow: "Android primeiro",
        title: "Beta fechado agora. Mais plataformas depois.",
        body:
          "A build Android ainda depende de configuração final, testes físicos e capacidade de convite. Compras com dinheiro real e anúncios recompensados não estarão ativos nesta fase.",
      },
      lore: {
        eyebrow: "Crônicas de Elyndor",
        title: "Aethron despertou quando a Chama quase se apagou.",
        body:
          "Elyndor não caiu em uma única guerra. O propósito desapareceu sob a Névoa, e cada retorno ao caminho passou a alimentar a resistência.",
      },
      faq: {
        eyebrow: "Antes do beta",
        title: "Respostas diretas sobre o estado atual.",
        body:
          "Disponibilidade, plataformas, dados, compras e integrações — sem transformar roadmap em promessa ativa.",
      },
      waitlist: {
        eyebrow: "Lista do beta",
        title: "Registre seu interesse em testar MythStride.",
        body:
          "Entrar na lista não garante acesso automático. Os convites dependem da capacidade de testes e da compatibilidade do dispositivo.",
      },
    },
    waitlist: {
      name: "Nome (opcional)",
      email: "Email",
      submit: "Entrar na lista do beta",
      loading: "Enviando...",
      disclosure:
        "Usaremos seu email, idioma e informações técnicas de prevenção a abuso para administrar a lista.",
      capacity:
        "O cadastro registra interesse; não garante convite ou data de acesso.",
      privacyLink: "Ler o rascunho de privacidade",
      success:
        "Interesse registrado. Um eventual convite dependerá da capacidade de testes e do dispositivo.",
      duplicate: "Este email já está registrado na lista.",
      invalid: "Informe um email válido.",
      failure: "Não foi possível acessar a lista agora. Tente novamente.",
      honeypot: "Não preencha este campo",
    },
    accountDeletion: {
      formTitle: "Solicitar exclusão de conta",
      formIntro:
        "Informe o email da conta. Se existir uma conta associada, enviaremos um link de verificação.",
      emailLabel: "Email da conta",
      submit: "Solicitar exclusão",
      loading: "Enviando...",
      honeypot: "Não preencha este campo",
      requested:
        "Caso exista uma conta associada a esse email, enviaremos as próximas instruções.",
      invalidEmail: "Informe um email válido.",
      rateLimited: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
      unavailable:
        "Não foi possível processar a solicitação agora. Tente novamente mais tarde.",
      confirmChecking: "Verificando o link de confirmação...",
      confirmMissingToken:
        "Este link de confirmação está incompleto. Solicite um novo link de exclusão.",
      confirmScheduled: "Verificação concluída. A exclusão foi agendada.",
      confirmAwaitingRetention:
        "Verificação concluída. A execução da exclusão ainda depende da configuração final de retenção de dados pelo responsável.",
      confirmGenericSuccess: "Verificação concluída.",
      confirmInvalid:
        "Este link é inválido ou já expirou. Solicite um novo link de exclusão.",
      confirmRateLimited:
        "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
      confirmUnavailable:
        "Não foi possível confirmar agora. Tente novamente mais tarde.",
      backToRequest: "Solicitar novo link",
    },
    footer: {
      product: "Produto",
      support: "Suporte",
      legal: "Legal",
      roadmap: "Roadmap",
      language: "Idioma",
      social: "Canais sociais",
      comingSoon: "Disponível futuramente",
      rights: "Todos os direitos reservados.",
      draftNote:
        "Os documentos jurídicos indicados como rascunho aguardam decisões e revisão final.",
    },
  },
  en: {
    skip: "Skip to content",
    nav: {
      product: "Product",
      how: "How it works",
      events: "Events",
      community: "Community",
      aethron: "Aethron",
      integrations: "Integrations",
      beta: "Closed beta",
      faq: "FAQ",
      join: "Join the beta list",
      tester: "Beta tester login",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      language: "Language",
    },
    hero: {
      eyebrow: "Android closed beta",
      title: "Run in the real world. Progress in another.",
      body:
        "MythStride turns recorded runs into quests, bosses, rewards and RPG progression. The complete universe continues to evolve alongside the beta.",
      primary: "Join the beta list",
      secondary: "Discover MythStride",
      note:
        "Public access is not available yet. Invitations depend on testing capacity and device compatibility.",
    },
    section: {
      vision: {
        eyebrow: "State of the universe",
        title: "A complete vision, presented clearly.",
        body:
          "MythStride preserves its ambition to unite running, RPG progression, community, narrative intelligence and new platforms. Every feature below shows its real status.",
      },
      flow: {
        eyebrow: "From running to RPG",
        title: "Your movement advances the adventure.",
        body:
          "Record the activity, validate the distance and turn the result into progression inside Elyndor.",
      },
      interface: {
        eyebrow: "Real interface",
        title: "The next capture must be as trustworthy as the product.",
        body:
          "These spaces are prepared for final validation-build captures. Old media containing test metrics is not displayed.",
      },
      battle: {
        eyebrow: "Conflicts of Elyndor",
        title: "Bosses in beta. Raids and sagas in development.",
        body:
          "Validated distance already moves boss battles forward. Raids and sagas remain part of the universe while implementation evolves.",
      },
      rewards: {
        eyebrow: "Rewards and identity",
        title: "Inventory, achievements and relics record the journey.",
        body:
          "Items, equipment, gold, diamonds, achievements and the Founder Sword remain central to progression.",
      },
      community: {
        eyebrow: "Community",
        title: "Friends, groups and rankings give the week a rhythm.",
        body:
          "Invitations, group governance, events and weekly ranking are part of the beta. Safety controls remain in development.",
      },
      aethron: {
        eyebrow: "Keeper of the Flame",
        title: "Aethron gives narrative context to discipline.",
        body:
          "Aethron generates narrative and motivational guidance from selected context. Content can be wrong and does not provide diagnosis, treatment or professional health advice.",
      },
      integrations: {
        eyebrow: "Integrations",
        title: "The path starts on Android and expands.",
        body:
          "Wear OS and Strava are under validation. iOS and Apple Watch remain planned for future phases.",
      },
      safety: {
        eyebrow: "Privacy and community",
        title: "Product evolution includes control and safety.",
        body:
          "Privacy, account deletion, reporting and blocking foundations are being completed. Documents in this phase are technical drafts, not approved policies.",
      },
      roadmap: {
        eyebrow: "Android first",
        title: "Closed beta now. More platforms later.",
        body:
          "The Android build still depends on final configuration, physical testing and invitation capacity. Real-money purchases and rewarded ads will not be active in this phase.",
      },
      lore: {
        eyebrow: "Chronicles of Elyndor",
        title: "Aethron awakened when the Flame nearly faded.",
        body:
          "Elyndor did not fall in a single war. Purpose vanished beneath the Mist, and every return to the path began feeding the resistance.",
      },
      faq: {
        eyebrow: "Before the beta",
        title: "Direct answers about the current state.",
        body:
          "Availability, platforms, data, purchases and integrations — without turning a roadmap into an active promise.",
      },
      waitlist: {
        eyebrow: "Beta list",
        title: "Register your interest in testing MythStride.",
        body:
          "Joining the list does not guarantee automatic access. Invitations depend on testing capacity and device compatibility.",
      },
    },
    waitlist: {
      name: "Name (optional)",
      email: "Email",
      submit: "Join the beta list",
      loading: "Sending...",
      disclosure:
        "We use your email, language and technical abuse-prevention information to administer the list.",
      capacity:
        "Registration records interest; it does not guarantee an invitation or access date.",
      privacyLink: "Read the privacy draft",
      success:
        "Interest registered. Any invitation will depend on testing capacity and device compatibility.",
      duplicate: "This email is already registered on the list.",
      invalid: "Enter a valid email address.",
      failure: "The list could not be reached right now. Please try again.",
      honeypot: "Do not fill in this field",
    },
    accountDeletion: {
      formTitle: "Request account deletion",
      formIntro:
        "Enter the account email. If an account is associated with it, we will send a verification link.",
      emailLabel: "Account email",
      submit: "Request deletion",
      loading: "Sending...",
      honeypot: "Do not fill in this field",
      requested:
        "If an account is associated with this email, we will send the next instructions.",
      invalidEmail: "Enter a valid email address.",
      rateLimited: "Too many attempts. Wait a few minutes and try again.",
      unavailable:
        "The request could not be processed right now. Please try again later.",
      confirmChecking: "Verifying the confirmation link...",
      confirmMissingToken:
        "This confirmation link is incomplete. Request a new deletion link.",
      confirmScheduled: "Verification complete. Deletion has been scheduled.",
      confirmAwaitingRetention:
        "Verification complete. Executing the deletion still depends on the owner's final data-retention configuration.",
      confirmGenericSuccess: "Verification complete.",
      confirmInvalid:
        "This link is invalid or has expired. Request a new deletion link.",
      confirmRateLimited: "Too many attempts. Wait a few minutes and try again.",
      confirmUnavailable:
        "The request could not be confirmed right now. Please try again later.",
      backToRequest: "Request a new link",
    },
    footer: {
      product: "Product",
      support: "Support",
      legal: "Legal",
      roadmap: "Roadmap",
      language: "Language",
      social: "Social channels",
      comingSoon: "Coming later",
      rights: "All rights reserved.",
      draftNote:
        "Legal documents marked as drafts still require final decisions and review.",
    },
  },
  es: {
    skip: "Saltar al contenido",
    nav: {
      product: "Producto",
      how: "Cómo funciona",
      events: "Eventos",
      community: "Comunidad",
      aethron: "Aethron",
      integrations: "Integraciones",
      beta: "Beta cerrada",
      faq: "Preguntas",
      join: "Unirme a la lista de la beta",
      tester: "Acceso para testers",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      language: "Idioma",
    },
    hero: {
      eyebrow: "Beta cerrada para Android",
      title: "Corre en el mundo real. Progresa en otro.",
      body:
        "MythStride convierte carreras registradas en misiones, jefes, recompensas y progreso de RPG. El universo completo sigue evolucionando junto con la beta.",
      primary: "Unirme a la lista de la beta",
      secondary: "Descubrir MythStride",
      note:
        "El acceso público aún no está disponible. Las invitaciones dependen de la capacidad de prueba y de la compatibilidad del dispositivo.",
    },
    section: {
      vision: {
        eyebrow: "Estado del universo",
        title: "Una visión completa, presentada con claridad.",
        body:
          "MythStride conserva su ambición de unir carrera, progreso de RPG, comunidad, inteligencia narrativa y nuevas plataformas. Cada función muestra su estado real.",
      },
      flow: {
        eyebrow: "De la carrera al RPG",
        title: "Tu movimiento hace avanzar la aventura.",
        body:
          "Registra la actividad, valida la distancia y convierte el resultado en progreso dentro de Elyndor.",
      },
      interface: {
        eyebrow: "Interfaz real",
        title: "La próxima captura debe ser tan fiable como el producto.",
        body:
          "Estos espacios están preparados para capturas finales de la versión de validación. No se muestran imágenes antiguas con métricas de prueba.",
      },
      battle: {
        eyebrow: "Conflictos de Elyndor",
        title: "Jefes en la beta. Raids y sagas en desarrollo.",
        body:
          "La distancia validada ya hace avanzar las batallas contra jefes. Las raids y sagas siguen formando parte del universo mientras evoluciona su implementación.",
      },
      rewards: {
        eyebrow: "Recompensas e identidad",
        title: "Inventario, logros y reliquias cuentan el viaje.",
        body:
          "Objetos, equipo, oro, diamantes, logros y la Espada de Fundador siguen en el centro del progreso.",
      },
      community: {
        eyebrow: "Comunidad",
        title: "Amigos, grupos y clasificaciones dan ritmo a la semana.",
        body:
          "Las invitaciones, la gestión de grupos, los eventos y la clasificación semanal forman parte de la beta. Los controles de seguridad siguen en desarrollo.",
      },
      aethron: {
        eyebrow: "Guardián de la Llama",
        title: "Aethron da contexto narrativo a la disciplina.",
        body:
          "Aethron genera orientación narrativa y motivacional a partir de contexto seleccionado. El contenido puede contener errores y no ofrece diagnóstico, tratamiento ni asesoramiento profesional de salud.",
      },
      integrations: {
        eyebrow: "Integraciones",
        title: "El camino comienza en Android y se expande.",
        body:
          "Wear OS y Strava están en validación. iOS y Apple Watch siguen planificados para fases futuras.",
      },
      safety: {
        eyebrow: "Privacidad y comunidad",
        title: "La evolución del producto incluye control y seguridad.",
        body:
          "Se están completando las bases de privacidad, eliminación de cuenta, denuncias y bloqueos. Los documentos de esta fase son borradores técnicos, no políticas aprobadas.",
      },
      roadmap: {
        eyebrow: "Android primero",
        title: "Beta cerrada ahora. Más plataformas después.",
        body:
          "La versión Android todavía depende de configuración final, pruebas físicas y capacidad de invitación. Las compras con dinero real y los anuncios recompensados no estarán activos en esta fase.",
      },
      lore: {
        eyebrow: "Crónicas de Elyndor",
        title: "Aethron despertó cuando la Llama casi se apagó.",
        body:
          "Elyndor no cayó en una sola guerra. El propósito desapareció bajo la Niebla y cada regreso al camino comenzó a alimentar la resistencia.",
      },
      faq: {
        eyebrow: "Antes de la beta",
        title: "Respuestas directas sobre el estado actual.",
        body:
          "Disponibilidad, plataformas, datos, compras e integraciones, sin convertir la hoja de ruta en una promesa activa.",
      },
      waitlist: {
        eyebrow: "Lista de la beta",
        title: "Registra tu interés en probar MythStride.",
        body:
          "Unirse a la lista no garantiza acceso automático. Las invitaciones dependen de la capacidad de prueba y de la compatibilidad del dispositivo.",
      },
    },
    waitlist: {
      name: "Nombre (opcional)",
      email: "Correo electrónico",
      submit: "Unirme a la lista de la beta",
      loading: "Enviando...",
      disclosure:
        "Usaremos tu correo, idioma e información técnica de prevención de abusos para administrar la lista.",
      capacity:
        "El registro expresa interés; no garantiza una invitación ni una fecha de acceso.",
      privacyLink: "Leer el borrador de privacidad",
      success:
        "Interés registrado. Cualquier invitación dependerá de la capacidad de prueba y de la compatibilidad del dispositivo.",
      duplicate: "Este correo ya está registrado en la lista.",
      invalid: "Introduce una dirección de correo válida.",
      failure:
        "No se pudo acceder a la lista en este momento. Inténtalo de nuevo.",
      honeypot: "No rellenes este campo",
    },
    accountDeletion: {
      formTitle: "Solicitar la eliminación de la cuenta",
      formIntro:
        "Indica el email de la cuenta. Si existe una cuenta asociada, enviaremos un enlace de verificación.",
      emailLabel: "Email de la cuenta",
      submit: "Solicitar eliminación",
      loading: "Enviando...",
      honeypot: "No rellenes este campo",
      requested:
        "Si existe una cuenta asociada a este email, enviaremos las próximas instrucciones.",
      invalidEmail: "Indica un email válido.",
      rateLimited: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.",
      unavailable:
        "No se pudo procesar la solicitud ahora. Inténtalo de nuevo más tarde.",
      confirmChecking: "Verificando el enlace de confirmación...",
      confirmMissingToken:
        "Este enlace de confirmación está incompleto. Solicita un nuevo enlace de eliminación.",
      confirmScheduled: "Verificación completada. La eliminación ha sido programada.",
      confirmAwaitingRetention:
        "Verificación completada. La ejecución de la eliminación todavía depende de la configuración final de retención de datos del responsable.",
      confirmGenericSuccess: "Verificación completada.",
      confirmInvalid:
        "Este enlace no es válido o ha caducado. Solicita un nuevo enlace de eliminación.",
      confirmRateLimited:
        "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.",
      confirmUnavailable:
        "No se pudo confirmar ahora. Inténtalo de nuevo más tarde.",
      backToRequest: "Solicitar un nuevo enlace",
    },
    footer: {
      product: "Producto",
      support: "Soporte",
      legal: "Legal",
      roadmap: "Hoja de ruta",
      language: "Idioma",
      social: "Canales sociales",
      comingSoon: "Disponible más adelante",
      rights: "Todos los derechos reservados.",
      draftNote:
        "Los documentos jurídicos marcados como borrador aún requieren decisiones finales y revisión.",
    },
  },
};
