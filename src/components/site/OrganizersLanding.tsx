import Image from "next/image";
import { LocalizedFooter } from "@/components/site/LocalizedFooter";
import { LocalizedNavigation } from "@/components/site/LocalizedNavigation";
import { organizersCopy } from "@/content/organizers";
import { siteCopy } from "@/content/site";
import type { PublicLocale } from "@/lib/locales";
import styles from "./OrganizersLanding.module.css";

type Props = { locale: PublicLocale };

export function OrganizersLanding({ locale }: Props) {
  const copy = organizersCopy[locale];
  const contactHref =
    "mailto:contato@playmythstride.com?subject=" +
    encodeURIComponent(copy.mailSubject) +
    "&body=" +
    encodeURIComponent(copy.mailBody);

  return (
    <>
      <a className="skip-link" href="#main-content">
        {siteCopy[locale].skip}
      </a>
      <LocalizedNavigation locale={locale} />
      <main id="main-content" className={styles.landing}>
        <section className={styles.hero} aria-labelledby="organizers-heading">
          <div className={styles.heroBackdrop} aria-hidden="true" />
          <div className={styles.container + " " + styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}><span className={styles.spark} aria-hidden="true" />{copy.eyebrow}</p>
              <h1 id="organizers-heading">{copy.title}</h1>
              <p className={styles.lead}>{copy.lead}</p>
              <div className={styles.actions}>
                <a className={styles.primary} href={contactHref}>
                  {copy.primaryCta}<span aria-hidden="true">↗</span>
                </a>
                <a className={styles.secondary} href="#como-funciona">{copy.secondaryCta} <span aria-hidden="true">↓</span></a>
              </div>
              <p className={styles.pilotNote}>{copy.pilotNote}</p>
            </div>
            <div className={styles.visual} aria-label={copy.conceptNote}>
              <div className={styles.visualHalo} aria-hidden="true" />
              <div className={styles.visualCard}>
                <div className={styles.visualBrand}>
                  <Image src="/images/optimized/app-icon.webp" width={38} height={38} alt="" />
                  <span>MYTHSTRIDE <small>× EVENTOS</small></span>
                </div>
                <div className={styles.ribbon} aria-hidden="true"><span /><span /></div>
                <div className={styles.medal} aria-hidden="true">
                  <div className={styles.medalInner}>
                    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
                      <path d="M32 6 40 18 53 20 45 33 47 47 32 41 17 47 19 33 11 20 24 18 32 6Z" stroke="currentColor" strokeWidth="2" />
                      <path d="M21 31c3-6 8-9 11-9s8 3 11 9M25 38h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                <p className={styles.conceptTop}>{copy.conceptTop}</p>
                <strong className={styles.conceptName}>{copy.conceptName}</strong>
                <span className={styles.conceptBottom}>{copy.conceptBottom}</span>
              </div>
              <p className={styles.conceptNote}>{copy.conceptNote}</p>
            </div>
          </div>
        </section>

        <section className={styles.statement} aria-label={copy.highlight}>
          <div className={styles.container}>
            <p>{copy.highlight}</p>
          </div>
        </section>

        <section className={styles.benefits} aria-labelledby="benefits-title">
          <div className={styles.container}>
            <p className={styles.eyebrow}>{copy.benefitsEyebrow}</p>
            <h2 id="benefits-title">{copy.benefitsTitle}</h2>
            <p className={styles.sectionLead}>{copy.benefitsIntro}</p>
            <div className={styles.benefitGrid}>
              {copy.benefits.map((benefit) => (
                <article className={styles.benefitCard} key={benefit.number}>
                  <span className={styles.cardNumber}>{benefit.number}</span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className={styles.process} aria-labelledby="process-title">
          <div className={styles.container}>
            <p className={styles.eyebrow}>{copy.processEyebrow}</p>
            <h2 id="process-title">{copy.processTitle}</h2>
            <ol className={styles.steps}>
              {copy.steps.map((step, index) => (
                <li className={styles.step} key={step.title}>
                  <span className={styles.stepNumber}>0{index + 1}</span>
                  <div><h3>{step.title}</h3><p>{step.text}</p></div>
                </li>
              ))}
            </ol>
            <aside className={styles.eligibility}>
              <span className={styles.eligibilityIcon} aria-hidden="true">✦</span>
              <div><h3>{copy.eligibilityTitle}</h3><p>{copy.eligibilityText}</p></div>
            </aside>
          </div>
        </section>

        <section className={styles.faq} aria-labelledby="faq-title">
          <div className={styles.container + " " + styles.faqGrid}>
            <div><p className={styles.eyebrow}>FAQ</p><h2 id="faq-title">{copy.faqTitle}</h2></div>
            <div className={styles.questions}>
              {copy.questions.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}<span aria-hidden="true">+</span></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.closing} aria-labelledby="closing-title">
          <div className={styles.container + " " + styles.closingInner}>
            <p className={styles.eyebrow}>{copy.closingEyebrow}</p>
            <h2 id="closing-title">{copy.closingTitle}</h2>
            <p>{copy.closingText}</p>
            <a className={styles.primary} href={contactHref}>{copy.primaryCta}<span aria-hidden="true">↗</span></a>
            <a className={styles.email} href={contactHref}>{copy.emailLabel}</a>
          </div>
        </section>
      </main>
      <LocalizedFooter locale={locale} />
    </>
  );
}
