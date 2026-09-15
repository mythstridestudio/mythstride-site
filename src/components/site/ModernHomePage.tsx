import Image from "next/image";
import Link from "next/link";
import {
  CrownIcon,
  MagicWandIcon,
  MapIcon,
  ScrollIcon,
  ShieldIcon,
  SwordsIcon,
  WatchIcon,
} from "@/components/Icons";
import { MythBossMedal, MythGlyph } from "@/components/relic";
import WaitlistForm from "@/components/WaitlistForm";
import { FaqAccordion, type FaqItem } from "@/components/site/FaqAccordion";
import { FeatureCard } from "@/components/site/FeatureCard";
import { IntegrationCard } from "@/components/site/IntegrationCard";
import { LocalizedFooter } from "@/components/site/LocalizedFooter";
import { LocalizedNavigation } from "@/components/site/LocalizedNavigation";
import { LoreCard } from "@/components/site/LoreCard";
import { PageHero } from "@/components/site/PageHero";
import { ScreenshotGallery } from "@/components/site/ScreenshotGallery";
import { SectionShell } from "@/components/site/SectionShell";
import { siteCopy } from "@/content/site";
import { getLocalizedText, localePath, type PublicLocale } from "@/lib/locales";
import { getAssetPath } from "@/lib/assets";
import { getHomeStructuredData, serializeStructuredData } from "@/lib/structured-data";

type ModernHomePageProps = { locale: PublicLocale };

