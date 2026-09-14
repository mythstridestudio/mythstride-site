import Link from "next/link";
import {
  CrownIcon,
  MagicWandIcon,
  MapIcon,
  ScrollIcon,
  ShieldIcon,
  SwordsIcon,
  SyncIcon,
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
      { question: "Posso excluir minha conta?", answer: "Sim. O MythStride oferece um fluxo de exclusão com verificação de titularidade e período de segurança antes da remoção definitiva dos dados aplicáveis." },
    ],
    en: [
      { question: "Is MythStride available?", answer: "MythStride is in closed beta for Android. Access is invite-only for participants selected from the beta list." },
      { question: "How do my runs become progress?", answer: "MythStride processes eligible activities and uses them to fuel progression, quests, battles, and other game systems." },
      { question: "Is Aethron a coach?", answer: "No. Aethron is an AI-powered narrative companion. It does not provide diagnosis, treatment, or professional health advice." },
      { question: "Are there real-money purchases?", answer: "Real-money purchases are not part of the current closed beta. Diamonds are virtual game currency and have no monetary value outside MythStride." },
      { question: "Can I delete my account?", answer: "Yes. MythStride provides an account deletion flow with ownership verification and a safety period before applicable data is permanently removed." },
    ],
    es: [
      { question: "¿MythStride ya está disponible?", answer: "MythStride está en beta cerrada para Android. El acceso se realiza por invitación para participantes seleccionados de la lista." },
      { question: "¿Cómo se convierten mis carreras en progreso?", answer: "MythStride procesa las actividades elegibles y las utiliza para impulsar el progreso, las misiones, las batallas y otros sistemas del juego." },
      { question: "¿Aethron es un entrenador?", answer: "No. Aethron es un compañero narrativo basado en inteligencia artificial. No ofrece diagnóstico, tratamiento ni orientación profesional de salud." },
      { question: "¿Hay compras con dinero real?", answer: "Las compras con dinero real no forman parte de la beta cerrada actual. Los diamantes son moneda virtual y no tienen valor monetario fuera de MythStride." },
      { question: "¿Puedo eliminar mi cuenta?", answer: "Sí. MythStride ofrece un flujo de eliminación con verificación de titularidad y un período de seguridad antes de eliminar definitivamente los datos aplicables." },
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
          aside={<BetaInvitationCard locale={locale} />}
        >
          <p className="hero-note">{copy.hero.note}</p>
        </PageHero>

        <SectionShell id="how" eyebrow={copy.section.flow.eyebrow} title={copy.section.flow.title} body={copy.section.flow.body} tone="stone">
          <ol className="journey-steps journey-steps--four">
            <JourneyStep number="01" icon={<MythGlyph glyph="runOutdoor" />} title={text("Corra", "Run", "Corre")} body={text("Registre sua atividade e acompanhe distância, duração e ritmo.", "Track your activity and follow distance, duration, and pace.", "Registra tu actividad y sigue la distancia, la duración y el ritmo.")} />
            <JourneyStep number="02" icon={<SwordsIcon />} title={text("Progrida", "Progress", "Progresa")} body={text("Atividades elegíveis geram avanço dentro da sua jornada.", "Eligible activities move your journey forward.", "Las actividades elegibles hacen avanzar tu viaje.")} />
            <JourneyStep number="03" icon={<MythBossMedal name="dragao_ancestral" size="sm" />} title={text("Enfrente", "Fight", "Enfréntate")} body={text("Sua corrida contribui para batalhas contra chefes de Elyndor.", "Your run contributes to battles against the bosses of Elyndor.", "Tu carrera contribuye a las batallas contra los jefes de Elyndor.")} />
            <JourneyStep number="04" icon={<MythGlyph glyph="seasonChampion" />} title={text("Conquiste", "Achieve", "Conquista")} body={text("Evolua, desbloqueie conquistas e construa um inventário que registra sua trajetória.", "Grow, unlock achievements, and build an inventory that records your path.", "Evoluciona, desbloquea logros y construye un inventario que registre tu trayectoria.")} />
          </ol>
          <div className="section-action"><Link className="text-link" href={localePath(locale, "/how-it-works")}>{text("Entender o ciclo completo", "Explore the complete loop", "Explorar el ciclo completo")}</Link></div>
        </SectionShell>

        <SectionShell eyebrow={copy.section.interface.eyebrow} title={copy.section.interface.title} body={copy.section.interface.body} align="center">
          <ScreenshotGallery locale={locale} items={[{
            title: text("Inventário do herói", "Hero inventory", "Inventario del héroe"),
            caption: text("Equipamentos conquistados, raridade e estado de conservação em uma captura real do MythStride.", "Earned equipment, rarity, and condition in a real MythStride capture.", "Equipo conseguido, rareza y estado en una captura real de MythStride."),
            image: { src: `/images/product/inventory-${locale}.webp`, alt: text("Inventário do MythStride mostrando equipamentos obtidos, com raridade e estado de conservação.", "MythStride inventory showing earned equipment, rarity, and condition.", "Inventario de MythStride con el equipo obtenido, su rareza y su estado.") },
          }]} />
        </SectionShell>

        <SectionShell eyebrow={copy.section.battle.eyebrow} title={copy.section.battle.title} body={copy.section.battle.body} tone="ember">
          <div className="feature-grid">
            <FeatureCard icon={<MythBossMedal name="arpia" size="sm" />} title={text("Arpia", "Harpy", "Arpía")} body={text("Uma ameaça dos céus de Elyndor.", "A threat from the skies of Elyndor.", "Una amenaza de los cielos de Elyndor.")} />
            <FeatureCard icon={<MythBossMedal name="lich_do_abismo" size="sm" />} title={text("Lich do Abismo", "Abyss Lich", "Liche del Abismo")} body={text("Poder antigo contra a resistência dos Striders.", "Ancient power against the Striders' resistance.", "Poder antiguo contra la resistencia de los Striders.")} />
            <FeatureCard icon={<MythBossMedal name="dragao_ancestral" size="sm" />} title={text("Dragão Ancestral", "Ancestral Dragon", "Dragón Ancestral")} body={text("Um encontro em que cada distância elegível importa.", "An encounter where every eligible distance matters.", "Un encuentro donde cada distancia elegible importa.")} href={localePath(locale, "/events")} linkLabel={learnLabel} />
          </div>
        </SectionShell>

        <SectionShell eyebrow={copy.section.rewards.eyebrow} title={copy.section.rewards.title} body={copy.section.rewards.body} tone="stone">
          <div className="feature-grid">
            <FeatureCard icon={<MythGlyph glyph="inventory" />} title={text("Inventário", "Inventory", "Inventario")} body={text("Reúna e equipe itens obtidos ao longo da sua jornada.", "Collect and equip items earned throughout your journey.", "Reúne y equipa objetos obtenidos durante tu viaje.")} />
            <FeatureCard icon={<MythGlyph glyph="achievements" />} title={text("Conquistas", "Achievements", "Logros")} body={text("Transforme consistência, exploração e desafios concluídos em marcos permanentes.", "Turn consistency, exploration, and completed challenges into lasting milestones.", "Convierte la constancia, la exploración y los desafíos completados en hitos permanentes.")} />
            <FeatureCard icon={<MythGlyph glyph="founderSword" />} title={text("Espada do Fundador", "Founder Sword", "Espada del Fundador")} body={text("Uma relíquia exclusiva para marcar quem esteve presente no início da jornada do MythStride.", "An exclusive relic for those present at the beginning of MythStride's journey.", "Una reliquia exclusiva para quienes estuvieron al comienzo del viaje de MythStride.")} />
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
          <div className="aethron-panel">
            <div className="aethron-panel__sigil" aria-hidden="true"><MythGlyph glyph="aethronSigil" size={128} /></div>
            <div>
              <h3>{text("Companheiro narrativo", "Narrative companion", "Compañero narrativo")}</h3>
              <p>{text("Como todo conteúdo gerado por inteligência artificial, suas mensagens podem conter erros. Aethron não oferece diagnóstico, tratamento ou aconselhamento profissional de saúde.", "Like all AI-generated content, its messages may contain errors. Aethron does not provide diagnosis, treatment, or professional health advice.", "Como todo contenido generado por inteligencia artificial, sus mensajes pueden contener errores. Aethron no ofrece diagnóstico, tratamiento ni orientación profesional de salud.")}</p>
              <Link className="text-link" href={localePath(locale, "/aethron")}>{learnLabel}</Link>
            </div>
          </div>
        </SectionShell>

        <SectionShell eyebrow={copy.section.integrations.eyebrow} title={copy.section.integrations.title} body={copy.section.integrations.body} tone="stone">
          <div className="integration-track">
            <IntegrationCard icon={<WatchIcon />} title="Wear OS" body={text("A experiência para Wear OS complementa o aplicativo Android e mantém informações essenciais da corrida acessíveis durante a atividade.", "The Wear OS experience complements the Android app and keeps essential run information accessible during activity.", "La experiencia para Wear OS complementa la aplicación Android y mantiene accesible la información esencial durante la actividad.")} href={localePath(locale, "/wear-os")} linkLabel={learnLabel} />
            <IntegrationCard icon={<SyncIcon />} title={text("Serviços de atividade", "Activity services", "Servicios de actividad")} body={text("Conecte o MythStride ao seu ecossistema de corrida quando uma integração estiver disponível para sua conta.", "Connect MythStride to your running ecosystem when an integration is available for your account.", "Conecta MythStride con tu ecosistema de carrera cuando una integración esté disponible para tu cuenta.")} href={localePath(locale, "/third-party-services")} linkLabel={learnLabel} />
          </div>
        </SectionShell>

        <SectionShell eyebrow={copy.section.privacy.eyebrow} title={copy.section.privacy.title} body={copy.section.privacy.body}>
          <div className="safety-grid">
            <FeatureCard icon={<ShieldIcon />} title={text("Política de Privacidade", "Privacy Policy", "Política de Privacidad")} body={text("Entenda quais dados são tratados e quais controles estão disponíveis.", "Understand what data is handled and what controls are available.", "Comprende qué datos se tratan y qué controles tienes disponibles.")} href={localePath(locale, "/privacy")} linkLabel={learnLabel} />
            <FeatureCard icon={<ScrollIcon />} title={text("Excluir minha conta", "Delete my account", "Eliminar mi cuenta")} body={text("Solicite a exclusão usando o email associado à conta.", "Request deletion using the email associated with your account.", "Solicita la eliminación mediante el email asociado a tu cuenta.")} href={localePath(locale, "/delete-account")} linkLabel={learnLabel} />
          </div>
        </SectionShell>

        <SectionShell eyebrow={copy.section.beta.eyebrow} title={copy.section.beta.title} body={copy.section.beta.body} tone="ember" align="center">
          <div className="founder-callout"><MythGlyph glyph="founderSword" size={96} /><div><h3>{text("Espada do Fundador", "Founder Sword", "Espada del Fundador")}</h3><p>{text("Jogadores elegíveis que participarem desta fase recebem uma relíquia exclusiva criada para marcar o início da jornada do MythStride.", "Eligible players who join this phase receive an exclusive relic created to mark the beginning of MythStride's journey.", "Los jugadores elegibles que participen en esta fase reciben una reliquia exclusiva creada para marcar el inicio del viaje de MythStride.")}</p></div></div>
          <Link className="button button--secondary" href="#join">{copy.hero.primary}</Link>
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
          <div className="section-action"><Link className="text-link" href={localePath(locale, "/faq")}>{text("Ver todas as respostas", "View all answers", "Ver todas las respuestas")}</Link></div>
        </SectionShell>

        <SectionShell id="join" eyebrow={copy.section.waitlist.eyebrow} title={copy.section.waitlist.title} body={copy.section.waitlist.body} tone="ember" align="center" className="join-section">
          <WaitlistForm locale={locale} />
        </SectionShell>
      </main>
      <LocalizedFooter locale={locale} />
    </>
  );
}

function BetaInvitationCard({ locale }: { locale: PublicLocale }) {
  const text = (ptBR: string, en: string, es: string) => getLocalizedText(locale, { "pt-BR": ptBR, en, es });
  return (
    <aside className="field-report" aria-label={text("Acesso ao beta", "Beta access", "Acceso a la beta")}>
      <div className="field-report__top"><span>{text("Convites", "Invitations", "Invitaciones")}</span><strong>Android</strong></div>
      <div className="field-report__crest" aria-hidden="true"><SwordsIcon /></div>
      <h2>{text("Beta fechado", "Closed beta", "Beta cerrada")}</h2>
      <p>{text("Entre na lista para ter a oportunidade de explorar Elyndor entre os primeiros Striders.", "Join the list for a chance to explore Elyndor among the first Striders.", "Únete a la lista para tener la oportunidad de explorar Elyndor entre los primeros Striders.")}</p>
    </aside>
  );
}

function JourneyStep({ number, icon, title, body }: { number: string; icon: React.ReactNode; title: string; body: string }) {
  return <li className="journey-step"><span className="journey-step__number">{number}</span><span className="journey-step__icon" aria-hidden="true">{icon}</span><h3>{title}</h3><p>{body}</p></li>;
}
