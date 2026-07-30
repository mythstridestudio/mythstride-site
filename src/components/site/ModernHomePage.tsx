import Link from "next/link";
import {
  AnvilIcon,
  BookIcon,
  CrownIcon,
  GemIcon,
  MagicWandIcon,
  MapIcon,
  RunIcon,
  ScrollIcon,
  ShieldIcon,
  SkullIcon,
  StarIcon,
  SwordsIcon,
  SyncIcon,
  TowerIcon,
  TrophyIcon,
  UsersIcon,
  WatchIcon,
} from "@/components/Icons";
import WaitlistForm from "@/components/WaitlistForm";
import { FeatureStatusBadge } from "@/components/product/FeatureStatusBadge";
import { FaqAccordion, type FaqItem } from "@/components/site/FaqAccordion";
import { FeatureCard } from "@/components/site/FeatureCard";
import { IntegrationCard } from "@/components/site/IntegrationCard";
import { LocalizedFooter } from "@/components/site/LocalizedFooter";
import { LocalizedNavigation } from "@/components/site/LocalizedNavigation";
import { LoreCard } from "@/components/site/LoreCard";
import { PageHero } from "@/components/site/PageHero";
import { RoadmapCard } from "@/components/site/RoadmapCard";
import { ScreenshotGallery } from "@/components/site/ScreenshotGallery";
import { SectionShell } from "@/components/site/SectionShell";
import { siteCopy } from "@/content/site";
import { getLocalizedText, localePath, type PublicLocale } from "@/lib/locales";
import {
  getHomeStructuredData,
  serializeStructuredData,
} from "@/lib/structured-data";

type ModernHomePageProps = {
  locale: PublicLocale;
};