export function ModernHomePage({ locale }: ModernHomePageProps) {
  const copy = siteCopy[locale];
  const text = (ptBR: string, en: string, es: string) =>
    getLocalizedText(locale, { "pt-BR": ptBR, en, es });
  const learnLabel = text("Ver detalhes", "View details", "Ver detalles");

  const faqs: FaqItem[] = getLocalizedText(locale, {
    "pt-BR": [
      { question: "O MythStride já está disponível?", answer: "O MythStride está em beta fechado para Android. O acesso é liberado por convite para participantes selecionados da lista do beta." },
      { question: "Como minhas corridas viram progresso?", answer: "Atividades elegíveis são processadas pelo MythStride e utilizadas para alimentar progressão, missões, batalhas e outros sistemas do jogo." },
      { question: "Aethron é um treinador?", answer: "Não. Aethron é um companheiro narrativo baseado em inteligência artificial. Ele não oferece diagnóstico, tratamento ou orientação profissional de saúde." },
      { question: "Existem compras com dinheiro real?", answer: "Compras com dinheiro real não fazem parte do beta fechado atual. Diamantes existentes no jogo são moeda virtual e não possuem valor monetário fora do MythStride." },
      { question: "Posso excluir minha conta?", answer: "Sim. O MythStride disponibiliza um fluxo público de solicitação de exclusão com verificação do email associado à conta." },
    ],
    en: [
      { question: "Is MythStride available?", answer: "MythStride is in closed beta for Android. Access is invite-only for participants selected from the beta list." },
      { question: "How do my runs become progress?", answer: "MythStride processes eligible activities and uses them to fuel progression, quests, battles, and other game systems." },
      { question: "Is Aethron a coach?", answer: "No. Aethron is an AI-powered narrative companion. It does not provide diagnosis, treatment, or professional health advice." },
      { question: "Are there real-money purchases?", answer: "Real-money purchases are not part of the current closed beta. Diamonds are virtual game currency and have no monetary value outside MythStride." },
      { question: "Can I delete my account?", answer: "Yes. MythStride provides a public deletion request flow that verifies the email associated with the account." },
    ],
    es: [
      { question: "¿MythStride ya está disponible?", answer: "MythStride está en beta cerrada para Android. El acceso se realiza por invitación para participantes seleccionados de la lista." },
      { question: "¿Cómo se convierten mis carreras en progreso?", answer: "MythStride procesa las actividades elegibles y las utiliza para impulsar el progreso, las misiones, las batallas y otros sistemas del juego." },
      { question: "¿Aethron es un entrenador?", answer: "No. Aethron es un compañero narrativo basado en inteligencia artificial. No ofrece diagnóstico, tratamiento ni orientación profesional de salud." },
      { question: "¿Hay compras con dinero real?", answer: "Las compras con dinero real no forman parte de la beta cerrada actual. Los diamantes son moneda virtual y no tienen valor monetario fuera de MythStride." },
      { question: "¿Puedo eliminar mi cuenta?", answer: "Sí. MythStride ofrece un flujo público de solicitud de eliminación que verifica el email asociado a la cuenta." },
    ],
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(getHomeStructuredData(locale)) }} />
      <a className="skip-link" href="#main-content">{copy.skip}</a>
      <LocalizedNavigation locale={locale} />
      <main id="main-content">
        <PageHero
          eyebrow={copy.hero.eyebrow}
          title={copy.hero.title}
          body={copy.hero.body}
          primary={{ href: "#join", label: copy.hero.primary }}
          secondary={{ href: "#how", label: copy.hero.secondary }}
          aside={<HeroProductPreview locale={locale} />}
        />

        <SectionShell id="how" eyebrow={copy.section.flow.eyebrow} title={copy.section.flow.title} body={copy.section.flow.body} tone="stone">
          <ol className="journey-steps">
            <JourneyStep number="01" icon={<MythGlyph glyph="runOutdoor" />} title={text("Registre a corrida", "Track your run", "Registra la carrera")} body={text("Acompanhe distância, duração e ritmo da sua atividade.", "Follow the distance, duration, and pace of your activity.", "Sigue la distancia, la duración y el ritmo de tu actividad.")} />
            <JourneyStep number="02" icon={<SwordsIcon />} title={text("Converta em progresso", "Turn it into progress", "Conviértela en progreso")} body={text("Atividades elegíveis alimentam missões, batalhas e evolução.", "Eligible activities fuel quests, battles, and progression.", "Las actividades elegibles impulsan misiones, batallas y progreso.")} />
            <JourneyStep number="03" icon={<MythGlyph glyph="seasonChampion" />} title={text("Construa sua lenda", "Build your legend", "Construye tu leyenda")} body={text("Conquiste equipamentos, marcos e uma identidade própria em Elyndor.", "Earn equipment, milestones, and an identity of your own in Elyndor.", "Consigue equipo, hitos y una identidad propia en Elyndor.")} />
          </ol>
          <div className="section-action"><Link className="text-link" href={localePath(locale, "/how-it-works")} prefetch={false}>{text("Entender o ciclo completo", "Explore the complete loop", "Explorar el ciclo completo")}</Link></div>
        </SectionShell>

        <SectionShell eyebrow={copy.section.interface.eyebrow} title={copy.section.interface.title} body={copy.section.interface.body} align="center">
          <ScreenshotGallery locale={locale} items={[
            { title: text("Sua jornada", "Your journey", "Tu viaje"), caption: text("Acompanhe sua evolução, objetivos e o que está acontecendo em Elyndor.", "Follow your progression, goals, and what is happening across Elyndor.", "Sigue tu evolución, tus objetivos y lo que ocurre en Elyndor."), image: { src: `/images/product/dashboard-${locale}.webp`, alt: text("Painel principal do MythStride com progresso e chefe atual.", "MythStride home screen with progression and the current boss.", "Pantalla principal de MythStride con el progreso y el jefe actual.") } },
            { title: text("Inventário", "Inventory", "Inventario"), caption: text("Equipe itens conquistados e construa a identidade do seu personagem.", "Equip earned items and shape your character's identity.", "Equipa los objetos conseguidos y define la identidad de tu personaje."), image: { src: `/images/product/inventory-${locale}.webp`, alt: text("Inventário do MythStride com equipamentos e raridades.", "MythStride inventory with equipment and item rarities.", "Inventario de MythStride con equipo y rarezas.") } },
            { title: text("Eventos", "Events", "Eventos"), caption: text("Participe de desafios que conectam sua atividade ao mundo do MythStride.", "Take part in challenges that connect your activity to the world of MythStride.", "Participa en desafíos que conectan tu actividad con el mundo de MythStride."), image: { src: `/images/product/events-${locale}.webp`, alt: text("Tela de eventos do MythStride com desafios de corrida.", "MythStride events screen with running challenges.", "Pantalla de eventos de MythStride con desafíos de carrera.") } },
            { title: text("Grupos", "Groups", "Grupos"), caption: text("Funde um clã e compartilhe a jornada com quem corre ao seu lado.", "Found a clan and share the journey with the people who run beside you.", "Funda un clan y comparte el viaje con quienes corren a tu lado."), image: { src: `/images/product/groups-${locale}.webp`, alt: text("Tela de criação de grupo do MythStride com nome, descrição e requisito de fundação.", "MythStride group creation screen with name, description, and founding requirement.", "Pantalla de creación de grupo de MythStride con nombre, descripción y requisito de fundación.") } },
            { title: "Aethron", caption: text("Leve o contexto da sua jornada para uma experiência narrativa mais pessoal.", "Bring the context of your journey into a more personal narrative experience.", "Lleva el contexto de tu viaje a una experiencia narrativa más personal."), image: { src: `/images/product/aethron-${locale}.webp`, alt: text("Tela de Aethron com orientação narrativa da jornada.", "Aethron screen with narrative guidance for the journey.", "Pantalla de Aethron con orientación narrativa para el viaje.") } },
          ]} />
        </SectionShell>

        <SectionShell eyebrow={copy.section.battle.eyebrow} title={copy.section.battle.title} body={copy.section.battle.body} tone="ember">
          <div className="boss-showcase">
            <div className="boss-showcase__medals" aria-hidden="true">
              <MythBossMedal name="arpia" size="sm" /><MythBossMedal name="lich_do_abismo" size="sm" /><MythBossMedal name="dragao_ancestral" size="sm" /><MythBossMedal name="medusa" size="sm" /><MythBossMedal name="cerberus" size="sm" />
            </div>
            <FeatureCard icon={<SwordsIcon />} title={text("Chefes", "Bosses", "Jefes")} body={text("Transforme distância elegível em dano e avance nas batalhas de Elyndor.", "Turn eligible distance into damage and advance through the battles of Elyndor.", "Convierte la distancia elegible en daño y avanza en las batallas de Elyndor.")} href={localePath(locale, "/events")} linkLabel={learnLabel} />
          </div>
        </SectionShell>

        <SectionShell eyebrow={copy.section.rewards.eyebrow} title={copy.section.rewards.title} body={copy.section.rewards.body} tone="stone">
          <div className="feature-grid">
            <FeatureCard icon={<MythGlyph glyph="inventory" />} title={text("Inventário", "Inventory", "Inventario")} body={text("Reúna e equipe itens obtidos ao longo da sua jornada.", "Collect and equip items earned throughout your journey.", "Reúne y equipa objetos obtenidos durante tu viaje.")} />
            <FeatureCard icon={<MythGlyph glyph="achievements" />} title={text("Conquistas", "Achievements", "Logros")} body={text("Transforme consistência, exploração e desafios concluídos em marcos permanentes.", "Turn consistency, exploration, and completed challenges into lasting milestones.", "Convierte la constancia, la exploración y los desafíos completados en hitos permanentes.")} />
            <FeatureCard icon={<MythGlyph glyph="founderSword" />} title={text("Espada do Fundador", "Founder Sword", "Espada del Fundador")} body={text("Uma relíquia exclusiva para marcar quem esteve presente no início da jornada do MythStride.", "An exclusive relic for those present at the beginning of MythStride's journey.", "Una reliquia exclusiva para quienes estuvieron al comienzo del viaje de MythStride.")} />
            <FeatureCard icon={<MythGlyph glyph="diamond" />} title={text("Diamantes", "Diamonds", "Diamantes")} body={text("Moeda virtual utilizada dentro do MythStride. Não possui valor monetário fora do jogo. Compras com dinheiro real não fazem parte do beta fechado atual.", "Virtual currency used within MythStride. It has no monetary value outside the game. Real-money purchases are not part of the current closed beta.", "Moneda virtual utilizada dentro de MythStride. No tiene valor monetario fuera del juego. Las compras con dinero real no forman parte de la beta cerrada actual.")} />
          </div>
        </SectionShell>

        <SectionShell eyebrow={copy.section.community.eyebrow} title={copy.section.community.title} body={copy.section.community.body}>
          <div className="feature-grid">
            <FeatureCard icon={<MythGlyph glyph="social" />} title={text("Amigos", "Friends", "Amigos")} body={text("Construa sua rede e acompanhe outros Striders ao longo da jornada.", "Build your network and follow other Striders through the journey.", "Construye tu red y sigue a otros Striders durante el viaje.")} />
            <FeatureCard icon={<ShieldIcon />} title={text("Grupos", "Groups", "Grupos")} body={text("Reúna jogadores, organize sua comunidade e compartilhe objetivos.", "Bring players together, organize your community, and share goals.", "Reúne jugadores, organiza tu comunidad y comparte objetivos.")} />
            <FeatureCard icon={<MythGlyph glyph="seasonChampion" />} title={text("Ranking semanal", "Weekly ranking", "Clasificación semanal")} body={text("Compare sua participação com a comunidade e transforme cada semana em um novo desafio.", "Compare your participation with the community and turn every week into a new challenge.", "Compara tu participación con la comunidad y convierte cada semana en un nuevo desafío.")} href={localePath(locale, "/community")} linkLabel={learnLabel} />
          </div>
        </SectionShell>

        <SectionShell eyebrow={copy.section.aethron.eyebrow} title={copy.section.aethron.title} body={copy.section.aethron.body} tone="ember">
          <div className="aethron-panel aethron-panel--product">
            <div className="aethron-panel__sigil" aria-hidden="true"><MythGlyph glyph="aethronSigil" size={128} /></div>
            <div>
              <h3>{text("Companheiro narrativo", "Narrative companion", "Compañero narrativo")}</h3>
              <p>{text("Aethron é um companheiro narrativo baseado em inteligência artificial. O conteúdo gerado pode conter erros e não substitui diagnóstico, tratamento, orientação médica, treinamento profissional ou serviços de emergência.", "Aethron is an AI-powered narrative companion. Generated content may contain errors and does not replace diagnosis, treatment, medical advice, professional coaching, or emergency services.", "Aethron es un compañero narrativo basado en inteligencia artificial. El contenido generado puede contener errores y no sustituye diagnósticos, tratamientos, orientación médica, entrenamiento profesional ni servicios de emergencia.")}</p>
              <Link className="text-link" href={localePath(locale, "/aethron")} prefetch={false}>{learnLabel}</Link>
            </div>
            <div className="aethron-panel__screen" aria-hidden="true"><Image src={getAssetPath(`/images/product/aethron-${locale}.webp`)} alt="" width={720} height={1560} sizes="(max-width: 52rem) 72vw, 260px" /></div>
          </div>
        </SectionShell>

        <SectionShell eyebrow={copy.section.integrations.eyebrow} title={copy.section.integrations.title} body={copy.section.integrations.body} tone="stone">
          <div className="integration-track integration-track--single">
            <IntegrationCard icon={<WatchIcon />} title="Wear OS" body={text("A experiência para Wear OS complementa o aplicativo Android e mantém informações essenciais da corrida acessíveis durante a atividade.", "The Wear OS experience complements the Android app and keeps essential run information accessible during activity.", "La experiencia para Wear OS complementa la aplicación Android y mantiene accesible la información esencial durante la actividad.")} href={localePath(locale, "/wear-os")} linkLabel={learnLabel} />
          </div>
        </SectionShell>

        <SectionShell eyebrow={copy.section.privacy.eyebrow} title={copy.section.privacy.title} body={copy.section.privacy.body}>
          <div className="safety-grid">
            <FeatureCard icon={<ShieldIcon />} title={text("Política de Privacidade", "Privacy Policy", "Política de Privacidad")} body={text("Entenda quais dados são tratados e quais controles estão disponíveis.", "Understand what data is handled and what controls are available.", "Comprende qué datos se tratan y qué controles tienes disponibles.")} href={localePath(locale, "/privacy")} linkLabel={learnLabel} />
            <FeatureCard icon={<ScrollIcon />} title={text("Excluir minha conta", "Delete my account", "Eliminar mi cuenta")} body={text("Solicite a exclusão usando o email associado à conta.", "Request deletion using the email associated with your account.", "Solicita la eliminación mediante el email asociado a tu cuenta.")} href={localePath(locale, "/delete-account")} linkLabel={learnLabel} />
          </div>
        </SectionShell>

        <SectionShell eyebrow={copy.section.beta.eyebrow} title={copy.section.beta.title} body={copy.section.beta.body} tone="ember" align="center">
          <FounderRelic locale={locale} />
          <Link className="button button--secondary" href="#join" prefetch={false}>{copy.hero.primary}</Link>
          <p className="beta-capacity-note">{copy.waitlist.capacity}</p>
        </SectionShell>

        <SectionShell eyebrow={copy.section.lore.eyebrow} title={copy.section.lore.title} body={copy.section.lore.body} tone="stone">
          <div className="lore-grid">
            <LoreCard number="I" icon={<MapIcon />} title={text("A Névoa", "The Mist", "La Niebla")} body={text("Ela cresce onde o caminho é abandonado e a vontade perde forma.", "It grows where the path is abandoned and purpose loses its shape.", "Crece donde se abandona el camino y la voluntad pierde su forma.")} />
            <LoreCard number="II" icon={<MagicWandIcon />} title="Aethron" body={text("Guardião da Chama, desperto para lembrar aos Striders que todo retorno ao caminho importa.", "Keeper of the Flame, awakened to remind Striders that every return to the path matters.", "Guardián de la Llama, despierto para recordar a los Striders que cada regreso al camino importa.")} />
            <LoreCard number="III" icon={<CrownIcon />} title={text("Os Striders", "The Striders", "Los Striders")} body={text("Corredores que transformam disciplina no mundo real em força dentro de Elyndor.", "Runners who turn real-world discipline into strength within Elyndor.", "Corredores que convierten la disciplina del mundo real en fuerza dentro de Elyndor.")} />
          </div>
        </SectionShell>

        <SectionShell eyebrow={copy.section.faq.eyebrow} title={copy.section.faq.title} body={copy.section.faq.body}>
          <FaqAccordion items={faqs} />
          <div className="section-action"><Link className="text-link" href={localePath(locale, "/faq")} prefetch={false}>{text("Ver todas as respostas", "View all answers", "Ver todas las respuestas")}</Link></div>
        </SectionShell>

        <SectionShell id="join" eyebrow={copy.section.waitlist.eyebrow} title={copy.section.waitlist.title} body={copy.section.waitlist.body} tone="ember" align="center" className="join-section">
          <div className="join-grid"><FounderRelic locale={locale} compact /><WaitlistForm locale={locale} /></div>
        </SectionShell>
      </main>
      <LocalizedFooter locale={locale} />
    </>
  );
}

