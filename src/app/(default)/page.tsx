"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { localePath } from "@/lib/locales";

export default function LocaleChooserPage() {
  useEffect(() => {
    const language = navigator.language.toLowerCase();
    const locale = language.startsWith("pt")
      ? "pt-BR"
      : language.startsWith("es")
        ? "es"
        : "en";
    window.location.replace(
      `${localePath(locale)}${window.location.search}${window.location.hash}`,
    );
  }, []);

  return (
    <main className="locale-gateway">
      <div className="locale-gateway__panel">
        <Image
          src="/images/optimized/app-icon.webp"
          width={88}
          height={88}
          alt=""
        />
        <p className="section-eyebrow">MythStride</p>
        <h1>MythStride</h1>
        <p lang="en">Run in the real world. Progress in another.</p>
        <div className="locale-gateway__actions">
          <Link
            className="button button--primary"
            href={localePath("pt-BR")}
            lang="pt-BR"
          >
            Português
          </Link>
          <Link
            className="button button--secondary"
            href={localePath("en")}
            lang="en"
          >
            English
          </Link>
          <Link
            className="button button--secondary"
            href={localePath("es")}
            lang="es"
          >
            Español
          </Link>
        </div>
        <noscript>
          <p className="locale-gateway__noscript">
            <Link href="/pt-BR/" lang="pt-BR">Português</Link>{" · "}
            <Link href="/en/" lang="en">English</Link>{" · "}
            <Link href="/es/" lang="es">Español</Link>
          </p>
        </noscript>
      </div>
    </main>
  );
}
