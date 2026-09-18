"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/Icons";
import { siteCopy } from "@/content/site";
import { homeSectionIds } from "@/content/home-data";
import {
  getLocaleLabel,
  getOtherLocales,
  localePath,
  publicLocales,
  replacePathLocale,
  type PublicLocale,
} from "@/lib/locales";

type LocalizedNavigationProps = {
  locale: PublicLocale;
};

const localeCode: Record<PublicLocale, string> = {
  "pt-BR": "PT",
  en: "EN",
  es: "ES",
};

/**
 * The site header: four destinations, the language, and the one action the
 * page is asking for.
 *
 * It starts transparent over the hero and takes on a surface once the page has
 * moved, so the first screen stays a single image rather than a bar sitting on
 * top of one. The full menu — every page the site has, including the tester
 * login — is one tap away on small screens and lives in the footer everywhere.
 */
export function LocalizedNavigation({ locale }: LocalizedNavigationProps) {
  const copy = siteCopy[locale].nav;
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const home = localePath(locale);
  const links = [
    { href: localePath(locale, "/how-it-works"), label: copy.how },
    { href: `${home}#${homeSectionIds.elyndor}`, label: copy.elyndor },
    { href: localePath(locale, "/community"), label: copy.community },
    { href: localePath(locale, "/aethron"), label: copy.aethron },
  ];

  // Everything the header trims, kept reachable on small screens.
  const secondaryLinks = [
    { href: localePath(locale, "/features"), label: copy.product },
    { href: localePath(locale, "/events"), label: copy.events },
    { href: localePath(locale, "/wear-os"), label: copy.integrations },
    { href: localePath(locale, "/closed-beta"), label: copy.beta },
    { href: localePath(locale, "/faq"), label: copy.faq },
  ];

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }

      // The panel says `aria-modal`, so Tab has to honour that: without this,
      // the next Tab after the last link walks straight into the page behind
      // the overlay, which is still rendered and still focusable.
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>("a[href], button");
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const inside = active instanceof Node && panel.contains(active);

      if (event.shiftKey && (!inside || active === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || active === last)) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);
  const otherLocales = getOtherLocales(locale);

  return (
    <nav
      className="site-nav"
      data-scrolled={isScrolled ? "true" : "false"}
      aria-label={copy.primary}
    >
      <div className="site-container site-nav__inner">
        <Link
          className="site-nav__brand"
          href={home}
          aria-label="MythStride"
          prefetch={false}
        >
          <Image
            src="/images/optimized/app-icon.webp"
            alt=""
            width={36}
            height={36}
            // The brand mark sits in the first fold of every page, so it is not
            // a lazy image. It is 9 KB and 36px wide, which is too small to be
            // worth a preload, so this is `eager` rather than `priority`.
            loading="eager"
          />
          <span>MythStride</span>
        </Link>

        <div className="site-nav__desktop">
          <div className="site-nav__links">
            {links.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                prefetch={false}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link className="tester-link" href="/login/" prefetch={false}>
            {copy.tester}
          </Link>

          <Link
            className="button button--primary button--nav"
            href={`${home}#${homeSectionIds.join}`}
            prefetch={false}
          >
            {copy.join}
          </Link>

          <div className="locale-rail" role="group" aria-label={copy.language}>
            {publicLocales.map((candidate) =>
              candidate === locale ? (
                <span key={candidate} aria-current="true">
                  {localeCode[candidate]}
                </span>
              ) : (
                <Link
                  href={replacePathLocale(pathname, candidate)}
                  hrefLang={candidate}
                  lang={candidate}
                  key={candidate}
                  aria-label={getLocaleLabel(candidate, locale)}
                  prefetch={false}
                >
                  {localeCode[candidate]}
                </Link>
              ),
            )}
          </div>
        </div>

        <button
          ref={triggerRef}
          className="site-nav__menu-button"
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={copy.openMenu}
          onClick={() => setIsOpen(true)}
        >
          <MenuIcon />
        </button>
      </div>

      {isOpen ? (
        <div
          ref={panelRef}
          className="site-nav__mobile"
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label={copy.menuTitle}
        >
          <div className="site-nav__mobile-top">
            <span>{copy.menuTitle}</span>
            <button
              ref={closeRef}
              type="button"
              aria-label={copy.closeMenu}
              onClick={() => {
                closeMenu();
                triggerRef.current?.focus();
              }}
            >
              <CloseIcon />
            </button>
          </div>

          <div className="site-nav__mobile-scroll">
            <div className="site-nav__mobile-primary">
              {links.map((link) => (
                <Link
                  href={link.href}
                  key={link.href}
                  onClick={closeMenu}
                  prefetch={false}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="site-nav__mobile-secondary">
              {secondaryLinks.map((link) => (
                <Link
                  href={link.href}
                  key={link.href}
                  onClick={closeMenu}
                  prefetch={false}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/login/" onClick={closeMenu} prefetch={false}>
                {copy.tester}
              </Link>
            </div>

            <Link
              className="button button--primary site-nav__mobile-cta"
              href={`${home}#${homeSectionIds.join}`}
              onClick={closeMenu}
              prefetch={false}
            >
              {copy.join}
            </Link>

            <div className="site-nav__mobile-locales">
              <span>{copy.language}</span>
              {otherLocales.map((candidate) => (
                <Link
                  href={replacePathLocale(pathname, candidate)}
                  hrefLang={candidate}
                  lang={candidate}
                  key={candidate}
                  onClick={closeMenu}
                  prefetch={false}
                >
                  {getLocaleLabel(candidate, locale)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
