import Link from "next/link";
import "./globals.css";
import { documentFontClasses } from "@/app/fonts";
import { MapIcon } from "@/components/Icons";

export default function GlobalNotFound() {
  return (
    <html lang="pt-BR" className={documentFontClasses}>
      <body className="bg-void font-body text-text-primary">
        <main className="not-found-page">
          <div className="not-found-page__panel">
            <MapIcon className="not-found-page__icon" />
            <p className="section-eyebrow">404 · Caminho perdido</p>
            <h1>A Névoa cobriu esta rota.</h1>
            <p>
              Esta página não existe.{" "}
              <span lang="en">This page does not exist.</span>{" "}
              <span lang="es">Esta página no existe.</span>
            </p>
            <div className="cta-row">
              <Link className="button button--primary" href="/pt-BR/" lang="pt-BR">
                Voltar em português
              </Link>
              <Link className="button button--secondary" href="/en/" lang="en">
                Return in English
              </Link>
              <Link className="button button--secondary" href="/es/" lang="es">
                Volver en español
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
