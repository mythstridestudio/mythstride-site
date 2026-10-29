import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eventos e desafios | MythStride",
  description: "Conheça eventos e desafios MythStride. Escolha seu idioma para explorar atividades e recompensas.",
  alternates: { canonical: "/pt-BR/events/" },
  robots: { index: false, follow: true },
};

export default function EventsLanguageGateway() {
  return (
    <main style={{ minHeight: "100vh", padding: "6rem 1.5rem", maxWidth: 760, margin: "auto" }}>
      <h1>Eventos MythStride / Events / Eventos</h1>
      <p>Selecione seu idioma / Choose your language / Elige tu idioma.</p>
      <nav aria-label="Idioma / Language">
        <ul>
          <li><Link href="/pt-BR/events/">Português — Eventos</Link></li>
          <li><Link href="/en/events/">English — Events</Link></li>
          <li><Link href="/es/events/">Español — Eventos</Link></li>
        </ul>
      </nav>
    </main>
  );
}
