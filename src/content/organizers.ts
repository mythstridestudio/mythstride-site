import type { PublicLocale } from "@/lib/locales";

type Benefit = { number: string; title: string; text: string };
type Step = { title: string; text: string };
type Question = { question: string; answer: string };

export type OrganizersCopy = {
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  title: string;
  lead: string;
  primaryCta: string;
  secondaryCta: string;
  pilotNote: string;
  conceptNote: string;
  conceptTop: string;
  conceptName: string;
  conceptBottom: string;
  highlight: string;
  benefitsEyebrow: string;
  benefitsTitle: string;
  benefitsIntro: string;
  benefits: Benefit[];
  processEyebrow: string;
  processTitle: string;
  steps: Step[];
  eligibilityTitle: string;
  eligibilityText: string;
  faqTitle: string;
  questions: Question[];
  closingEyebrow: string;
  closingTitle: string;
  closingText: string;
  emailLabel: string;
  mailSubject: string;
  mailBody: string;
};

export const organizersCopy: Record<PublicLocale, OrganizersCopy> = {
  "pt-BR": {
    seoTitle: "Para organizadores de corridas e caminhadas | MythStride",
    seoDescription: "Organiza corridas de rua ou caminhadas? Apresente seu evento ao MythStride e conheça uma parceria piloto com medalha digital e divulgação conjunta.",
    eyebrow: "MYTHSTRIDE PARA ORGANIZADORES",
    title: "Sua prova termina. A conquista continua.",
    lead: "Leve sua corrida de rua ou caminhada para a experiência digital do MythStride. Uma medalha exclusiva pode transformar a participação em uma conquista que o atleta guarda no aplicativo.",
    primaryCta: "Quero apresentar meu evento",
    secondaryCta: "Entenda a parceria",
    pilotNote: "Propostas piloto selecionadas · Sem custo para o organizador nesta fase · Sujeito à análise",
    conceptNote: "Visual conceitual. A arte final é definida com cada organizador.",
    conceptTop: "MEDALHA DIGITAL",
    conceptName: "SUA PROVA",
    conceptBottom: "UMA CONQUISTA PARA GUARDAR",
    highlight: "Mais um motivo para seus atletas se lembrarem da sua prova.",
    benefitsEyebrow: "VALOR PARA SEU EVENTO",
    benefitsTitle: "Uma lembrança que vai além da linha de chegada.",
    benefitsIntro: "O MythStride é um aplicativo de corrida com elementos de RPG. Nossa proposta conecta a identidade do seu evento a uma experiência digital para os participantes.",
    benefits: [
      { number: "01", title: "Medalha com a identidade da prova", text: "Avaliamos uma medalha digital exclusiva, alinhada à marca e aos critérios de participação do evento." },
      { number: "02", title: "Uma nova oportunidade de divulgação", text: "Podemos apresentar a parceria nos canais do MythStride e construir ações de divulgação conjunta, conforme o plano acordado." },
      { number: "03", title: "Conquista na jornada do atleta", text: "Quando a entrega da medalha for elegível e validada, a conquista poderá fazer parte do perfil do participante no MythStride." },
    ],
    processEyebrow: "SIMPLES DE COMEÇAR",
    processTitle: "Você organiza o evento. Nós alinhamos a experiência digital.",
    steps: [
      { title: "Apresente sua prova", text: "Envie nome, cidade, data, modalidade e uma estimativa de participantes." },
      { title: "Validamos a proposta", text: "Conferimos formato, critérios de participação, viabilidade técnica e uso da identidade visual." },
      { title: "Preparamos a experiência", text: "Após o alinhamento, definimos medalha, regras de elegibilidade e comunicação com os participantes." },
      { title: "Divulgamos em conjunto", text: "Com o evento aprovado, combinamos a divulgação e as instruções para os atletas." },
    ],
    eligibilityTitle: "Corridas e caminhadas são bem-vindas",
    eligibilityText: "O registro de atividades do MythStride é focado em corridas. Para caminhadas, analisamos caso a caso a forma de participação e validação antes de confirmar qualquer medalha. A parceria não substitui inscrição, cronometragem ou operação do evento.",
    faqTitle: "Dúvidas de organizadores",
    questions: [
      { question: "A parceria tem custo?", answer: "Nesta fase, estamos avaliando parcerias piloto sem custo para organizadores selecionados. Escopo, condições e responsabilidades são combinados antes da confirmação." },
      { question: "O MythStride organiza ou cronometra minha prova?", answer: "Não. A organização, inscrição, segurança e cronometragem continuam sob responsabilidade do evento. O MythStride propõe uma experiência digital complementar." },
      { question: "Como o atleta recebe a medalha digital?", answer: "As regras de elegibilidade e o processo de entrega são definidos com cada parceiro, de acordo com as funcionalidades e validações técnicas disponíveis. Não prometemos entrega automática em todos os formatos." },
      { question: "É possível cadastrar uma caminhada?", answer: "Sim, você pode apresentar uma caminhada. A viabilidade da experiência digital e da validação de participação precisa ser analisada antes da aprovação." },
      { question: "A divulgação garante inscrições ou alcance?", answer: "Não. Planejamos ações de divulgação de acordo com a parceria, sem prometer volume de inscrições, instalações ou impressões." },
    ],
    closingEyebrow: "VAMOS CONVERSAR?",
    closingTitle: "Sua próxima edição pode ter uma conquista digital própria.",
    closingText: "Conte-nos sobre sua corrida ou caminhada. Nossa equipe avaliará a proposta e responderá sobre os próximos passos.",
    emailLabel: "Ou escreva para contato@playmythstride.com",
    mailSubject: "Parceria MythStride — proposta de evento",
    mailBody: "Olá, equipe MythStride!\n\nGostaria de apresentar meu evento para avaliação de parceria.\n\nNome do evento: \nModalidade (corrida/caminhada): \nCidade/UF: \nData do evento: \nParticipantes estimados: \nSite ou rede social: \nMeu nome e contato: \n\nObrigado!",
  },
  en: {
    seoTitle: "For running and walking event organizers | MythStride",
    seoDescription: "Organize road races or walking events? Introduce your event to MythStride and explore a pilot partnership with digital medals and joint promotion.",
    eyebrow: "MYTHSTRIDE FOR EVENT ORGANIZERS",
    title: "Your event ends. The achievement lives on.",
    lead: "Bring your road race or walking event into the MythStride digital experience. A custom medal can turn participation into an achievement athletes keep in the app.",
    primaryCta: "Tell us about your event",
    secondaryCta: "How the partnership works",
    pilotNote: "Selected pilot proposals · No organizer fee at this stage · Subject to review",
    conceptNote: "Illustrative concept. Final artwork is agreed with each organizer.",
    conceptTop: "DIGITAL MEDAL",
    conceptName: "YOUR EVENT",
    conceptBottom: "AN ACHIEVEMENT TO KEEP",
    highlight: "Give athletes another reason to remember your event.",
    benefitsEyebrow: "VALUE FOR YOUR EVENT",
    benefitsTitle: "A memory that goes beyond the finish line.",
    benefitsIntro: "MythStride is a running app with RPG elements. Our proposal connects your event identity to an additional digital experience for participants.",
    benefits: [
      { number: "01", title: "Your event's own digital medal", text: "We assess a custom digital medal aligned with your brand and participation requirements." },
      { number: "02", title: "An extra promotion opportunity", text: "We can feature the partnership on MythStride channels and agree on collaborative promotion." },
      { number: "03", title: "An achievement in the athlete's journey", text: "After eligibility and delivery are validated, the achievement may become part of the athlete's MythStride profile." },
    ],
    processEyebrow: "GETTING STARTED",
    processTitle: "You run the event. We plan the digital experience.",
    steps: [
      { title: "Introduce your event", text: "Send the name, location, date, event type, and estimated attendance." },
      { title: "We review the proposal", text: "We check the format, participation criteria, technical feasibility, and brand permissions." },
      { title: "We prepare the experience", text: "Once aligned, we define medal artwork, eligibility rules, and athlete communication." },
      { title: "We promote together", text: "After approval, we agree on promotion and participant instructions." },
    ],
    eligibilityTitle: "Road races and walking events are welcome",
    eligibilityText: "MythStride's activity tracking focuses on running. For walking events, we review participation and validation options case by case before confirming any medal. The partnership does not replace registration, timing, or event operations.",
    faqTitle: "Questions from organizers",
    questions: [
      { question: "Does the partnership cost anything?", answer: "We are reviewing pilot partnerships at no cost to selected organizers. Scope, terms, and responsibilities are agreed before confirmation." },
      { question: "Will MythStride organize or time my race?", answer: "No. The organizer remains responsible for registration, safety, timing, and the event itself. MythStride offers a complementary digital experience." },
      { question: "How do athletes receive the digital medal?", answer: "Eligibility and delivery are agreed for each partner based on the available features and technical checks. Automatic delivery is not guaranteed for every format." },
      { question: "Can I propose a walking event?", answer: "Yes. You can submit walking events, but validation and technical feasibility need to be assessed before approval." },
      { question: "Does promotion guarantee sign-ups or reach?", answer: "No. Promotional activity is agreed individually, without guarantees of registrations, installations, or impressions." },
    ],
    closingEyebrow: "LET'S TALK",
    closingTitle: "Your next edition could have its own digital achievement.",
    closingText: "Tell us about your road race or walking event. We'll review the proposal and get back to you about next steps.",
    emailLabel: "Or email contato@playmythstride.com",
    mailSubject: "MythStride partnership — event proposal",
    mailBody: "Hello MythStride team!\n\nI'd like to introduce my event for partnership review.\n\nEvent name: \nType (run/walk): \nCity/region: \nEvent date: \nEstimated participants: \nWebsite or social profile: \nMy name and contact details: \n\nThank you!",
  },
  es: {
    seoTitle: "Para organizadores de carreras y caminatas | MythStride",
    seoDescription: "¿Organizas carreras o caminatas? Presenta tu evento a MythStride y conoce una posible alianza piloto con medallas digitales y promoción conjunta.",
    eyebrow: "MYTHSTRIDE PARA ORGANIZADORES",
    title: "Tu evento termina. El logro permanece.",
    lead: "Lleva tu carrera o caminata a la experiencia digital de MythStride. Una medalla personalizada puede convertir la participación en un logro que los atletas conservan en la aplicación.",
    primaryCta: "Quiero presentar mi evento",
    secondaryCta: "Cómo funciona la alianza",
    pilotNote: "Propuestas piloto seleccionadas · Sin costo para el organizador en esta fase · Sujeto a evaluación",
    conceptNote: "Concepto ilustrativo. El diseño final se acuerda con cada organizador.",
    conceptTop: "MEDALLA DIGITAL",
    conceptName: "TU EVENTO",
    conceptBottom: "UN LOGRO PARA CONSERVAR",
    highlight: "Dales a tus atletas otra razón para recordar tu evento.",
    benefitsEyebrow: "VALOR PARA TU EVENTO",
    benefitsTitle: "Un recuerdo más allá de la meta.",
    benefitsIntro: "MythStride es una aplicación de running con elementos de RPG. Nuestra propuesta conecta la identidad de tu evento con una experiencia digital adicional para los participantes.",
    benefits: [
      { number: "01", title: "Medalla con la identidad del evento", text: "Evaluamos una medalla digital exclusiva alineada con la marca y los requisitos de participación." },
      { number: "02", title: "Otra oportunidad de promoción", text: "Podemos difundir la alianza en los canales de MythStride y acordar acciones conjuntas." },
      { number: "03", title: "El logro en la historia del atleta", text: "Una vez aprobadas la elegibilidad y la entrega, el logro podrá formar parte del perfil del participante en MythStride." },
    ],
    processEyebrow: "FÁCIL DE EMPEZAR",
    processTitle: "Tú organizas el evento. Nosotros coordinamos la experiencia digital.",
    steps: [
      { title: "Presenta tu evento", text: "Envíanos nombre, ciudad, fecha, modalidad y participantes estimados." },
      { title: "Evaluamos la propuesta", text: "Revisamos formato, criterios de participación, viabilidad técnica y uso de la marca." },
      { title: "Preparamos la experiencia", text: "Tras acordarla, definimos medalla, criterios de elegibilidad y comunicación." },
      { title: "Difundimos juntos", text: "Con el evento aprobado, coordinamos la promoción e instrucciones para los atletas." },
    ],
    eligibilityTitle: "Carreras y caminatas son bienvenidas",
    eligibilityText: "El registro de actividades de MythStride se centra en las carreras. En las caminatas, revisamos la participación y la validación caso por caso antes de confirmar una medalla. La alianza no sustituye la inscripción, el cronometraje ni la organización del evento.",
    faqTitle: "Preguntas de organizadores",
    questions: [
      { question: "¿La alianza tiene costo?", answer: "En esta fase evaluamos alianzas piloto sin costo para organizadores seleccionados. El alcance, las condiciones y las responsabilidades se acuerdan antes de la confirmación." },
      { question: "¿MythStride organiza o cronometra el evento?", answer: "No. El organizador sigue siendo responsable de la inscripción, seguridad, cronometraje y operación. MythStride propone una experiencia digital complementaria." },
      { question: "¿Cómo recibe la medalla digital el atleta?", answer: "Los criterios de elegibilidad y entrega se definen con cada aliado según las funcionalidades y validaciones disponibles. No garantizamos entregas automáticas en todos los formatos." },
      { question: "¿Puedo proponer una caminata?", answer: "Sí. Puedes presentar caminatas, pero la validación y la viabilidad técnica se analizan antes de confirmar la alianza." },
      { question: "¿La promoción garantiza inscripciones o alcance?", answer: "No. Las acciones promocionales se acuerdan caso por caso, sin garantías de inscripciones, instalaciones o impresiones." },
    ],
    closingEyebrow: "¿HABLAMOS?",
    closingTitle: "Tu próxima edición puede tener su propio logro digital.",
    closingText: "Cuéntanos sobre tu carrera o caminata. Evaluaremos la propuesta y te responderemos con los próximos pasos.",
    emailLabel: "O escribe a contato@playmythstride.com",
    mailSubject: "Alianza MythStride — propuesta de evento",
    mailBody: "¡Hola, equipo MythStride!\n\nMe gustaría presentar mi evento para evaluar una alianza.\n\nNombre del evento: \nModalidad (carrera/caminata): \nCiudad/región: \nFecha: \nParticipantes estimados: \nSitio web o red social: \nMi nombre y contacto: \n\n¡Gracias!",
  },
};
