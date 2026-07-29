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
import { localePath, type PublicLocale } from "@/lib/locales";
import {
  getHomeStructuredData,
  serializeStructuredData,
} from "@/lib/structured-data";

type ModernHomePageProps = {
  locale: PublicLocale;
};

export function ModernHomePage({ locale }: ModernHomePageProps) {
  const copy = siteCopy[locale];
  const isPt = locale === "pt-BR";
  const learnLabel = isPt ? "Ver detalhes" : "View details";
  const placeholderLabel = isPt
    ? "Espaço reservado para captura validada"
    : "Reserved for a validated product capture";

  const faqs: FaqItem[] = isPt
    ? [
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
      ]
    : [
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
      ];

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
              title={isPt ? "Registre a corrida" : "Record the run"}
              body={
                isPt
                  ? "Acompanhe uma atividade no Android ou traga dados de uma integração compatível."
                  : "Track an activity on Android or bring data from a compatible integration."
              }
              locale={locale}
              feature="runTracking"
            />
            <JourneyStep
              number="02"
              icon={<SwordsIcon />}
              title={isPt ? "Converta em progresso" : "Convert it into progress"}
              body={
                isPt
                  ? "Distância elegível alimenta missões, chefes e o avanço do personagem."
                  : "Eligible distance fuels quests, bosses and character progression."
              }
              locale={locale}
              feature="bossBattles"
            />
            <JourneyStep
              number="03"
              icon={<TrophyIcon />}
              title={isPt ? "Construa sua lenda" : "Build your legend"}
              body={
                isPt
                  ? "Recompensas, conquistas e relações registram uma identidade compartilhável."
                  : "Rewards, achievements and relationships create a shareable identity."
              }
              locale={locale}
              feature="achievements"
            />
          </ol>
          <div className="section-action">
            <Link
              className="text-link"
              href={localePath(locale, "/how-it-works")}
            >
              {isPt ? "Entender o ciclo completo" : "Explore the complete loop"}
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
                title: isPt ? "Registro da atividade" : "Activity tracking",
                caption: isPt
                  ? "A captura final será publicada após a validação da build."
                  : "The final capture will be published after build validation.",
                label: placeholderLabel,
              },
              {
                feature: "inventory",
                title: isPt ? "Inventário do herói" : "Hero inventory",
                caption: isPt
                  ? "Sem números de teste, preços fictícios ou promessas de loja."
                  : "No test metrics, fictional prices or storefront promises.",
                label: placeholderLabel,
              },
              {
                feature: "weeklyRanking",
                title: isPt ? "Ranking da semana" : "Weekly ranking",
                caption: isPt
                  ? "Apenas dados aprovados serão usados na apresentação pública."
                  : "Only approved data will appear in public presentation.",
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
              title={isPt ? "Chefes mundiais" : "World bosses"}
              body={
                isPt
                  ? "Converta movimento validado em dano e avance encontros do beta."
                  : "Turn validated movement into damage and advance beta encounters."
              }
              href={localePath(locale, "/features")}
              linkLabel={learnLabel}
            />
            <FeatureCard
              locale={locale}
              feature="raids"
              icon={<TowerIcon />}
              title="Raids"
              body={
                isPt
                  ? "Desafios coletivos de maior escala permanecem no desenvolvimento do universo."
                  : "Larger collective challenges remain in active universe development."
              }
            />
            <FeatureCard
              locale={locale}
              feature="sagas"
              icon={<BookIcon />}
              title={isPt ? "Sagas sazonais" : "Seasonal sagas"}
              body={
                isPt
                  ? "Arcos narrativos conectarão eventos, chefes e consequências futuras."
                  : "Narrative arcs will connect events, bosses and future consequences."
              }
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
              title={isPt ? "Inventário" : "Inventory"}
              body={
                isPt
                  ? "Equipamentos e itens obtidos pelo ciclo de progressão do beta."
                  : "Equipment and items earned through the beta progression loop."
              }
            />
            <FeatureCard
              locale={locale}
              feature="achievements"
              icon={<TrophyIcon />}
              title={isPt ? "Conquistas" : "Achievements"}
              body={
                isPt
                  ? "Marcos reconhecem consistência, exploração e participação."
                  : "Milestones recognize consistency, exploration and participation."
              }
            />
            <FeatureCard
              locale={locale}
              feature="founderSword"
              icon={<CrownIcon />}
              title={isPt ? "Espada de Fundador" : "Founder Sword"}
              body={
                isPt
                  ? "Uma relíquia de identidade ainda em validação para participantes elegíveis."
                  : "An identity relic still under validation for eligible participants."
              }
            />
            <FeatureCard
              locale={locale}
              feature="diamondPurchases"
              icon={<GemIcon />}
              title={isPt ? "Diamantes" : "Diamonds"}
              body={
                isPt
                  ? "Moeda virtual sem valor monetário real. Compras não estarão ativas no beta."
                  : "Virtual currency with no real-world monetary value. Purchases will not be active in beta."
              }
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
              title={isPt ? "Amigos" : "Friends"}
              body={
                isPt
                  ? "Convites e conexões aproximam pessoas sem expor dados de treino por padrão."
                  : "Invitations and connections bring people together without exposing training data by default."
              }
            />
            <FeatureCard
              locale={locale}
              feature="groups"
              icon={<ShieldIcon />}
              title={isPt ? "Grupos e governança" : "Groups and governance"}
              body={
                isPt
                  ? "Papéis e administração apoiam comunidades pequenas no beta."
                  : "Roles and administration support small communities in beta."
              }
            />
            <FeatureCard
              locale={locale}
              feature="weeklyRanking"
              icon={<TrophyIcon />}
              title={isPt ? "Ranking semanal" : "Weekly ranking"}
              body={
                isPt
                  ? "Uma cadência compartilhada mede participação dentro das regras do beta."
                  : "A shared cadence measures participation within beta rules."
              }
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
                {isPt
                  ? "Companheiro narrativo, não profissional de saúde"
                  : "Narrative companion, not a health professional"}
              </h3>
              <p>
                {isPt
                  ? "Aethron usa contexto selecionado do produto para gerar mensagens. O escopo do provedor, a retenção e o uso de dados para treinamento ainda exigem decisões formais."
                  : "Aethron uses selected product context to generate messages. Provider scope, retention and the use of data for training still require formal decisions."}
              </p>
              <Link
                className="text-link"
                href={localePath(locale, "/ai-transparency")}
              >
                {isPt ? "Ler a transparência de IA" : "Read AI transparency"}
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
              body={
                isPt
                  ? "Importação e reconciliação de atividades passam por validação."
                  : "Activity import and reconciliation are under validation."
              }
            />
            <IntegrationCard
              locale={locale}
              feature="wearOs"
              icon={<WatchIcon />}
              title="Wear OS"
              body={
                isPt
                  ? "A experiência no relógio depende de testes em aparelhos físicos."
                  : "The watch experience depends on physical-device testing."
              }
              href={localePath(locale, "/wear-os")}
              linkLabel={learnLabel}
            />
            <IntegrationCard
              locale={locale}
              feature="ios"
              icon={<StarIcon />}
              title="iOS"
              body={
                isPt
                  ? "Uma plataforma planejada para uma fase posterior ao beta Android."
                  : "A platform planned for a phase after the Android beta."
              }
            />
            <IntegrationCard
              locale={locale}
              feature="appleWatch"
              icon={<WatchIcon />}
              title="Apple Watch"
              body={
                isPt
                  ? "A experiência de relógio da Apple permanece no roadmap."
                  : "The Apple watch experience remains on the roadmap."
              }
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
              title={isPt ? "Controle de conta" : "Account control"}
              body={
                isPt
                  ? "O fluxo de exclusão está em implementação. A página atual é apenas informativa e não recebe solicitações."
                  : "The deletion flow is being implemented. The current page is informational and does not accept requests."
              }
              href={localePath(locale, "/delete-account")}
              linkLabel={learnLabel}
              detailedStatus
            />
            <FeatureCard
              locale={locale}
              feature="communitySafety"
              icon={<ShieldIcon />}
              title={isPt ? "Denúncia e bloqueio" : "Reporting and blocking"}
              body={
                isPt
                  ? "Ferramentas e critérios de moderação ainda estão sendo concluídos."
                  : "Moderation tools and criteria are still being completed."
              }
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
              title={isPt ? "Preparar a build Android" : "Prepare Android build"}
              body={
                isPt
                  ? "Configuração final, integridade do registro e testes físicos."
                  : "Final configuration, tracking integrity and physical testing."
              }
            />
            <RoadmapCard
              number="02"
              locale={locale}
              feature="wearOs"
              title={isPt ? "Validar integrações" : "Validate integrations"}
              body={
                isPt
                  ? "Wear OS e Strava com dados reais de teste autorizados."
                  : "Wear OS and Strava with authorized real test data."
              }
            />
            <RoadmapCard
              number="03"
              locale={locale}
              feature="ios"
              title={isPt ? "Expandir plataformas" : "Expand platforms"}
              body={
                isPt
                  ? "iOS e Apple Watch depois dos aprendizados do beta."
                  : "iOS and Apple Watch after beta learnings."
              }
            />
          </div>
          <Link
            className="button button--secondary"
            href={localePath(locale, "/closed-beta")}
          >
            {isPt ? "Ver o plano do beta" : "View the beta plan"}
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
              title={isPt ? "A Névoa" : "The Mist"}
              body={
                isPt
                  ? "Ela cresce onde o caminho é abandonado e a vontade perde forma."
                  : "It grows where the path is abandoned and purpose loses its shape."
              }
            />
            <LoreCard
              number="II"
              icon={<MagicWandIcon />}
              title="Aethron"
              body={
                isPt
                  ? "Guardião desperto para lembrar que cada retorno alimenta a Chama."
                  : "A keeper awakened to remind us that every return feeds the Flame."
              }
            />
            <LoreCard
              number="III"
              icon={<CrownIcon />}
              title={isPt ? "Os Striders" : "The Striders"}
              body={
                isPt
                  ? "Corredores que transformam disciplina real em resistência para Elyndor."
                  : "Runners who turn real discipline into resistance for Elyndor."
              }
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
              {isPt ? "Abrir todas as respostas" : "Open all answers"}
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
  const isPt = locale === "pt-BR";

  return (
    <aside className="field-report" aria-label={isPt ? "Estado do beta" : "Beta status"}>
      <div className="field-report__top">
        <span>{isPt ? "Relatório de campo" : "Field report"}</span>
        <strong>{isPt ? "Android primeiro" : "Android first"}</strong>
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
        {isPt
          ? "Sem download público ou data prometida."
          : "No public download or promised release date."}
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