export function ModernHomePage({ locale }: ModernHomePageProps) {
  const copy = siteCopy[locale];
  const text = (ptBR: string, en: string, es: string) =>
    getLocalizedText(locale, { "pt-BR": ptBR, en, es });
  const learnLabel = text("Ver detalhes", "View details", "Ver detalles");
  const placeholderLabel = text(
    "Espaço reservado para captura validada",
    "Reserved for a validated product capture",
    "Espacio reservado para una captura validada",
  );

  const faqs: FaqItem[] = getLocalizedText(locale, {
    "pt-BR": [
        {
          question: "O MythStride já está disponível para download?",
          answer:
            "Ainda não. O primeiro acesso será um beta fechado para Android, distribuído conforme a capacidade de testes e a compatibilidade dos aparelhos.",
        },
        {
          question: "Toda corrida vira uma batalha?",
          answer:
            "A proposta é validar a atividade e converter distância elegível em progresso de RPG. As regras e integrações ainda passam por validação antes da abertura do beta.",
        },
        {
          question: "Aethron oferece orientação médica ou de treino?",
          answer:
            "Não. Aethron é um companheiro narrativo e motivacional. O conteúdo pode conter erros e não substitui profissionais de saúde, diagnóstico, tratamento ou plano de treinamento.",
        },
        {
          question: "Haverá compras ou anúncios no beta?",
          answer:
            "Compras com dinheiro real e anúncios recompensados não estarão ativos nesta fase. Diamantes existem como elemento de progressão, sem valor monetário real.",
        },
        {
          question: "iPhone e Apple Watch serão compatíveis?",
          answer:
            "iOS e Apple Watch estão planejados, mas não fazem parte da primeira fase. Android, Wear OS e a validação com Strava vêm antes.",
        },
      ],
    en: [
        {
          question: "Is MythStride available to download?",
          answer:
            "Not yet. Initial access will be an Android closed beta, distributed according to testing capacity and device compatibility.",
        },
        {
          question: "Does every run become a battle?",
          answer:
            "The product is designed to validate an activity and convert eligible distance into RPG progress. Rules and integrations are still under validation before the beta opens.",
        },
        {
          question: "Does Aethron provide medical or training advice?",
          answer:
            "No. Aethron is a narrative and motivational companion. Content can be wrong and does not replace health professionals, diagnosis, treatment or a training plan.",
        },
        {
          question: "Will purchases or ads be active in the beta?",
          answer:
            "Real-money purchases and rewarded ads will not be active in this phase. Diamonds exist as a progression element and have no real-world monetary value.",
        },
        {
          question: "Will iPhone and Apple Watch be supported?",
          answer:
            "iOS and Apple Watch are planned but are not part of the first phase. Android, Wear OS and Strava validation come first.",
        },
      ],
    es: [
      {
        question: "¿MythStride ya está disponible para descargar?",
        answer:
          "Todavía no. El primer acceso será una beta cerrada para Android, distribuida según la capacidad de pruebas y la compatibilidad de los dispositivos.",
      },
      {
        question: "¿Cada carrera se convierte en una batalla?",
        answer:
          "La propuesta es validar la actividad y convertir la distancia elegible en progreso de RPG. Las reglas y las integraciones siguen en validación antes de abrir la beta.",
      },
      {
        question: "¿Aethron ofrece orientación médica o de entrenamiento?",
        answer:
          "No. Aethron es un compañero narrativo y motivacional. El contenido puede contener errores y no sustituye a profesionales de la salud, diagnósticos, tratamientos ni planes de entrenamiento.",
      },
      {
        question: "¿Habrá compras o anuncios en la beta?",
        answer:
          "Las compras con dinero real y los anuncios recompensados no estarán activos en esta fase. Los diamantes son un elemento de progresión sin valor monetario real.",
      },
      {
        question: "¿Habrá compatibilidad con iPhone y Apple Watch?",
        answer:
          "iOS y Apple Watch están planificados, pero no forman parte de la primera fase. Android, Wear OS y la validación con Strava tienen prioridad.",
      },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(getHomeStructuredData(locale)),
        }}
      />
      <a className="skip-link" href="#main-content">
        {copy.skip}
      </a>
      <LocalizedNavigation locale={locale} />
      <main id="main-content">
        <PageHero
          eyebrow={copy.hero.eyebrow}
          title={copy.hero.title}
          body={copy.hero.body}
          primary={{ href: "#join", label: copy.hero.primary }}
          secondary={{ href: "#how", label: copy.hero.secondary }}
          aside={<HeroFieldReport locale={locale} />}
        >
          <p className="hero-note">{copy.hero.note}</p>
        </PageHero>

        <SectionShell
          eyebrow={copy.section.vision.eyebrow}
          title={copy.section.vision.title}
          body={copy.section.vision.body}
          align="center"
        >
          <div className="status-ledger">
            <FeatureStatusBadge
              feature="bossBattles"
              locale={locale}
              detailed
            />
            <FeatureStatusBadge feature="strava" locale={locale} detailed />
            <FeatureStatusBadge feature="raids" locale={locale} detailed />
            <FeatureStatusBadge feature="ios" locale={locale} detailed />
            <FeatureStatusBadge
              feature="diamondPurchases"
              locale={locale}
              detailed
            />
          </div>
        </SectionShell>

        <SectionShell
          id="how"
          eyebrow={copy.section.flow.eyebrow}
          title={copy.section.flow.title}
          body={copy.section.flow.body}
          tone="stone"
        >
          <ol className="journey-steps">
            <JourneyStep
              number="01"
              icon={<RunIcon />}
              title={text("Registre a corrida", "Record the run", "Registra la carrera")}
              body={text(
                "Acompanhe uma atividade no Android ou traga dados de uma integração compatível.",
                "Track an activity on Android or bring data from a compatible integration.",
                "Registra una actividad en Android o incorpora datos de una integración compatible.",
              )}
              locale={locale}
              feature="runTracking"
            />
            <JourneyStep
              number="02"
              icon={<SwordsIcon />}
              title={text(
                "Converta em progresso",
                "Convert it into progress",
                "Conviértela en progreso",
              )}
              body={text(
                "Distância elegível alimenta missões, chefes e o avanço do personagem.",
                "Eligible distance fuels quests, bosses and character progression.",
                "La distancia elegible impulsa misiones, jefes y el progreso del personaje.",
              )}
              locale={locale}
              feature="bossBattles"
            />
            <JourneyStep
              number="03"
              icon={<TrophyIcon />}
              title={text("Construa sua lenda", "Build your legend", "Construye tu leyenda")}
              body={text(
                "Recompensas, conquistas e relações registram uma identidade compartilhável.",
                "Rewards, achievements and relationships create a shareable identity.",
                "Las recompensas, los logros y las relaciones crean una identidad que puedes compartir.",
              )}
              locale={locale}
              feature="achievements"
            />
          </ol>
          <div className="section-action">
            <Link
              className="text-link"
              href={localePath(locale, "/how-it-works")}
            >
              {text(
                "Entender o ciclo completo",
                "Explore the complete loop",
                "Explorar el ciclo completo",
              )}
            </Link>
          </div>
        </SectionShell>

        <SectionShell
          eyebrow={copy.section.interface.eyebrow}
          title={copy.section.interface.title}
          body={copy.section.interface.body}
          align="center"
        >
          <ScreenshotGallery
            locale={locale}
            items={[
              {
                feature: "runTracking",
                title: text(
                  "Registro da atividade",
                  "Activity tracking",
                  "Registro de actividad",
                ),
                caption: text(
                  "A captura final será publicada após a validação da build.",
                  "The final capture will be published after build validation.",
                  "La captura final se publicará después de validar la build.",
                ),
                label: placeholderLabel,
              },
              {
                feature: "inventory",
                title: text(
                  "Inventário do herói",
                  "Hero inventory",
                  "Inventario del héroe",
                ),
                caption: text(
                  "Sem números de teste, preços fictícios ou promessas de loja.",
                  "No test metrics, fictional prices or storefront promises.",
                  "Sin métricas de prueba, precios ficticios ni promesas de tienda.",
                ),
                label: placeholderLabel,
              },
              {
                feature: "weeklyRanking",
                title: text(
                  "Ranking da semana",
                  "Weekly ranking",
                  "Clasificación semanal",
                ),
                caption: text(
                  "Apenas dados aprovados serão usados na apresentação pública.",
                  "Only approved data will appear in public presentation.",
                  "Solo los datos aprobados aparecerán en la presentación pública.",
                ),
                label: placeholderLabel,
              },
            ]}
          />
        </SectionShell>

        <SectionShell
          eyebrow={copy.section.battle.eyebrow}
          title={copy.section.battle.title}
          body={copy.section.battle.body}
          tone="ember"
        >
          <div className="feature-grid">
            <FeatureCard
              locale={locale}
              feature="bossBattles"
              icon={<SkullIcon />}
              title={text("Chefes mundiais", "World bosses", "Jefes mundiales")}
              body={text(
                "Converta movimento validado em dano e avance encontros do beta.",
                "Turn validated movement into damage and advance beta encounters.",
                "Convierte el movimiento validado en daño y avanza en los encuentros de la beta.",
              )}
              href={localePath(locale, "/features")}
              linkLabel={learnLabel}
            />
            <FeatureCard
              locale={locale}
              feature="raids"
              icon={<TowerIcon />}
              title="Raids"
              body={text(
                "Desafios coletivos de maior escala permanecem no desenvolvimento do universo.",
                "Larger collective challenges remain in active universe development.",
                "Los desafíos colectivos de mayor escala siguen en desarrollo dentro del universo.",
              )}
            />
            <FeatureCard
              locale={locale}
              feature="sagas"
              icon={<BookIcon />}
              title={text("Sagas sazonais", "Seasonal sagas", "Sagas de temporada")}
              body={text(
                "Arcos narrativos conectarão eventos, chefes e consequências futuras.",
                "Narrative arcs will connect events, bosses and future consequences.",
                "Los arcos narrativos conectarán eventos, jefes y consecuencias futuras.",
              )}
            />
          </div>
        </SectionShell>

        <SectionShell
          eyebrow={copy.section.rewards.eyebrow}
          title={copy.section.rewards.title}
          body={copy.section.rewards.body}
          tone="stone"
        >
          <div className="feature-grid feature-grid--four">
            <FeatureCard
              locale={locale}
              feature="inventory"
              icon={<AnvilIcon />}
              title={text("Inventário", "Inventory", "Inventario")}
              body={text(
                "Equipamentos e itens obtidos pelo ciclo de progressão do beta.",
                "Equipment and items earned through the beta progression loop.",
                "Equipo y objetos obtenidos mediante el ciclo de progresión de la beta.",
              )}
            />
            <FeatureCard
              locale={locale}
              feature="achievements"
              icon={<TrophyIcon />}
              title={text("Conquistas", "Achievements", "Logros")}
              body={text(
                "Marcos reconhecem consistência, exploração e participação.",
                "Milestones recognize consistency, exploration and participation.",
                "Los hitos reconocen la constancia, la exploración y la participación.",
              )}
            />
            <FeatureCard
              locale={locale}
              feature="founderSword"
              icon={<CrownIcon />}
              title={text(
                "Espada de Fundador",
                "Founder Sword",
                "Espada de Fundador",
              )}
              body={text(
                "Uma relíquia de identidade ainda em validação para participantes elegíveis.",
                "An identity relic still under validation for eligible participants.",
                "Una reliquia de identidad aún en validación para participantes elegibles.",
              )}
            />
            <FeatureCard
              locale={locale}
              feature="diamondPurchases"
              icon={<GemIcon />}
              title={text("Diamantes", "Diamonds", "Diamantes")}
              body={text(
                "Moeda virtual sem valor monetário real. Compras não estarão ativas no beta.",
                "Virtual currency with no real-world monetary value. Purchases will not be active in beta.",
                "Moneda virtual sin valor monetario real. Las compras no estarán activas en la beta.",
              )}
              href={localePath(locale, "/purchases")}
              linkLabel={learnLabel}
            />
          </div>
        </SectionShell>

        <SectionShell
          eyebrow={copy.section.community.eyebrow}
          title={copy.section.community.title}
          body={copy.section.community.body}
        >
          <div className="feature-grid">
            <FeatureCard
              locale={locale}
              feature="friends"
              icon={<UsersIcon />}
              title={text("Amigos", "Friends", "Amigos")}
              body={text(
                "Convites e conexões aproximam pessoas sem expor dados de treino por padrão.",
                "Invitations and connections bring people together without exposing training data by default.",
                "Las invitaciones y conexiones acercan a las personas sin exponer datos de entrenamiento por defecto.",
              )}
            />
            <FeatureCard
              locale={locale}
              feature="groups"
              icon={<ShieldIcon />}
              title={text(
                "Grupos e governança",
                "Groups and governance",
                "Grupos y gobernanza",
              )}
              body={text(
                "Papéis e administração apoiam comunidades pequenas no beta.",
                "Roles and administration support small communities in beta.",
                "Los roles y la administración apoyan a comunidades pequeñas durante la beta.",
              )}
            />
            <FeatureCard
              locale={locale}
              feature="weeklyRanking"
              icon={<TrophyIcon />}
              title={text(
                "Ranking semanal",
                "Weekly ranking",
                "Clasificación semanal",
              )}
              body={text(
                "Uma cadência compartilhada mede participação dentro das regras do beta.",
                "A shared cadence measures participation within beta rules.",
                "Un ritmo compartido mide la participación dentro de las reglas de la beta.",
              )}
              href={localePath(locale, "/community")}
              linkLabel={learnLabel}
            />
          </div>
        </SectionShell>

        <SectionShell
          eyebrow={copy.section.aethron.eyebrow}
          title={copy.section.aethron.title}
          body={copy.section.aethron.body}
          tone="ember"
        >
          <div className="aethron-panel">
            <div className="aethron-panel__sigil" aria-hidden="true">
              <MagicWandIcon />
            </div>
            <div>
              <FeatureStatusBadge
                locale={locale}
                feature="aethron"
                detailed
              />
              <h3>
                {text(
                  "Companheiro narrativo, não profissional de saúde",
                  "Narrative companion, not a health professional",
                  "Compañero narrativo, no profesional de la salud",
                )}
              </h3>
              <p>
                {text(
                  "Aethron usa contexto selecionado do produto para gerar mensagens. O escopo do provedor, a retenção e o uso de dados para treinamento ainda exigem decisões formais.",
                  "Aethron uses selected product context to generate messages. Provider scope, retention and the use of data for training still require formal decisions.",
                  "Aethron utiliza contexto seleccionado del producto para generar mensajes. El alcance del proveedor, la retención y el uso de datos para entrenamiento aún requieren decisiones formales.",
                )}
              </p>
              <Link
                className="text-link"
                href={localePath(locale, "/ai-transparency")}
              >
                {text(
                  "Ler a transparência de IA",
                  "Read AI transparency",
                  "Leer la transparencia de IA",
                )}
              </Link>
            </div>
          </div>
        </SectionShell>

        <SectionShell
          eyebrow={copy.section.integrations.eyebrow}
          title={copy.section.integrations.title}
          body={copy.section.integrations.body}
          tone="stone"
        >
          <div className="integration-track">
            <IntegrationCard
              locale={locale}
              feature="strava"
              icon={<SyncIcon />}
              title="Strava"
              body={text(
                "Importação e reconciliação de atividades passam por validação.",
                "Activity import and reconciliation are under validation.",
                "La importación y la conciliación de actividades están en validación.",
              )}
            />
            <IntegrationCard
              locale={locale}
              feature="wearOs"
              icon={<WatchIcon />}
              title="Wear OS"
              body={text(
                "A experiência no relógio depende de testes em aparelhos físicos.",
                "The watch experience depends on physical-device testing.",
                "La experiencia en el reloj depende de pruebas con dispositivos físicos.",
              )}
              href={localePath(locale, "/wear-os")}
              linkLabel={learnLabel}
            />
            <IntegrationCard
              locale={locale}
              feature="ios"
              icon={<StarIcon />}
              title="iOS"
              body={text(
                "Uma plataforma planejada para uma fase posterior ao beta Android.",
                "A platform planned for a phase after the Android beta.",
                "Una plataforma planificada para una fase posterior a la beta de Android.",
              )}
            />
            <IntegrationCard
              locale={locale}
              feature="appleWatch"
              icon={<WatchIcon />}
              title="Apple Watch"
              body={text(
                "A experiência de relógio da Apple permanece no roadmap.",
                "The Apple watch experience remains on the roadmap.",
                "La experiencia para el reloj de Apple continúa en el roadmap.",
              )}
            />
          </div>
        </SectionShell>

        <SectionShell
          eyebrow={copy.section.safety.eyebrow}
          title={copy.section.safety.title}
          body={copy.section.safety.body}
        >
          <div className="safety-grid">
            <FeatureCard
              locale={locale}
              feature="accountDeletion"
              icon={<ScrollIcon />}
              title={text(
                "Controle de conta",
                "Account control",
                "Control de la cuenta",
              )}
              body={text(
                "O fluxo de exclusão está em implementação. A página atual é apenas informativa e não recebe solicitações.",
                "The deletion flow is being implemented. The current page is informational and does not accept requests.",
                "El flujo de eliminación está en implementación. La página actual es informativa y no recibe solicitudes.",
              )}
              href={localePath(locale, "/delete-account")}
              linkLabel={learnLabel}
              detailedStatus
            />
            <FeatureCard
              locale={locale}
              feature="communitySafety"
              icon={<ShieldIcon />}
              title={text(
                "Denúncia e bloqueio",
                "Reporting and blocking",
                "Denuncia y bloqueo",
              )}
              body={text(
                "Ferramentas e critérios de moderação ainda estão sendo concluídos.",
                "Moderation tools and criteria are still being completed.",
                "Las herramientas y los criterios de moderación aún se están completando.",
              )}
              href={localePath(locale, "/community-guidelines")}
              linkLabel={learnLabel}
              detailedStatus
            />
          </div>
        </SectionShell>

        <SectionShell
          eyebrow={copy.section.roadmap.eyebrow}
          title={copy.section.roadmap.title}
          body={copy.section.roadmap.body}
          tone="ember"
          align="center"
        >
          <div className="roadmap-line">
            <RoadmapCard
              number="01"
              locale={locale}
              feature="runTracking"
              title={text(
                "Preparar a build Android",
                "Prepare Android build",
                "Preparar la build de Android",
              )}
              body={text(
                "Configuração final, integridade do registro e testes físicos.",
                "Final configuration, tracking integrity and physical testing.",
                "Configuración final, integridad del registro y pruebas físicas.",
              )}
            />
            <RoadmapCard
              number="02"
              locale={locale}
              feature="wearOs"
              title={text(
                "Validar integrações",
                "Validate integrations",
                "Validar integraciones",
              )}
              body={text(
                "Wear OS e Strava com dados reais de teste autorizados.",
                "Wear OS and Strava with authorized real test data.",
                "Wear OS y Strava con datos reales de prueba autorizados.",
              )}
            />
            <RoadmapCard
              number="03"
              locale={locale}
              feature="ios"
              title={text(
                "Expandir plataformas",
                "Expand platforms",
                "Ampliar plataformas",
              )}
              body={text(
                "iOS e Apple Watch depois dos aprendizados do beta.",
                "iOS and Apple Watch after beta learnings.",
                "iOS y Apple Watch después de lo aprendido en la beta.",
              )}
            />
          </div>
          <Link
            className="button button--secondary"
            href={localePath(locale, "/closed-beta")}
          >
            {text("Ver o plano do beta", "View the beta plan", "Ver el plan de la beta")}
          </Link>
        </SectionShell>

        <SectionShell
          eyebrow={copy.section.lore.eyebrow}
          title={copy.section.lore.title}
          body={copy.section.lore.body}
          tone="stone"
        >
          <div className="lore-grid">
            <LoreCard
              number="I"
              icon={<MapIcon />}
              title={text("A Névoa", "The Mist", "La Niebla")}
              body={text(
                "Ela cresce onde o caminho é abandonado e a vontade perde forma.",
                "It grows where the path is abandoned and purpose loses its shape.",
                "Crece donde se abandona el camino y la voluntad pierde su forma.",
              )}
            />
            <LoreCard
              number="II"
              icon={<MagicWandIcon />}
              title="Aethron"
              body={text(
                "Guardião desperto para lembrar que cada retorno alimenta a Chama.",
                "A keeper awakened to remind us that every return feeds the Flame.",
                "Un guardián despierto para recordar que cada regreso alimenta la Llama.",
              )}
            />
            <LoreCard
              number="III"
              icon={<CrownIcon />}
              title={text("Os Striders", "The Striders", "Los Striders")}
              body={text(
                "Corredores que transformam disciplina real em resistência para Elyndor.",
                "Runners who turn real discipline into resistance for Elyndor.",
                "Corredores que convierten la disciplina real en resistencia para Elyndor.",
              )}
            />
          </div>
        </SectionShell>

        <SectionShell
          eyebrow={copy.section.faq.eyebrow}
          title={copy.section.faq.title}
          body={copy.section.faq.body}
        >
          <FaqAccordion items={faqs} />
          <div className="section-action">
            <Link className="text-link" href={localePath(locale, "/faq")}>
              {text(
                "Abrir todas as respostas",
                "Open all answers",
                "Abrir todas las respuestas",
              )}
            </Link>
          </div>
        </SectionShell>

        <SectionShell
          id="join"
          eyebrow={copy.section.waitlist.eyebrow}
          title={copy.section.waitlist.title}
          body={copy.section.waitlist.body}
          tone="ember"
          align="center"
          className="join-section"
        >
          <WaitlistForm locale={locale} />
        </SectionShell>
      </main>
      <LocalizedFooter locale={locale} />
    </>
  );
}

