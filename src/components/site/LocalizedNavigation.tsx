"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/Icons";
import { siteCopy } from "@/content/site";
import {
  localeLabels,
  localePath,
  replacePathLocale,
  type PublicLocale,
} from "@/lib/locales";

type LocalizedNavigationProps = {
  locale: PublicLocale;
};

export function LocalizedNavigation({ locale }: LocalizedNavigationProps) {
  const copy = siteCopy[locale].nav;
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const links = [
    { href: localePath(locale, "/features"), label: copy.product },
    { href: localePath(locale, "/how-it-works"), label: copy.how },
    { href: localePath(locale, "/events"), label: copy.events },
    { href: localePath(locale, "/community"), label: copy.community },
    { href: localePath(locale, "/aethron"), label: copy.aethron },
    { href: localePath(locale, "/wear-os"), label: copy.integrations },
    { href: localePath(locale, "/closed-beta"), label: copy.beta },
    { href: localePath(locale, "/faq"), label: copy.faq },
  ];

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    closeRef.current?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);
  const alternateLocale: PublicLocale = locale === "pt-BR" ? "en" : "pt-BR";
  const alternatePath = replacePathLocale(pathname, alternateLocale);

  return (
    <nav className="site-nav" aria-label={copy.product}>
      <div className="site-container site-nav__inner">
        <Link
          className="site-nav__brand"
          href={localePath(locale)}
          aria-label="MythStride"
        >
          <Image
            src="/images/optimized/app-icon.webp"
            alt=""
            width={42}
            height={42}
            priority
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
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            className="locale-switch"
            href={alternatePath}
            hrefLang={alternateLocale}
            lang={alternateLocale}
            aria-label={`${copy.language}: ${localeLabels[alternateLocale]}`}
          >
            {alternateLocale === "pt-BR" ? "PT" : "EN"}
          </Link>
          <Link className="tester-link" href="/login/">
            {copy.tester}
          </Link>
          <Link
            className="button button--nav"
            href={`${localePath(locale)}#join`}
          >
            {copy.join}
          </Link>
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
          className="site-nav__mobile"
          id="mobile-navigation"
          aria-label={copy.product}
        >
          <div className="site-nav__mobile-top">
            <span>{copy.product}</span>
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
          {links.map((link) => (
            <Link href={link.href} key={link.href} onClick={closeMenu}>
              {link.label}
            </Link>
          ))}
          <Link
            className="button button--primary"
            href={`${localePath(locale)}#join`}
            onClick={closeMenu}
          >
            {copy.join}
          </Link>
          <Link href={alternatePath} hrefLang={alternateLocale} onClick={closeMenu}>
            {copy.language}: {localeLabels[alternateLocale]}
          </Link>
          <Link href="/login/" onClick={closeMenu}>
            {copy.tester}
          </Link>
        </div>
      ) : null}
    </nav>
  );
}