function HeroProductPreview({ locale }: { locale: PublicLocale }) {
  const text = (ptBR: string, en: string, es: string) => getLocalizedText(locale, { "pt-BR": ptBR, en, es });
  return (
    <figure className="hero-product" aria-label={text("Interface do MythStride", "MythStride interface", "Interfaz de MythStride")}>
      <div className="hero-product__aura" aria-hidden="true" />
      <div className="hero-product__device"><Image src={getAssetPath(`/images/product/dashboard-${locale}.webp`)} alt={text("Tela inicial do MythStride com progresso, chefe atual e Aethron.", "MythStride home screen with progression, the current boss, and Aethron.", "Pantalla principal de MythStride con progreso, el jefe actual y Aethron.")} width={720} height={1560} priority sizes="(max-width: 52rem) 72vw, 360px" /></div>
    </figure>
  );
}

function FounderRelic({ locale, compact = false }: { locale: PublicLocale; compact?: boolean }) {
  const text = (ptBR: string, en: string, es: string) => getLocalizedText(locale, { "pt-BR": ptBR, en, es });
  return <div className={`founder-relic${compact ? " founder-relic--compact" : ""}`}><div className="founder-relic__artifact" aria-hidden="true"><Image src={getAssetPath("/assets/mythstride/icons/founder_sword.png")} alt="" width={256} height={256} /></div><div className="founder-relic__copy"><span>{text("ESPADA DO FUNDADOR", "FOUNDER SWORD", "ESPADA DEL FUNDADOR")}</span><h3>{text("Espada do Fundador", "Founder Sword", "Espada del Fundador")}</h3><p>{text("Participantes elegíveis convidados para o beta recebem uma relíquia exclusiva vinculada à sua jornada.", "Eligible participants invited to the beta receive an exclusive relic tied to their journey.", "Los participantes elegibles invitados a la beta reciben una reliquia exclusiva vinculada a su viaje.")}</p></div></div>;
}

function JourneyStep({ number, icon, title, body }: { number: string; icon: React.ReactNode; title: string; body: string }) {
  return <li className="journey-step"><span className="journey-step__number">{number}</span><span className="journey-step__icon" aria-hidden="true">{icon}</span><h3>{title}</h3><p>{body}</p></li>;
}