function HeroFieldReport({ locale }: { locale: PublicLocale }) {
  const text = (ptBR: string, en: string, es: string) =>
    getLocalizedText(locale, { "pt-BR": ptBR, en, es });

  return (
    <aside
      className="field-report"
      aria-label={text("Estado do beta", "Beta status", "Estado de la beta")}
    >
      <div className="field-report__top">
        <span>
          {text("Relatório de campo", "Field report", "Informe de campo")}
        </span>
        <strong>
          {text("Android primeiro", "Android first", "Android primero")}
        </strong>
      </div>
      <div className="field-report__crest" aria-hidden="true">
        <SwordsIcon />
      </div>
      <div className="field-report__items">
        <FeatureStatusBadge feature="bossBattles" locale={locale} />
        <FeatureStatusBadge feature="runTracking" locale={locale} />
        <FeatureStatusBadge feature="aethron" locale={locale} />
        <FeatureStatusBadge feature="wearOs" locale={locale} />
      </div>
      <p>
        {text(
          "Sem download público ou data prometida.",
          "No public download or promised release date.",
          "Sin descarga pública ni fecha de lanzamiento prometida.",
        )}
      </p>
    </aside>
  );
}

function JourneyStep({
  number,
  icon,
  title,
  body,
  locale,
  feature,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  locale: PublicLocale;
  feature: "runTracking" | "bossBattles" | "achievements";
}) {
  return (
    <li className="journey-step">
      <span className="journey-step__number">{number}</span>
      <span className="journey-step__icon" aria-hidden="true">
        {icon}
      </span>
      <FeatureStatusBadge feature={feature} locale={locale} />
      <h3>{title}</h3>
      <p>{body}</p>
    </li>
  );
}
