import Image from "next/image";
import Link from "next/link";
import { localePath } from "@/lib/locales";

export default function LocaleChooserPage() {
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
        <h1>Escolha seu idioma</h1>
        <p>
          <span>Entre em Elyndor.</span>{" "}
          <span lang="en">Choose your path.</span>{" "}
          <span lang="es">Elige tu camino.</span>
        </p>
        <div className="locale-gateway__actions">
          <Link
            className="button button--primary"
            href={localePath("pt-BR")}
            lang="pt-BR"
          >
            Português (Brasil)
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
      </div>
    </main>
  );
}
